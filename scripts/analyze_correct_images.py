#!/usr/bin/env python3
"""
Analyze WordPress export.xml to extract correct post-to-image relationships
and fix featured images in blog-posts.json
"""

import xml.etree.ElementTree as ET
import json
import os
from pathlib import Path
from typing import Dict, Optional

class WordPressImageAnalyzer:
    def __init__(self, xml_path: str, images_dir: str):
        self.xml_path = xml_path
        self.images_dir = Path(images_dir)
        self.namespaces = {
            'content': 'http://purl.org/rss/1.0/modules/content/',
            'wp': 'http://wordpress.org/export/1.2/',
            'dc': 'http://purl.org/dc/elements/1.1/',
            'excerpt': 'http://wordpress.org/export/1.2/excerpt/'
        }

        # Maps
        self.attachment_map = {}  # attachment_id -> {url, filename}
        self.post_thumbnail_map = {}  # post_name -> attachment_id
        self.available_images = self._scan_local_images()

    def _scan_local_images(self) -> Dict[str, str]:
        """Scan local images directory and create filename map."""
        image_map = {}

        if not self.images_dir.exists():
            return image_map

        for file_path in self.images_dir.iterdir():
            if file_path.is_file() and file_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
                filename = file_path.name
                # Store lowercase key for case-insensitive matching
                image_map[filename.lower()] = filename

        return image_map

    def parse_xml(self):
        """Parse XML and extract attachments and post-thumbnail relationships."""
        print("📖 Parsing WordPress export XML...")

        tree = ET.parse(self.xml_path)
        root = tree.getroot()
        channel = root.find('channel')

        if not channel:
            print("❌ No channel found in XML")
            return

        items = channel.findall('item')
        print(f"   Found {len(items)} items in XML")

        # First pass: collect all attachments
        for item in items:
            post_type = item.find('wp:post_type', self.namespaces)
            if post_type is not None and post_type.text == 'attachment':
                self._process_attachment(item)

        print(f"   Found {len(self.attachment_map)} attachments")

        # Second pass: collect post-thumbnail relationships
        for item in items:
            post_type = item.find('wp:post_type', self.namespaces)
            status = item.find('wp:status', self.namespaces)

            if post_type is not None and post_type.text == 'post':
                if status is not None and status.text == 'publish':
                    self._process_post_thumbnail(item)

        print(f"   Found {len(self.post_thumbnail_map)} post-thumbnail relationships")

    def _process_attachment(self, item):
        """Extract attachment information."""
        attachment_id = self._get_text(item.find('wp:post_id', self.namespaces))
        attachment_url = self._get_text(item.find('wp:attachment_url', self.namespaces))
        post_name = self._get_text(item.find('wp:post_name', self.namespaces))

        if attachment_id and attachment_url:
            filename = attachment_url.split('/')[-1]
            self.attachment_map[attachment_id] = {
                'url': attachment_url,
                'filename': filename,
                'post_name': post_name
            }

    def _process_post_thumbnail(self, item):
        """Extract post thumbnail ID for each post."""
        post_name = self._get_text(item.find('wp:post_name', self.namespaces))

        # Look for _thumbnail_id in postmeta
        for meta in item.findall('wp:postmeta', self.namespaces):
            key = self._get_text(meta.find('wp:meta_key', self.namespaces))
            if key == '_thumbnail_id':
                thumbnail_id = self._get_text(meta.find('wp:meta_value', self.namespaces))
                if post_name and thumbnail_id:
                    self.post_thumbnail_map[post_name] = thumbnail_id
                break

    def _get_text(self, element) -> str:
        """Safely extract text from XML element."""
        if element is not None and element.text:
            return element.text.strip()
        return ''

    def get_correct_image_for_post(self, post_slug: str) -> Optional[str]:
        """Get the correct local image path for a post."""
        # Check if post has thumbnail_id
        if post_slug not in self.post_thumbnail_map:
            return None

        thumbnail_id = self.post_thumbnail_map[post_slug]

        # Get attachment info
        if thumbnail_id not in self.attachment_map:
            return None

        attachment = self.attachment_map[thumbnail_id]
        wp_filename = attachment['filename']

        # Try to find this file locally
        local_path = self._find_local_image(wp_filename)

        if local_path:
            return f"assets/images/imagenes-blog/{local_path}"

        return None

    def _find_local_image(self, wp_filename: str) -> Optional[str]:
        """Find local image matching WordPress filename."""
        # Try exact match (case-insensitive)
        if wp_filename.lower() in self.available_images:
            return self.available_images[wp_filename.lower()]

        # Try without size suffix (-300x200, -1024x768, etc.)
        import re
        base_filename = re.sub(r'-\d+x\d+(\.[a-z]+)$', r'\1', wp_filename)
        if base_filename.lower() in self.available_images:
            return self.available_images[base_filename.lower()]

        # Try fuzzy match on base name
        base_name_no_ext = os.path.splitext(base_filename)[0].lower()
        for local_key, local_filename in self.available_images.items():
            local_base = os.path.splitext(local_filename)[0].lower()
            if base_name_no_ext in local_base or local_base in base_name_no_ext:
                return local_filename

        return None

    def analyze_and_fix(self, posts_json_path: str):
        """Analyze current posts and fix incorrect images."""
        print("\n🔍 Analyzing current blog posts...")

        with open(posts_json_path, 'r', encoding='utf-8') as f:
            posts = json.load(f)

        corrections = []
        missing_images = []
        correct_count = 0

        for post in posts:
            post_slug = post['slug']
            current_image = post['featuredImage']

            # Get correct image from XML
            correct_image = self.get_correct_image_for_post(post_slug)

            if correct_image is None:
                # No thumbnail_id in WordPress, skip
                continue

            # Check if current image is correct
            if current_image != correct_image:
                # Get WordPress info for reporting
                thumbnail_id = self.post_thumbnail_map.get(post_slug, '')
                attachment_info = self.attachment_map.get(thumbnail_id, {})
                wp_filename = attachment_info.get('filename', 'unknown')

                # Check if image exists locally
                local_filename = correct_image.split('/')[-1] if correct_image else ''
                image_exists = (self.images_dir / local_filename).exists() if local_filename else False

                correction = {
                    'title': post['title'],
                    'slug': post_slug,
                    'current_image': current_image.split('/')[-1] if current_image else 'none',
                    'correct_image': correct_image.split('/')[-1] if correct_image else 'none',
                    'wp_filename': wp_filename,
                    'exists_locally': image_exists,
                    'full_correct_path': correct_image
                }

                corrections.append(correction)

                # Update the post
                post['featuredImage'] = correct_image

                if not image_exists:
                    missing_images.append({
                        'post': post['title'],
                        'wp_filename': wp_filename,
                        'wp_url': attachment_info.get('url', 'unknown')
                    })
            else:
                correct_count += 1

        # Save updated posts
        if corrections:
            with open(posts_json_path, 'w', encoding='utf-8') as f:
                json.dump(posts, f, indent=2, ensure_ascii=False)

        # Print report
        print("\n" + "="*70)
        print("ANÁLISIS DE IMÁGENES DEL BLOG")
        print("="*70)

        print(f"\n✅ Posts con imagen correcta: {correct_count}")
        print(f"⚠️  Posts con imagen incorrecta: {len(corrections)}")
        print(f"❌ Imágenes faltantes localmente: {len(missing_images)}")

        if corrections:
            print("\n" + "─"*70)
            print("CORRECCIONES REALIZADAS:")
            print("─"*70)

            for i, corr in enumerate(corrections, 1):
                status = "✓" if corr['exists_locally'] else "✗"
                print(f"\n{i}. {status} {corr['title']}")
                print(f"   Slug: {corr['slug']}")
                print(f"   Tenía:   {corr['current_image']}")
                print(f"   Correcto: {corr['correct_image']}")
                print(f"   WordPress: {corr['wp_filename']}")
                if not corr['exists_locally']:
                    print(f"   ⚠️  IMAGEN NO ENCONTRADA LOCALMENTE")

        if missing_images:
            print("\n" + "─"*70)
            print("IMÁGENES FALTANTES EN CARPETA LOCAL:")
            print("─"*70)

            for i, img in enumerate(missing_images, 1):
                print(f"\n{i}. Post: {img['post']}")
                print(f"   Archivo WP: {img['wp_filename']}")
                print(f"   URL WP: {img['wp_url']}")

        print("\n" + "="*70)

        return corrections, missing_images


def main():
    base_dir = Path('/Users/miguel/Desktop/CarlosRodgarman.com')
    xml_path = '/Users/miguel/Desktop/export.xml'
    images_dir = base_dir / 'assets' / 'images' / 'imagenes-blog'
    posts_json_path = base_dir / 'data' / 'blog-posts.json'

    analyzer = WordPressImageAnalyzer(xml_path, str(images_dir))
    analyzer.parse_xml()
    corrections, missing = analyzer.analyze_and_fix(str(posts_json_path))

    if corrections:
        print(f"\n💾 Archivo actualizado: {posts_json_path}")
        print(f"   {len(corrections)} imágenes corregidas")
    else:
        print("\n✅ Todas las imágenes ya estaban correctas")

    return 0


if __name__ == '__main__':
    exit(main())

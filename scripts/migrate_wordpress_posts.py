#!/usr/bin/env python3
"""
WordPress to Static Blog Migration Script

This script migrates WordPress posts from export.xml to the static blog JSON format.
It handles:
- XML parsing and post extraction
- Gutenberg block content transformation
- Image URL to local file mapping
- Yoast SEO metadata extraction
- JSON structure generation matching existing blog posts
"""

import xml.etree.ElementTree as ET
import json
import re
import os
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Set
import unicodedata


class WordPressParser:
    """Parses WordPress XML export and extracts post data."""

    def __init__(self, xml_path: str):
        self.xml_path = xml_path
        self.tree = None
        self.root = None
        self.namespaces = {
            'content': 'http://purl.org/rss/1.0/modules/content/',
            'wp': 'http://wordpress.org/export/1.2/',
            'dc': 'http://purl.org/dc/elements/1.1/',
            'excerpt': 'http://wordpress.org/export/1.2/excerpt/'
        }

    def parse(self) -> List[Dict]:
        """Parse XML and return list of post dictionaries."""
        print(f"📖 Parsing WordPress export: {self.xml_path}")

        try:
            self.tree = ET.parse(self.xml_path)
            self.root = self.tree.getroot()
        except ET.ParseError as e:
            print(f"❌ XML parsing error: {e}")
            return []

        channel = self.root.find('channel')
        if not channel:
            print("❌ No channel found in XML")
            return []

        posts = []
        items = channel.findall('item')
        print(f"   Found {len(items)} items in export")

        for item in items:
            post = self._extract_post(item)
            if post:
                posts.append(post)

        print(f"✓  Extracted {len(posts)} published posts")
        return posts

    def _extract_post(self, item) -> Optional[Dict]:
        """Extract post data from XML item."""
        # Check if it's a published post
        post_type = item.find('wp:post_type', self.namespaces)
        status = item.find('wp:status', self.namespaces)

        if post_type is None or status is None:
            return None

        if post_type.text != 'post' or status.text != 'publish':
            return None

        # Extract basic fields
        post = {
            'title': self._get_text(item.find('title')),
            'link': self._get_text(item.find('link')),
            'pubDate': self._get_text(item.find('pubDate')),
            'wp_post_date': self._get_text(item.find('wp:post_date', self.namespaces)),
            'wp_post_name': self._get_text(item.find('wp:post_name', self.namespaces)),
            'content': self._get_text(item.find('content:encoded', self.namespaces)),
            'excerpt': self._get_text(item.find('excerpt:encoded', self.namespaces)),
            'categories': [],
            'tags': [],
            'postmeta': {}
        }

        # Extract categories and tags
        for category in item.findall('category'):
            domain = category.get('domain', '')
            cat_name = category.text

            if cat_name:
                if domain == 'category':
                    post['categories'].append(cat_name)
                elif domain == 'post_tag':
                    post['tags'].append(cat_name)

        # Extract postmeta
        for meta in item.findall('wp:postmeta', self.namespaces):
            key = self._get_text(meta.find('wp:meta_key', self.namespaces))
            value = self._get_text(meta.find('wp:meta_value', self.namespaces))
            if key:
                post['postmeta'][key] = value

        return post

    def _get_text(self, element) -> str:
        """Safely extract text from XML element."""
        if element is not None and element.text:
            return element.text.strip()
        return ''


class ContentTransformer:
    """Transforms WordPress Gutenberg content to clean HTML."""

    def __init__(self):
        self.wp_cdn_pattern = re.compile(r'https://carlosrodgarman\.com/wp-content/uploads/[^"\'>\s]+')

    def transform(self, content: str) -> str:
        """Transform WordPress content to clean HTML."""
        if not content:
            return ''

        # Strip Gutenberg block comments
        content = self._strip_gutenberg_comments(content)

        # Transform galleries
        content = self._transform_galleries(content)

        # Clean WordPress-specific HTML attributes
        content = self._clean_wp_attributes(content)

        # Remove empty paragraphs
        content = re.sub(r'<p>\s*</p>', '', content)

        # Clean up multiple newlines
        content = re.sub(r'\n{3,}', '\n\n', content)

        return content.strip()

    def _strip_gutenberg_comments(self, content: str) -> str:
        """Remove all Gutenberg block comments."""
        # Remove block comments like <!-- wp:paragraph --> and <!-- /wp:paragraph -->
        content = re.sub(r'<!--\s*/?wp:[^>]*-->', '', content)
        return content

    def _transform_galleries(self, content: str) -> str:
        """Transform wp-block-gallery to simple HTML."""
        # Simple transformation: keep the images, remove gallery wrapper classes
        content = re.sub(
            r'<ul\s+class="wp-block-gallery[^"]*"[^>]*>',
            '<div class="image-gallery">',
            content
        )
        content = re.sub(r'</ul>(\s*<!-- /wp:gallery -->)?', '</div>', content)

        # Transform gallery items
        content = re.sub(
            r'<li\s+class="blocks-gallery-item"[^>]*>',
            '<div class="gallery-item">',
            content
        )
        content = re.sub(r'</li>', '</div>', content)

        return content

    def _clean_wp_attributes(self, content: str) -> str:
        """Remove WordPress-specific HTML attributes."""
        # Remove data-id, data-link, data-full-url, etc.
        content = re.sub(r'\s+data-[a-z-]+="[^"]*"', '', content)

        # Remove WordPress CSS classes from images
        content = re.sub(r'\s+class="wp-image-\d+"', '', content)

        return content

    def extract_first_image(self, content: str) -> Optional[str]:
        """Extract the first image URL from content."""
        if not content:
            return None

        # Look for img tags
        img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', content)
        if img_match:
            return img_match.group(1)

        return None

    def replace_image_urls(self, content: str, url_map: Dict[str, str]) -> str:
        """Replace WordPress CDN URLs with local paths."""
        def replace_url(match):
            wp_url = match.group(0)
            # Try to find matching local path
            for wp_pattern, local_path in url_map.items():
                if wp_pattern in wp_url:
                    return local_path
            return wp_url  # Keep original if no match

        return self.wp_cdn_pattern.sub(replace_url, content)


class ImageManager:
    """Manages image file mapping from WordPress URLs to local files."""

    def __init__(self, images_dir: str):
        self.images_dir = Path(images_dir)
        self.image_files = self._scan_images()
        self.base_path = "assets/images/imagenes-blog"

        print(f"🖼️  Found {len(self.image_files)} images in {images_dir}")

    def _scan_images(self) -> Dict[str, str]:
        """Scan images directory and build filename map."""
        image_map = {}

        if not self.images_dir.exists():
            return image_map

        for file_path in self.images_dir.iterdir():
            if file_path.is_file() and file_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
                # Store both full filename and base name (without size variants)
                filename = file_path.name
                image_map[filename.lower()] = filename

                # Also store base name without size variants (e.g., image-300x200.jpg -> image.jpg)
                base_name = re.sub(r'-\d+x\d+(\.[a-z]+)$', r'\1', filename)
                if base_name != filename:
                    image_map[base_name.lower()] = filename

        return image_map

    def find_local_image(self, wp_url: str) -> Optional[str]:
        """Find local image file matching WordPress URL."""
        if not wp_url:
            return None

        # Extract filename from URL
        filename = wp_url.split('/')[-1]

        # Try exact match first
        if filename.lower() in self.image_files:
            return f"{self.base_path}/{self.image_files[filename.lower()]}"

        # Try base name without size variant
        base_filename = re.sub(r'-\d+x\d+(\.[a-z]+)$', r'\1', filename)
        if base_filename.lower() in self.image_files:
            return f"{self.base_path}/{self.image_files[base_filename.lower()]}"

        # Try fuzzy matching on base name
        base_name_no_ext = os.path.splitext(base_filename)[0].lower()
        for stored_name in self.image_files.values():
            stored_base = os.path.splitext(stored_name)[0].lower()
            if base_name_no_ext in stored_base or stored_base in base_name_no_ext:
                return f"{self.base_path}/{stored_name}"

        return None

    def get_placeholder(self) -> str:
        """Return placeholder image path."""
        return "assets/images/blog/placeholder.jpg"


class PostBuilder:
    """Builds blog post JSON objects from WordPress data."""

    def __init__(self, image_manager: ImageManager, content_transformer: ContentTransformer):
        self.image_manager = image_manager
        self.content_transformer = content_transformer
        self.author = "Carlos Rodgarman"

    def build(self, wp_post: Dict) -> Dict:
        """Build complete blog post JSON object."""
        # Generate ID from post name (already kebab-case)
        post_id = wp_post['wp_post_name'] or self._slugify(wp_post['title'])

        # Transform content
        content = self.content_transformer.transform(wp_post['content'])

        # Find featured image
        featured_image = self._resolve_featured_image(wp_post, content)

        # Build image URL map for content replacement
        url_map = self._build_image_url_map(content)
        content = self.content_transformer.replace_image_urls(content, url_map)

        # Extract or generate excerpt
        excerpt = self._generate_excerpt(wp_post, content)

        # Calculate read time
        read_time = self._calculate_read_time(wp_post, content)

        # Get category (use first one, default to "Blog")
        category = wp_post['categories'][0] if wp_post['categories'] else "Blog"

        # Get tags
        tags = wp_post['tags'] if wp_post['tags'] else []

        # Format dates
        pub_date = self._format_date(wp_post['wp_post_date'])

        # Extract SEO metadata
        meta_desc = self._get_meta_description(wp_post, excerpt)
        meta_keywords = self._get_meta_keywords(wp_post, tags)

        # Build post object
        post = {
            "id": post_id,
            "title": wp_post['title'],
            "slug": post_id,
            "excerpt": excerpt,
            "content": content,
            "featuredImage": featured_image,
            "category": category,
            "tags": tags,
            "author": self.author,
            "publishDate": pub_date,
            "updatedDate": pub_date,
            "readTime": read_time,
            "metaDescription": meta_desc,
            "metaKeywords": meta_keywords,
            "featured": False  # Set featured posts manually later
        }

        return post

    def _resolve_featured_image(self, wp_post: Dict, content: str) -> str:
        """Resolve featured image from thumbnail ID or content."""
        # Priority 1: Use thumbnail ID from postmeta
        thumbnail_id = wp_post['postmeta'].get('_thumbnail_id', '')
        if thumbnail_id:
            # For now, we can't resolve attachment IDs without parsing attachments
            # Fall through to other methods
            pass

        # Priority 2: Extract first image from content
        first_image_url = self.content_transformer.extract_first_image(content)
        if first_image_url:
            local_image = self.image_manager.find_local_image(first_image_url)
            if local_image:
                return local_image

        # Priority 3: Use placeholder
        return self.image_manager.get_placeholder()

    def _build_image_url_map(self, content: str) -> Dict[str, str]:
        """Build map of WordPress URLs to local paths from content."""
        url_map = {}

        # Find all image URLs in content
        img_urls = re.findall(r'https://carlosrodgarman\.com/wp-content/uploads/[^"\'>\s]+', content)

        for wp_url in img_urls:
            local_path = self.image_manager.find_local_image(wp_url)
            if local_path:
                url_map[wp_url] = local_path

        return url_map

    def _generate_excerpt(self, wp_post: Dict, content: str) -> str:
        """Generate excerpt from WordPress data or content."""
        # Use WordPress excerpt if available
        if wp_post['excerpt']:
            excerpt = re.sub(r'<[^>]+>', '', wp_post['excerpt'])  # Strip HTML
            return excerpt.strip()[:200]

        # Generate from content
        text_content = re.sub(r'<[^>]+>', '', content)  # Strip HTML
        text_content = re.sub(r'\s+', ' ', text_content)  # Normalize whitespace

        if len(text_content) > 150:
            return text_content[:150] + '...'
        return text_content

    def _calculate_read_time(self, wp_post: Dict, content: str) -> str:
        """Calculate or extract read time."""
        # Try Yoast estimated reading time
        yoast_time = wp_post['postmeta'].get('_yoast_wpseo_estimated-reading-time-minutes', '')
        if yoast_time and yoast_time.isdigit():
            return f"{yoast_time} min read"

        # Calculate from word count (200 words per minute)
        text_content = re.sub(r'<[^>]+>', '', content)
        word_count = len(text_content.split())
        minutes = max(1, round(word_count / 200))

        return f"{minutes} min read"

    def _format_date(self, wp_date: str) -> str:
        """Format WordPress date to YYYY-MM-DD."""
        if not wp_date:
            return datetime.now().strftime('%Y-%m-%d')

        try:
            # Parse WordPress date format: 2004-02-06 19:54:45
            dt = datetime.strptime(wp_date.split()[0], '%Y-%m-%d')
            return dt.strftime('%Y-%m-%d')
        except:
            return datetime.now().strftime('%Y-%m-%d')

    def _get_meta_description(self, wp_post: Dict, excerpt: str) -> str:
        """Get meta description from Yoast or excerpt."""
        yoast_desc = wp_post['postmeta'].get('_yoast_wpseo_metadesc', '')
        if yoast_desc:
            return yoast_desc

        return excerpt[:160]

    def _get_meta_keywords(self, wp_post: Dict, tags: List[str]) -> str:
        """Get meta keywords from Yoast or tags."""
        yoast_keywords = wp_post['postmeta'].get('_yoast_wpseo_focuskw', '')
        if yoast_keywords:
            # Combine Yoast keyword with tags
            all_keywords = [yoast_keywords] + tags
            return ', '.join(all_keywords)

        return ', '.join(tags)

    def _slugify(self, text: str) -> str:
        """Convert text to URL-safe slug."""
        # Normalize unicode characters
        text = unicodedata.normalize('NFKD', text)
        text = text.encode('ascii', 'ignore').decode('ascii')

        # Convert to lowercase and replace spaces with hyphens
        text = text.lower()
        text = re.sub(r'[^\w\s-]', '', text)
        text = re.sub(r'[-\s]+', '-', text)

        return text.strip('-')


class Validator:
    """Validates blog post data."""

    def validate_posts(self, posts: List[Dict]) -> tuple[bool, List[str]]:
        """Validate list of posts. Returns (is_valid, errors)."""
        errors = []
        ids_seen = set()

        for i, post in enumerate(posts):
            # Check required fields
            required_fields = ['id', 'title', 'slug', 'content', 'featuredImage',
                             'category', 'tags', 'author', 'publishDate', 'readTime']

            for field in required_fields:
                if field not in post:
                    errors.append(f"Post {i}: Missing required field '{field}'")

            # Check for duplicate IDs
            if 'id' in post:
                if post['id'] in ids_seen:
                    errors.append(f"Post {i}: Duplicate ID '{post['id']}'")
                ids_seen.add(post['id'])

            # Validate date format
            if 'publishDate' in post:
                if not re.match(r'\d{4}-\d{2}-\d{2}', post['publishDate']):
                    errors.append(f"Post {i} ({post.get('id')}): Invalid date format '{post['publishDate']}'")

            # Check tags is array
            if 'tags' in post and not isinstance(post['tags'], list):
                errors.append(f"Post {i} ({post.get('id')}): Tags must be an array")

        return len(errors) == 0, errors


def main():
    """Main execution function."""
    print("=" * 60)
    print("WordPress to Static Blog Migration")
    print("=" * 60)
    print()

    # Paths
    base_dir = Path('/Users/miguel/Desktop/CarlosRodgarman.com')
    xml_path = '/Users/miguel/Desktop/export.xml'
    images_dir = base_dir / 'assets' / 'images' / 'imagenes-blog'
    existing_posts_path = base_dir / 'data' / 'blog-posts.json'
    output_path = base_dir / 'data' / 'blog-posts-migrated.json'

    # Initialize components
    parser = WordPressParser(xml_path)
    image_manager = ImageManager(str(images_dir))
    content_transformer = ContentTransformer()
    post_builder = PostBuilder(image_manager, content_transformer)
    validator = Validator()

    # Parse WordPress export
    wp_posts = parser.parse()

    if not wp_posts:
        print("❌ No posts found in WordPress export")
        return 1

    print()
    print(f"🔄 Transforming {len(wp_posts)} posts...")

    # Build blog posts
    new_posts = []
    warnings = []

    for i, wp_post in enumerate(wp_posts, 1):
        try:
            blog_post = post_builder.build(wp_post)
            new_posts.append(blog_post)

            # Warn if using placeholder
            if blog_post['featuredImage'] == image_manager.get_placeholder():
                warnings.append(f"   ⚠️  '{blog_post['title']}' - using placeholder image")

            print(f"   [{i}/{len(wp_posts)}] ✓ {blog_post['title']}")
        except Exception as e:
            print(f"   [{i}/{len(wp_posts)}] ❌ Error: {e}")
            warnings.append(f"   ❌ Failed to process: {wp_post.get('title', 'Unknown')}")

    # Load existing posts
    print()
    print("📚 Merging with existing posts...")
    existing_posts = []

    if existing_posts_path.exists():
        with open(existing_posts_path, 'r', encoding='utf-8') as f:
            existing_posts = json.load(f)
        print(f"   Found {len(existing_posts)} existing posts")

    # Merge (avoid duplicates by ID)
    existing_ids = {post['id'] for post in existing_posts}
    merged_posts = existing_posts.copy()

    duplicates = 0
    for post in new_posts:
        if post['id'] not in existing_ids:
            merged_posts.append(post)
        else:
            duplicates += 1
            print(f"   ⚠️  Skipping duplicate ID: {post['id']}")

    print(f"   Total posts after merge: {len(merged_posts)}")
    if duplicates > 0:
        print(f"   Skipped {duplicates} duplicates")

    # Sort by date (newest first)
    merged_posts.sort(key=lambda x: x['publishDate'], reverse=True)

    # Validate
    print()
    print("✅ Validating posts...")
    is_valid, errors = validator.validate_posts(merged_posts)

    if not is_valid:
        print(f"   ❌ Validation failed with {len(errors)} errors:")
        for error in errors[:10]:  # Show first 10 errors
            print(f"      {error}")
        return 1

    print(f"   ✓ All {len(merged_posts)} posts validated successfully")

    # Write output
    print()
    print(f"💾 Writing to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(merged_posts, f, indent=2, ensure_ascii=False)

    print(f"   ✓ Wrote {len(merged_posts)} posts")

    # Print summary
    print()
    print("=" * 60)
    print("Migration Summary")
    print("=" * 60)
    print(f"WordPress posts parsed: {len(wp_posts)}")
    print(f"Posts successfully transformed: {len(new_posts)}")
    print(f"Existing posts: {len(existing_posts)}")
    print(f"Total posts in output: {len(merged_posts)}")
    print(f"Duplicates skipped: {duplicates}")

    if warnings:
        print()
        print("⚠️  Warnings:")
        for warning in warnings[:20]:  # Show first 20 warnings
            print(warning)

    print()
    print("✅ Migration complete!")
    print(f"   Output file: {output_path}")
    print()
    print("Next steps:")
    print("1. Review the output file")
    print("2. Test in browser")
    print("3. If satisfied, copy to blog-posts.json")

    return 0


if __name__ == '__main__':
    exit(main())

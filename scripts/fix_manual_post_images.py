#!/usr/bin/env python3
"""
Fix images for the 4 manually created posts that reference assets/images/blog/*
These should use actual images from imagenes-blog instead.
"""

import json
from pathlib import Path

def fix_manual_post_images():
    """Update manually created posts to use correct image paths."""

    # Load posts
    posts_path = Path('data/blog-posts.json')
    with open(posts_path, 'r', encoding='utf-8') as f:
        posts = json.load(f)

    # Mappings for the 4 manually created posts
    manual_post_images = {
        'exploring-antelope-galaxy-64': 'assets/images/imagenes-blog/Carlos-Rodgarman-en-su-estudio-con-la-Antelope-Galaxy-64.jpg',
        'interview-neve-now-live': 'assets/images/imagenes-blog/Carlos_neve.jpg',
        'my-journey-in-music': 'assets/images/imagenes-blog/Carlos-Rodgarman-–-Music-Producer-at-RG-Studios.jpg',
        'neve-genesys-antelope-galaxy-synergy': 'assets/images/imagenes-blog/neve-genesys-g3d-dolby-atmos-los-angeles.jpg',
    }

    updates = []
    for post in posts:
        post_id = post['id']
        if post_id in manual_post_images:
            old_image = post['featuredImage']
            new_image = manual_post_images[post_id]

            if old_image != new_image:
                post['featuredImage'] = new_image
                updates.append(f"{post['title']}")
                updates.append(f"  FROM: {old_image}")
                updates.append(f"  TO:   {new_image}")

    # Write updated posts
    with open(posts_path, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

    if updates:
        print(f"Updated {len(updates)//3} post images:")
        for update in updates:
            print(f"  {update}")
    else:
        print("No updates needed - all images already correct")

if __name__ == '__main__':
    fix_manual_post_images()

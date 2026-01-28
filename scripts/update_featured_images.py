#!/usr/bin/env python3
"""
Update featured images for posts currently using placeholder.
Maps specific posts to available images.
"""

import json
from pathlib import Path

def update_featured_images():
    """Update featured images for specific posts."""

    # Load posts
    posts_path = Path('data/blog-posts.json')
    with open(posts_path, 'r', encoding='utf-8') as f:
        posts = json.load(f)

    # Image mappings (title keyword -> image path)
    image_map = {
        'Neve': 'assets/images/imagenes-blog/Carlos_neve.jpg',
        'Genesys Black': 'assets/images/imagenes-blog/Carlos_neve.jpg',
        'Carlos Rodgarman: Excellence': 'assets/images/imagenes-blog/Carlos-Rodgarman-–-Music-Producer-at-RG-Studios.jpg',
        'Practicing with the Harpejji': 'assets/images/imagenes-blog/Carlos-Rodgarman-–-Music-Producer-at-RG-Studios.jpg',
        'Celebration night': 'assets/images/imagenes-blog/Carlos-Rodgarman-–-Music-Producer-at-RG-Studios.jpg',
        'Interview for holahollywood': 'assets/images/imagenes-blog/Carlos-Rodgarman-–-Music-Producer-at-RG-Studios.jpg',
        'Press release in Faro de Vigo': 'assets/images/imagenes-blog/Carlos-Rodgarman-–-Music-Producer-at-RG-Studios.jpg',
        'Special thanks to my brother Grecco': 'assets/images/imagenes-blog/Carlos-Rodgarman-–-Music-Producer-at-RG-Studios.jpg',
        'Thanks Marcodi Musical': 'assets/images/imagenes-blog/Carlos-Rodgarman-–-Music-Producer-at-RG-Studios.jpg',
        'Thank you Anna Sarkisova': 'assets/images/imagenes-blog/Carlos-Rodgarman-–-Music-Producer-at-RG-Studios.jpg',
    }

    updates = []
    for post in posts:
        if post['featuredImage'] == 'assets/images/blog/placeholder.jpg':
            title = post['title']

            # Try to find a match
            for keyword, image_path in image_map.items():
                if keyword in title:
                    post['featuredImage'] = image_path
                    updates.append(f"{title} -> {image_path}")
                    break

    # Write updated posts
    with open(posts_path, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

    print(f"Updated {len(updates)} featured images:")
    for update in updates:
        print(f"  ✓ {update}")

    # Count remaining placeholders
    placeholder_count = sum(1 for p in posts if p['featuredImage'] == 'assets/images/blog/placeholder.jpg')
    print(f"\nRemaining placeholders: {placeholder_count}")

if __name__ == '__main__':
    update_featured_images()

#!/usr/bin/env python3
"""
Fix featured images to use correct, specific images for each post.
"""

import json
from pathlib import Path

def fix_featured_images():
    """Update featured images with specific, relevant images."""

    # Load posts
    posts_path = Path('data/blog-posts.json')
    with open(posts_path, 'r', encoding='utf-8') as f:
        posts = json.load(f)

    # Specific image mappings for posts
    image_updates = {
        'Carlos Rodgarman: Excellence in Music Production in Los Angeles':
            'assets/images/imagenes-blog/neve-genesys-g3d-dolby-atmos-los-angeles.jpg',

        'Carlos Rodgarman Adds Prestige To His Studio By Installing A Genesys Black':
            'assets/images/imagenes-blog/rodgarman_neve.jpg',

        'RG Music Mixes Immersive Michael Bublé Collection':
            'assets/images/imagenes-blog/2022-08-25-genelec-726x408-1.jpg',

        'Celebration night.':
            'assets/images/imagenes-blog/Carlos-Rodgarman-Music-Producer-at-RG-Studios.jpg',

        'Interview for holahollywood.com':
            'assets/images/imagenes-blog/Carlos-Rodgarman-Music-Producer-at-RG-Studios.jpg',

        'Press release in Faro de Vigo':
            'assets/images/imagenes-blog/Carlos-Rodgarman-Music-Producer-at-RG-Studios.jpg',

        'Practicing with the Harpejji':
            'assets/images/imagenes-blog/Carlos-Rodgarman-Music-Producer-at-RG-Studios.jpg',

        'Thanks Marcodi Musical':
            'assets/images/imagenes-blog/Carlos-Rodgarman-Music-Producer-at-RG-Studios.jpg',

        'Thank you Anna Sarkisova for this beautiful video as my dear friend Arturo.':
            'assets/images/imagenes-blog/Carlos-Rodgarman-Music-Producer-at-RG-Studios.jpg',

        'My Journey in Music: From Galicia to Los Angeles':
            'assets/images/imagenes-blog/Carlos-Rodgarman-Music-Producer-at-RG-Studios.jpg',
    }

    updates = []
    for post in posts:
        title = post['title']
        if title in image_updates:
            old_image = post['featuredImage']
            new_image = image_updates[title]
            if old_image != new_image:
                post['featuredImage'] = new_image
                updates.append(f"✓ {title}")
                updates.append(f"  FROM: {old_image}")
                updates.append(f"  TO:   {new_image}")

    # Write updated posts
    with open(posts_path, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

    print(f"Updated {len(updates)//3} featured images:\n")
    for update in updates:
        print(update)

    # Count remaining placeholders
    placeholder_count = sum(1 for p in posts if p['featuredImage'] == 'assets/images/blog/placeholder.jpg')
    print(f"\nRemaining placeholders: {placeholder_count}")

if __name__ == '__main__':
    fix_featured_images()

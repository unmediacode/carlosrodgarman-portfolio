#!/usr/bin/env python3
"""
Clean remaining WordPress URLs from post content.
"""

import json
import re
from pathlib import Path

def clean_wordpress_urls():
    """Remove WordPress CDN URLs from content."""

    posts_path = Path('data/blog-posts.json')
    with open(posts_path, 'r', encoding='utf-8') as f:
        posts = json.load(f)

    fixes = 0
    for post in posts:
        content = post['content']
        original = content

        # Remove img tags with wp-content URLs (broken images)
        content = re.sub(r'<img[^>]*src=["\']wp-content/uploads/[^"\']+["\'][^>]*>', '', content)

        # Clean up any remaining wp-content references
        content = re.sub(r'wp-content/uploads/[^\s"\'<>]+', '', content)

        # Clean up double spaces and empty lines
        content = re.sub(r'\s{2,}', ' ', content)
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

        if content != original:
            post['content'] = content.strip()
            fixes += 1
            print(f"✓ Cleaned: {post['title']}")

    with open(posts_path, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

    print(f"\nTotal posts cleaned: {fixes}")

if __name__ == '__main__':
    clean_wordpress_urls()

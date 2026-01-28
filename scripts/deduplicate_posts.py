#!/usr/bin/env python3
"""
Deduplicate blog posts by title, keeping manually created posts over WordPress imports.
"""

import json
from pathlib import Path

def deduplicate_posts():
    """Remove duplicate posts, prioritizing manually created ones."""

    # Load migrated posts
    migrated_path = Path('data/blog-posts-migrated.json')
    with open(migrated_path, 'r', encoding='utf-8') as f:
        posts = json.load(f)

    # Load original posts to identify manual ones
    backup_path = Path('data/blog-posts.json.backup')
    with open(backup_path, 'r', encoding='utf-8') as f:
        original_posts = json.load(f)

    original_ids = {post['id'] for post in original_posts}

    # Build map of title -> post, preferring original posts
    posts_by_title = {}
    duplicates_removed = []

    for post in posts:
        title = post['title']
        post_id = post['id']

        if title in posts_by_title:
            # Already have a post with this title
            existing_id = posts_by_title[title]['id']

            # If existing is original (manually created), skip this WordPress one
            if existing_id in original_ids:
                duplicates_removed.append(f"{title} (kept manual ID: {existing_id}, removed WP ID: {post_id})")
                continue

            # If this one is original, replace the existing
            if post_id in original_ids:
                duplicates_removed.append(f"{title} (kept manual ID: {post_id}, removed WP ID: {existing_id})")
                posts_by_title[title] = post
                continue

            # If both are from WP, keep first one
            duplicates_removed.append(f"{title} (kept {existing_id}, removed duplicate {post_id})")
        else:
            posts_by_title[title] = post

    # Convert back to list and sort by date
    deduplicated = list(posts_by_title.values())
    deduplicated.sort(key=lambda x: x['publishDate'], reverse=True)

    # Write output
    output_path = Path('data/blog-posts-deduplicated.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(deduplicated, f, indent=2, ensure_ascii=False)

    print(f"Original posts: {len(posts)}")
    print(f"After deduplication: {len(deduplicated)}")
    print(f"Removed: {len(posts) - len(deduplicated)}")

    if duplicates_removed:
        print("\nDuplicates removed:")
        for dup in duplicates_removed:
            print(f"  - {dup}")

    print(f"\n✓ Output written to: {output_path}")

if __name__ == '__main__':
    deduplicate_posts()

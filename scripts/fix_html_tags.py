#!/usr/bin/env python3
"""
Fix HTML tag issues in post content.
Specifically: <li> items that close with </div> instead of </li>
"""

import json
import re
from pathlib import Path

def fix_html_tags():
    """Fix HTML tag mismatches in post content."""

    # Load posts
    posts_path = Path('data/blog-posts.json')
    with open(posts_path, 'r', encoding='utf-8') as f:
        posts = json.load(f)

    fixes = 0
    for post in posts:
        content = post['content']
        original = content

        # Fix list items: <li>...</div> should be <li>...</li>
        # Look for <li> followed by content and closing with </div>
        content = re.sub(r'<li>([^<]*)</div>', r'<li>\1</li>', content)

        # More complex case: <li>...content...</div>
        # This regex handles li tags that have content and close with div
        def fix_list_item(match):
            # If we have <li> and the closing is </div> and we're in a <ul>, fix it
            li_content = match.group(1)
            # Check if there's a </ul> or </ol> after this
            return f'<li>{li_content}</li>'

        # Find <li>...text...</div> patterns that aren't part of gallery-item
        lines = content.split('\n')
        fixed_lines = []
        in_list = False

        for line in lines:
            # Track if we're in a list
            if '<ul>' in line or '<ol>' in line:
                in_list = True
            elif '</ul>' in line or '</ol>' in line:
                in_list = False

            # If we're in a list and line has <li>...</div>, fix it
            if in_list and '<li>' in line and '</div>' in line and 'gallery-item' not in line:
                line = re.sub(r'</div>', '</li>', line)

            fixed_lines.append(line)

        content = '\n'.join(fixed_lines)

        if content != original:
            post['content'] = content
            fixes += 1
            print(f"✓ Fixed: {post['title']}")

    # Write updated posts
    with open(posts_path, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

    print(f"\nTotal posts fixed: {fixes}")

if __name__ == '__main__':
    fix_html_tags()

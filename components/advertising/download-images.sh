#!/bin/bash

# Script para ayudar a identificar las imágenes necesarias
# Este script NO descarga las imágenes, solo proporciona la lista

echo "========================================="
echo "ADVERTISING PAGE - IMAGES NEEDED"
echo "========================================="
echo ""
echo "Total images needed: 29"
echo ""
echo "📂 Location: advertising/images/"
echo ""
echo "----------------------------------------"
echo "TV SERIES (16 images)"
echo "----------------------------------------"

cat << 'EOF'
1.  tv_series_1.jpg              → The Three Stooges
2.  tv_series_2.jpg              → Lucy Ball
3.  tv_series_3.jpg              → Bing Crosby
4.  tv_series_best_west_2020.jpg → Best of the West
5.  tv_series_5_2020.jpg         → Carol Burnet
6.  tv_series_6.jpg              → Laugh-In
7.  tv_series_2020.jpg           → All in the Family
8.  tv_series_andy_2020.jpg      → Andy Williams
9.  tv_series_9.jpg              → Bob Hope American Hero
10. tv_series_10.jpg             → Hee Haw
11. tv_series_12.jpg             → Red Skelton / Wonder Years
12. tv_series_batman_2020.jpg    → Batman The TV
13. tv_series_sullivan.jpg       → The Ed Sullivan Show
14. tv_series_16-_2020.jpg       → The Dean Martin Roast
15. tv_series_17.jpg             → The Johnny Carson Show
EOF

echo ""
echo "----------------------------------------"
echo "PRODUCTS (13 images)"
echo "----------------------------------------"

cat << 'EOF'
16. tv_produc_1.jpg              → KitchenAid
17. tv_produc_2.jpg              → Phillips Air Fryer
18. tv_produc_3.jpg              → LifeLock
19. tv_produc_4.jpg              → Murad RLR
20. tv_produc_5.jpg              → Cue Vapor System
21. tv_produc_6.jpg              → Kitchen Aid Mixer
22. tv_produc_7.jpg              → Murad Resurgence
23. maxi.jpg                     → MaxiClimber
24. tv_produc_8.jpg              → SwitchDriver
25. tv_produc_9.jpg              → PaintRunner Pro
26. tv_produc_10.jpg             → Ancestry
27. tv_produc_11.jpg             → Proactive
28. tv_produc_12.jpg             → Androzene
29. logo_time.jpg                → TimeLife Logo
EOF

echo ""
echo "========================================="
echo "INSTRUCTIONS"
echo "========================================="
echo ""
echo "1. Locate these images from your WordPress installation"
echo "   Original path: wp-content/uploads/"
echo ""
echo "2. Copy all images to:"
echo "   $(pwd)/images/"
echo ""
echo "3. Test the page:"
echo "   Open advertising.html in your browser"
echo ""
echo "========================================="


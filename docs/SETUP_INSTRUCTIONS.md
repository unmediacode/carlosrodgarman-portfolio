# Advertising Page - Setup Instructions

## 🎯 Overview

The Advertising page has been successfully created with the same structure and design coherence as the other pages (Films, Music, RG Studio).

## 📁 Files Created

### Main Files
- `advertising.html` - Main page (root directory)
- `css/pages/advertising.css` - Page-specific styles

### Component Files (advertising/ directory)
- `advertising-data.json` - Data for all 29 advertising items
- `advertising-card.css` - Card component styles
- `advertising-card.js` - Card component logic

### Assets
- `advertising/images/` - Folder for images
- `advertising/images/README.md` - List of required images
- `advertising/images/placeholder.svg` - Fallback placeholder

## ✅ What's Working

1. **Navigation** - All pages now link correctly to `advertising.html`
2. **Layout** - Matches the style of Films/Music pages
3. **Hero Section** - Curtain opening animation
4. **Grid System** - Responsive 4-column grid
5. **Card Components** - Hover effects, badges, modals
6. **Progressive Loading** - Loads in batches for performance
7. **Responsive Design** - Works on all screen sizes

## 📊 Data Structure

The page displays **29 items**:
- **16 DVD Series** (TimeLife productions)
- **13 Products** (Various commercial products)

Each item includes:
- Title
- Client (if applicable)
- Category (DVD SERIES or PRODUCT)
- Year (if applicable)
- Cover image
- Video URL (optional, for modal playback)

## 🖼️ Images Setup

### Required Images

You need to add **29 images** to the `advertising/images/` folder.

See `advertising/images/README.md` for the complete list.

### Option 1: Manual Download
If you have access to the WordPress site mentioned in the Excel file, download the images from the `wp-content/uploads/` directory.

### Option 2: Source Images
The Excel file references these images, but they are not embedded. You'll need to:
1. Locate the original WordPress installation
2. Download from `wp-content/uploads/`
3. Place them in `advertising/images/`

### Fallback
The system uses a placeholder image if any image is missing, so the site won't break.

## 🎨 Design Features

### Hero Section
- Title: "ADVERTISING"
- Subtitle: "Commercial Production · TV Series · Products"
- Curtain opening animation (1.2s)

### Card Design
- 3:4 aspect ratio covers
- Category badges (Series/Product)
- Hover effects with scale
- Play button overlay (if video available)
- Year display in accent color

### Modal System
- 16:9 video player
- Metadata display (Client, Category, Year)
- Close on ESC key or background click
- Auto-pause on close

## 🔗 Navigation

All pages updated with correct link:
- ✅ index.html
- ✅ films.html
- ✅ music.html
- ✅ rg-studio.html
- ✅ advertising.html

## 🚀 Next Steps

1. **Add Images**
   - Download the 29 images listed in `advertising/images/README.md`
   - Place them in `advertising/images/` folder

2. **Test the Page**
   - Open `advertising.html` in browser
   - Verify all cards display correctly
   - Test responsive behavior

3. **Optional Enhancements**
   - Add video URLs to `advertising-data.json` if available
   - Add descriptions for items if needed
   - Implement category filters (code structure ready)

## 📱 Responsive Breakpoints

- **Desktop** (>1200px): 4 columns
- **Tablet** (768-1200px): 3-4 columns
- **Mobile Large** (480-768px): 2-3 columns
- **Mobile** (<480px): 2 columns

## 🎬 Animations

- Curtain opening: 1.2s
- Card reveal: Staggered (50ms delay each)
- Hover scale: 0.3s smooth
- Modal fade in: 0.3s

## 📝 Notes

- The Excel file (`Work _ Advertinsing.xlsx`) only contained image paths, not embedded images
- All data has been converted to JSON format
- The design follows the same patterns as Films and Music pages
- Color scheme uses existing CSS variables for consistency

## 🆘 Troubleshooting

**Images not loading?**
- Check that images are in `advertising/images/` folder
- Verify filenames match exactly (case-sensitive)
- Check browser console for 404 errors

**Layout issues?**
- Clear browser cache
- Check that all CSS files are loading
- Verify responsive.css is included

**Cards not appearing?**
- Check browser console for JavaScript errors
- Verify `advertising-data.json` is accessible
- Check network tab for failed requests

## 📞 Support

For issues or questions, refer to the main project documentation or check the console for error messages.

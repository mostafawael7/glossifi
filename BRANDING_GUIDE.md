# Glossifi Branding Guide

## Colors

### Primary Colors
- **Cream Background**: `#FFF2EC` - Used for backgrounds and subtle sections
- **Lime Green**: `#DCEC80` - Used for secondary buttons and accents
- **Lavender**: `#B79AFF` - Used for gradients and highlights
- **Purple (Primary)**: `#7061F0` - Main brand color for primary actions, links, and accents

### Usage in Tailwind
```tsx
// Use brand colors like this:
className="bg-brand-purple"
className="text-brand-lavender"
className="border-brand-lime"
className="bg-brand-cream"
```

## Typography

### Font Family
- **Primary Font**: Montserrat
- **Weights Available**: 100-900
- Applied globally via Google Fonts

### Usage
The font is automatically applied to all text. Use Tailwind font-weight classes:
- `font-light` (300)
- `font-normal` (400)
- `font-medium` (500)
- `font-semibold` (600)
- `font-bold` (700)
- `font-extrabold` (800)

## Logo

### Logo Files Needed
Place logo files in `/public/` directory:
- `logo-white.svg` or `logo-white.png` - For dark backgrounds
- `logo-dark.svg` or `logo-dark.png` - For light backgrounds

### Logo Implementation
The logo is currently using a text placeholder. To use actual logo images:

1. Add logo files to `/public/` directory
2. Uncomment the Image component in `components/layout/Header.tsx`
3. Update the src path to match your logo file name

## Color Application

### Marketing Website
- **Hero Section**: Purple to lavender gradient
- **Buttons**: Purple primary, lime green secondary
- **Links**: Purple hover states
- **Backgrounds**: Cream for sections, white for cards
- **Featured Badges**: Purple background

### Admin Panel
- **Sidebar**: Dark slate (keeps professional look)
- **Accents**: Brand purple for active states and buttons
- **Cards**: White with subtle shadows

## Next Steps

1. **Add Logo Files**: 
   - Export your logos as SVG or PNG
   - Place in `/public/` directory
   - Update Header component

2. **Fine-tune Colors** (if needed):
   - Adjust color usage in specific components
   - Add more brand color variations if needed

3. **Test Branding**:
   - Check all pages for consistent brand application
   - Ensure good contrast and readability


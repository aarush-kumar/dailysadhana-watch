# Daily Sadhana - Master Design System

This document codifies the design language for the Daily Sadhana Watch platform, ensuring consistency with the main website [thedailysadhana.com](https://thedailysadhana.com).

## Core Design Tokens

### 🎨 Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| **Primary Maroon** | `#5D1F1F` | Headers, primary buttons, active states, key branding |
| **Accent Gold** | `#D4AF37` | Symbols, icons, secondary highlights |
| **Soft Cream** | `#FDF5E6` | Main background (warm, spiritual feel) |
| **Pure White** | `#FFFFFF` | Card backgrounds, button text |
| **Deep Brown** | `#2D1E1E` | Primary body text (softer than black) |
| **Muted Tan** | `#8B7D6B` | Secondary text, borders, disabled states |

### 🖋️ Typography
- **Headings (Serif):** `Playfair Display` (Google Fonts)
  - *Mood:* Tradition, Authority, Spiritual Depth
- **Body (Sans-serif):** `Poppins` (Google Fonts)
  - *Mood:* Modern Clarity, Accessibility
- **Special (Sanskrit):** `Noto Sans Devanagari`

### 📐 Layout & Interaction
- **Rounded Corners:** `border-radius: 50x` (Pill) for buttons, `24px` for cards/modules.
- **Spacing:** Based on an `8px` grid (8, 16, 24, 32, 48, 64).
- **Shadows:** Very subtle deep brown shadows (`rgba(45, 30, 30, 0.08)`).
- **Animations:** Smooth fades and subtle vertical slides (`300ms`, `ease-out`).

## Dashboard Redesign Principles
1. **Premium Minimalism:** Every element should breathe. Increase white space to create a "meditative" interface.
2. **Rounded Connectivity:** Use the "pill" button style consistently.
3. **Warmth:** Avoid cold pure whites or grays. Use the cream background as the foundation.
4. **Elevation:** Use soft card containers with significant rounding (24px) to group metrics.

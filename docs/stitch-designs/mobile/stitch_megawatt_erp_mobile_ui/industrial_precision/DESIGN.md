---
name: Industrial Precision
colors:
  surface: '#f7f9fc'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#43474f'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#737780'
  outline-variant: '#c3c6d1'
  surface-tint: '#3a5f94'
  primary: '#001e40'
  on-primary: '#ffffff'
  primary-container: '#003366'
  on-primary-container: '#799dd6'
  inverse-primary: '#a7c8ff'
  secondary: '#795900'
  on-secondary: '#ffffff'
  secondary-container: '#ffbf00'
  on-secondary-container: '#6d5000'
  tertiary: '#041f38'
  on-tertiary: '#ffffff'
  tertiary-container: '#1d344e'
  on-tertiary-container: '#869dbc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#1f477b'
  secondary-fixed: '#ffdfa0'
  secondary-fixed-dim: '#fbbc00'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#d2e4ff'
  tertiary-fixed-dim: '#b1c8e9'
  on-tertiary-fixed: '#021c36'
  on-tertiary-fixed-variant: '#324863'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
---

## Brand & Style

The design system is engineered for **MegaWatt ERP**, a high-utility mobile application serving the electrical and factory supply sector. The brand personality is authoritative, dependable, and highly functional, mirroring the precision of industrial engineering.

The aesthetic follows a **Corporate / Modern** direction with a focus on high-density information management and rapid task completion. It prioritizes clarity and utility over decorative elements. 
- **Target Audience:** Factory managers, procurement officers, and electrical contractors.
- **Emotional Response:** Efficiency, reliability, and professional rigor.
- **Key Characteristics:** High contrast for readability in various lighting conditions (e.g., bright warehouses), generous touch targets for active work environments, and a structured layout that feels indestructible and professional.

## Colors

The palette is anchored by **Deep Electric Blue**, signaling stability and corporate trust. **Amber/Yellow** serves as a strategic accent for primary actions and attention-critical alerts, mimicking industrial safety standards.

- **Primary (#003366):** Used for headers, primary branding, and core navigation.
- **Accent (#FFBF00):** Reserved for primary call-to-action buttons and critical highlights. High contrast against both white and dark navy.
- **Neutral Background (#F5F7FA):** A cool-toned light gray to reduce eye strain during prolonged use.
- **Surface/Text (#001A33):** Used for primary text and deep background containers to ensure AA/AAA accessibility compliance.

## Typography

This design system utilizes **Be Vietnam Pro** for its exceptional legibility and professional, geometric structure. While the system is optimized for English (LTR), it must be paired with **Cairo** for Arabic (RTL) support to maintain the same modern, technical aesthetic.

- **Weight Usage:** Use Bold (700) for headers and SemiBold (600) for sub-headers. Regular (400) is used for all body copy to ensure clarity.
- **RTL Considerations:** When switching to Arabic, font sizes should be increased by 10-15% to maintain equivalent visual weight and legibility compared to the Latin script.
- **Data Tables:** For part numbers and quantities, ensure numeric characters use tabular lining to keep columns aligned.

## Layout & Spacing

The system uses a **Fluid Grid** model based on a 4px baseline shift. For mobile, a 16px side margin is mandatory.

- **Touch Targets:** All interactive elements (buttons, inputs, toggles) must maintain a minimum height of 48px to accommodate use in active, high-movement factory environments.
- **Spacing Rhythm:** Use 16px (md) for standard padding within cards and 24px (lg) to separate distinct content sections.
- **RTL Behavior:** The layout must mirror perfectly for Arabic support. Icons with directionality (arrows, progress bars) must be flipped, while industrial icons (gears, bolts, batteries) remain static.

## Elevation & Depth

Depth is conveyed through **Tonal Layers** and crisp, low-opacity shadows. This ensures that even in low-light environments, the hierarchy remains obvious.

- **Level 0 (Background):** #F5F7FA.
- **Level 1 (Cards/Basics):** White surface with a 1px border (#E1E4E8) and no shadow.
- **Level 2 (Interactive/Floating):** White surface with a soft, 8px blur shadow (Color: #001A33, Opacity: 8%). Used for active state cards and bottom sheets.
- **Level 3 (Modals):** High-contrast overlay with 16px blur shadows to isolate critical task flows.

## Shapes

The design system employs **Soft** (4px - 12px) corner radii. This strikes a balance between the "hard" nature of industrial equipment and the "modern" requirement of a clean software interface.

- **Small Components (Buttons/Inputs):** 4px radius.
- **Medium Components (Cards/Dialogs):** 8px radius.
- **Large Components (Modals/Banners):** 12px radius.
- **Pills:** Used exclusively for status badges (Success, Warning, etc.) to distinguish them from interactive buttons.

## Components

### Buttons
- **Primary:** Deep Electric Blue background, white text. Solid 48px height.
- **Action/Accent:** Amber background with Dark Navy text for maximum visibility.
- **Secondary:** Ghost style with 1px Deep Electric Blue border.

### Mobile-First Cards
- Cards feature a 1px #E1E4E8 border. Headlines are set in `headline-sm`.
- Quantitative data (e.g., "Stock: 450 units") should be highlighted using a background tint of the Primary color (5% opacity).

### Status Badges
- Small, pill-shaped tags. 
- Use semi-bold 11px text. Backgrounds are high-chroma but light (20% opacity of the status color) with 100% opacity text of the same color for high contrast.

### Input Fields
- Structured with a persistent label in `label-bold`. 
- Focused state uses a 2px Deep Electric Blue border.
- Include "Clear" (X) trailing icons for efficient data entry.

### Industrial Icons
- Use 24px stroke-based icons with a 2px weight. 
- Avoid thin lines that might disappear on lower-resolution mobile screens.
- Icons must be centered within a 48px hit area.
---
name: Megawatt
colors:
  surface: '#fef7ff'
  surface-dim: '#dfd7e3'
  surface-bright: '#fef7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f1fc'
  surface-container: '#f3ebf7'
  surface-container-high: '#ede6f1'
  surface-container-highest: '#e7e0eb'
  on-surface: '#1d1a22'
  on-surface-variant: '#4a4453'
  inverse-surface: '#322f37'
  inverse-on-surface: '#f6eef9'
  outline: '#7b7484'
  outline-variant: '#ccc3d5'
  surface-tint: '#6f43c0'
  primary: '#4f1c9e'
  on-primary: '#ffffff'
  primary-container: '#673ab7'
  on-primary-container: '#d8c2ff'
  inverse-primary: '#d3bbff'
  secondary: '#0061a4'
  on-secondary: '#ffffff'
  secondary-container: '#33a0fd'
  on-secondary-container: '#00355c'
  tertiary: '#5f3500'
  on-tertiary: '#ffffff'
  tertiary-container: '#804900'
  on-tertiary-container: '#ffbf83'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ebddff'
  primary-fixed-dim: '#d3bbff'
  on-primary-fixed: '#250059'
  on-primary-fixed-variant: '#5727a6'
  secondary-fixed: '#d1e4ff'
  secondary-fixed-dim: '#9ecaff'
  on-secondary-fixed: '#001d36'
  on-secondary-fixed-variant: '#00497d'
  tertiary-fixed: '#ffdcbf'
  tertiary-fixed-dim: '#ffb872'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6a3b00'
  background: '#fef7ff'
  on-background: '#1d1a22'
  surface-variant: '#e7e0eb'
typography:
  display:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
  numeric-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding: 16px
  card-gap: 12px
  mobile-safe-bottom: 34px
---

## Brand & Style
The design system is engineered for **Megawatt**, a professional ERP environment that prioritizes data density, operational efficiency, and cross-functional reliability. The target audience consists of enterprise power users who require high-performance interfaces for resource planning and logistics management.

The design style is **Corporate / Modern**, heavily influenced by the structured, layered approach of professional admin dashboards. It utilizes a "Surface-over-Base" architectural model where the primary background provides a cool, neutral canvas for crisp, white elevated containers. The aesthetic is utilitarian yet refined, avoiding any decorative flourishes that do not serve a functional purpose. The emotional response should be one of confidence, stability, and precision.

## Colors
The palette is rooted in a professional "Berry" aesthetic, utilizing a Deep Purple primary for brand recognition and an Accent Blue for interactive secondary elements. 

- **Background Strategy:** Use the Light Grayish Blue (#eef2f6) for the global canvas to reduce eye strain and provide contrast for white surface elements.
- **Functional Colors:** Success, Warning, and Error colors follow standard enterprise conventions to ensure immediate status recognition.
- **Typography:** Text colors are strictly tiered between Dark Gray (#364152) for primary readability and Medium Gray (#697586) for metadata and labels.

## Typography
This design system utilizes **Inter** for its exceptional legibility in data-heavy environments and neutral, professional tone. 

The type scale is optimized for ERP density. **Headline-lg** and **Headline-md** are used for view titles and section headers. **Body-md** is the workhorse for content, while **Label-sm** (uppercase) is reserved for category descriptors and table headers. Special attention is given to **Numeric** roles to ensure that financial and quantity data remain the most prominent elements in the UI. For mobile views, the scale is compressed slightly to maintain high information density without sacrificing touch-target clarity.

## Layout & Spacing
The layout philosophy is a **Fixed-Fluid Hybrid**. On mobile (390px), the system uses a single-column stack with 16px lateral margins. 

- **Grid:** Content follows a 4px baseline grid to ensure vertical rhythm. 
- **Density:** Spacing is compact. Use `md` (16px) for major section spacing and `sm` (8px) for internal component spacing (e.g., between an icon and text).
- **Mobile Constraints:** All views must account for a 34px bottom safe area to accommodate mobile browser "home bars" and navigation overlays.
- **Cards:** Elements should span the full width of the safe area minus the container padding.

## Elevation & Depth
The design system employs **Tonal Layers with subtle shadows** to define hierarchy:

1.  **Level 0 (Base):** Background color (#eef2f6). No shadow.
2.  **Level 1 (Cards/Surfaces):** White background. 1px solid border (#e3e8ef) or a very soft ambient shadow (0px 2px 4px rgba(144, 164, 174, 0.2)).
3.  **Level 2 (Modals/Popovers):** White background. Pronounced diffused shadow (0px 8px 24px rgba(33, 150, 243, 0.15)) to create distinct separation from the base content.

Navigation bars and top headers remain flat with a bottom border to maintain the "enterprise tool" feel rather than a floating app aesthetic.

## Shapes
The shape language is structured and approachable. All "MainCard" elements and primary containers use a **12px (0.75rem)** corner radius. 

- **Small Components:** Buttons and Input fields use an 8px radius to maintain a cohesive look.
- **Chips/Status Tags:** Utilize a 6px radius or a full-pill shape depending on the status type (use 6px for outlined status tags to keep them feeling professional and "admin-like").
- **Consistency:** Rounding is never excessive; it is used just enough to soften the interface without losing the "grid-like" efficiency of an ERP.

## Components
- **Buttons:** Primary buttons use the Deep Purple background with white text. Secondary buttons use an outlined style with the Accent Blue. Use "compact" height (36px-40px) for mobile ERP actions.
- **MainCard:** The core container. Must have a 12px border-radius, white background, and a subtle 1px border (#e3e8ef).
- **Status Chips:** Use an "Outlined" style for ERP statuses. Backgrounds should be a 10% opacity version of the status color (e.g., Light Green for Success) with a 1px solid border of the full-strength color.
- **Input Fields:** Outlined Material style. The border turns Primary Purple on focus. Labels should use the `label-md` typography role.
- **Data Lists:** For mobile, replace tables with "List Cards." Each row is a separate white surface or separated by a subtle divider, emphasizing the key numeric value in the top right.
- **Progress Bars:** Thin (4px - 6px height), using flat colors without gradients.
- **App Bar:** Fixed at the top, white background, 1px bottom border. Centered or left-aligned title using `headline-md`.
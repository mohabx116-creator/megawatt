---
name: MegaWatt Industrial Framework
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#43474f'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
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
  tertiary: '#181e2a'
  on-tertiary: '#ffffff'
  tertiary-container: '#2d3340'
  on-tertiary-container: '#959bab'
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
  tertiary-fixed: '#dde2f3'
  tertiary-fixed-dim: '#c1c6d7'
  on-tertiary-fixed: '#161c27'
  on-tertiary-fixed-variant: '#414754'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
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
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: jetbrainsMono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style

This design system is engineered for high-density industrial ERP environments. It prioritizes **Reliability, Precision, and Utility**. The aesthetic leans into a "Modern Corporate" style with subtle "Industrial Brutalist" influences—characterized by structured grids, clear data boundaries, and a focus on functional clarity over decorative flair.

The target audience consists of procurement officers, warehouse managers, and electrical engineers who require a stable, high-performance interface that minimizes cognitive load during complex task flows. The emotional response should be one of "Ordered Confidence"—users should feel that the system is as robust as the electrical infrastructure they manage.

**Key Stylistic Pillars:**
- **Information Density:** Optimized for data-heavy views without sacrificing legibility.
- **Structural Integrity:** Heavy reliance on vertical and horizontal alignment to suggest stability.
- **Functional Accents:** Using industrial-inspired amber highlights to draw attention to critical actions and alerts.

## Colors

The palette is anchored by **Deep Electric Blue**, representing the power and stability of the industrial sector. 

- **Primary (#003366):** Used for global navigation, primary actions, and branding elements. It provides a serious, trustworthy foundation.
- **Accent (#FFBF00):** A high-visibility Amber used sparingly for primary Call-to-Actions (CTAs), warnings, and highlights that require immediate attention.
- **Neutrals:** A range of Cool Grays (from #F8FAFC to #1A202C) is used to create clear separation in complex data tables and dashboards.
- **Semantic Colors:** Adhere to industry standards to ensure safety and status are communicated instantly across inventory and electrical load monitoring modules.

## Typography

The typography system uses **Inter** for its exceptional legibility in digital interfaces and data-heavy applications. For Arabic localization, **Cairo** is the designated typeface to maintain the structured, professional tone.

**Type Roles:**
- **Display/Headlines:** Use Bold weights for clear section delineation.
- **Body:** The default is `body-md` (14px) for general interface text to allow for higher information density.
- **Labels:** Uppercase labels with slight letter spacing are used for table headers and form category titles.
- **Data Mono:** `jetbrainsMono` is introduced for SKU numbers, serial numbers, and electrical specifications to ensure no character ambiguity.

## Layout & Spacing

The layout follows a **Rigid 12-Column Grid** system for desktop. ERP modules typically require a "sidebar-first" orientation.

- **Sidebar Width:** 260px (expanded), 64px (collapsed).
- **Spacing Scale:** Based on a 4px baseline. Use 8px (Small), 16px (Medium), and 24px (Large) for internal component spacing.
- **Density:** In data-entry views, vertical padding is reduced to 8px to allow more rows "above the fold." In dashboard views, padding increases to 24px to provide visual breathing room around KPIs.
- **Breakpoints:**
  - Mobile: < 768px (1-column stack)
  - Tablet: 768px - 1024px (Reduced sidebar, 6-column grid)
  - Desktop: > 1024px (Full sidebar, 12-column grid)

## Elevation & Depth

This system avoids heavy shadows to maintain a clean, industrial look. Depth is conveyed through **Tonal Layering** and **Low-Contrast Outlines**.

- **Level 0 (Background):** #F8FAFC (Cool Gray) - The canvas.
- **Level 1 (Cards/Containers):** #FFFFFF - Used for the primary content areas. 1px border (#E2E8F0) is preferred over shadows.
- **Level 2 (Dropdowns/Modals):** Subtle ambient shadow (Y: 4, Blur: 12, Opacity: 0.05, Color: #003366) to indicate temporary overlay without disrupting the flat industrial aesthetic.
- **Active State:** A 2px "Electric Blue" left-border highlight is used for active navigation or selected table rows.

## Shapes

To reflect the precision of industrial engineering, the shape language is **geometric and disciplined**. 

- **Standard Radius:** 4px for buttons, input fields, and small UI elements.
- **Large Radius:** 8px for cards and primary containers.
- **Strict Square:** Use 0px corners for decorative separators and table headers to reinforce the "grid" feel.
- **Pattern:** Dashboard KPI cards should feature a subtle 5% opacity "Circuitry" or "Grid" watermark in the top-right corner to reinforce the electrical theme.

## Components

### Buttons
- **Primary:** Deep Electric Blue background, white text. High contrast, 4px radius.
- **Action (Amber):** Used specifically for "Update," "Dispatch," or "Submit Order." Amber background with Navy text for maximum legibility.
- **Ghost:** Navy outline for secondary actions like "Cancel" or "Export."

### Data Tables
- **Zebra Stripping:** Alternate rows use #F8FAFC. 
- **Sticky Headers:** Navy background (#1A202C) with white label-md typography.
- **Status Badges:** Small, 4px radius, low-opacity background with high-opacity text (e.g., "In Stock" is 10% Green bg, 100% Green text).

### Navigation
- **Sidebar:** Dark Navy background. Icons should be "Outlined" style for clarity. Nested items should have a 12px indent and a lighter text-weight.

### Input Fields
- **State-driven:** 1px border (#CBD5E1). On focus, the border shifts to Deep Electric Blue with a 2px outer glow.
- **Validation:** Errors must include both a red border and a specific error icon for accessibility.

### KPI Cards
- **Structure:** Title (Label-md), Value (Display-lg), Trend (Body-sm). Trend indicators (Up/Down) must use semantic colors.
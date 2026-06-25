---
name: Resilience Command
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45474c'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#bb0112'
  on-secondary: '#ffffff'
  secondary-container: '#e02928'
  on-secondary-container: '#fffbff'
  tertiary: '#001907'
  on-tertiary: '#ffffff'
  tertiary-container: '#003013'
  on-tertiary-container: '#559f67'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ab'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#93000b'
  tertiary-fixed: '#a6f4b5'
  tertiary-fixed-dim: '#8bd79b'
  on-tertiary-fixed: '#00210b'
  on-tertiary-fixed-variant: '#005226'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
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
    letterSpacing: -0.01em
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
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
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
  2xl: 48px
  gutter: 16px
  margin: 24px
---

## Brand & Style

The design system is engineered for high-stakes operational environments where clarity, speed of cognition, and reliability are paramount. The brand personality is **authoritative, systematic, and urgent**, yet remains **composed** under pressure. It is designed for emergency responders, relief coordinators, and government officials who require a "single source of truth" during disaster scenarios.

The visual style follows a **Modern Corporate** approach with a focus on **Information Density**. It prioritizes functional utility over decorative flair. The aesthetic is clean and structured, utilizing a systematic grid to organize complex data sets into digestible modules. High-contrast signaling is reserved strictly for status changes and critical alerts, ensuring that the user's attention is always directed to the most vital information.

## Colors

The palette is anchored by **Deep Navy (#1e293b)**, providing a stable, professional foundation that implies institutional trust. **Emergency Red (#dc2626)** is used sparingly but with high impact for critical alerts, overdue resources, and immediate threats.

- **Primary (Deep Navy):** Navigation, headers, and primary actions.
- **Secondary (Emergency Red):** Critical status badges, "High" priority markers, and destructive actions.
- **Success (Forest Green):** Fulfilled resource requests and stable camp statuses.
- **Warning (Amber):** Low inventory alerts and pending approvals.
- **Neutral/Surface:** A spectrum of cool grays (Slate) to provide depth and separation without introducing visual noise. Backgrounds utilize a very light tint (#f8fafc) to reduce eye strain during prolonged use.

## Typography

This design system utilizes **Inter** as the primary typeface for its exceptional legibility and neutral, professional tone. To support the technical nature of resource tracking and ID codes, **JetBrains Mono** is introduced for labels and data values, providing a distinct visual "voice" for system-generated strings and status indicators.

- **Headlines:** Use Bold and Semi-Bold weights to create a clear information hierarchy.
- **Body:** The 14px (md) size is the workhorse for data tables and descriptions.
- **Monospaced Labels:** Used for ID tags (e.g., Victim IDs, Batch Numbers) and status badges to ensure characters like '0' and 'O' or '1' and 'l' are never confused during high-pressure data entry.

## Layout & Spacing

The system employs a rigorous **8px grid** (with 4px increments for tight components) to ensure mathematical alignment across all screens. 

- **Dashboard Layout:** A 12-column fluid grid for desktop, collapsing to a single column on mobile. 
- **Data Density:** Use the `sm` (8px) and `md` (16px) tokens for internal padding in tables and cards to maximize information density while maintaining readability.
- **Sidebars:** Fixed-width navigation (240px or 280px) to provide a persistent "home base" for switching between Map View, Resource List, and Victim Tracking.
- **Breakpoints:** 
    - Mobile: < 640px (16px margins)
    - Tablet: 640px - 1024px (24px margins)
    - Desktop: > 1024px (Max-width 1440px for content containers)

## Elevation & Depth

To maintain a "production-ready" and utilitarian feel, depth is created primarily through **Tonal Layering** and **Low-Contrast Outlines** rather than dramatic shadows.

- **Level 0 (Background):** #f8fafc.
- **Level 1 (Cards/Surface):** White (#ffffff) with a 1px border (#e2e8f0).
- **Interactive States:** A very subtle ambient shadow (4px blur, 2% opacity) may be used on hover to indicate clickability.
- **Modals/Overlays:** Use a slightly more aggressive shadow and a backdrop blur (8px) to isolate critical input forms from the background data.

## Shapes

The shape language is **Soft (0.25rem)**. This provides a clean, modern edge that feels structured and professional without the clinical harshness of sharp 90-degree corners. 

- **Buttons & Inputs:** 4px radius.
- **Cards & Containers:** 8px (rounded-lg) for outer containers to create a visible frame.
- **Status Badges:** 2px or 4px radius; avoid pill shapes to maintain the serious, systematic aesthetic.

## Components

### Buttons
- **Primary:** Deep Navy background, white text. Bold weight.
- **Secondary:** Transparent with a 1px Slate border.
- **Urgent/Danger:** Emergency Red background for high-priority resource requests.

### Cards
- Clean, flat design. 
- Use a "header bar" within the card for titles, utilizing a light gray background (#f1f5f9) to separate the title from the content.

### Data Tables
- **Alternating Rows:** Use #f8fafc for even rows to improve horizontal tracking across many columns.
- **Row Hover:** A subtle background shift to #f1f5f9.
- **Sticky Headers:** Essential for long lists of resources or victims.

### Status Badges
- Small, uppercase, monospaced text.
- **Critical:** Light red background, dark red text.
- **Active:** Light green background, dark green text.
- **Pending:** Light amber background, dark amber text.

### Form Inputs
- 1px Slate-200 border, turning to Primary Navy on focus.
- Help text should be 12px (label-md) and positioned directly below the input field.

### Map Pins & Markers
- Custom markers for Camp Locations, Hospital Points, and Supply Drops using the system's primary and status colors for consistency.
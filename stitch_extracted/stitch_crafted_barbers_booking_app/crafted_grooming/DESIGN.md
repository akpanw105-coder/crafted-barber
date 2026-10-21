---
name: Crafted Grooming
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d1c5b5'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#998f81'
  outline-variant: '#4d463a'
  surface-tint: '#e5c285'
  primary: '#e5c285'
  on-primary: '#412d00'
  primary-container: '#c6a56b'
  on-primary-container: '#513a0a'
  inverse-primary: '#755a28'
  secondary: '#e4beb1'
  on-secondary: '#432b21'
  secondary-container: '#5e4338'
  on-secondary-container: '#d6b0a3'
  tertiary: '#eabda0'
  on-tertiary: '#452a16'
  tertiary-container: '#cba185'
  on-tertiary-container: '#553722'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdea7'
  primary-fixed-dim: '#e5c285'
  on-primary-fixed: '#271900'
  on-primary-fixed-variant: '#5b4312'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#e4beb1'
  on-secondary-fixed: '#2b160e'
  on-secondary-fixed-variant: '#5b4136'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#eabda0'
  on-tertiary-fixed: '#2d1604'
  on-tertiary-fixed-variant: '#5f402a'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 34px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: 0em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0.01em
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.12em
  currency-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  currency-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

### Personality & Demographics
This design system defines an intimate, bespoke grooming concierge built for discerning men who prioritize ritual, discretion, and craftsmanship. The digital presence channels bespoke tailoring houses, apothecary craft, and exclusive private clubs: restrained, deliberate, and uncompromisingly quiet. 

### Emotional Response
The interface must evoke an immediate sensation of unhurried focus, quiet authority, and spatial ease. The experience mirrors walking into a private studio: warm ambient low-light, leather notes, silent precision, and absence of synthetic noise. Every touchpoint feels intentional and grounded.

### Design Movement & Aesthetic Direction
- **Minimalist Tactility:** Radical reduction of decorative noise. Every layout adheres to expansive breathing room, razor-sharp structural alignments, and purposeful negative space.
- **Editorial Luxury:** High-contrast, dignified serif headlines paired with precise geometric sans-serif data points and micro-labels.
- **Pure Functional Scarcity:** Strictly zero promotional carousels, flashy gamified banners, badge clutter, or faux urgency patterns. Content is structured into pure sequential appointments, curated artisan profiles, and effortless checkout.

## Colors

### Strict Palette Mapping
- **Obsidian Black (`#111111`):** The primary canvas surface and viewport base. Establishes depth, absolute contrast, and darkroom intimacy.
- **Espresso Brown (`#3B241B`):** Deep secondary containers, pressed action states, and rich organic panel backdrops.
- **Ivory White (`#F8F5EF`):** Primary display typography, high-priority readouts, active booking states, and crisp icon strokes.
- **Champagne Gold (`#C6A56B`):** Restrained accent highlight. Reserved strictly for active indicators, status milestones, select interactive toggles, and monetary currency symbols (`₦`).
- **Charcoal Gray (`#292929`):** Subtle surface elevations (cards, bottom sheets), structural separators, hairline borders, and inactive progress rails.
- **Warm Mocha (`#6F4E37`):** Muted structural details, tertiary button backgrounds, and micro-accents.
- **Warm Beige (`#D8C3A5`):** Secondary metadata, helper labels, timestamps, duration specs, and breadcrumbs.

### Usage Disciplines
1. **Gold Scarcity:** Champagne Gold must never dominate more than 5% of the viewport area. It acts as an artisan hallmark, not a background wash.
2. **Hairline Discipline:** Borders on `#292929` must remain 1px solid with 60% opacity to prevent harsh grid lines.
3. **Contrast Hierarchy:** Text flows strictly from Ivory White (`#F8F5EF`, 100%) for headers and primary values, to Warm Beige (`#D8C3A5`, 80%) for service details, down to Warm Mocha / Charcoal for deactivated slots.

## Typography

### Structural Hierarchy & Pairing
- **Serif Authority (`Playfair Display`):** Reserved for screen titles, master service names (e.g., "The Signature Scissor Cut", "Beard Sculpt & Hot Towel"), and conversational modal prompts. Evokes master craftsmanship and timeless bespoke barbering.
- **Modern Legibility (`Plus Jakarta Sans`):** Powers all functional UI mechanics, calendar data, timeslot matrices, master barber bios, and navigation nodes.
- **Uppercase Tracking:** Micro-labels, step trackers, and category identifiers (e.g., "MASTER BARBER", "AVAILABLE SLOTS") utilize `label-sm` or `label-md` with strict uppercase styling and expanded letter spacing (`0.08em` to `0.12em`).
- **Currency Typography:** All Nigerian Naira monetary representations (`₦`) utilize `Plus Jakarta Sans` semi-bold weights rather than serif styling to preserve crisp clarity across compact lists.

## Layout & Spacing

### Mobile Architecture (390px Native Viewport)
- **Safe Margins:** A fixed `1.25rem` (20px) horizontal outer margin guarantees breathability on modern edge-to-edge handheld devices, eliminating edge collisions.
- **Rhythm & Grid:** Built on an intentional 4px base / 8px scale step. The vertical flow enforces spacious sections with `space-xl` (36px) separating distinct workflow steps (Barber Selection -> Date/Time Matrix -> Ritual Add-ons -> Payment Confirmation).
- **Vertical Restraint:** Content panels do not crowd the viewport. Every screen is strictly optimized for one singular booking decision at a time, preventing decision fatigue.
- **Fixed Persistent Anchor:** Checkout and progression bars lock cleanly to the bottom safe area with a translucent backdrop blur over `#111111` to anchor the thumb zone.

## Elevation & Depth

### The Tonal Layering Model
Depth in this design system avoids garish drop shadows. Depth is achieved purely through layered, tonal surface shifts and hairline luminance:

1. **Canvas (Base - Level 0):** `#111111` (Obsidian Black) - The bottom viewport foundation.
2. **Elevated Surface (Cards & Rows - Level 1):** `#181818` with a 1px perimeter border rendered in `rgba(41, 41, 41, 0.7)`.
3. **Interactive & Highlight Surface (Selected Item - Level 2):** `#3B241B` (Espresso Brown) with a 1px border rendered in `rgba(198, 165, 107, 0.4)` (Champagne Gold highlight).
4. **Overlay Sheets & Dialogues (Modals - Level 3):** `#1E1E1E` surrounded by a subtle edge ring in `rgba(216, 195, 165, 0.12)` accompanied by an ambient dark diffusion: `box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.7)`.

### Glass & Frosted Accents
Top application bars and floating confirmation footers use `backdrop-filter: blur(16px)` combined with `background: rgba(17, 17, 17, 0.82)` to preserve seamless visual continuity during smooth scrolling.

## Shapes

### Tailored Edge Philosophy
- **Soft Minimal Radius:** A strict subtle roundedness level (`1` / `0.25rem` to `0.5rem` max) conveys masculine tailoring, precision geometry, and architectural solidity.
- **Buttons & Action Triggers:** Standardized at `0.375rem` (6px) corner radius. Round "pill" forms are strictly avoided to reject casual, bubbly app conventions.
- **Card Frames & Time Chips:** `0.375rem` (6px) rounded corners, ensuring cards look like crafted leather tags or luxury membership passes.
- **Barber Avatar Portraits:** Squared aspect ratio (1:1) with a muted `0.5rem` (8px) corner radius, framed by a 1px border of `#292929`.

## Components

### Buttons & Action Controls
- **Primary Action (Confirm Ritual / Pay):** Solid Champagne Gold (`#C6A56B`) background, `#111111` bold text, height 52px, full-width touch zone. Subtle gold hover/active luminance.
- **Secondary Action (Time Slot / Detail Expansion):** `#181818` background, 1px border in `#292929`, Ivory White text. Transitions to Espresso Brown (`#3B241B`) with Gold border when selected.
- **Ghost/Tertiary:** Pure typography button in Warm Beige (`#D8C3A5`) with underline accent on touch.

### Service & Ritual Cards
- Clean list items separated by 1px `#292929` dividers or standalone elevated cards.
- Left column: Playfair Display title, duration in Warm Beige (`45 mins`), and single-sentence description.
- Right column: Prominent currency value formatted in Nigerian Naira (`₦35,000`) in `currency-md` Ivory White, alongside a precise selection ring.

### Time & Date Matrix
- **Calendar Strip:** Horizontal day scrubber displaying single-letter day over numeric date. Selected date features an Espresso Brown (`#3B241B`) pill tile with Champagne Gold text.
- **Slots:** 2-column or 3-column grid of time slots. Available: `#181818` with subtle border. Selected: `#3B241B` container with `#C6A56B` border. Unavailable: `#111111` container, crossed-out Warm Mocha typography with 40% opacity.

### Selection Controls (Radio / Toggles)
- Custom minimal concentric rings. Unchecked: 1px border `#292929` with transparent core. Checked: Champagne Gold (`#C6A56B`) border with a centered Champagne Gold dot.

### Input Fields & Search
- Low-profile inputs. Background `#161616`, bottom or full border in `#292929`. Focus state shifts border to Champagne Gold (`#C6A56B`) without loud drop shadows. Typography typed in `#F8F5EF` with placeholder in `#6F4E37`.

### Master Barber Artisan Cards
- Minimalist profile preview featuring a portrait, artisan title ("Master Barber & Stylist"), rating metric presented cleanly (`★ 4.9`), and a refined "Select Artisan" trigger button.
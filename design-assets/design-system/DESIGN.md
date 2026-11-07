---
name: Tactile Party Deduction
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#4a4455'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#7b7486'
  outline-variant: '#ccc3d7'
  surface-tint: '#7332e0'
  primary: '#5200b7'
  on-primary: '#ffffff'
  primary-container: '#6c28d9'
  on-primary-container: '#d9c5ff'
  inverse-primary: '#d2bbff'
  secondary: '#6d5e00'
  on-secondary: '#ffffff'
  secondary-container: '#f9e061'
  on-secondary-container: '#726200'
  tertiary: '#870018'
  on-tertiary: '#ffffff'
  tertiary-container: '#ac1b2a'
  on-tertiary-container: '#ffbfbc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#fce264'
  secondary-fixed-dim: '#dfc64b'
  on-secondary-fixed: '#211b00'
  on-secondary-fixed-variant: '#524600'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#ffb3b0'
  on-tertiary-fixed: '#410007'
  on-tertiary-fixed-variant: '#92001b'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '800'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
  body-sm:
    fontFamily: Nunito Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '800'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '800'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1.25rem
  margin-mobile: 1rem
  margin-tablet: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system defines an energetic, tactile, and delightfully mischievous visual language tailored for a casual mobile social deduction party game. Blending physical board game charm with contemporary mobile gaming delight, the aesthetic balances high-spirited competition with welcoming, approachable playfulness. 

The design direction merges **Tactile Casual Game UI** with **Sticker-Pop Modernism**:
- **Tactile & Pop-Out:** Surfaces feel physical, pressable, and bouncy. Elements feature solid extruded 3D base bevels, crisp offsets, and juicy micro-interactions that evoke arcade cabinets and board game cards.
- **Expressive & Irreverent:** Eschews flat corporate minimalism and generic system emojis in favor of characterful vector iconography, dynamic speech bubbles, bold question cards, and sneaky spy silhouettes.
- **Warm & Engaging:** Uses creamy, warm surfaces to keep the experience soft on the eyes during prolonged social gameplay sessions, while delivering electrifying primary accents when high-stakes bluffs unfold.

## Colors

The palette draws directly from party game camaraderie and mystery: deep, vibrant purples paired with radiant yellows, punchy punch-orange/coral tones, and lively cyan accents.

### Palette Architecture
- **Primary Brand Purple (`#6C28D9` & Deep Shadow `#4C1D95`):** The signature mystery hue. Represents the secret bluffer, used for primary action anchors, main app headers, brand wordmark backdrops, and active player spotlights.
- **Secondary Sunny Gold (`#FFE566` & Highlight `#FFF3B0`):** Radiates energy, fun, and coin rewards. Paired with dark purple ink (`#1E1035`) for high-contrast accessibility.
- **Energetic Coral / Alert (`#FF5A5F` / `#FF7A59`):** Indicates urgent bluff countdowns, buzzer triggers, and intense head-to-head voting rounds.
- **Electric Cyan / Mint (`#00B4D8` / `#06D6A0`):** Celebratory success states, confirmed truths, ready indicators, and online status badges.
- **Canvas & Surfaces:**
  - `bg-cream`: `#FDFBF7` (primary canvas, warm, soft paper-card feel)
  - `surface-card`: `#FFFFFF` (crisp card fronts, isolated response fields)
  - `surface-subtle`: `#F4EFE6` (secondary grouped layers, disabled slots)
  - `ink-primary`: `#181126` (high contrast, ultra-deep purple-tinted black)
  - `ink-muted`: `#746A85` (subtle hints, meta tags, timer labels)

### Semantic Color Role Rules
1. Never mix pure black `#000000` with the primary purple; always use chromatic shadows (`#4C1D95` or `#1E1035`) to retain vivid comic-book richness.
2. Important buttons use a solid lower "lip" (extrusion layer) tinted 20–30% darker than the surface tone to create a 3D arcade press effect.

## Typography

The typographic hierarchy is calibrated for rapid, high-legibility party gameplay on handheld devices.

- **Headlines & Action Labels (`Plus Jakarta Sans` - Weights 700 & 800):** Rounded terminals, hyper-legible counters, and high impact. Display titles adopt tight negative tracking to emulate expressive comic balloons and arcade scoreboards.
- **Body & Subtitles (`Nunito Sans` - Weights 600 & 700):** Provides a humanist, softly rounded geometric partner that stays clear at 13px–17px while reading prompt cards, secret player roles, and rule explanations.
- **Casing and Styling:** Key action buttons and stage badges use bold Title Case or uppercase letterforms with slightly widened tracking (`+0.02em` to `+0.04em`) to maintain crisp readability on vibrant color pills.

## Layout & Spacing

Layouts prioritize single-handed mobile ergonomics, rapid thumb tap-targets, and an immersive stage area for mystery reveal animations.

- **Grid System:** A mobile-first 4-column fluid layout on phones with `16px` gutters and `16px–20px` canvas edge margins. On tablets and foldables, it transitions into an 8-column layout centered at a maximum content width of `640px` to maintain focused party gameplay.
- **Rhythm & Touch Targets:** All interactive touch elements conform to an absolute minimum target of `48px × 48px`, with primary interactive game cards targeting `64px` or taller for confident, rapid tapping.
- **Vertical Hierarchy:** Vertical spacing clusters related question cards and answers tightly (`8px` to `12px`), separating interactive voting decks from sticky bottom action bars by generous safe zones (`space-lg` to `space-xl`).

## Elevation & Depth

Visual depth is conveyed through a hybrid of **tactile 3D button lips** and **diffused tinted game shadows**, creating a physical, sticker-like interface.

### Depth Levels
1. **Level 0 (Canvas):** Flat base surface (`#FDFBF7`) overlaid with playful, low-contrast geometric background motifs or subtle wavy game-cloth textures.
2. **Level 1 (Card & Bubble Tiles):** Pure white or tinted pastel surface, resting on a soft tinted drop shadow: `0 4px 16px rgba(108, 40, 217, 0.08)`. Outlined with a soft, chromatic border: `2px solid rgba(108, 40, 217, 0.06)`.
3. **Level 2 (Tactile Arcade Buttons):** Elements have a physical 3D lip achieved via stacked solid shadows: `box-shadow: 0 4px 0 #4C1D95` for purple buttons, and `0 4px 0 #D97706` for yellow buttons. On tap or active state, the button translates down `3px` and the extrusion reduces to `1px`, delivering real-time haptic-like visual feedback.
4. **Level 3 (Floating Overlays & Modals):** Pop-out deduction cards, mystery role reveals, and victory popups feature an elevated silhouette with `0 16px 36px rgba(30, 16, 53, 0.22)` accompanied by a gentle bouncy spring entrance curve (`cubic-bezier(0.34, 1.56, 0.64, 1)`).

## Shapes

The shape system is friendly, pill-based, and rounded, mirroring the plush, friendly aesthetic of the character mascots and official logo badge.

- **Corner Radii Hierarchy:**
  - Base components (Chips, Avatars, Badges): Complete Pills (`rounded-full` / `9999px`).
  - Cards, Modal Containers, and Question Decks: Super-elliptical corners (`24px` to `32px` / `rounded-3xl`).
  - Small Form Elements & Inputs: Gentle rounded-pill contours (`16px` to `20px` / `rounded-2xl`).
- **Iconography & Badges:** Vector badges adopt puffy circular containers with crisp outlines. No harsh 90-degree corners exist in the active interface; all edges feel tumbled, polished, and friendly to the touch.

## Components

### Buttons
- **Primary Arcade Button:** Saturated purple (`#6C28D9`) or vibrant amber-gold (`#FFE566`). Features full-width pill curvature (`rounded-full`), bold typography (`label-lg`), and an extruded bottom edge of `4px` in darker tone (`#4C1D95` or `#D97706`). Includes tap animation that compresses the extrusion layer downward.
- **Secondary Bubble Button:** White background with a `2px` solid tinted border (`#E9D5FF`), purple label, and a subtle soft drop shadow.
- **Icon Action Buttons:** Circular pills (`48px` to `56px`) with high-contrast glyphs, designed for reactions, audio toggles, and chat shortcuts.

### Question & Voting Cards
- **Deduction Choice Cards:** Crisp white surface with rounded-2xl geometry. Left-aligned choice identifier pill (`A`, `B`, `C`, `D`) set inside a cheerful colored disc.
- **Selected State:** Shifts to solid sunny yellow (`#FFF3B0`) or brand purple with a `3px` solid stroke, pulsing micro-scale (`scale-102`), and a checkmark badge.
- **Bluff Reveal Card:** Features a two-tone layout: top header band with custom detective hat/magnifying silhouette, and bottom canvas with mystery question text.

### Chips & Status Badges
- **Live Room Status:** Pill-shaped badge with a glowing green beacon dot (`#06D6A0`), semi-transparent emerald surface (`rgba(6, 214, 160, 0.15)`), and bold `label-sm` text.
- **Player Role Chips:** Confidential pills that remain concealed until held down by the user, providing a haptic "peeking" experience.

### Input Fields & Secret Prompts
- **Bluff Text Input:** Chunky field with `16px` inner padding, `rounded-2xl` corners, soft cream background (`#F4EFE6`), and a bold cursor. Focus state transitions the border to a bright `3px solid #6C28D9` with zero sharp corners.

### Avatars & Player Pods
- **Party Circle Avatars:** Bold circular frames with thick `3px` white strokes and colored outer rings indicating team alignment or voting status (e.g., green for voted, pulsing orange for thinking). Crown or detective hat adornments attach to the top-right corner of the active bluffer or lobby host.

### Timers & Progress Bars
- **Game Clock Pill:** Centered at the top of active play, combining a stylized vector stopwatch icon with a bold countdown number (`18px Plus Jakarta Sans`). Includes a multi-segment pill bar that shifts from Cyan (`#00B4D8`) to Coral (`#FF5A5F`) in the final 5 seconds.
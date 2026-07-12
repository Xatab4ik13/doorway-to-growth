---
name: Storefront typography
description: Onest (Google Fonts) as primary font for storefronts. Cormorant Garamond only for decorative accents.
type: design
---
Primary font: **Onest** (weights 300/400/500/600/700), loaded from Google Fonts.
- Great Cyrillic support, tabular lining numbers by default.
- Applied on `StorefrontLayout` with `font-feature-settings: 'tnum' 1, 'lnum' 1, 'ss01' 1` so prices align (equal-width digits, proper comma height).
- Replaces previous Raleway usage across all storefront components/pages.

Cormorant Garamond remains available for decorative headings only (brand page, section labels), not body text.

CRM continues to use Plus Jakarta Sans — do not swap.

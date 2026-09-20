# DESIGN.md

Kharo visual system. Committed 2026-09-20 after the critique loop. Replaces the earlier obsidian/glassmorphism spec, which the owner rejected.

## Register
Functional clarity. The references are Auto Trader, Rightmove and Monzo: white ground, the instrument first, price before everything, dense information delivered calmly. Trust in this category comes from looking like a tool people already use with money, not from cinema.

## Tokens (see `frontend/src/index.css` and `tailwind.config.js`)
- Ground `--bg` #F3F3F0 (bone), surfaces #FFFFFF, secondary surface #EAEAE5.
- Ink #111312, secondary #454A47, muted #6A6F6C. Lines rgba(17,19,18,.14) and .28.
- Green #0E3B2C (primary actions, links, status), hover #0A2C20, soft #EBF0ED. Mint #7FD8B0 only on dark surfaces (footer). Night #111312 for dark bands and scrims.
- One accent. No gold, no purple, no gradients as decoration.

## Type
Cabinet Grotesk 800/700 for headings, Satoshi 400/500/700 for body. Fluid scale: display, h1, h2, h3, lead, stat. Headlines two lines maximum; tracking -0.02em to -0.035em; line-height never below 1.3 on body. Tabular numerals on every price and count. Body measure 65 to 75ch.

## Shape
Tight by intent. Controls 4px (`rounded`), inputs 6px, cards 10px (`rounded-lg`), photo frames 12px. `rounded-full` only for the header CTA and removable chips. Borders carry structure; shadows are light and offset (`--shadow-1`, `--shadow-2`).

## Components
- Search instrument: white panel on a photograph, labels above fields, live result count on the button, price range with the distribution histogram visible.
- Vehicle card: 16/10 photograph, name, area and licensing authority, spec row (seats, fuel, mileage allowance), price prominent with "a week" small, deposit, "Register interest" as a real button. No pills over the photograph.
- Lists: `divide-y` with real row inset; never a hairline under every row of a long table. More than five items means a different component.
- FAQ: accordion rows with inset.
- Forms: label above input, helper text below, errors below in plain language.

## Motion
Intensity 3. Ease-out `cubic-bezier(0.23,1,0.32,1)`, UI durations 120 to 260ms, press feedback `scale(.97)`, hover gated to `(hover:hover) and (pointer:fine)`, staggered grid reveal 30 to 80ms, one authored moment per page. Reduced motion keeps opacity and colour, drops movement.

## Photography
Only photographs that show the car they are labelled as: the matched catalogue on the CDN and the five verified local assets. London photography for place. No product renders, no studio CGI, no unrelated stock.

## Banned
Glassmorphism, glow, blobs, floating hero cards, badges/pills/icon-in-circle, eyebrow labels, uppercase tracked labels, mono as a costume, em dashes, "Ready to..." closers, three-equal-card rows, four-box stat grids, fake screenshots built from divs, invented numbers, testimonials.

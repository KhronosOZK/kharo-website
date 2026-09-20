# DESIGN.md

Kharo visual system. Committed 2026-09-20 after the critique loop. Replaces the earlier obsidian/glassmorphism spec, which the owner rejected.

## Register
Dealership clarity, committed 2026-09-20 (second pass) from two references the owner supplied: a car-dealership landing page (full-bleed photograph with the featured car named on it and the search in a white card beside it, browse-by-type tiles, makes, tabbed featured listings, two photo banners, a contact strip) and the "Auto Ultimate" browse console (filter sidebar with a price histogram and checkbox groups, white cards with the car photographed inside, a left navigation rail on account pages). Ground is bone, content sits in white cards with hairline borders, the photograph does the selling and the price is always the largest number in view. Trust in this category comes from looking like a tool people already use with money, not from cinema.

## Tokens (see `frontend/src/index.css` and `tailwind.config.js`)
- Ground `--bg` #F3F3F0 (bone), surfaces #FFFFFF, secondary surface #EAEAE5.
- Ink #111312, secondary #454A47, muted #6A6F6C. Lines rgba(17,19,18,.14) and .28.
- Green #0E3B2C (primary actions, links, status), hover #0A2C20, soft #EBF0ED. Mint #7FD8B0 only on dark surfaces (footer). Night #111312 for dark bands and scrims.
- One accent. No gold, no purple, no gradients as decoration.

## Type
Cabinet Grotesk 800/700 for headings, Satoshi 400/500/700 for body. Fluid scale: display, h1, h2, h3, lead, stat. Headlines two lines maximum; tracking -0.02em to -0.035em; line-height never below 1.3 on body. Tabular numerals on every price and count. Body measure 65 to 75ch.

## Shape
Tight by intent. Buttons, inputs, chips and tabs 6px (`rounded-md`), cards and photo frames 10px (`rounded-lg`). `rounded-full` is reserved for things that are actually circles: radio dots, slider thumbs, the numbered step marker. No pill buttons anywhere, including the header CTA. Borders carry structure; shadows are light and offset (`--shadow-1`, `--shadow-2`).

## Components
- Page top (`PageHero`): one photograph across the full width with a left-to-right night scrim, the heading and one line in white on it, the page's buttons in the same column, an optional white card (`aside`) on the right. Form pages use the plain band without a photograph. The homepage runs its own version with the featured car's price and name on the photograph and the search card beside it.
- Search card: "Rent a car" / "List a car" segmented tabs, labels above fields, the weekly budget with its distribution histogram, the live result count on the button.
- Browse page: filter sidebar on the left (sticky, native disclosures per group, price histogram with typed bounds, breakdown-cover switch, body types as checkboxes with counts), results grid on the right, the same panel inside a dialog on phones.
- Vehicle card: white card, 16/10 photograph inside it, save heart top right, name, year · area · plate, one spec line, price with "a week" small, "Register interest" as a real button. The whole card is the link.
- Homepage sections: browse by type (photo tiles with counts), browse by make (name tiles with counts), featured cars (underline tabs), what Kharo does (icon, heading, two lines, four items), two photo banners (drivers, operators), recently added, contact strip over a photograph, the gap figure beside the FAQ. Every "View all" is a real link.
- Consoles (`ConsoleShell`): time and city strip, title and action, left navigation rail with counts (a scrolling tab row on phones), white panels. Both consoles have Notifications and Chat; the operator console has Tracking with a map of plate markers.
- Lists: `divide-y` with real row inset; never a hairline under every row of a long table. More than five items means a different component.
- FAQ: accordion rows with inset.
- Forms: label above input, helper text below, errors below in plain language.

## Motion
Intensity 3. Ease-out `cubic-bezier(0.23,1,0.32,1)`, UI durations 120 to 260ms, press feedback `scale(.97)`, hover gated to `(hover:hover) and (pointer:fine)`, staggered grid reveal 30 to 80ms, one authored moment per page. Scroll reveals move (14px) and never hide: text is readable at rest without the observer. No hover zoom on photographs. The homepage hero rotates its featured car every six seconds, pauses on hover, and stops under reduced motion.

## Photography
Only photographs that show the car they are labelled as: the matched catalogue on the CDN and the five verified local assets. London photography for place. No product renders, no studio CGI, no unrelated stock.

## Banned
Glassmorphism, glow, blobs, floating hero cards, badges/pills/icon-in-circle, eyebrow labels, uppercase tracked labels, mono as a costume, em dashes, "Ready to..." closers, three-equal-card rows, four-box stat grids, fake screenshots built from divs, invented numbers, testimonials.

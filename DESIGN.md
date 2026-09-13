# KHARO Marketplace — System Design Specification (`DESIGN.md`)

> **Product:** KHARO (`kharo.co.uk`) — Next-Generation London PHV Vehicle Marketplace & Fleet Management Platform.  
> **Visual Identity:** *Industrial Utility meets Luxury Modern Tech* (Inspired by modern EV automotive dashboards, sleek dark/light Dribbble UI patterns, and hyper-legible utility design).

---

## 1. Visual Strategy & Aesthetic Direction

### Key Inspiration & Aesthetic Themes
* **Automotive Glassmorphism & High Contrast:** Deep dark surfaces (`#0B0D12`), ultra-clean light backgrounds (`#F8F9FB`), translucent frosted cards, subtle accent glows, and sharp vector car visual cutouts.
* **Hyper-Scannable Commercial Utility:** Bold pricing tags (`£240/wk`), clear visual spec badges (*TfL Approved*, *EV 280 mi*, *Zero Deposit*), and high-contrast primary call-to-actions.
* **Dual-Mode UX Architecture:**
  1. **Driver Marketplace (Mobile-First):** Card-driven feed, instant floating filters, low-friction priority bottom-sheet lead flows.
  2. **Operator Fleet Dashboard (Desktop-Optimized):** Data-dense analytics cards, live vehicle availability tables, real-time revenue loss indicators, and lead pipeline tracking.

---

## 2. Design Tokens & Palette

### Color System (Tailwind Compatible)

```text
├── Dark Theme Backgrounds (Operator / Hero Details)
│   ├── Surface Base:    #0B0D12 (Obsidian)
│   ├── Surface Card:    #13161F (Deep Navy Gray)
│   └── Surface Elevated:#1B202D (Elevated Dark Slate)
│
├── Light Theme Backgrounds (Driver Feed / Listings)
│   ├── Canvas Base:     #F8F9FB (Off-white Frost)
│   ├── Container Card:  #FFFFFF (Pure White)
│   └── Accent Subdued:  #F1F3F7 (Neutral Gray Fill)
│
├── Brand Accent Colors (High Contrast Conversion)
│   ├── Primary Action:  #00E676 (Electric Mint — "Apply / Check Availability")
│   ├── Secondary Accent:#FFD600 (Cyber Gold — "Priority / High Demand")
│   └── B2B Fleet Blue:  #3B82F6 (Hyper Blue — "Operator Portal")
│
└── Status & Badge Indicators
    ├── EV / Clean Air:  #00E676 (Emerald Green)
    ├── Low Stock/Drop:  #FF3D00 (Vibrant Red-Orange)
    └── Border Stroke:   rgba(255, 255, 255, 0.08) [Dark] / #E5E7EB [Light]
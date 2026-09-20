/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  future: {
    // hover: and group-hover: compile to @media (hover: hover) and (pointer: fine),
    // so a tap on a phone never leaves a hover state stuck on.
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      screens: { xs: "400px" },
      colors: {
        // Brand tokens. Static hex here (mirroring index.css :root) so Tailwind
        // opacity modifiers like bg-night/40 and ring-green/20 keep working.
        ink: "#111312",
        "ink-2": "#454A47",
        "ink-3": "#6A6F6C",
        bone: "#F3F3F0",
        surface: "#FFFFFF",
        "surface-2": "#EAEAE5",
        line: "rgba(17, 19, 18, 0.10)",
        "line-strong": "rgba(17, 19, 18, 0.20)",
        green: { DEFAULT: "#0E3B2C", hover: "#0A2C20", soft: "#EBF0ED" },
        mint: "#7FD8B0",
        gold: { DEFAULT: "#111312", soft: "#FDF6E7", ink: "#6E4A10" },
        night: "#111312",
        obsidian: { DEFAULT: "#0B0C0B", 2: "#151715", 3: "#1F221F" },
        danger: { DEFAULT: "#B42318", soft: "#FCEEEC" },
        // shadcn semantic tokens
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))", 2: "hsl(var(--chart-2))", 3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))", 5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        // Tight by intent: this product handles money, insurance and claims.
        sm: "3px",
        DEFAULT: "4px",
        md: "6px",
        lg: "10px",
        xl: "12px",
        "2xl": "12px",   // legacy usages collapse to the card radius
        "3xl": "14px",
        hero: "18px",
      },
      // Headings set at 500, not 800: the dealership reference the owner chose
      // runs a light, wide grotesk. One mapping here moves every heading.
      fontWeight: {
        extrabold: "500",
      },
      fontFamily: {
        heading: ["'Cabinet Grotesk'", "'Satoshi'", "-apple-system", "sans-serif"],
        sans: ["'Satoshi'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        // System stack: the tracked micro-labels need a mono face and this
        // costs no extra webfont request.
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      // Fluid type scale. Values live in index.css so CSS and Tailwind agree.
      fontSize: {
        display: ["var(--fs-display)", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        h1: ["var(--fs-h1)", { lineHeight: "1.04", letterSpacing: "-0.025em" }],
        h2: ["var(--fs-h2)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        h3: ["var(--fs-h3)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        stat: ["var(--fs-stat)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        lead: ["var(--fs-lead)", { lineHeight: "1.55" }],
      },
      spacing: {
        gutter: "var(--gutter)",
        section: "var(--space-section)",
        block: "var(--space-block)",
        card: "var(--space-card)",
        header: "var(--header-h)",
        "safe-b": "env(safe-area-inset-bottom, 0px)",
        "safe-t": "env(safe-area-inset-top, 0px)",
      },
      maxWidth: { wrap: "var(--container)" },
      boxShadow: {
        1: "var(--shadow-1)",
        2: "var(--shadow-2)",
        glass: "var(--shadow-glass)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
        drawer: "var(--ease-drawer)",
      },
      transitionDuration: {
        press: "var(--dur-press)",
        hover: "var(--dur-hover)",
        fast: "var(--dur-fast)",
        ui: "var(--dur-ui)",
        modal: "var(--dur-modal)",
        drawer: "var(--dur-drawer)",
        reveal: "var(--dur-reveal)",
      },
      keyframes: {
        // Slow drift on the homepage photograph, one direction, never loops.
        "hero-drift": { from: { transform: "scale(1)" }, to: { transform: "scale(1.06)" } },
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down var(--dur-ui) var(--ease-out)",
        "accordion-up": "accordion-up var(--dur-ui) var(--ease-out)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      height: {
        'layout': 'calc(100vh - 5.5rem - 40px)',
        'layout-full': 'calc(100vh - 5.5rem)',
      },
      typography: {
        DEFAULT: {
          css: {
            blockquote: {
              fontWeight: '400',
              fontStyle: 'normal',
              fontSize: '0.9em',
              color: 'hsl(var(--accent-foreground))',
              backgroundColor: 'hsl(var(--accent))',
              borderLeftWidth: '4px',
              borderLeftColor: 'hsl(var(--border))',
              padding: '1em 1.5em',
              margin: '1.5em 0',
              borderRadius: '0.375rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              '& p:first-of-type::before': {
                content: 'none',
              },
              '& p:last-of-type::after': {
                content: 'none',
              },
            },
            table: {
              display: 'block',
              width: '100%',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              borderCollapse: 'collapse',
              borderSpacing: 0,
            },
            'table thead': {
              display: 'table-header-group',
            },
            'table tbody': {
              display: 'table-row-group',
            },
            'table tr': {
              display: 'table-row',
              borderBottom: '1px solid hsl(var(--border))',
            },
            'table td, table th': {
              whiteSpace: 'normal',
              minWidth: '130px',
              maxWidth: 'min-content',
              verticalAlign: 'top',
              padding: '0.5rem 0.75rem',
            },
            'table tbody tr:last-child': {
              borderBottom: 'none',
            },
          },
        }
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;

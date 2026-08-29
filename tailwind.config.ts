import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Ink Navy - primary structural color (headers, nav, dark surfaces)
        ink: {
          50: "#eef1f7",
          100: "#d6dde9",
          200: "#aab7cf",
          300: "#7186ac",
          400: "#3d5480",
          500: "#233c63",
          600: "#1b2f52",
          700: "#14213d",
          800: "#0f1930",
          900: "#0a1122"
        },
        // Signal Amber - road-marking accent, primary CTA
        signal: {
          50: "#fff8e6",
          100: "#ffedb8",
          300: "#ffcf4d",
          400: "#ffb100",
          500: "#f0a300",
          600: "#cc8700"
        },
        // Route Green - approvals / success / "go"
        route: {
          50: "#e9f7f2",
          100: "#c3ebdd",
          500: "#0f7a5c",
          600: "#0c6249"
        },
        // Rust - rejections / alerts
        rust: {
          50: "#fdece5",
          100: "#f7c9b4",
          500: "#c1440e",
          600: "#9e360a"
        },
        // Violet - Permits & business services category color
        violet: {
          50: "#f2edfb",
          100: "#ddccf5",
          400: "#8b5cf6",
          500: "#7c3aed",
          600: "#6425c9"
        },
        // Sky - Vehicle services category color
        sky: {
          50: "#e8f6fb",
          100: "#c3e9f5",
          400: "#22b1e0",
          500: "#0e94c4",
          600: "#0b76a0"
        },
        // Coral - Payments & challans category color
        coral: {
          50: "#fdecec",
          100: "#f9c9c9",
          400: "#f0645f",
          500: "#e8433d",
          600: "#c33531"
        },
        // Concrete - warm paper background, not stark white
        concrete: {
          50: "#faf9f5",
          100: "#f5f3ec",
          200: "#e9e6da"
        },
        // Backwards-compat aliases so existing utility classes keep working
        brand: {
          50: "#eef1f7",
          100: "#d6dde9",
          200: "#aab7cf",
          300: "#7186ac",
          400: "#3d5480",
          500: "#233c63",
          600: "#14213d",
          700: "#0f1930",
          800: "#0a1122",
          900: "#070c18"
        },
        success: { 500: "#0f7a5c", 600: "#0c6249" },
        accent: { 500: "#ffb100", 600: "#cc8700" }
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      fontFamily: {
        display: ["Oswald", "system-ui", "sans-serif"],
        sans: ["Work Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"]
      },
      backgroundImage: {
        "route-dash": "repeating-linear-gradient(90deg, currentColor 0 10px, transparent 10px 18px)"
      }
    }
  },
  plugins: []
};
export default config;

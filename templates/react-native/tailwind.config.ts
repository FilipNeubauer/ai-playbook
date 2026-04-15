import type { Config } from "tailwindcss"

export default {
	content: [
		"./src/app/**/*.{ts,tsx}",
		"./src/features/**/*.{ts,tsx}",
		"./src/components/**/*.{ts,tsx}",
		"./src/providers/**/*.{ts,tsx}",
	],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				background: "hsl(var(--color-background) / <alpha-value>)",
				foreground: "hsl(var(--color-foreground) / <alpha-value>)",
				primary: {
					DEFAULT: "hsl(var(--color-primary) / <alpha-value>)",
					foreground: "hsl(var(--color-primary-foreground) / <alpha-value>)",
				},
				secondary: {
					DEFAULT: "hsl(var(--color-secondary) / <alpha-value>)",
					foreground: "hsl(var(--color-secondary-foreground) / <alpha-value>)",
				},
				muted: {
					DEFAULT: "hsl(var(--color-muted) / <alpha-value>)",
					foreground: "hsl(var(--color-muted-foreground) / <alpha-value>)",
				},
				destructive: {
					DEFAULT: "hsl(var(--color-destructive) / <alpha-value>)",
					foreground: "hsl(var(--color-destructive-foreground) / <alpha-value>)",
				},
				border: "hsl(var(--color-border) / <alpha-value>)",
				ring: "hsl(var(--color-ring) / <alpha-value>)",
			},
			fontFamily: {
				sans: ["Inter"],
				"sans-medium": ["Inter-Medium"],
				"sans-semibold": ["Inter-SemiBold"],
				"sans-bold": ["Inter-Bold"],
			},
			borderRadius: {
				sm: "6px",
				md: "8px",
				lg: "12px",
				xl: "16px",
			},
		},
	},
	plugins: [],
} satisfies Config

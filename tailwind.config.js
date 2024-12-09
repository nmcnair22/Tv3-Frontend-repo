/** @type {import('tailwindcss').Config} */
const primeui = require('tailwindcss-primeui');

export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    plugins: [primeui],
    theme: {
        screens: {
            'xs': '320px',   // Extra Small Mobile
            'sm': '481px',   // Small Mobile Landscape
            'md': '601px',   // Medium (Tablet)
            'lg': '769px',   // Large (Tablet)
            'xl': '1025px',  // Small Desktop
            '2xl': '1281px', // Medium Desktop
            '3xl': '1441px', // Large Desktop
            '4xl': '1921px', // Extra Large Screens
        },
        extend: {
            colors: {
                "primary-50": "rgb(var(--primary-50))",
                "primary-100": "rgb(var(--primary-100))",
                "primary-200": "rgb(var(--primary-200))",
                "primary-300": "rgb(var(--primary-300))",
                "primary-400": "rgb(var(--primary-400))",
                "primary-500": "rgb(var(--primary-500))",
                "primary-600": "rgb(var(--primary-600))",
                "primary-700": "rgb(var(--primary-700))",
                "primary-800": "rgb(var(--primary-800))",
                "primary-900": "rgb(var(--primary-900))",
                "primary-950": "rgb(var(--primary-950))",
                "surface-0": "rgb(var(--surface-0))",
                "surface-50": "rgb(var(--surface-50))",
                "surface-100": "rgb(var(--surface-100))",
                "surface-200": "rgb(var(--surface-200))",
                "surface-300": "rgb(var(--surface-300))",
                "surface-400": "rgb(var(--surface-400))",
                "surface-500": "rgb(var(--surface-500))",
                "surface-600": "rgb(var(--surface-600))",
                "surface-700": "rgb(var(--surface-700))",
                "surface-800": "rgb(var(--surface-800))",
                "surface-900": "rgb(var(--surface-900))",
                "surface-950": "rgb(var(--surface-950))",
            },
            fontFamily: {
                sans: ['Archivo', 'sans-serif'],
            },
        },
    },
};

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#F64060',
                primaryDark: '#D6324B',
                muted: '#F7F7F7',
                surface: '#FFFFFF',
            }
        },
    },
    plugins: [],
}

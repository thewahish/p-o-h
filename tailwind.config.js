/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark RPG Theme
        'rpg-primary': '#d4a656',
        'rpg-secondary': '#5c4423',
        'rpg-text': '#f8e4c0',
        'rpg-bg-dark': '#1a0f0a',
        'rpg-bg-darker': '#0d0604',
        'rpg-bg-darkest': '#000000',
        
        // Health colors (solid shades)
        'health-full': '#dc2626', // Bright red for full health
        'health-empty': '#7f1d1d', // Dark red for empty health
        'health-dark': '#8b0000',
        'health-mid': '#ff4500',
        'health-light': '#ff6347',
        
        // Mana colors (solid shades)
        'mana-full': '#3b82f6', // Bright blue for full mana
        'mana-empty': '#1e3a8a', // Dark blue for empty mana
        'mana-dark': '#191970',
        'mana-mid': '#4169e1',
        'mana-light': '#87ceeb',
        
        // Vigor colors (solid shades)
        'vigor-full': '#a855f7', // Bright purple for full vigor
        'vigor-empty': '#581c87', // Dark purple for empty vigor
        
        // Energy colors (solid shades)
        'energy-full': '#eab308', // Bright yellow for full energy
        'energy-empty': '#713f12', // Dark yellow for empty energy
        
        // Rarity colors
        'common': '#95a5a6',
        'uncommon': '#27ae60',
        'rare': '#3498db',
        'epic': '#9b59b6',
        'mythic': '#e67e22',
        'legendary': '#f1c40f',
      },
      backgroundImage: {
        'rpg-radial': 'radial-gradient(ellipse at center, #1a0f0a 0%, #0d0604 40%, #000000 100%)',
        'health-gradient': 'linear-gradient(90deg, #8b0000, #ff4500, #ff6347)',
        'mana-gradient': 'linear-gradient(90deg, #191970, #4169e1, #87ceeb)',
      }
    },
  },
  plugins: [],
}

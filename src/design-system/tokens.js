// filename: src/design-system/tokens.js

/**
 * Design System Tokens
 * Single source of truth for all UI sizing, spacing, and typography
 */

export const DesignTokens = {
    // === TYPOGRAPHY ===
    text: {
        // Screen titles
        screenTitle: 'text-2xl font-bold',

        // Section headers
        sectionHeader: 'text-lg font-bold',

        // Card titles
        cardTitle: 'text-base font-bold',

        // Body text
        body: 'text-sm',
        bodyLarge: 'text-base',

        // Small text (labels, hints)
        small: 'text-xs',
        tiny: 'text-[10px]',
    },

    // === SPACING ===
    spacing: {
        // Screen padding
        screen: 'p-3',

        // Section spacing
        sectionGap: 'space-y-3',

        // Card padding
        cardPadding: 'p-3',
        cardGap: 'gap-3',

        // Item spacing
        itemGap: 'space-y-2',

        // Tight spacing
        tight: 'space-y-1',
    },

    // === COMPONENTS ===
    components: {
        // Buttons
        button: {
            primary: 'px-6 py-2 text-base font-bold rounded-lg transition-all',
            secondary: 'px-4 py-2 text-sm font-bold rounded-lg transition-all',
            small: 'px-3 py-1 text-xs font-bold rounded-lg transition-all',
        },

        // Cards
        card: {
            base: 'bg-rpg-bg-darker rounded-lg border-2 backdrop-blur-sm',
            padding: 'p-3',
        },

        // Icons
        icon: {
            large: 'text-5xl',      // Emojis/icons in cards
            medium: 'text-3xl',     // Enemy/player avatars
            small: 'text-xl',       // UI icons
            tiny: 'text-base',      // Inline icons
        },

        // Stats display
        stats: {
            container: 'flex gap-2 text-xs',
            bar: 'h-2 rounded-full',
            label: 'text-xs opacity-70',
        },
    },

    // === LAYOUT ===
    layout: {
        // Screen containers
        screenContainer: 'min-h-screen max-h-screen flex flex-col overflow-y-auto',
        screenContent: 'w-full max-w-3xl mx-auto flex flex-col flex-1',

        // Modal/Popup containers
        modal: 'fixed inset-0 flex items-center justify-center z-[100] p-3',
        modalContent: 'bg-rpg-bg-darker border-2 border-rpg-primary rounded-lg shadow-2xl backdrop-blur-sm max-w-md w-full max-h-[95vh] overflow-y-auto',

        // Grid layouts
        grid: {
            cols2: 'grid grid-cols-2 gap-3',
            cols3: 'grid grid-cols-3 gap-3',
        },
    },

    // === COLORS (using existing Tailwind classes) ===
    colors: {
        primary: 'text-rpg-primary',
        secondary: 'text-rpg-secondary',
        text: 'text-rpg-text',

        // Rarity colors
        common: 'text-common',
        uncommon: 'text-uncommon',
        rare: 'text-rare',
        epic: 'text-epic',
        mythic: 'text-mythic',
        legendary: 'text-legendary',

        // Status colors
        health: 'text-health-mid',
        mana: 'text-mana-light',
    },

    // === ANIMATIONS ===
    animations: {
        fadeIn: 'animate-fade-in',
        pulse: 'animate-pulse',
        hover: 'hover:scale-105 transition-transform',
    },
};

// filename: src/design-system/components.jsx

import React from 'react';
import { DesignTokens as DT } from './tokens';

/**
 * Reusable UI Components with consistent styling
 */

// === LAYOUT COMPONENTS ===

export function ScreenContainer({ children, className = '' }) {
    return (
        <div className={`${DT.layout.screenContainer} bg-rpg-radial text-rpg-text ${DT.spacing.screen} ${className}`}>
            {children}
        </div>
    );
}

export function ScreenContent({ children, className = '' }) {
    return (
        <div className={`${DT.layout.screenContent} ${className}`}>
            {children}
        </div>
    );
}

export function Modal({ children, className = '' }) {
    return (
        <div className={`${DT.layout.modal} bg-rpg-bg-darkest/90 ${className}`}>
            {children}
        </div>
    );
}

export function ModalContent({ children, className = '' }) {
    return (
        <div className={`${DT.layout.modalContent} ${DT.spacing.cardPadding} ${className}`}>
            {children}
        </div>
    );
}

// === TYPOGRAPHY COMPONENTS ===

export function ScreenTitle({ children, className = '' }) {
    return (
        <h1 className={`${DT.text.screenTitle} ${DT.colors.primary} text-center ${className}`}>
            {children}
        </h1>
    );
}

export function SectionHeader({ children, className = '' }) {
    return (
        <h2 className={`${DT.text.sectionHeader} ${DT.colors.primary} ${className}`}>
            {children}
        </h2>
    );
}

export function CardTitle({ children, className = '' }) {
    return (
        <h3 className={`${DT.text.cardTitle} ${className}`}>
            {children}
        </h3>
    );
}

export function BodyText({ children, className = '', large = false }) {
    const size = large ? DT.text.bodyLarge : DT.text.body;
    return (
        <p className={`${size} ${DT.colors.text} ${className}`}>
            {children}
        </p>
    );
}

export function SmallText({ children, className = '' }) {
    return (
        <p className={`${DT.text.small} ${DT.colors.text} opacity-70 ${className}`}>
            {children}
        </p>
    );
}

// === BUTTON COMPONENTS ===

export function PrimaryButton({ children, onClick, disabled = false, className = '' }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${DT.components.button.primary} bg-rpg-primary hover:bg-rpg-secondary text-rpg-text ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
}

export function SecondaryButton({ children, onClick, disabled = false, className = '' }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${DT.components.button.secondary} bg-rpg-secondary hover:bg-rpg-primary text-rpg-text ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
}

export function SmallButton({ children, onClick, disabled = false, className = '' }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${DT.components.button.small} bg-rpg-secondary hover:bg-rpg-primary text-rpg-text ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
}

// === CARD COMPONENTS ===

export function Card({ children, className = '', highlighted = false }) {
    return (
        <div className={`${DT.components.card.base} ${DT.components.card.padding} ${highlighted ? 'border-legendary' : 'border-rpg-secondary'} ${className}`}>
            {children}
        </div>
    );
}

// === STATS COMPONENTS ===

export function StatBar({ current, max, color = 'bg-health-full', label = '', showNumbers = true }) {
    const percentage = max > 0 ? (current / max) * 100 : 0;

    return (
        <div className="w-full">
            {(label || showNumbers) && (
                <div className="flex justify-between items-center mb-1">
                    {label && <span className={DT.components.stats.label}>{label}</span>}
                    {showNumbers && <span className={DT.components.stats.label}>{current} / {max}</span>}
                </div>
            )}
            <div className={`${DT.components.stats.bar} bg-rpg-bg-darkest bg-opacity-80 overflow-hidden`}>
                <div
                    className={`${DT.components.stats.bar} ${color} transition-all`}
                    style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                />
            </div>
        </div>
    );
}

export function StatDisplay({ icon, value, label = '', className = '' }) {
    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <span className={DT.components.icon.tiny}>{icon}</span>
            <span className={DT.text.small}>{value}</span>
            {label && <span className={`${DT.text.small} opacity-60`}>{label}</span>}
        </div>
    );
}

// === ICON COMPONENTS ===

export function LargeIcon({ children, className = '' }) {
    return <div className={`${DT.components.icon.large} ${className}`}>{children}</div>;
}

export function MediumIcon({ children, className = '' }) {
    return <div className={`${DT.components.icon.medium} ${className}`}>{children}</div>;
}

export function SmallIcon({ children, className = '' }) {
    return <div className={`${DT.components.icon.small} ${className}`}>{children}</div>;
}

// === GRID LAYOUTS ===

export function TwoColumnGrid({ children, className = '' }) {
    return <div className={`${DT.layout.grid.cols2} ${className}`}>{children}</div>;
}

export function ThreeColumnGrid({ children, className = '' }) {
    return <div className={`${DT.layout.grid.cols3} ${className}`}>{children}</div>;
}

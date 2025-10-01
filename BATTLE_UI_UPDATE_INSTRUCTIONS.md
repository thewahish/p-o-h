# Battle UI Update Instructions

## What to Add:

### 1. Break Bar Display (Add after HP bar in focused enemy section)

```jsx
{/* Break Bar - Toughness */}
{focusedEnemy.breakData && (
    <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-rpg-text opacity-70">
                🛡️ Toughness
            </span>
            <span className="text-xs text-rpg-text opacity-70">
                {focusedEnemy.breakData.currentToughness}/{focusedEnemy.breakData.maxToughness}
            </span>
        </div>
        <div className="h-2 bg-gray-700 rounded overflow-hidden">
            <div
                className={`h-2 transition-all ${focusedEnemy.breakData.isBroken ? 'bg-red-500' : 'bg-blue-400'}`}
                style={{ width: `${(focusedEnemy.breakData.currentToughness / focusedEnemy.breakData.maxToughness) * 100}%` }}
            ></div>
        </div>
        {/* Weakness Icons */}
        <div className="flex gap-1 mt-1">
            <span className="text-xs text-rpg-text opacity-70">Weak:</span>
            {focusedEnemy.breakData.weaknesses.map(weakness => {
                const element = getElement(weakness);
                return (
                    <span key={weakness} className="text-xs" title={element.name.en}>
                        {element.icon}
                    </span>
                );
            })}
        </div>
    </div>
)}
```

### 2. Ultimate Gauge Display (Add before action buttons)

```jsx
{/* Ultimate Gauge */}
{player.ultimate && (
    <div className="mb-3 bg-rpg-bg-darker bg-opacity-80 rounded-lg p-3 border border-rpg-primary">
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-bold text-rpg-primary">
                ⚡ ULTIMATE
            </span>
            <span className="text-sm font-bold text-rpg-primary">
                {player.ultimate.current}/{player.ultimate.max}
            </span>
        </div>
        <div className="h-3 bg-gray-700 rounded overflow-hidden">
            <div
                className={`h-3 transition-all ${player.ultimate.ready ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 animate-pulse' : 'bg-gradient-to-r from-gray-600 to-blue-500'}`}
                style={{ width: `${(player.ultimate.current / player.ultimate.max) * 100}%` }}
            ></div>
        </div>
        {player.ultimate.ready && (
            <p className="text-center text-xs text-yellow-400 font-bold mt-1 animate-pulse">
                💥 READY! 💥
            </p>
        )}
    </div>
)}
```

### 3. Ultimate Button (Add to action button grid)

Replace the 4-column grid with a 5-column grid and add:

```jsx
<button
    onClick={() => combatSystem.playerUltimate(focusedTargetId)}
    disabled={!isPlayerTurn || !player.ultimate?.ready || !focusedEnemy?.isAlive}
    className={`px-2 py-2 text-sm rounded font-bold transition-colors ${
        isPlayerTurn && player.ultimate?.ready && focusedEnemy?.isAlive
            ? 'bg-gradient-to-r from-yellow-400 to-red-500 text-black hover:from-yellow-300 hover:to-red-400 animate-pulse'
            : 'bg-rpg-secondary bg-opacity-50 opacity-50 cursor-not-allowed text-rpg-text'
    }`}
>
    💥 ULTIMATE
</button>
```

Change grid from `grid-cols-4` to `grid-cols-5`.

---

## Full Implementation Locations:

**Line ~320**: After HP bar in focused enemy section - add break bar
**Line ~331**: Before action buttons - add ultimate gauge
**Line ~334**: Change `grid-cols-4` to `grid-cols-5`
**Line ~335**: Add ultimate button after attack button

---

## Testing Checklist:

- [ ] Break bar appears above enemy
- [ ] Weakness icons show correctly
- [ ] Ultimate gauge fills during combat
- [ ] Ultimate button glows when ready
- [ ] Ultimate ability executes correctly
- [ ] Break effects show "BROKEN!" message
- [ ] Toughness depletes with attacks

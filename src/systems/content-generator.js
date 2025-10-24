// filename: src/systems/content-generator.js

import Logger from '../core/logger.js';

/**
 * Content Generator - AI-powered dynamic descriptions and flavor text
 * Makes the game feel more immersive with procedurally generated content
 */
export const ContentGenerator = {
  // Floor atmosphere descriptions
  floorDescriptions: {
    1: [
      "The entrance to the dungeon. Torches flicker on damp stone walls.",
      "Moss-covered stones mark the beginning of your descent.",
      "Fresh air still reaches this level. It won't last much longer.",
      "Ancient runes carved into the archway warn of dangers below."
    ],
    2: [
      "Deeper into darkness. The air grows cold and stale.",
      "Water drips from unseen crevices above.",
      "The walls here show signs of old battles - claw marks and bloodstains.",
      "Shadows seem to move of their own accord."
    ],
    3: [
      "Ancient bones litter the floor. Something terrible happened here.",
      "The temperature drops noticeably. Your breath fogs in the air.",
      "Faded banners hang from rusted chains, their colors long forgotten.",
      "A sense of dread fills this forsaken place."
    ],
    4: [
      "The stench of decay is overwhelming.",
      "Cobwebs thick as rope span the corridors.",
      "Strange symbols glow faintly on the walls.",
      "The floor trembles occasionally. Something massive moves below."
    ],
    5: [
      "Fire pits burn with unnatural flame, casting eerie shadows.",
      "The screams of the damned echo from somewhere distant.",
      "Sulfurous smoke stings your eyes.",
      "This level feels... alive. Watching you."
    ],
    6: [
      "Ice crystals form on every surface despite the heat.",
      "Reality seems thin here. Space bends unnaturally.",
      "You see glimpses of other worlds through cracked walls.",
      "Time moves strangely in this cursed place."
    ],
    7: [
      "Pure malevolence saturates the very stone.",
      "Your equipment feels heavier with each step.",
      "The darkness here hungers. It wants to consume you.",
      "Few have reached this depth. Fewer have returned."
    ],
    8: [
      "The boundary between life and death blurs.",
      "Whispers in forgotten languages fill your mind.",
      "Your shadow no longer follows your movements.",
      "This is where legends come to die."
    ],
    9: [
      "The final approaches loom before you.",
      "Ancient evil permeates everything. You taste it in the air.",
      "Your courage wavers. This is madness. But you press on.",
      "The heart of darkness beats somewhere ahead."
    ],
    10: [
      "No light reaches this abyss.",
      "The dungeon's master awaits in the darkness beyond.",
      "Every instinct screams at you to flee. You ignore them.",
      "This is the end. One way or another."
    ]
  },

  // Boss introduction templates by character progression path
  bossIntros: {
    defensive_tank: [
      "A hulking brute emerges from the shadows, shield raised. It seeks an immovable object to test.",
      "The ground trembles as an armored giant steps forward, eyes gleaming with challenge.",
      "Chains rattle as a massive warrior blocks your path. It grins. Finally, worthy prey.",
      "Stone armor cracks and shifts as the dungeon's guardian awakens. Your defense will be tested.",
      "A fortress given form. This enemy will not yield easily."
    ],
    elemental_mage: [
      "Arcane energy crackles as a robed figure materializes. The air itself bends to its will.",
      "The temperature plummets. A frost mage appears before you, ice forming with each breath.",
      "Flames dance around a pyromancer's staff. Fire answers its call.",
      "Reality shivers as raw magical power takes shape. This foe commands the elements themselves.",
      "Lightning arcs between its fingers. The very laws of nature obey this being."
    ],
    assassin_berserker: [
      "Silent footsteps. A shadow detaches from the wall, blades already drawn.",
      "Twin daggers gleam in the torchlight as a figure approaches with deadly grace.",
      "A scarred warrior grins, weapons ready. It has tasted blood and craves more.",
      "Swift as death itself, your opponent circles. Speed is life in this dance.",
      "Crimson eyes lock onto yours. The hunt has begun."
    ]
  },

  // Elite enemy flavor based on type
  eliteIntros: {
    brute: [
      "A towering brute blocks the way. Its muscles ripple with barely contained rage.",
      "This one is larger than the others. Scars cover its massive frame.",
      "A champion among its kind. It won't fall easily."
    ],
    magical: [
      "Eldritch power radiates from this creature. The air shimmers around it.",
      "This enemy has mastered dark arts. Approach with caution.",
      "Magical wards protect this foe. Brute force alone won't suffice."
    ],
    fast: [
      "Faster than the rest. It moves like liquid shadow.",
      "This one's reflexes are supernatural. Blink and you're dead.",
      "Speed incarnate. Your own quickness will be tested."
    ],
    undead: [
      "Death itself walks. This creature shouldn't exist, yet it does.",
      "Unholy power animates these bones. The grave couldn't hold it.",
      "Neither living nor dead. An abomination that defies nature."
    ],
    elite: [
      "A battle-hardened veteran. It's survived countless fights.",
      "This enemy radiates confidence. It knows it's dangerous.",
      "Elite warrior. Underestimate it at your peril."
    ]
  },

  // Room-specific atmospheric descriptions
  roomDescriptions: {
    battle: [
      "You hear grunting and the clang of metal ahead.",
      "Shadows move in the darkness. You're not alone.",
      "Something lurks in this chamber. It knows you're here.",
      "The air shifts. Hostile eyes watch from the gloom.",
      "Battle-stained floors tell of previous fights. Yours is next."
    ],
    elite: [
      "A powerful presence fills this room. The very air feels heavy.",
      "This chamber radiates menace. Whatever's inside is formidable.",
      "Ancient trophies line the walls. A champion dwells here.",
      "The stench of old blood is overwhelming.",
      "Lesser creatures fled this room. The thing inside made them."
    ],
    boss: [
      "The final chamber. Your destiny awaits within.",
      "Massive doors loom before you. What lies beyond will test everything.",
      "This is it. The dungeon master's throne room.",
      "Your journey culminates here. Victory or death.",
      "The air itself seems to scream: turn back! You don't."
    ],
    shop: [
      "A mysterious merchant beckons from the corner.",
      "Wares are laid out on a worn wooden table.",
      "The smell of old leather and metal fills the air.",
      "\"Ah, a customer!\" the merchant grins. \"What can I offer you?\"",
      "Coins change hands here. Death is merely business."
    ],
    treasure: [
      "A chest gleams in the torchlight!",
      "Gold coins spill from an overturned chest. Your lucky day.",
      "Your eyes catch the glint of treasure.",
      "Riches beyond measure... or so it appears.",
      "Fortune favors the bold. This cache is yours."
    ],
    shrine: [
      "A sacred altar radiates divine energy.",
      "The gods have not abandoned this place entirely.",
      "Healing light emanates from ancient carvings.",
      "Your wounds begin to close just from proximity.",
      "Blessed ground. Even in hell, sanctuaries exist."
    ],
    stairs: [
      "Stairs descend into deeper darkness.",
      "The way down beckons. Are you ready?",
      "Another floor awaits. The dungeon grows deadlier.",
      "These steps lead further from salvation.",
      "Descend, if you dare. There's no going back."
    ]
  },

  // Victory flavor text
  victoryTexts: {
    quick: [
      "Swift and decisive. The enemy never stood a chance.",
      "A masterful display. They fell before they knew the battle began.",
      "Efficient. Brutal. Perfect execution."
    ],
    normal: [
      "Victory is yours. But at what cost?",
      "The enemy lies defeated. You stand victorious.",
      "Another battle won. How many more await?"
    ],
    hard: [
      "You survived. Barely. That was too close.",
      "Victory tastes like blood and ash. But it's yours.",
      "Death came for you. You sent it away empty-handed."
    ],
    boss: [
      "The floor's master falls. Against all odds, you prevailed.",
      "VICTORY! The dungeon trembles at your might!",
      "Impossible odds. Overwhelming power. You conquered both.",
      "Legends will speak of this day. You have triumphed!"
    ]
  },

  // Defeat flavor text
  defeatTexts: [
    "Darkness claims you. Your story ends here... for now.",
    "Death's embrace is cold. But Hero Souls remember.",
    "You fall. But heroes don't die. They evolve.",
    "The dungeon wins this round. You'll return stronger.",
    "Not the end. Merely a setback. Rise again, hero."
  ],

  /**
   * Get atmospheric description for current floor
   */
  getFloorDescription(floor) {
    const maxFloor = 10;
    const floorKey = Math.min(floor, maxFloor);

    const descriptions = this.floorDescriptions[floorKey] || this.floorDescriptions[maxFloor];
    return this.randomChoice(descriptions);
  },

  /**
   * Generate boss introduction text
   */
  generateBossIntro(floor, characterPath) {
    const intros = this.bossIntros[characterPath] || this.bossIntros.defensive_tank;
    const intro = this.randomChoice(intros);

    const floorSuffix = floor >= 10 ? " The final guardian." : "";
    return intro + floorSuffix;
  },

  /**
   * Generate elite enemy introduction
   */
  generateEliteIntro(enemyType) {
    const type = enemyType?.toLowerCase() || 'elite';
    const intros = this.eliteIntros[type] || this.eliteIntros.elite;
    return this.randomChoice(intros);
  },

  /**
   * Get room-specific atmospheric description
   */
  getRoomDescription(roomType) {
    const descriptions = this.roomDescriptions[roomType] || this.roomDescriptions.battle;
    return this.randomChoice(descriptions);
  },

  /**
   * Get victory flavor text based on battle difficulty
   */
  getVictoryText(battleDuration, isBoss = false) {
    if (isBoss) {
      return this.randomChoice(this.victoryTexts.boss);
    }

    // Determine difficulty by battle duration
    if (battleDuration < 15) {
      return this.randomChoice(this.victoryTexts.quick);
    } else if (battleDuration < 45) {
      return this.randomChoice(this.victoryTexts.normal);
    } else {
      return this.randomChoice(this.victoryTexts.hard);
    }
  },

  /**
   * Get defeat flavor text
   */
  getDefeatText() {
    return this.randomChoice(this.defeatTexts);
  },

  /**
   * Generate enemy name variation
   */
  generateEnemyVariation(baseName, floor) {
    const prefixes = {
      low: ["Lesser", "Weak", "Young", "Feral"],
      mid: ["Veteran", "Hardened", "Cunning", "Savage"],
      high: ["Elite", "Ancient", "Legendary", "Corrupted"]
    };

    let category = 'low';
    if (floor >= 5) category = 'mid';
    if (floor >= 8) category = 'high';

    const prefix = this.randomChoice(prefixes[category]);
    return `${prefix} ${baseName}`;
  },

  /**
   * Generate combat flavor text
   */
  getCombatFlavor(action, damage, isCritical = false) {
    const critFlavor = [
      "A devastating strike!",
      "CRITICAL HIT!",
      "Perfect execution!",
      "A masterful blow!"
    ];

    const normalFlavor = [
      "A solid hit.",
      "The attack connects.",
      "Damage dealt.",
      "The enemy reels."
    ];

    const weakFlavor = [
      "A glancing blow.",
      "Barely a scratch.",
      "The enemy shrugs it off.",
      "Minimal impact."
    ];

    if (isCritical) {
      return this.randomChoice(critFlavor);
    } else if (damage > 20) {
      return this.randomChoice(normalFlavor);
    } else {
      return this.randomChoice(weakFlavor);
    }
  },

  /**
   * Helper: Get random choice from array
   */
  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  /**
   * Log generated content for debugging
   */
  logContent(type, content) {
    Logger.log(`Generated ${type}: ${content}`, 'SYSTEM');
  }
};

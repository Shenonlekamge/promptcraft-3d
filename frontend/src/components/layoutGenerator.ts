/**
 * Layout Generator
 * 
 * Generates room layouts by matching user prompts to available assets
 * and intelligently placing them within the room dimensions.
 * 
 * Coordinate system:
 *   - Room center is (0, 0, 0)
 *   - Back wall is at -Z (north)
 *   - Front (open/camera side) is at +Z (south)
 *   - Left wall is at -X (west)
 *   - Right wall is at +X (east)
 * 
 * Rotation (rotationY) is in degrees:
 *   0   = default (model's native facing — typically toward +Z / camera)
 *   90  = rotated to face right (+X)
 *   180 = rotated to face back wall (-Z)
 *   270 = rotated to face left (-X)
 */

import type { RoomData } from "../pages/Home";

// ── Types ───────────────────────────────────────────────────────────────────

interface PresetItem {
  type: string;
  /** [xFraction, zFraction] of room half-dimensions. 0 = center, ±0.4 = near walls */
  relativePos: [number, number];
  /** Y-axis rotation in degrees. 0 = facing camera (+Z), 180 = facing back wall */
  rotation: number;
}

interface RoomPreset {
  keywords: string[];
  furniture: PresetItem[];
  roomSettings?: Partial<Pick<RoomData, 'floorColor' | 'wallColor' | 'floorTexture' | 'wallTexture'>>;
}

// ── Room Presets ─────────────────────────────────────────────────────────────
// Rotation reference:
//   0°   → faces toward viewer (+Z)
//   90°  → faces right (+X)
//   180° → faces back wall (-Z)
//   270° → faces left (-X)

const ROOM_PRESETS: Record<string, RoomPreset> = {
  bedroom: {
    keywords: ['bedroom', 'bed room', 'sleeping', 'master bedroom', 'guest room'],
    furniture: [
      // Bed against back wall, headboard touching wall (faces camera)
      { type: 'bedDouble', relativePos: [0, -0.35], rotation: 0 },
      // Nightstands flanking the bed
      { type: 'cabinetBedDrawer', relativePos: [-0.30, -0.38], rotation: 0 },
      { type: 'cabinetBedDrawerTable', relativePos: [0.30, -0.38], rotation: 0 },
      // Lamps on nightstands
      { type: 'lampRoundTable', relativePos: [-0.30, -0.40], rotation: 0 },
      { type: 'lampRoundTable', relativePos: [0.30, -0.40], rotation: 0 },
      // Rug at foot of bed
      { type: 'rugRectangle', relativePos: [0, 0.05], rotation: 0 },
      // Bookcase on right wall, facing left
      { type: 'bookcaseOpen', relativePos: [0.42, 0.15], rotation: 270 },
      // Plant in corner
      { type: 'pottedPlant', relativePos: [-0.40, 0.38], rotation: 0 },
    ],
    roomSettings: {
      floorColor: '#8B7355',
      wallColor: '#F5F0E8',
      floorTexture: 'wood',
      wallTexture: 'none',
    }
  },

  livingRoom: {
    keywords: ['living room', 'lounge', 'family room', 'sitting room', 'living'],
    furniture: [
      // TV + cabinet against back wall, facing viewer
      { type: 'cabinetTelevision', relativePos: [0, -0.40], rotation: 0 },
      { type: 'televisionModern', relativePos: [0, -0.38], rotation: 0 },
      // Main sofa facing the TV (back to camera, faces back wall)
      { type: 'loungeSofa', relativePos: [0, 0.20], rotation: 180 },
      // Coffee table between sofa and TV
      { type: 'tableCoffeeGlass', relativePos: [0, 0.0], rotation: 0 },
      // Left armchair facing right (toward center)
      { type: 'loungeChair', relativePos: [-0.30, 0.0], rotation: 90 },
      // Right armchair facing left (toward center)
      { type: 'loungeChairRelax', relativePos: [0.30, 0.0], rotation: 270 },
      // Rug under coffee table area
      { type: 'rugRound', relativePos: [0, 0.05], rotation: 0 },
      // Floor lamp near sofa corner
      { type: 'lampSquareFloor', relativePos: [-0.40, 0.30], rotation: 0 },
      // Plant in far corner
      { type: 'pottedPlant', relativePos: [0.40, -0.38], rotation: 0 },
      // Books on shelf area
      { type: 'books', relativePos: [-0.40, -0.38], rotation: 0 },
    ],
    roomSettings: {
      floorColor: '#A0896C',
      wallColor: '#EDEAE5',
      floorTexture: 'wood',
      wallTexture: 'none',
    }
  },

  kitchen: {
    keywords: ['kitchen', 'cooking', 'cook room'],
    furniture: [
      // Counter line along back wall (all facing camera/viewer)
      { type: 'kitchenCabinet', relativePos: [-0.35, -0.42], rotation: 0 },
      { type: 'kitchenCabinetDrawer', relativePos: [-0.15, -0.42], rotation: 0 },
      { type: 'kitchenSink', relativePos: [0.05, -0.42], rotation: 0 },
      { type: 'kitchenStove', relativePos: [0.25, -0.42], rotation: 0 },
      // Fridge at end of counter, against right + back corner
      { type: 'kitchenFridge', relativePos: [0.42, -0.42], rotation: 0 },
      // Upper cabinets (on the wall above counter — same X, pulled back slightly)
      { type: 'kitchenCabinetUpper', relativePos: [-0.35, -0.45], rotation: 0 },
      { type: 'kitchenCabinetUpperDouble', relativePos: [0.05, -0.45], rotation: 0 },
      // Microwave on counter
      { type: 'kitchenMicrowave', relativePos: [-0.15, -0.38], rotation: 0 },
      // Dining table in front half of room
      { type: 'tableRound', relativePos: [0, 0.15], rotation: 0 },
      // Chairs around the table — facing inward
      { type: 'chair', relativePos: [-0.10, 0.25], rotation: 180 },
      { type: 'chair', relativePos: [0.10, 0.25], rotation: 180 },
      { type: 'chair', relativePos: [-0.10, 0.05], rotation: 0 },
      { type: 'chair', relativePos: [0.10, 0.05], rotation: 0 },
      // Trash can in corner
      { type: 'trashcan', relativePos: [0.40, 0.38], rotation: 0 },
    ],
    roomSettings: {
      floorColor: '#C8B89A',
      wallColor: '#FAFAF8',
      floorTexture: 'tiles',
      wallTexture: 'none',
    }
  },

  bathroom: {
    keywords: ['bathroom', 'bath room', 'toilet room', 'washroom', 'restroom'],
    furniture: [
      // Bathtub along left wall, facing right
      { type: 'bathtub', relativePos: [-0.32, -0.25], rotation: 90 },
      // Toilet on right side, facing viewer
      { type: 'toiletSquare', relativePos: [0.30, -0.32], rotation: 0 },
      // Sink + mirror on right wall, facing left
      { type: 'bathroomSink', relativePos: [0.40, 0.10], rotation: 270 },
      { type: 'bathroomMirror', relativePos: [0.42, 0.10], rotation: 270 },
      // Cabinet on left wall
      { type: 'bathroomCabinet', relativePos: [-0.38, 0.30], rotation: 90 },
      // Shower in back-right corner
      { type: 'showerRound', relativePos: [0.35, 0.35], rotation: 180 },
      // Bath mat
      { type: 'rugDoormat', relativePos: [0, 0.10], rotation: 0 },
    ],
    roomSettings: {
      floorColor: '#D4D4D4',
      wallColor: '#F0F4F8',
      floorTexture: 'tiles',
      wallTexture: 'none',
    }
  },

  office: {
    keywords: ['office', 'study', 'workspace', 'work room', 'home office', 'study room'],
    furniture: [
      // Desk against back wall, user faces camera
      { type: 'desk', relativePos: [0, -0.35], rotation: 0 },
      // Chair in front of desk, facing desk (back wall)
      { type: 'chairDesk', relativePos: [0, -0.18], rotation: 180 },
      // Monitor + keyboard on desk
      { type: 'computerScreen', relativePos: [0, -0.38], rotation: 0 },
      { type: 'computerKeyboard', relativePos: [0, -0.33], rotation: 0 },
      { type: 'computerMouse', relativePos: [0.10, -0.33], rotation: 0 },
      // Bookcases on left wall, facing right
      { type: 'bookcaseClosedWide', relativePos: [-0.42, -0.10], rotation: 90 },
      // Bookcase on right wall, facing left
      { type: 'bookcaseOpen', relativePos: [0.42, -0.10], rotation: 270 },
      // Desk lamp
      { type: 'lampSquareTable', relativePos: [-0.15, -0.38], rotation: 0 },
      // Plant in front-right corner
      { type: 'pottedPlant', relativePos: [0.40, 0.38], rotation: 0 },
      // Trash can front-left
      { type: 'trashcan', relativePos: [-0.40, 0.38], rotation: 0 },
    ],
    roomSettings: {
      floorColor: '#7D6B5D',
      wallColor: '#E8E4DF',
      floorTexture: 'wood',
      wallTexture: 'none',
    }
  },

  diningRoom: {
    keywords: ['dining room', 'dining', 'eating room'],
    furniture: [
      // Table in center
      { type: 'tableCross', relativePos: [0, 0], rotation: 0 },
      // Chairs around table — each facing inward
      { type: 'chair', relativePos: [-0.12, -0.12], rotation: 90 },   // left side, face right
      { type: 'chair', relativePos: [0.12, -0.12], rotation: 270 },   // right side, face left
      { type: 'chair', relativePos: [-0.12, 0.12], rotation: 90 },    // left side, face right
      { type: 'chair', relativePos: [0.12, 0.12], rotation: 270 },    // right side, face left
      { type: 'chair', relativePos: [0, -0.18], rotation: 0 },        // back, face toward camera
      { type: 'chair', relativePos: [0, 0.18], rotation: 180 },       // front, face toward back
      // Sideboard against back wall
      { type: 'bookcaseClosedDoors', relativePos: [-0.38, -0.40], rotation: 0 },
      // Ceiling lamp above table
      { type: 'lampSquareCeiling', relativePos: [0, 0], rotation: 0 },
      // Plant in corner
      { type: 'pottedPlant', relativePos: [0.40, -0.38], rotation: 0 },
      // Rug under table
      { type: 'rugRectangle', relativePos: [0, 0], rotation: 0 },
    ],
    roomSettings: {
      floorColor: '#8B7355',
      wallColor: '#F0ECE3',
      floorTexture: 'wood',
      wallTexture: 'none',
    }
  },

  kidsRoom: {
    keywords: ['kids room', 'children room', 'nursery', 'playroom', 'child room', 'kid room'],
    furniture: [
      // Bunk bed against left-back corner, headboard to back wall
      { type: 'bedBunk', relativePos: [-0.32, -0.35], rotation: 0 },
      // Desk on right side against back wall
      { type: 'desk', relativePos: [0.25, -0.35], rotation: 0 },
      // Chair at desk, facing desk
      { type: 'chairRounded', relativePos: [0.25, -0.18], rotation: 180 },
      // Low bookcase on left wall, facing right
      { type: 'bookcaseOpenLow', relativePos: [-0.42, 0.15], rotation: 90 },
      // Teddy bear in play area
      { type: 'bear', relativePos: [0.15, 0.20], rotation: 0 },
      // Play area rug in center-front
      { type: 'rugRound', relativePos: [0, 0.12], rotation: 0 },
      // Floor lamp
      { type: 'lampRoundFloor', relativePos: [0.40, 0.38], rotation: 0 },
      // Plant
      { type: 'pottedPlant', relativePos: [-0.40, 0.38], rotation: 0 },
    ],
    roomSettings: {
      floorColor: '#C4A882',
      wallColor: '#E8F0F8',
      floorTexture: 'wood',
      wallTexture: 'none',
    }
  },
};

// ── Prompt parser ───────────────────────────────────────────────────────────

interface ParsedPrompt {
  roomType: string | null;
  presetKey: string | null;
  dimensions: { width?: number; depth?: number; height?: number };
}

function parsePrompt(prompt: string): ParsedPrompt {
  const lower = prompt.toLowerCase().trim();

  // Detect room type — longest keyword match wins
  let presetKey: string | null = null;
  let roomType: string | null = null;
  let bestMatchLength = 0;

  for (const [key, preset] of Object.entries(ROOM_PRESETS)) {
    for (const keyword of preset.keywords) {
      if (lower.includes(keyword) && keyword.length > bestMatchLength) {
        presetKey = key;
        roomType = keyword;
        bestMatchLength = keyword.length;
      }
    }
  }

  // Parse dimensions from prompt (e.g., "12x14", "10 by 12", "8x8x3")
  const dimensions: { width?: number; depth?: number; height?: number } = {};
  const dimMatch = lower.match(/(\d+)\s*(?:x|by)\s*(\d+)(?:\s*(?:x|by)\s*(\d+))?/);
  if (dimMatch) {
    dimensions.width = Math.max(4, Math.min(20, parseInt(dimMatch[1])));
    dimensions.depth = Math.max(4, Math.min(20, parseInt(dimMatch[2])));
    if (dimMatch[3]) {
      dimensions.height = Math.max(2, Math.min(5, parseInt(dimMatch[3])));
    }
  }

  return { roomType, presetKey, dimensions };
}

// ── Layout generator ────────────────────────────────────────────────────────

export interface GenerationResult {
  furniture: RoomData['furniture'];
  roomUpdates: Partial<RoomData>;
  roomType: string;
}

export function generateLayout(
  prompt: string,
  currentRoom: RoomData,
  availableAssets: string[]
): GenerationResult | null {
  const parsed = parsePrompt(prompt);

  if (!parsed.presetKey || !parsed.roomType) {
    return null;
  }

  const preset = ROOM_PRESETS[parsed.presetKey];
  if (!preset) return null;

  // Determine room dimensions
  const width = parsed.dimensions.width ?? currentRoom.width;
  const depth = parsed.dimensions.depth ?? currentRoom.depth;
  const height = parsed.dimensions.height ?? currentRoom.height;

  // Filter preset furniture to only include assets that exist in the manifest
  const availableSet = new Set(availableAssets);

  const furniture: RoomData['furniture'] = [];

  for (const item of preset.furniture) {
    if (!availableSet.has(item.type)) continue;

    const buffer = 0.5;
    const maxX = (width / 2) - buffer;
    const maxZ = (depth / 2) - buffer;

    // Convert relative fractions to absolute positions
    const x = Math.max(-maxX, Math.min(maxX, item.relativePos[0] * width));
    const z = Math.max(-maxZ, Math.min(maxZ, item.relativePos[1] * depth));

    furniture.push({
      id: Math.random().toString(36).substr(2, 9),
      type: item.type,
      position: [
        parseFloat(x.toFixed(2)),
        0,
        parseFloat(z.toFixed(2))
      ],
      rotation: item.rotation,
      color: '#3895D3',
    });
  }

  const roomUpdates: Partial<RoomData> = {
    width,
    depth,
    height,
    ...preset.roomSettings,
  };

  return {
    furniture,
    roomUpdates,
    roomType: parsed.roomType,
  };
}

/** Returns list of supported room types for display to user */
export function getSupportedRoomTypes(): string[] {
  return Object.values(ROOM_PRESETS).flatMap(p => p.keywords.slice(0, 1));
}



import type { RoomData } from "../pages/Home";

interface PresetItem {
  type: string;
  
  relativePos: [number, number];
  
  rotation: number;
}

interface RoomPreset {
  keywords: string[];
  furniture: PresetItem[];
  roomSettings?: Partial<Pick<RoomData, 'floorColor' | 'wallColor' | 'floorTexture' | 'wallTexture'>>;
}

const ROOM_PRESETS: Record<string, RoomPreset> = {
  bedroom: {
    keywords: ['bedroom', 'bed room', 'sleeping', 'master bedroom', 'guest room'],
    furniture: [
      { type: 'bedDouble', relativePos: [0, -0.35], rotation: 0 },
      { type: 'cabinetBedDrawer', relativePos: [-0.30, -0.38], rotation: 0 },
      { type: 'cabinetBedDrawerTable', relativePos: [0.30, -0.38], rotation: 0 },
      { type: 'lampRoundTable', relativePos: [-0.30, -0.40], rotation: 0 },
      { type: 'lampRoundTable', relativePos: [0.30, -0.40], rotation: 0 },
      { type: 'rugRectangle', relativePos: [0, 0.05], rotation: 0 },
      { type: 'bookcaseOpen', relativePos: [0.42, 0.15], rotation: 270 },
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
      { type: 'cabinetTelevision', relativePos: [0, -0.40], rotation: 0 },
      { type: 'televisionModern', relativePos: [0, -0.38], rotation: 0 },
      { type: 'loungeSofa', relativePos: [0, 0.20], rotation: 180 },
      { type: 'tableCoffeeGlass', relativePos: [0, 0.0], rotation: 0 },
      { type: 'loungeChair', relativePos: [-0.30, 0.0], rotation: 90 },
      { type: 'loungeChairRelax', relativePos: [0.30, 0.0], rotation: 270 },
      { type: 'rugRound', relativePos: [0, 0.05], rotation: 0 },
      { type: 'lampSquareFloor', relativePos: [-0.40, 0.30], rotation: 0 },
      { type: 'pottedPlant', relativePos: [0.40, -0.38], rotation: 0 },
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
      { type: 'kitchenCabinet', relativePos: [-0.35, -0.42], rotation: 0 },
      { type: 'kitchenCabinetDrawer', relativePos: [-0.15, -0.42], rotation: 0 },
      { type: 'kitchenSink', relativePos: [0.05, -0.42], rotation: 0 },
      { type: 'kitchenStove', relativePos: [0.25, -0.42], rotation: 0 },
      { type: 'kitchenFridge', relativePos: [0.42, -0.42], rotation: 0 },
      { type: 'kitchenCabinetUpper', relativePos: [-0.35, -0.45], rotation: 0 },
      { type: 'kitchenCabinetUpperDouble', relativePos: [0.05, -0.45], rotation: 0 },
      { type: 'kitchenMicrowave', relativePos: [-0.15, -0.38], rotation: 0 },
      { type: 'tableRound', relativePos: [0, 0.15], rotation: 0 },
      { type: 'chair', relativePos: [-0.10, 0.25], rotation: 180 },
      { type: 'chair', relativePos: [0.10, 0.25], rotation: 180 },
      { type: 'chair', relativePos: [-0.10, 0.05], rotation: 0 },
      { type: 'chair', relativePos: [0.10, 0.05], rotation: 0 },
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
      { type: 'bathtub', relativePos: [-0.32, -0.25], rotation: 90 },
      { type: 'toiletSquare', relativePos: [0.30, -0.32], rotation: 0 },
      { type: 'bathroomSink', relativePos: [0.40, 0.10], rotation: 270 },
      { type: 'bathroomMirror', relativePos: [0.42, 0.10], rotation: 270 },
      { type: 'bathroomCabinet', relativePos: [-0.38, 0.30], rotation: 90 },
      { type: 'showerRound', relativePos: [0.35, 0.35], rotation: 180 },
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
      { type: 'desk', relativePos: [0, -0.35], rotation: 0 },
      { type: 'chairDesk', relativePos: [0, -0.18], rotation: 180 },
      { type: 'computerScreen', relativePos: [0, -0.38], rotation: 0 },
      { type: 'computerKeyboard', relativePos: [0, -0.33], rotation: 0 },
      { type: 'computerMouse', relativePos: [0.10, -0.33], rotation: 0 },
      { type: 'bookcaseClosedWide', relativePos: [-0.42, -0.10], rotation: 90 },
      { type: 'bookcaseOpen', relativePos: [0.42, -0.10], rotation: 270 },
      { type: 'lampSquareTable', relativePos: [-0.15, -0.38], rotation: 0 },
      { type: 'pottedPlant', relativePos: [0.40, 0.38], rotation: 0 },
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
      { type: 'tableCross', relativePos: [0, 0], rotation: 0 },
      { type: 'chair', relativePos: [-0.12, -0.12], rotation: 90 },   
      { type: 'chair', relativePos: [0.12, -0.12], rotation: 270 },   
      { type: 'chair', relativePos: [-0.12, 0.12], rotation: 90 },    
      { type: 'chair', relativePos: [0.12, 0.12], rotation: 270 },    
      { type: 'chair', relativePos: [0, -0.18], rotation: 0 },        
      { type: 'chair', relativePos: [0, 0.18], rotation: 180 },       
      { type: 'bookcaseClosedDoors', relativePos: [-0.38, -0.40], rotation: 0 },
      { type: 'lampSquareCeiling', relativePos: [0, 0], rotation: 0 },
      { type: 'pottedPlant', relativePos: [0.40, -0.38], rotation: 0 },
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
      { type: 'bedBunk', relativePos: [-0.32, -0.35], rotation: 0 },
      { type: 'desk', relativePos: [0.25, -0.35], rotation: 0 },
      { type: 'chairRounded', relativePos: [0.25, -0.18], rotation: 180 },
      { type: 'bookcaseOpenLow', relativePos: [-0.42, 0.15], rotation: 90 },
      { type: 'bear', relativePos: [0.15, 0.20], rotation: 0 },
      { type: 'rugRound', relativePos: [0, 0.12], rotation: 0 },
      { type: 'lampRoundFloor', relativePos: [0.40, 0.38], rotation: 0 },
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

interface ParsedPrompt {
  roomType: string | null;
  presetKey: string | null;
  dimensions: { width?: number; depth?: number; height?: number };
}

function parsePrompt(prompt: string): ParsedPrompt {
  const lower = prompt.toLowerCase().trim();

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

  const width = parsed.dimensions.width ?? currentRoom.width;
  const depth = parsed.dimensions.depth ?? currentRoom.depth;
  const height = parsed.dimensions.height ?? currentRoom.height;

  const availableSet = new Set(availableAssets);

  const furniture: RoomData['furniture'] = [];

  for (const item of preset.furniture) {
    if (!availableSet.has(item.type)) continue;

    const buffer = 0.5;
    const maxX = (width / 2) - buffer;
    const maxZ = (depth / 2) - buffer;

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
      scale: 2.0,
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

export function getSupportedRoomTypes(): string[] {
  return Object.values(ROOM_PRESETS).flatMap(p => p.keywords.slice(0, 1));
}

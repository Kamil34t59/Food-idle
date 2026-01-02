
export interface Position {
  x: number;
  y: number;
}

export interface Station extends Position {
  id: string;
  name: string;
  icon: string;
  level: number;
  basePrice: number;
  baseTime: number;
  baseCost: number;
  unlocked: boolean;
  color: string;
  machineUpgrades?: number;
}

export interface Chef {
  id: string;
  pos: Position;
  targetPos: Position | null;
  state: 'idle' | 'walking' | 'cooking' | 'delivering';
  currentTaskId: string | null;
  progress: number;
  isStaff?: boolean;
}

export interface Task {
  id: string;
  stationId: string;
  price: number;
  duration: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  multiplier: number;
  type: 'speed' | 'price' | 'staff';
  purchased: boolean;
}

export interface GameState {
  money: number;
  gems: number;
  stations: Station[];
  upgrades: Upgrade[];
  staffCount: number;
  totalEarnings: number;
  lastSaved: number;
  aiQuestionsUsed: number; // Nowe: licznik pytań
  isAiVip: boolean;        // Nowe: status subskrypcji AI
}

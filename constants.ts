
import { Station, Upgrade } from './types';

export const DELIVERY_POINT = { x: 50, y: 85 };

export const INITIAL_STATIONS: Station[] = [
  {
    id: 'lemonade',
    name: 'Lemonade',
    icon: '🍋',
    level: 1,
    basePrice: 5,
    baseTime: 1200,
    baseCost: 0,
    unlocked: true,
    color: 'bg-yellow-400',
    x: 20, y: 30
  },
  {
    id: 'hotdog',
    name: 'Hot Dog',
    icon: '🌭',
    level: 0,
    basePrice: 20,
    baseTime: 2500,
    baseCost: 250,
    unlocked: false,
    color: 'bg-red-400',
    x: 80, y: 30
  },
  {
    id: 'fries',
    name: 'Fries',
    icon: '🍟',
    level: 0,
    basePrice: 60,
    baseTime: 4000,
    baseCost: 2000,
    unlocked: false,
    color: 'bg-orange-400',
    x: 20, y: 60
  },
  {
    id: 'burger',
    name: 'Burger',
    icon: '🍔',
    level: 0,
    basePrice: 180,
    baseTime: 7000,
    baseCost: 10000,
    unlocked: false,
    color: 'bg-amber-700',
    x: 80, y: 60
  },
  {
    id: 'pizza',
    name: 'Pizza',
    icon: '🍕',
    level: 0,
    basePrice: 500,
    baseTime: 12000,
    baseCost: 50000,
    unlocked: false,
    color: 'bg-red-600',
    x: 50, y: 45
  }
];

export const INITIAL_UPGRADES: Upgrade[] = [
  { id: 'u1', name: 'Running Shoes', description: 'Walk speed +50%', cost: 100, multiplier: 1.5, type: 'speed', purchased: false },
  { id: 'u2', name: 'Sharp Knives', description: 'Cooking speed +100%', cost: 300, multiplier: 2, type: 'speed', purchased: false },
  { id: 'u3', name: 'Food Blogger Review', description: 'Prices +50%', cost: 1000, multiplier: 1.5, type: 'price', purchased: false },
  { id: 'u4', name: 'Chef Segway', description: 'Walk speed +100%', cost: 5000, multiplier: 2, type: 'speed', purchased: false },
  { id: 'u5', name: 'Non-Stick Pans', description: 'Cooking speed +50%', cost: 12000, multiplier: 1.5, type: 'speed', purchased: false },
  { id: 'u6', name: 'TV Commercial', description: 'All prices x2', cost: 25000, multiplier: 2, type: 'price', purchased: false },
  { id: 'u7', name: 'Masterclass Training', description: 'Cooking speed x2', cost: 60000, multiplier: 2, type: 'speed', purchased: false },
  { id: 'u8', name: 'Delivery Drone', description: 'Instant Delivery Walk', cost: 150000, multiplier: 5, type: 'speed', purchased: false },
  { id: 'u9', name: 'Michelin Star', description: 'Everything x5 Price', cost: 500000, multiplier: 5, type: 'price', purchased: false },
  { id: 'u10', name: 'Golden Spatula', description: 'Passive Gems generation', cost: 1000000, multiplier: 1, type: 'price', purchased: false }
];

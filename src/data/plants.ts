import type { Plant } from "@/lib/types";

// Sydney and coastal-Sydney planting palette (Build Spec section 7).
// Tagging conventions:
//   requires  — hard gate; ALL must be present in the answer set or the plant is dropped.
//               Used sparingly, mainly for genuine full-sun lovers so they don't surface
//               in shaded results. Leave empty for forgiving, wide-tolerance plants.
//   prefers   — soft boosts (+1 each): ideal sun, soil, coastal exposure and style.
//   avoid     — if ANY of these tags is present the plant is dropped. Used to exclude
//               species that are unsafe around young children (who:children) or pets
//               (who:pets). These flags are deliberate — do not remove without horticultural sign-off.
//
// To add a plant: append an entry with honest tags. No component code needs touching.

export const plants: Plant[] = [
  // --- Coastal / full-sun natives & structure ------------------------------
  {
    id: "westringia",
    name: "Coastal Rosemary",
    botanical: "Westringia fruticosa",
    note: "A tough, salt-hardy shrub that clips into soft grey-green hedging.",
    requires: ["sun:full"],
    prefers: ["soil:sandy", "coastal", "style:native", "style:modern"],
    maintenance: "low",
    priority: 9,
  },
  {
    id: "banksia-integrifolia",
    name: "Coastal Banksia",
    botanical: "Banksia integrifolia",
    note: "A local coastal tree that shrugs off salt wind and brings in the birds.",
    requires: ["sun:full"],
    prefers: ["soil:sandy", "coastal", "style:native"],
    maintenance: "low",
    priority: 7,
  },
  {
    id: "lomandra-tanika",
    name: "Mat Rush 'Tanika'",
    botanical: "Lomandra longifolia 'Tanika'",
    note: "A fine, fountaining grass that copes with sand, clay, sun or part shade.",
    requires: [],
    prefers: ["sun:full", "sun:part", "coastal", "soil:sandy", "soil:clay", "style:native", "style:modern"],
    maintenance: "low",
    priority: 10,
  },
  {
    id: "dianella-caerulea",
    name: "Blue Flax Lily",
    botanical: "Dianella caerulea",
    note: "Strappy native with blue flowers and berries, happy in sun or dappled light.",
    requires: [],
    prefers: ["sun:full", "sun:part", "coastal", "soil:sandy", "style:native", "style:lush"],
    maintenance: "low",
    priority: 7,
  },
  {
    id: "kangaroo-paw",
    name: "Kangaroo Paw",
    botanical: "Anigozanthos flavidus",
    note: "Sculptural flower spikes for full sun and free-draining sandy beds.",
    requires: ["sun:full"],
    prefers: ["soil:sandy", "coastal", "style:native", "style:modern"],
    maintenance: "balanced",
    priority: 6,
  },
  {
    id: "poa-eskdale",
    name: "Tussock Grass 'Eskdale'",
    botanical: "Poa poiformis 'Eskdale'",
    note: "Blue-toned native tussock for coastal drifts and modern massed planting.",
    requires: [],
    prefers: ["sun:full", "sun:part", "coastal", "soil:sandy", "style:native", "style:modern"],
    maintenance: "low",
    priority: 5,
  },

  // --- Structured / modern -------------------------------------------------
  {
    id: "buxus",
    name: "Japanese Box",
    botanical: "Buxus microphylla var. japonica",
    note: "The classic clipped hedge for crisp lines and formal edges.",
    requires: [],
    prefers: ["sun:full", "sun:part", "soil:loam", "soil:clay", "style:modern"],
    maintenance: "balanced",
    priority: 8,
  },
  {
    id: "magnolia-little-gem",
    name: "Dwarf Magnolia 'Little Gem'",
    botanical: "Magnolia grandiflora 'Little Gem'",
    note: "Glossy evergreen screening with big cream flowers; smart and low fuss.",
    requires: [],
    prefers: ["sun:full", "sun:part", "soil:loam", "soil:clay", "style:modern", "style:lush"],
    maintenance: "low",
    priority: 8,
  },
  {
    id: "star-jasmine",
    name: "Star Jasmine",
    botanical: "Trachelospermum jasminoides",
    note: "Fragrant, forgiving climber or groundcover for almost any aspect.",
    requires: [],
    prefers: ["sun:full", "sun:part", "sun:shade", "coastal", "soil:loam", "style:modern", "style:lush"],
    maintenance: "low",
    priority: 9,
  },
  {
    id: "rhaphiolepis",
    name: "Indian Hawthorn 'Snow Maiden'",
    botanical: "Rhaphiolepis indica",
    note: "Dense, salt-tolerant shrub for low screening and rounded structure.",
    requires: [],
    prefers: ["sun:full", "sun:part", "coastal", "soil:sandy", "soil:clay", "style:modern"],
    maintenance: "low",
    priority: 5,
  },
  {
    id: "liriope",
    name: "Lily Turf 'Just Right'",
    botanical: "Liriope muscari",
    note: "Reliable strappy border for shade or sun, easy on clay soils.",
    requires: [],
    prefers: ["sun:part", "sun:shade", "sun:full", "soil:clay", "soil:loam", "style:modern", "style:lush"],
    maintenance: "low",
    priority: 6,
  },

  // --- Lush / green --------------------------------------------------------
  {
    id: "frangipani",
    name: "Frangipani",
    botanical: "Plumeria rubra",
    note: "The scent of a Sydney summer; loves warm, sandy, sun-drenched spots.",
    requires: ["sun:full"],
    prefers: ["soil:sandy", "coastal", "style:lush"],
    avoid: ["who:children"], // milky sap is a skin and mouth irritant
    maintenance: "low",
    priority: 7,
  },
  {
    id: "strelitzia-nicolai",
    name: "Giant Bird of Paradise",
    botanical: "Strelitzia nicolai",
    note: "Bold paddle leaves for instant lush, resort-like screening.",
    requires: [],
    prefers: ["sun:full", "sun:part", "soil:loam", "soil:sandy", "coastal", "style:lush"],
    maintenance: "low",
    priority: 6,
  },
  {
    id: "bangalow-palm",
    name: "Bangalow Palm",
    botanical: "Archontophoenix cunninghamiana",
    note: "An elegant local palm for layered, canopy-style green in sheltered spots.",
    requires: [],
    prefers: ["sun:part", "sun:shade", "soil:loam", "style:lush"],
    maintenance: "balanced",
    priority: 5,
  },
  {
    id: "gardenia-florida",
    name: "Gardenia 'Florida'",
    botanical: "Gardenia augusta 'Florida'",
    note: "Compact and intensely fragrant; a lush border for warm, sheltered beds.",
    requires: [],
    prefers: ["sun:full", "sun:part", "soil:loam", "coastal", "style:lush"],
    maintenance: "balanced",
    priority: 6,
  },
  {
    id: "michelia-figo",
    name: "Port Wine Magnolia",
    botanical: "Michelia figo (Magnolia figo)",
    note: "Dense fragrant screen for part shade, with a soft banana-scented flower.",
    requires: [],
    prefers: ["sun:part", "sun:shade", "soil:loam", "style:lush"],
    maintenance: "low",
    priority: 5,
  },

  // --- Shade / courtyard ---------------------------------------------------
  {
    id: "tree-fern",
    name: "Soft Tree Fern",
    botanical: "Dicksonia antarctica",
    note: "A cool, prehistoric canopy for shaded courtyards with reliable moisture.",
    requires: [],
    prefers: ["sun:shade", "sun:part", "soil:loam", "style:lush"],
    maintenance: "balanced",
    priority: 6,
  },
  {
    id: "birds-nest-fern",
    name: "Bird's Nest Fern",
    botanical: "Asplenium australasicum",
    note: "Glossy rosette that thrives in shade and coastal humidity.",
    requires: [],
    prefers: ["sun:shade", "sun:part", "coastal", "soil:loam", "style:lush", "style:native"],
    maintenance: "low",
    priority: 6,
  },
  {
    id: "clivia",
    name: "Clivia",
    botanical: "Clivia miniata",
    note: "Dependable dry-shade colour under trees and along shaded walls.",
    requires: [],
    prefers: ["sun:shade", "sun:part", "soil:loam", "soil:clay", "style:lush"],
    avoid: ["who:children"], // all parts, especially the bulb, are toxic if eaten
    maintenance: "low",
    priority: 6,
  },
  {
    id: "native-violet",
    name: "Native Violet",
    botanical: "Viola hederacea",
    note: "Soft, safe groundcover that knits shade and part-shade beds together.",
    requires: [],
    prefers: ["sun:shade", "sun:part", "soil:loam", "style:native", "style:lush"],
    maintenance: "low",
    priority: 6,
  },

  // --- Kitchen garden ------------------------------------------------------
  {
    id: "meyer-lemon",
    name: "Meyer Lemon (espaliered)",
    botanical: "Citrus × meyeri",
    note: "A productive, fragrant citrus that trains flat against a warm wall.",
    requires: ["sun:full"],
    prefers: ["soil:loam", "style:lush", "style:modern"],
    maintenance: "balanced",
    priority: 5,
  },
  {
    id: "rosemary-culinary",
    name: "Rosemary",
    botanical: "Salvia rosmarinus",
    note: "Hardy Mediterranean herb for sunny, free-draining, coastal beds.",
    requires: ["sun:full"],
    prefers: ["soil:sandy", "coastal", "style:native", "style:modern"],
    maintenance: "low",
    priority: 5,
  },

  // --- Cautionary / toxic (surface only when no children or pets) ----------
  {
    id: "oleander",
    name: "Oleander",
    botanical: "Nerium oleander",
    note: "Salt- and drought-proof screening — but every part is highly toxic.",
    requires: ["sun:full"],
    prefers: ["soil:sandy", "coastal", "style:lush"],
    avoid: ["who:children", "who:pets"], // highly poisonous; unsafe near children or pets
    maintenance: "low",
    priority: 2,
  },
  {
    id: "cycad-sago",
    name: "Sago Palm",
    botanical: "Cycas revoluta",
    note: "Architectural, prehistoric form for modern courtyards; slow and toxic.",
    requires: [],
    prefers: ["sun:full", "sun:part", "soil:sandy", "style:modern"],
    avoid: ["who:children", "who:pets"], // seeds and foliage are severely toxic if eaten
    maintenance: "low",
    priority: 3,
  },
];

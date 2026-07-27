import type { Tag } from "@/lib/types";

// The tag-matched hero image set. Drop the matching files into public/gardens/
// (see public/README.md). The engine picks the highest-scoring match for a
// visitor's answers; `default` is the fallback when nothing else matches.
//
// To retune: change the tags/priority, or point `file` at a different image.

export interface GardenImage {
  id: string;
  file: string; // path under /public
  alt: string;
  tags: Tag[]; // overlap with the answer set scores this image
  priority: number; // tiebreak, higher wins
}

export const gardenImages: GardenImage[] = [
  {
    id: "coastal-native",
    file: "/gardens/coastal-native.jpg",
    alt: "A coastal Sydney garden with salt-hardy native planting",
    tags: ["coastal", "soil:sandy", "style:native"],
    priority: 8,
  },
  {
    id: "native-grasses",
    file: "/gardens/native-grasses.jpg",
    alt: "A full-sun native garden with textural grasses",
    tags: ["style:native", "sun:full"],
    priority: 5,
  },
  {
    id: "modern-courtyard",
    file: "/gardens/modern-courtyard.jpg",
    alt: "A structured, modern courtyard garden",
    tags: ["style:modern", "size:small"],
    priority: 7,
  },
  {
    id: "modern-grounds",
    file: "/gardens/modern-grounds.jpg",
    alt: "Large modern garden grounds",
    tags: ["style:modern", "size:large"],
    priority: 6,
  },
  {
    id: "modern-pool",
    file: "/gardens/modern-pool.jpg",
    alt: "A modern Sydney garden with a pool",
    tags: ["use:pool", "style:modern"],
    priority: 9,
  },
  {
    id: "lush-family",
    file: "/gardens/lush-family.jpg",
    alt: "A lush, green family garden",
    tags: ["style:lush", "use:family", "who:children"],
    priority: 7,
  },
  {
    id: "lush-tropical",
    file: "/gardens/lush-tropical.jpg",
    alt: "A lush, tropical-feeling coastal garden",
    tags: ["style:lush", "coastal"],
    priority: 6,
  },
  {
    id: "shaded-retreat",
    file: "/gardens/shaded-retreat.jpg",
    alt: "A shaded courtyard retreat with ferns and layered green",
    tags: ["sun:shade", "use:retreat", "style:lush"],
    priority: 6,
  },
  {
    id: "entertaining",
    file: "/gardens/entertaining.jpg",
    alt: "A Sydney garden set up for entertaining",
    tags: ["use:entertain"],
    priority: 4,
  },
  {
    id: "default",
    file: "/gardens/default.jpg",
    alt: "A Landart garden",
    tags: [], // always eligible as a fallback
    priority: 0,
  },
];

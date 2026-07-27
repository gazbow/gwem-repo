import {
  IconBuilding,
  IconPlant2,
  IconTrees,
  IconBuildingSkyscraper,
  IconSun,
  IconSunLow,
  IconUmbrella,
  IconBeach,
  IconHome,
  IconStack2,
  IconHelp,
  IconGlass,
  IconMoodKid,
  IconPool,
  IconYoga,
  IconCarrot,
  IconPaw,
  IconUsers,
  IconPlant,
  IconSquare,
  IconLeaf,
  IconLeaf2,
  IconShovel,
  IconScale,
  IconClock,
  IconTools,
  type IconProps,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

// Maps the Tabler outline names used in the question data (Build Spec section 5)
// to their React components. Add a mapping here when a new icon name is introduced.
const MAP: Record<string, ComponentType<IconProps>> = {
  "ti-building": IconBuilding,
  "ti-plant-2": IconPlant2,
  "ti-trees": IconTrees,
  "ti-building-skyscraper": IconBuildingSkyscraper,
  "ti-sun": IconSun,
  "ti-sun-low": IconSunLow,
  "ti-umbrella": IconUmbrella,
  "ti-beach": IconBeach,
  "ti-home": IconHome,
  "ti-stack": IconStack2,
  "ti-help": IconHelp,
  "ti-glass": IconGlass,
  "ti-mood-kid": IconMoodKid,
  "ti-pool": IconPool,
  "ti-yoga": IconYoga,
  "ti-carrot": IconCarrot,
  "ti-paw": IconPaw,
  "ti-users": IconUsers,
  "ti-plant": IconPlant,
  "ti-square": IconSquare,
  "ti-leaf": IconLeaf,
  "ti-leaf-2": IconLeaf2,
  "ti-shovel": IconShovel,
  "ti-scale": IconScale,
  "ti-clock": IconClock,
  "ti-tools": IconTools,
};

export function Icon({
  name,
  size = 32,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Cmp = MAP[name] ?? IconLeaf;
  return <Cmp size={size} stroke={1.25} className={className} aria-hidden />;
}

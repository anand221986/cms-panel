// lib/getLucideIcons.ts
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const getLucideIcons = (): [string, LucideIcon][] => {
  return Object.entries(Icons)
    .filter(([name, icon]) =>
      name !== "createLucideIcon" && typeof icon === "function"
    )
    .map(([name, icon]) => [name, icon as LucideIcon]);
};

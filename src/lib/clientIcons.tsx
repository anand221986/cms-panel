// lib/clientIcons.tsx
import {
  Building2,
  Rocket,
  Globe,
  Cpu,
  Palette,
  Cloud,
  BarChart3,
} from "lucide-react";

export const CLIENT_ICONS = {
  techcorp: {
    label: "Tech / Corporate",
    icon: <Cpu className="w-6 h-6" />,
  },
  startup: {
    label: "Startup",
    icon: <Rocket className="w-6 h-6" />,
  },
  enterprise: {
    label: "Enterprise",
    icon: <Building2 className="w-6 h-6" />,
  },
  design: {
    label: "Design Studio",
    icon: <Palette className="w-6 h-6" />,
  },
  cloud: {
    label: "Cloud / SaaS",
    icon: <Cloud className="w-6 h-6" />,
  },
  analytics: {
    label: "Data / Analytics",
    icon: <BarChart3 className="w-6 h-6" />,
  },
};

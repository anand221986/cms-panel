// lib/clientIcons.tsx
import {
  Building2,
  Rocket,
  Globe,
  Cpu,
  Palette,
  Cloud,
  BarChart3,
  Briefcase,
  ShoppingCart,
  HeartPulse,
  GraduationCap,
  Factory,
  ShieldCheck,
  Banknote,
  Phone,
  Megaphone,
  Truck,
  Hotel,
  Plane,
  Monitor,
  Wrench,
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

  /* ---------------- NEW ICONS ---------------- */

  business: {
    label: "Business Services",
    icon: <Briefcase className="w-6 h-6" />,
  },
  ecommerce: {
    label: "E-Commerce",
    icon: <ShoppingCart className="w-6 h-6" />,
  },
  healthcare: {
    label: "Healthcare",
    icon: <HeartPulse className="w-6 h-6" />,
  },
  education: {
    label: "Education",
    icon: <GraduationCap className="w-6 h-6" />,
  },
  manufacturing: {
    label: "Manufacturing",
    icon: <Factory className="w-6 h-6" />,
  },
  security: {
    label: "Security",
    icon: <ShieldCheck className="w-6 h-6" />,
  },
  finance: {
    label: "Finance / Banking",
    icon: <Banknote className="w-6 h-6" />,
  },
  telecom: {
    label: "Telecom",
    icon: <Phone className="w-6 h-6" />,
  },
  marketing: {
    label: "Marketing / Ads",
    icon: <Megaphone className="w-6 h-6" />,
  },
  logistics: {
    label: "Logistics",
    icon: <Truck className="w-6 h-6" />,
  },
  hospitality: {
    label: "Hospitality",
    icon: <Hotel className="w-6 h-6" />,
  },
  travel: {
    label: "Travel",
    icon: <Plane className="w-6 h-6" />,
  },
  software: {
    label: "Software Product",
    icon: <Monitor className="w-6 h-6" />,
  },
  services: {
    label: "Professional Services",
    icon: <Wrench className="w-6 h-6" />,
  },
};

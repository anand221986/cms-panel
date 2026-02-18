import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { CLIENT_ICONS } from "@/lib/clientIcons";
import { GRADIENTS } from "@/lib/gradients";
import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Trash2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
type USPItem = {
  key: string;
  label: string;
  description?: string;
  finalNumber?: number;
  colors?: string;
  icon_key?: string;
};
type ServiceItem = {
  title: string;
  badge?: string;
  features: { icon?: string; text: string }[];
  ctas?: {
    label: string;
    link: string;
    variant: "primary" | "outline";
    icon?: string;
  }[];
  image?: string;
};
/* ---------------------------------------------
   IMAGE PREVIEW RESOLVER
---------------------------------------------- */
const getPreview = (value: File | string | null) => {
  if (!value) return null;

  if (value instanceof File) {
    return URL.createObjectURL(value);
  }

  if (typeof value === "string") {
    if (value.startsWith("http")) return value;

    const cleanPath = value.replace(/^\/?uploads\/sections\//, "");
    return `${API_BASE_URL}/uploads/sections/${cleanPath}`;
  }

  return null;
};
 interface WhyChooseTalentBridgeData {
  section_key: "why_choose";

  /* ---------------- SECTION HEADER ---------------- */
  header: {
    badge: string;            // "Why Choose Us"
    title: {
      prefix: string;         // "The"
      highlight: string;      // "TalentBridge"
      suffix: string;         // "Advantage"
    };
    subtitle: string;         // supporting paragraph
  };

  /* ---------------- STATS BAR ---------------- */
  stats: {
    value: string;            // "98%", "10k+", "500+", "50+"
    label: string;            // "Success Rate", "Placements", etc.
    icon:
      | "target"
      | "award"
      | "users"
      | "globe";
  }[];

  /* ---------------- FEATURE CARDS ---------------- */
  features: {
    title: string;            // "Verified Talent"
    description: string;
    icon:
      | "shield"
      | "clock"
      | "globe"
      | "users";
    theme:
      | "emerald"
      | "teal"
      | "green";
  }[];

  /* ---------------- CTA ---------------- */
  cta: {
    label: string;            // "Start Your Success Story"
    link: string;             // "/contact"
  };
}

/* ---------------------------------------------
   DYNAMIC FIELD RENDERER
---------------------------------------------- */
export function renderDynamicFields(
  meta: Record<string, any>,
  onChange: (key: string, value: any) => void,
  sectionKey: string,
  config: any
) {

  console.log(sectionKey,'section key')
  const sectionConfig = config[sectionKey];
  if (!sectionConfig) return null;
  const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  Object.entries(LucideIcons).filter(
    ([, value]) =>
      typeof value === "function" &&
      "render" in value
  )
) as unknown as Record<string, LucideIcon>;

  return sectionConfig.fields.map((field: any) => {
    let value: any = "";

    /* ---------- VALUE RESOLUTION ---------- */
    if (field.type === "image" || field.type === "file") {
      value = field.multiple
        ? Array.isArray(meta?.[field.name])
          ? meta[field.name]
          : []
        : meta?.[field.name] ?? null;
    } else if (
      [
        "usp_items",
        "kpi_items",
        "kpi_items1",
        "faq_items",
        "client_items",
        "badges",
        "features",
        "ctas",
        "stats",
        "service_items",
        "specializations",
        "solutions",
        "workflow_blocks",
        "metrics_items",
         "cta", 
         "footer"
      ].includes(field.type)
    ) {
      value = meta?.[field.name];
    } else if (field.type === "heading") {
  value = typeof meta?.[field.name] === "object"
    ? meta[field.name]
    : {};
} else {
      const raw = meta?.[field.name];
      value =
        typeof raw === "string"
          ? raw
          : raw != null
          ? JSON.stringify(raw, null, 2)
          : "";
    }
  /* ---------- TEXT ---------- */
    if (field.type === "text") {
      return (
        <Input
          key={field.name}
          placeholder={field.label}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
    }
    /* ---------- TEXTAREA ---------- */
    if (field.type === "textarea") {
      return (
        <Textarea
          key={field.name}
          placeholder={field.label}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
    }

    /* ---------- JSON ---------- */
    if (field.type === "json") {
      return (
        <Textarea
          key={field.name}
          rows={6}
          placeholder={field.label}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
    }

    /* ---------- BADGES ---------- */
    if (field.type === "badges") {
      const badges: string[] = Array.isArray(value) ? value : [];

      return (
        <div key={field.name} className="space-y-2">
          <p className="font-medium">{field.label}</p>

          {badges.map((badge, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={badge}
                onChange={(e) => {
                  const updated = [...badges];
                  updated[index] = e.target.value;
                  onChange(field.name, updated);
                }}
              />
              <Button
                size="sm"
                variant="destructive"
                type="button"
                onClick={() =>
                  onChange(
                    field.name,
                    badges.filter((_, i) => i !== index)
                  )
                }
              >
                Remove
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => onChange(field.name, [...badges, ""])}
          >
            + Add Badge
          </Button>
        </div>
      );
    }

    /* ---------- IMAGE / FILE ---------- */
    if (field.type === "image" || field.type === "file") {
      const images = field.multiple
        ? Array.isArray(value)
          ? value
          : []
        : value
        ? [value]
        : [];

      return (
        <div key={field.name} className="space-y-2">
          <label className="text-sm font-medium">{field.label}</label>

          <Input
            type="file"
            accept="image/*"
            multiple={field.multiple}
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (!files.length) return;

              onChange(
                field.name,
                field.multiple ? [...images, ...files] : files[0]
              );
              e.target.value = "";
            }}
          />

          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((img: any, index: number) => {
                const preview = getPreview(img);
                if (!preview) return null;

                return (
                  <div key={index} className="relative">
                    <LazyLoadImage
                      src={preview}
                      effect="blur"
                      className="h-24 w-32 rounded border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        onChange(
                          field.name,
                          images.filter((_, i) => i !== index)
                        )
                      }
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    /* ---------- QUILL ---------- */
    if (field.type === "quill") {
      return (
        <div key={field.name} className="space-y-1">
          <label className="text-sm font-medium">{field.label}</label>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={(html) => onChange(field.name, html)}
          />
        </div>
      );
    }

    /* ---------- KPI ITEMS 1 (ICON + TEXT) ---------- */
    if (field.type === "kpi_items1") {
      const points: { icon?: string; text: string }[] = Array.isArray(value)
        ? value
        : [];

      return (
        <div key={field.name} className="space-y-3">
          <label className="text-sm font-medium">{field.label}</label>

          {points.map((item, index) => {
           const Icon = item.icon ? ICON_MAP[item.icon] : null;

            return (
              <div key={index} className="flex gap-2 items-center">
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={item.icon || ""}
                  onChange={(e) => {
                    const updated = [...points];
                    updated[index] = {
                      ...updated[index],
                      icon: e.target.value,
                    };
                    onChange(field.name, updated);
                  }}
                >
                  <option value="">Select icon</option>
                  {Object.keys(LucideIcons).map((iconName) => (
                    <option key={iconName} value={iconName}>
                      {iconName}
                    </option>
                  ))}
                </select>

                {Icon && <Icon size={18} className="text-gray-600" />}

                <Input
                  placeholder="Text"
                  value={item.text || ""}
                  onChange={(e) => {
                    const updated = [...points];
                    updated[index] = {
                      ...updated[index],
                      text: e.target.value,
                    };
                    onChange(field.name, updated);
                  }}
                />

                <Button
                  size="sm"
                  variant="destructive"
                  type="button"
                  onClick={() =>
                    onChange(
                      field.name,
                      points.filter((_, i) => i !== index)
                    )
                  }
                >
                  Remove
                </Button>
              </div>
            );
          })}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onChange(field.name, [...points, { icon: "", text: "" }])
            }
          >
            + Add Point
          </Button>
        </div>
      );
    }
    if (field.type === "metrics_items") {
  const metrics: {
    value: string;
    label: string;
    icon: "clock" | "barChart3" | "zap";
    color: "cyan" | "emerald" | "blue";
  }[] = Array.isArray(value) ? value : [];

  return (
    <div key={field.name} className="space-y-3">
      <label className="text-sm font-medium">{field.label}</label>

      {metrics.map((item, index) => {
        const Icon = item.icon ? ICON_MAP[item.icon] : null;
        const colorClasses: Record<string, string> = {
          cyan: "text-cyan-500",
          emerald: "text-emerald-500",
          blue: "text-blue-500",
        };

        return (
          <div key={index} className="flex gap-2 items-center">
            {/* Icon selection */}
            <select
              className="border rounded px-2 py-1 text-sm"
              value={item.icon || ""}
              onChange={(e) => {
                const updated = [...metrics];
                updated[index] = { ...updated[index], icon: e.target.value as any };
                onChange(field.name, updated);
              }}
            >
              <option value="">Select icon</option>
              {["clock", "barChart3", "zap"].map((iconName) => (
                <option key={iconName} value={iconName}>
                  {iconName}
                </option>
              ))}
            </select>

            {/* Icon preview */}
            {Icon && <Icon size={18} className={colorClasses[item.color] || "text-gray-600"} />}

            {/* Label */}
            <Input
              placeholder="Label"
              value={item.label || ""}
              onChange={(e) => {
                const updated = [...metrics];
                updated[index] = { ...updated[index], label: e.target.value };
                onChange(field.name, updated);
              }}
            />

            {/* Value */}
            <Input
              placeholder="Value"
              value={item.value || ""}
              onChange={(e) => {
                const updated = [...metrics];
                updated[index] = { ...updated[index], value: e.target.value };
                onChange(field.name, updated);
              }}
            />

            {/* Color selection */}
            <select
              className="border rounded px-2 py-1 text-sm"
              value={item.color || ""}
              onChange={(e) => {
                const updated = [...metrics];
                updated[index] = { ...updated[index], color: e.target.value as any };
                onChange(field.name, updated);
              }}
            >
              <option value="">Select color</option>
              <option value="cyan">Cyan</option>
              <option value="emerald">Emerald</option>
              <option value="blue">Blue</option>
            </select>

            {/* Remove button */}
            <Button
              size="sm"
              variant="destructive"
              type="button"
              onClick={() =>
                onChange(field.name, metrics.filter((_, i) => i !== index))
              }
            >
              Remove
            </Button>
          </div>
        );
      })}

      {/* Add new metric */}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange(field.name, [
            ...metrics,
            { value: "", label: "", icon: "clock", color: "cyan" },
          ])
        }
      >
        + Add Metric
      </Button>
    </div>
  );
}

    if (field.type === "heading") {
  const headingValue: {
    headingTitle?: string;
    headingsubtitle?: string;
    headinghighlight?: string;
  } = value || {};

  return (
    <div key={field.name} className="space-y-3">
      <label className="text-sm font-medium">{field.label}</label>

      {field.fields.map((subField: any) => (
        <Input
          key={`${field.name}.${subField.name}`}
          placeholder={subField.label}
          value={headingValue[subField.name] || ""}
          required={subField.required}
          onChange={(e) => {
            onChange(field.name, {
              ...headingValue,
              [subField.name]: e.target.value,
            });
          }}
        />
      ))}
    </div>
  );
}

if (field.type === "features") {
  const items: { icon?: string; text: string }[] = Array.isArray(value)
    ? value
    : [];

  return (
    <div key={field.name} className="space-y-3">
      <label className="text-sm font-medium">{field.label}</label>

      {items.map((item, index) => {
        const Icon = item.icon ? ICON_MAP[item.icon] : null;

        return (
          <div key={index} className="flex gap-2 items-center">
            {/* ICON SELECT */}
            <select
              className="border rounded px-2 py-1 text-sm"
              value={item.icon || ""}
              onChange={(e) => {
                const updated = [...items];
                updated[index] = {
                  ...updated[index],
                  icon: e.target.value,
                };
                onChange(field.name, updated);
              }}
            >
              <option value="">Select icon</option>
              {Object.keys(LucideIcons).map((iconName) => (
                <option key={iconName} value={iconName}>
                  {iconName}
                </option>
              ))}
            </select>

            {/* ICON PREVIEW */}
            {Icon && <Icon size={18} className="text-gray-600" />}

            {/* TEXT INPUT */}
            <Input
              placeholder="Feature text"
              value={item.text || ""}
              onChange={(e) => {
                const updated = [...items];
                updated[index] = {
                  ...updated[index],
                  text: e.target.value,
                };
                onChange(field.name, updated);
              }}
            />

            {/* REMOVE */}
            <Button
              size="sm"
              variant="destructive"
              type="button"
              onClick={() =>
                onChange(
                  field.name,
                  items.filter((_, i) => i !== index)
                )
              }
            >
              Remove
            </Button>
          </div>
        );
      })}

      {/* ADD FEATURE */}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange(field.name, [...items, { icon: "", text: "" }])
        }
      >
        + Add Feature
      </Button>
    </div>
  );
}
if (field.type === "ctas") {
  const ctas: {
    label: string;
    link: string;
    variant: "primary" | "outline";
    icon?: string;
  }[] = Array.isArray(value) ? value : [];

  return (
    <div key={field.name} className="space-y-4">
      <label className="text-sm font-medium">{field.label}</label>

      {ctas.map((cta, index) => {
        const Icon = cta.icon ? ICON_MAP[cta.icon] : null;

        return (
          <div
            key={index}
            className="border rounded-lg p-3 space-y-2 bg-gray-50"
          >
            {/* Label */}
            <Input
              placeholder="Button Label"
              value={cta.label || ""}
              onChange={(e) => {
                const updated = [...ctas];
                updated[index] = { ...updated[index], label: e.target.value };
                onChange(field.name, updated);
              }}
            />

            {/* Link */}
            <Input
              placeholder="Link (https://...)"
              value={cta.link || ""}
              onChange={(e) => {
                const updated = [...ctas];
                updated[index] = { ...updated[index], link: e.target.value };
                onChange(field.name, updated);
              }}
            />

            {/* Variant */}
            <select
              className="border rounded px-2 py-1 text-sm w-full"
              value={cta.variant || "primary"}
              onChange={(e) => {
                const updated = [...ctas];
                updated[index] = {
                  ...updated[index],
                  variant: e.target.value as "primary" | "outline",
                };
                onChange(field.name, updated);
              }}
            >
              <option value="primary">Primary</option>
              <option value="outline">Outline</option>
            </select>

            {/* Icon */}
            <div className="flex items-center gap-2">
              <select
                className="border rounded px-2 py-1 text-sm"
                value={cta.icon || ""}
                onChange={(e) => {
                  const updated = [...ctas];
                  updated[index] = { ...updated[index], icon: e.target.value };
                  onChange(field.name, updated);
                }}
              >
                <option value="">Select Icon</option>
                {Object.keys(LucideIcons).map((iconName) => (
                  <option key={iconName} value={iconName}>
                    {iconName}
                  </option>
                ))}
              </select>

              {Icon && <Icon size={18} className="text-gray-600" />}
            </div>

            {/* Remove */}
            <Button
              size="sm"
              variant="destructive"
              type="button"
              onClick={() =>
                onChange(
                  field.name,
                  ctas.filter((_, i) => i !== index)
                )
              }
            >
              Remove CTA
            </Button>
          </div>
        );
      })}

      {/* Add CTA */}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange(field.name, [
            ...ctas,
            { label: "", link: "", variant: "primary", icon: "" },
          ])
        }
      >
        + Add CTA
      </Button>
    </div>
  );
}
if (field.type === "stats") {
  const stats: { value: string; label: string }[] = Array.isArray(value)
    ? value
    : [];

  return (
    <div key={field.name} className="space-y-3">
      <label className="text-sm font-medium">{field.label}</label>

      {stats.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          {/* Value */}
          <Input
            placeholder="Value (e.g. 10K+)"
            value={item.value || ""}
            onChange={(e) => {
              const updated = [...stats];
              updated[index] = {
                ...updated[index],
                value: e.target.value,
              };
              onChange(field.name, updated);
            }}
          />

          {/* Label */}
          <Input
            placeholder="Label (e.g. Users)"
            value={item.label || ""}
            onChange={(e) => {
              const updated = [...stats];
              updated[index] = {
                ...updated[index],
                label: e.target.value,
              };
              onChange(field.name, updated);
            }}
          />

          {/* Remove */}
          <Button
            size="sm"
            variant="destructive"
            type="button"
            onClick={() =>
              onChange(
                field.name,
                stats.filter((_, i) => i !== index)
              )
            }
          >
            Remove
          </Button>
        </div>
      ))}

      {/* Add Stat */}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange(field.name, [...stats, { value: "", label: "" }])
        }
      >
        + Add Stat
      </Button>
    </div>
  );
}

/* ---------- USP ITEMS ---------- */
if (field.type === "usp_items") {
  const items: USPItem[] = Array.isArray(value) ? value : [];

  return (
    <div key={field.name} className="space-y-4">
      <label className="text-sm font-medium">{field.label}</label>

      {items.map((item, index) => {
        const Icon = item.icon_key ? ICON_MAP[item.icon_key] : null;

        return (
          <div
            key={item.key || index}
            className="border rounded-lg p-4 space-y-3 bg-gray-50"
          >
            {/* KEY */}
            <Input
              placeholder="Unique key (e.g. fast_delivery)"
              value={item.key || ""}
              onChange={(e) => {
                const updated = [...items];
                updated[index] = {
                  ...updated[index],
                  key: e.target.value,
                };
                onChange(field.name, updated);
              }}
            />

            {/* LABEL */}
            <Input
              placeholder="USP Label"
              value={item.label || ""}
              onChange={(e) => {
                const updated = [...items];
                updated[index] = {
                  ...updated[index],
                  label: e.target.value,
                };
                onChange(field.name, updated);
              }}
            />

            {/* DESCRIPTION */}
            <Textarea
              placeholder="USP Description (optional)"
              value={item.description || ""}
              onChange={(e) => {
                const updated = [...items];
                updated[index] = {
                  ...updated[index],
                  description: e.target.value,
                };
                onChange(field.name, updated);
              }}
            />

            {/* FINAL NUMBER */}
            <Input
              type="number"
              placeholder="Final Number (optional)"
              value={item.finalNumber ?? ""}
              onChange={(e) => {
                const updated = [...items];
                updated[index] = {
                  ...updated[index],
                  finalNumber: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                };
                onChange(field.name, updated);
              }}
            />

            {/* COLOR / GRADIENT */}
            <select
              className="border rounded px-2 py-1 text-sm w-full"
              value={item.colors || ""}
              onChange={(e) => {
                const updated = [...items];
                updated[index] = {
                  ...updated[index],
                  colors: e.target.value,
                };
                onChange(field.name, updated);
              }}
            >
              <option value="">Select Color</option>
              {GRADIENTS.map((g: string) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            {/* ICON */}
            <div className="flex items-center gap-2">
              <select
                className="border rounded px-2 py-1 text-sm"
                value={item.icon_key || ""}
                onChange={(e) => {
                  const updated = [...items];
                  updated[index] = {
                    ...updated[index],
                    icon_key: e.target.value,
                  };
                  onChange(field.name, updated);
                }}
              >
                <option value="">Select Icon</option>
                {Object.keys(LucideIcons).map((iconName) => (
                  <option key={iconName} value={iconName}>
                    {iconName}
                  </option>
                ))}
              </select>

              {Icon && <Icon size={18} className="text-gray-600" />}
            </div>

            {/* REMOVE */}
            <Button
              size="sm"
              variant="destructive"
              type="button"
              onClick={() =>
                onChange(
                  field.name,
                  items.filter((_, i) => i !== index)
                )
              }
            >
              Remove USP
            </Button>
          </div>
        );
      })}

      {/* ADD USP */}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange(field.name, [
            ...items,
            {
              key: `usp_${Date.now()}`,
              label: "",
              description: "",
              finalNumber: undefined,
              colors: "",
              icon_key: "",
            },
          ])
        }
      >
        + Add USP
      </Button>
    </div>
  );
}
if (field.type === "service_items") {
  const services: any[] = Array.isArray(value) ? value : [];

  return (
    <div key={field.name} className="space-y-6">
      <label className="text-sm font-medium">{field.label}</label>

      {services.map((service, index) => (
        <div key={index} className="border rounded-lg p-4 bg-gray-50 space-y-3">

          {/* TITLE */}
          <Input
            placeholder="Service Title"
            value={service.title || ""}
            onChange={(e) => {
              const updated = [...services];
              updated[index] = { ...service, title: e.target.value };
              onChange(field.name, updated);
            }}
          />

          {/* BADGE */}
          <Input
            placeholder="Badge (optional)"
            value={service.badge || ""}
            onChange={(e) => {
              const updated = [...services];
              updated[index] = { ...service, badge: e.target.value };
              onChange(field.name, updated);
            }}
          />

          {/* FEATURES */}
          {renderDynamicFields(
            { features: service.features || [] },
            (k, v) => {
              const updated = [...services];
              updated[index] = { ...service, features: v };
              onChange(field.name, updated);
            },
            "features",
            {
              features: {
                fields: [{ name: "features", type: "features", label: "Features" }],
              },
            }
          )}

          {/* CTAs */}
          {renderDynamicFields(
            { ctas: service.ctas || [] },
            (k, v) => {
              const updated = [...services];
              updated[index] = { ...service, ctas: v };
              onChange(field.name, updated);
            },
            "ctas",
            {
              ctas: {
                fields: [{ name: "ctas", type: "ctas", label: "CTAs" }],
              },
            }
          )}

          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              onChange(
                field.name,
                services.filter((_, i) => i !== index)
              )
            }
          >
            Remove Service
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange(field.name, [
            ...services,
            { title: "", badge: "", features: [], ctas: [] },
          ])
        }
      >
        + Add Service
      </Button>
    </div>
  );
}

if (field.type === "specializations" || field.type === "solutions") {
  const items: any[] = Array.isArray(value) ? value : [];

  return (
    <div key={field.name} className="space-y-4">
      <label className="text-sm font-medium">{field.label}</label>

      {items.map((item, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 space-y-3 bg-gray-50"
        >
          {field.fields.map((subField: any) => (
            <div key={subField.name}>
              {subField.type === "text" && (
                <Input
                  placeholder={subField.label}
                  value={item[subField.name] || ""}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[index] = {
                      ...updated[index],
                      [subField.name]: e.target.value,
                    };
                    onChange(field.name, updated);
                  }}
                />
              )}
              {subField.type === "textarea" && (
                <Textarea
                  placeholder={subField.label}
                  value={item[subField.name] || ""}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[index] = {
                      ...updated[index],
                      [subField.name]: e.target.value,
                    };
                    onChange(field.name, updated);
                  }}
                />
              )}
              {subField.type === "select" && (
                <select
                  className="border rounded px-2 py-1 text-sm w-full"
                  value={item[subField.name] || ""}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[index] = {
                      ...updated[index],
                      [subField.name]: e.target.value,
                    };
                    onChange(field.name, updated);
                  }}
                >
                  <option value="">Select {subField.label}</option>
                  {subField.options.map((opt: string) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          <Button
            size="sm"
            variant="destructive"
            type="button"
            onClick={() =>
              onChange(
                field.name,
                items.filter((_, i) => i !== index)
              )
            }
          >
            Remove
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange(field.name, [
            ...items,
            Object.fromEntries(field.fields.map((f: any) => [f.name, ""])),
          ])
        }
      >
        + Add {field.label.slice(0, -1)}
      </Button>
    </div>
  );
}

/* ---------- WHY CHOOSE SECTION ---------- */
if (field.type === "why_choose") {
  const data: WhyChooseTalentBridgeData = meta[field.name] || {
    header: { badge: "", title: { prefix: "", highlight: "", suffix: "" }, subtitle: "" },
    stats: [],
    features: [],
    cta: { label: "", link: "" },
  };

  return (
    <div key={field.name} className="space-y-6 border rounded-lg p-4 bg-gray-50">
      {/* HEADER */}
      <div className="space-y-2">
        <p className="font-medium">{field.label} - Header</p>
        <Input
          placeholder="Badge"
          value={data.header.badge}
          onChange={(e) =>
            onChange(field.name, {
              ...data,
              header: { ...data.header, badge: e.target.value },
            })
          }
        />
        <Input
          placeholder="Title Prefix"
          value={data.header.title.prefix}
          onChange={(e) =>
            onChange(field.name, {
              ...data,
              header: { ...data.header, title: { ...data.header.title, prefix: e.target.value } },
            })
          }
        />
        <Input
          placeholder="Title Highlight"
          value={data.header.title.highlight}
          onChange={(e) =>
            onChange(field.name, {
              ...data,
              header: { ...data.header, title: { ...data.header.title, highlight: e.target.value } },
            })
          }
        />
        <Input
          placeholder="Title Suffix"
          value={data.header.title.suffix}
          onChange={(e) =>
            onChange(field.name, {
              ...data,
              header: { ...data.header, title: { ...data.header.title, suffix: e.target.value } },
            })
          }
        />
        <Textarea
          placeholder="Subtitle"
          value={data.header.subtitle}
          onChange={(e) =>
            onChange(field.name, { ...data, header: { ...data.header, subtitle: e.target.value } })
          }
        />
      </div>

      {/* STATS */}
      <div className="space-y-2">
        <p className="font-medium">Stats</p>
        {data.stats.map((stat, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              placeholder="Value"
              value={stat.value}
              onChange={(e) => {
                const updated = [...data.stats];
                updated[index] = { ...updated[index], value: e.target.value };
                onChange(field.name, { ...data, stats: updated });
              }}
            />
            <Input
              placeholder="Label"
              value={stat.label}
              onChange={(e) => {
                const updated = [...data.stats];
                updated[index] = { ...updated[index], label: e.target.value };
                onChange(field.name, { ...data, stats: updated });
              }}
            />
            <select
              className="border rounded px-2 py-1 text-sm"
              value={stat.icon}
              onChange={(e) => {
                const updated = [...data.stats];
                updated[index] = { ...updated[index], icon: e.target.value as any };
                onChange(field.name, { ...data, stats: updated });
              }}
            >
              <option value="">Select Icon</option>
              <option value="target">Target</option>
              <option value="award">Award</option>
              <option value="users">Users</option>
              <option value="globe">Globe</option>
            </select>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                const updated = data.stats.filter((_, i) => i !== index);
                onChange(field.name, { ...data, stats: updated });
              }}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            onChange(field.name, { ...data, stats: [...data.stats, { value: "", label: "", icon: "target" }] })
          }
        >
          + Add Stat
        </Button>
      </div>

      {/* FEATURES (similar pattern) */}
      <div className="space-y-2">
        <p className="font-medium">Features</p>
        {data.features.map((feature, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              placeholder="Title"
              value={feature.title}
              onChange={(e) => {
                const updated = [...data.features];
                updated[index] = { ...updated[index], title: e.target.value };
                onChange(field.name, { ...data, features: updated });
              }}
            />
            <Textarea
              placeholder="Description"
              value={feature.description}
              onChange={(e) => {
                const updated = [...data.features];
                updated[index] = { ...updated[index], description: e.target.value };
                onChange(field.name, { ...data, features: updated });
              }}
            />
            <select
              className="border rounded px-2 py-1 text-sm"
              value={feature.icon}
              onChange={(e) => {
                const updated = [...data.features];
                updated[index] = { ...updated[index], icon: e.target.value as any };
                onChange(field.name, { ...data, features: updated });
              }}
            >
              <option value="">Select Icon</option>
              <option value="shield">Shield</option>
              <option value="clock">Clock</option>
              <option value="globe">Globe</option>
              <option value="users">Users</option>
            </select>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={feature.theme}
              onChange={(e) => {
                const updated = [...data.features];
                updated[index] = { ...updated[index], theme: e.target.value as any };
                onChange(field.name, { ...data, features: updated });
              }}
            >
              <option value="">Select Theme</option>
              <option value="emerald">Emerald</option>
              <option value="teal">Teal</option>
              <option value="green">Green</option>
            </select>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                const updated = data.features.filter((_, i) => i !== index);
                onChange(field.name, { ...data, features: updated });
              }}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            onChange(field.name, {
              ...data,
              features: [...data.features, { title: "", description: "", icon: "shield", theme: "emerald" }],
            })
          }
        >
          + Add Feature
        </Button>
      </div>

      {/* CTA */}
      <div className="space-y-2">
        <p className="font-medium">CTA</p>
        <Input
          placeholder="Label"
          value={data.cta.label}
          onChange={(e) => onChange(field.name, { ...data, cta: { ...data.cta, label: e.target.value } })}
        />
        <Input
          placeholder="Link"
          value={data.cta.link}
          onChange={(e) => onChange(field.name, { ...data, cta: { ...data.cta, link: e.target.value } })}
        />
      </div>
    </div>
  );
}

if (field.type === "workflow_blocks") {
  const blocks: any[] = Array.isArray(value) ? value : [];

  return (
    <div key={field.name} className="space-y-4">
      <label className="text-sm font-medium">{field.label}</label>

      {blocks.map((block, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 space-y-3 bg-gray-50"
        >
          {/* Title */}
          <Input
            placeholder="Title Prefix"
            value={block.title?.prefix || ""}
            onChange={(e) => {
              const updated = [...blocks];
              updated[index].title = {
                ...updated[index].title,
                prefix: e.target.value,
              };
              onChange(field.name, updated);
            }}
          />
          <Input
            placeholder="Title Highlight"
            value={block.title?.highlight || ""}
            onChange={(e) => {
              const updated = [...blocks];
              updated[index].title = {
                ...updated[index].title,
                highlight: e.target.value,
              };
              onChange(field.name, updated);
            }}
          />
          <Input
            placeholder="Title Suffix"
            value={block.title?.suffix || ""}
            onChange={(e) => {
              const updated = [...blocks];
              updated[index].title = {
                ...updated[index].title,
                suffix: e.target.value,
              };
              onChange(field.name, updated);
            }}
          />

          {/* Description */}
          <Textarea
            placeholder="Description"
            value={block.description || ""}
            onChange={(e) => {
              const updated = [...blocks];
              updated[index].description = e.target.value;
              onChange(field.name, updated);
            }}
          />

          {/* Bullets */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Bullets</p>
            {(block.bullets || []).map((b, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  placeholder={`Bullet ${i + 1}`}
                  value={b}
                  onChange={(e) => {
                    const updated = [...blocks];
                    updated[index].bullets[i] = e.target.value;
                    onChange(field.name, updated);
                  }}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  type="button"
                  onClick={() => {
                    const updated = [...blocks];
                    updated[index].bullets.splice(i, 1);
                    onChange(field.name, updated);
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const updated = [...blocks];
                updated[index].bullets = [...(block.bullets || []), ""];
                onChange(field.name, updated);
              }}
            >
              + Add Bullet
            </Button>
          </div>

          {/* Image */}
          <div>
            <label className="text-sm font-medium">Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                const updated = [...blocks];
                updated[index].image = { src: file, alt: "" };
                onChange(field.name, updated);
                e.target.value = "";
              }}
            />
            {block.image?.src && (
              <LazyLoadImage
                src={getPreview(block.image.src)}
                alt={block.image.alt || ""}
                effect="blur"
                className="h-24 w-32 rounded border object-cover mt-2"
              />
            )}
          </div>

          {/* Layout */}
          <select
            className="border rounded px-2 py-1 text-sm w-full"
            value={block.layout || "text-left"}
            onChange={(e) => {
              const updated = [...blocks];
              updated[index].layout = e.target.value as "text-left" | "text-right";
              onChange(field.name, updated);
            }}
          >
            <option value="text-left">Text Left</option>
            <option value="text-right">Text Right</option>
          </select>

          {/* Remove Block */}
          <Button
            size="sm"
            variant="destructive"
            type="button"
            onClick={() => {
              const updated = blocks.filter((_, i) => i !== index);
              onChange(field.name, updated);
            }}
          >
            Remove Block
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          onChange(field.name, [
            ...blocks,
            {
              title: { prefix: "", highlight: "", suffix: "" },
              description: "",
              bullets: [],
              image: { src: "", alt: "" },
              layout: "text-left",
            },
          ]);
        }}
      >
        + Add Workflow Block
      </Button>
    </div>
  );
}

if (field.type === "cta") {
  const data = value || { label: "", link: "" };

  return (
    <div key={field.name} className="space-y-2">
      <label className="text-sm font-medium">{field.label}</label>

      <Input
        placeholder="Label"
        value={data.label}
        onChange={(e) =>
          onChange(field.name, { ...data, label: e.target.value })
        }
      />

      <Input
        placeholder="Link"
        value={data.link}
        onChange={(e) =>
          onChange(field.name, { ...data, link: e.target.value })
        }
      />
    </div>
  );
}

/* ---------- FAQ ITEMS ---------- */
if (field.type === "faq_items") {
  const faqs: { question: string; answer: string }[] =
    Array.isArray(value) ? value : [];

  return (
    <div key={field.name} className="space-y-4">
      <label className="text-sm font-medium">{field.label}</label>

      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 space-y-2 bg-gray-50"
        >
          {/* Question */}
          <Input
            placeholder="Question"
            value={faq.question || ""}
            onChange={(e) => {
              const updated = [...faqs];
              updated[index] = {
                ...updated[index],
                question: e.target.value,
              };
              onChange(field.name, updated);
            }}
          />

          {/* Answer */}
          <Textarea
            placeholder="Answer"
            value={faq.answer || ""}
            onChange={(e) => {
              const updated = [...faqs];
              updated[index] = {
                ...updated[index],
                answer: e.target.value,
              };
              onChange(field.name, updated);
            }}
          />

          {/* Remove */}
          <Button
            size="sm"
            variant="destructive"
            type="button"
            onClick={() =>
              onChange(
                field.name,
                faqs.filter((_, i) => i !== index)
              )
            }
          >
            Remove FAQ
          </Button>
        </div>
      ))}

      {/* Add FAQ */}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange(field.name, [
            ...faqs,
            { question: "", answer: "" },
          ])
        }
      >
        + Add FAQ
      </Button>
    </div>
  );
}

if (field.type === "client_items") {
  const items = Array.isArray(value) ? value : [];

  const updateItem = (index: number, key: string, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [key]: val };
    onChange(field.name, updated);
  };

  const addItem = () => {
    onChange(field.name, [
      ...items,
      {
        logo: "",
        name: "",
        colors: "",
        icon_key: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    onChange(
      field.name,
      items.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <div key={field.name} className="space-y-4">

      <label className="text-sm font-semibold">
        {field.label}
      </label>

      {items.map((item: any, index: number) => (
        <div
          key={index}
          className="border rounded p-4 space-y-3"
        >

          {/* LOGO */}
          <div>
            <label className="text-xs">Logo</label>

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                updateItem(index, "logo", file);
              }}
            />

            {item.logo &&
              typeof item.logo === "string" && (
                <img
                  src={item.logo}
                  className="h-14 mt-2 border rounded"
                />
              )}
          </div>

          {/* NAME */}
          <Input
            placeholder="Client Name"
            value={item.name || ""}
            onChange={(e) =>
              updateItem(index, "name", e.target.value)
            }
          />

          {/* COLORS */}
          <Input
            placeholder="Tailwind colors"
            value={item.colors || ""}
            onChange={(e) =>
              updateItem(index, "colors", e.target.value)
            }
          />

          {/* ICON KEY */}
          <Input
            placeholder="Icon key"
            value={item.icon_key || ""}
            onChange={(e) =>
              updateItem(index, "icon_key", e.target.value)
            }
          />

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => removeItem(index)}
          >
            Remove
          </Button>

        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addItem}
      >
        + Add Client
      </Button>

    </div>
  );
}

 if (field.type === "footer") {
      const groupValue = value || {};

      const update = (key: string, val: any) =>
        onChange(field.name, {
          ...groupValue,
          [key]: val,
        });

      return (
        <div
          key={field.name}
          className="border rounded-lg p-4 space-y-3"
        >
          <label className="font-semibold text-sm">
            {field.label}
          </label>

          {field.fields?.map((subField: any) => {
            const subValue =
              groupValue[subField.name] ?? "";

            if (subField.type === "text")
              return (
                <Input
                  key={subField.name}
                  placeholder={subField.label}
                  value={subValue}
                  onChange={(e) =>
                    update(
                      subField.name,
                      e.target.value
                    )
                  }
                />
              );

            if (subField.type === "textarea")
              return (
                <Textarea
                  key={subField.name}
                  placeholder={subField.label}
                  value={subValue}
                  onChange={(e) =>
                    update(
                      subField.name,
                      e.target.value
                    )
                  }
                />
              );

            if (subField.type === "image")
              return (
                <div key={subField.name}>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file =
                        e.target.files?.[0];
                      if (!file) return;

                      const url =''
                        // await uploadFile(file);

                      update(
                        subField.name,
                        url
                      );
                    }}
                  />

                  {subValue && (
                    <img
                      src={subValue}
                      className="h-24 border rounded mt-2"
                    />
                  )}
                </div>
              );

            return null;
          })}
        </div>
      );
    }
    return null;
  });
}
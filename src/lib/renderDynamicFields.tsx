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

/* ---------------------------------------------
   DYNAMIC FIELD RENDERER
---------------------------------------------- */
export function renderDynamicFields(
  meta: Record<string, any>,
  onChange: (key: string, value: any) => void,
  sectionKey: string,
  config: any
) {
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

    /* ================= FIELD TYPES ================= */

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

    return null;
  });
}
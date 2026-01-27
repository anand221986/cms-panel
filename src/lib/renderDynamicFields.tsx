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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USP_KEYS = [
  "Active Candidates",
  "Jobs Placed",
  "Partner Companies",
];
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

    // remove duplicate path
    const cleanPath = value.replace(/^\/?uploads\/sections\//, "");
    return `${API_BASE_URL}/uploads/sections/${cleanPath}`;
  }

  return null;
};

/* ---------------------------------------------
   DYNAMIC FIELD RENDERER (FIXED)
---------------------------------------------- */
export function renderDynamicFields(
  meta: Record<string, any>,
  onChange: (key: string, value: any) => void,
  sectionKey: string,
  config: any
) {
  const sectionConfig = config[sectionKey];
  if (!sectionConfig) return null;

  return sectionConfig.fields.map((field: any) => {
    let value: any = "";

    /* ---------- IMAGE / FILE ---------- */
    if (field.type === "image" || field.type === "file") {
      if (field.multiple) {
        value = Array.isArray(meta?.[field.name]) ? meta[field.name] : [];
      } else {
        value = meta?.[field.name] ?? null;
      }
    }

    /* ---------- TEXT / TEXTAREA / JSON / QUILL ---------- */
    else {
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
          onChange={e => onChange(field.name, e.target.value)}
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
          onChange={e => onChange(field.name, e.target.value)}
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
          onChange={e => onChange(field.name, e.target.value)}
        />
      );
    }

    /* ---------- BADGES ---------- */
    if (field.type === "badges") {
      const badges: string[] = Array.isArray(meta?.[field.name])
        ? meta[field.name]
        : [];

      return (
        <div key={field.name} className="space-y-2">
          <p className="font-medium">{field.label}</p>

          {badges.map((badge, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={badge}
                onChange={e => {
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
            onChange={e => {
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
                console.log(preview,'preview image')
                if (!preview) return null;

                return (
                  <div key={index} className="relative">
                    {/* <img
                      src={preview}
                      className="h-24 w-32 rounded border object-cover"
                    /> */}
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

    /* ---------- CTA (LABEL + URL) ---------- */
if (field.type === "cta") {
  const cta = meta?.[field.name] || { label: "", url: "" };

  return (
    <div key={field.name} className="space-y-2 border rounded-lg p-3">
      <p className="font-medium">{field.label}</p>

      <Input
        placeholder="Button Label"
        value={cta.label}
        onChange={e =>
          onChange(field.name, { ...cta, label: e.target.value })
        }
      />

      <Input
        placeholder="Button URL"
        value={cta.url}
        onChange={e =>
          onChange(field.name, { ...cta, url: e.target.value })
        }
      />
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
            onChange={html => onChange(field.name, html)}
          />
        </div>
      );
    }

/* ---------- USP ITEMS ---------- */
// if (field.type === "usp_items") {
//   const usps: string[] = Array.isArray(meta?.[field.name])
//     ? meta[field.name]
//     : [];

//   return (
//     <div key={field.name} className="space-y-2">
//       <p className="font-medium">{field.label}</p>

//       {usps.map((item, index) => (
//         <div key={index} className="flex gap-2 items-center">
//           <Input
//             placeholder="USP text (e.g. 24x7 Support)"
//             value={item}
//             onChange={e => {
//               const updated = [...usps];
//               updated[index] = e.target.value;
//               onChange(field.name, updated);
//             }}
//           />

//           <Button
//             size="sm"
//             variant="destructive"
//             type="button"
//             onClick={() =>
//               onChange(
//                 field.name,
//                 usps.filter((_, i) => i !== index)
//               )
//             }
//           >
//             Remove
//           </Button>
//         </div>
//       ))}

//       <Button
//         type="button"
//         variant="outline"
//         onClick={() => onChange(field.name, [...usps, ""])}
//       >
//         + Add USP
//       </Button>
//     </div>
//   );
// }
/* ---------- USP ITEMS (FULL OBJECT) ---------- */
if (field.type === "usp_items") {
  const usps: any[] = Array.isArray(meta?.[field.name])
    ? meta[field.name]
    : [];

  return (
    <div key={field.name} className="space-y-4">
      <p className="font-medium">{field.label}</p>

      {usps.map((item, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 space-y-3"
        >
          {/* USP KEY */}
          {/* <select
            className="w-full border rounded px-3 py-2"
            value={item.key || ""}
            onChange={e => {
              const updated = [...usps];
              updated[index] = {
                ...item,
                key: e.target.value,
                label: e.target.value,
              };
              onChange(field.name, updated);
            }}
          >
            <option value="">Select USP</option>
            {USP_KEYS.map(key => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select> */}
            {/* USP KEY INPUT */}
          <Input
            placeholder="USP Key (e.g., Active Candidates)"
            value={item.key || ""}
            onChange={e => {
              const updated = [...usps];
              updated[index] = {
                ...item,
                key: e.target.value,
                label: e.target.value, // keep label in sync
              };
              onChange(field.name, updated);
            }}
          />

          {/* NUMBER */}
          <Input
            type="number"
            placeholder="Final Number"
            value={item.finalNumber || ""}
            onChange={e => {
              const updated = [...usps];
              updated[index].finalNumber = Number(e.target.value);
              onChange(field.name, updated);
            }}
          />

          {/* DESCRIPTION */}
          <Textarea
            placeholder="Description"
            value={item.description || ""}
            onChange={e => {
              const updated = [...usps];
              updated[index].description = e.target.value;
              onChange(field.name, updated);
            }}
          />

          {/* COLOR */}
          {/* <Input
            placeholder="Gradient color (tailwind)"
            value={item.color || ""}
            onChange={e => {
              const updated = [...usps];
              updated[index].color = e.target.value;
              onChange(field.name, updated);
            }}
          /> */}
            <Select
  value={item.colors || ""}
  onValueChange={(val) => {
    const updated = [...usps];
    updated[index].colors = val;
    onChange(field.name, updated);
  }}
>
  <SelectTrigger>
    <SelectValue placeholder="Select Gradient" />
  </SelectTrigger>

  <SelectContent>
    {Object.entries(GRADIENTS).map(([key, g]) => (
      <SelectItem key={key} value={g.value}>
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-4 rounded bg-gradient-to-r ${g.value}`}
          />
          <span>{g.label}</span>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>


          <Button
            size="sm"
            variant="destructive"
            type="button"
            onClick={() =>
              onChange(
                field.name,
                usps.filter((_, i) => i !== index)
              )
            }
          >
            Remove USP
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange(field.name, [
            ...usps,
            {
              key: "",
              finalNumber: "",
              label: "",
              description: "",
              color: "",
            },
          ])
        }
      >
        + Add USP
      </Button>
    </div>
  );
}



    /* ---------- KPI ITEMS ---------- */
if (field.type === "kpi_items") {
  const kpis: { value: string; label: string }[] = Array.isArray(meta?.[field.name])
    ? meta[field.name]
    : [];

  return (
    <div key={field.name} className="space-y-2">
      <p className="font-medium">{field.label}</p>

      {kpis.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            placeholder="Value (e.g. 48h)"
            value={item.value}
            onChange={e => {
              const updated = [...kpis];
              updated[index].value = e.target.value;
              onChange(field.name, updated);
            }}
          />
          <Input
            placeholder="Label (e.g. Contract Start)"
            value={item.label}
            onChange={e => {
              const updated = [...kpis];
              updated[index].label = e.target.value;
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
                kpis.filter((_, i) => i !== index)
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
        onClick={() => onChange(field.name, [...kpis, { value: "", label: "" }])}
      >
        + Add KPI
      </Button>
    </div>
  );
}


/* ---------- FAQ ITEMS ---------- */
if (field.type === "faq_items") {
  const faqs: { question: string; answer: string }[] =
    Array.isArray(meta?.[field.name]) ? meta[field.name] : [];

  return (
    <div key={field.name} className="space-y-4">
      <p className="font-medium">{field.label}</p>

      {faqs.map((item, index) => (
        <div key={index} className="space-y-2 border rounded p-3">
          <Input
            placeholder="Question"
            value={item.question || ""}
            onChange={e => {
              const updated = [...faqs];
              updated[index].question = e.target.value;
              onChange(field.name, updated);
            }}
          />
          <Textarea
            placeholder="Answer"
            value={item.answer || ""}
            onChange={e => {
              const updated = [...faqs];
              updated[index].answer = e.target.value;
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
                faqs.filter((_, i) => i !== index)
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
          onChange(field.name, [...faqs, { question: "", answer: "" }])
        }
      >
        + Add FAQ
      </Button>
    </div>
  );
}

/* ---------- CLIENT LOGO ITEMS ---------- */
if (field.type === "client_items") {
  const clients: any[] = Array.isArray(meta?.[field.name])
    ? meta[field.name]
    : [];

  return (
    <div key={field.name} className="space-y-4">
      <p className="font-medium">{field.label}</p>

      {clients.map((item, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          {/* NAME */}
          <Input
            placeholder="Company Name"
            value={item.name || ""}
            onChange={e => {
              const updated = [...clients];
              updated[index].name = e.target.value;
              onChange(field.name, updated);
            }}
          />

          {/* ICON KEY */}
          {/* <Input
            placeholder="Icon Key (e.g. techcorp)"
            value={item.icon_key || ""}
            onChange={e => {
              const updated = [...clients];
              updated[index].icon_key = e.target.value;
              onChange(field.name, updated);
            }}
          /> */}

          <Select
  value={item.icon_key || ""}
  onValueChange={(val) => {
    const updated = [...clients];
    updated[index].icon_key = val;
    onChange(field.name, updated);
  }}
>
  <SelectTrigger>
    <SelectValue placeholder="Select Icon" />
  </SelectTrigger>

  <SelectContent>
    {Object.entries(CLIENT_ICONS).map(([key, cfg]) => (
      <SelectItem key={key} value={key}>
        <div className="flex items-center gap-2">
          {cfg.icon}
          <span>{cfg.label}</span>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>


          {/* GRADIENT COLORS */}
          {/* <Input
            placeholder="Gradient (from-blue-500 to-cyan-500)"
            value={item.colors || ""}
            onChange={e => {
              const updated = [...clients];
              updated[index].colors = e.target.value;
              onChange(field.name, updated);
            }}
          /> */}

          <Select
  value={item.colors || ""}
  onValueChange={(val) => {
    const updated = [...clients];
    updated[index].colors = val;
    onChange(field.name, updated);
  }}
>
  <SelectTrigger>
    <SelectValue placeholder="Select Gradient" />
  </SelectTrigger>

  <SelectContent>
    {Object.entries(GRADIENTS).map(([key, g]) => (
      <SelectItem key={key} value={g.value}>
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-4 rounded bg-gradient-to-r ${g.value}`}
          />
          <span>{g.label}</span>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>


          {/* LOGO IMAGE */}
          <Input
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0];
              if (!file) return;

              const updated = [...clients];
              updated[index].logo = file;
              onChange(field.name, updated);

              e.target.value = "";
            }}
          />

          {/* PREVIEW */}
          {item.logo && (
            <LazyLoadImage
              src={getPreview(item.logo)}
              effect="blur"
              className="h-20 w-32 object-contain border rounded"
            />
          )}

          <Button
            size="sm"
            variant="destructive"
            type="button"
            onClick={() =>
              onChange(
                field.name,
                clients.filter((_, i) => i !== index)
              )
            }
          >
            Remove Client
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange(field.name, [
            ...clients,
            {
              name: "",
              icon_key: "",
              colors: "",
              logo: null
            }
          ])
        }
      >
        + Add Client
      </Button>
    </div>
  );
}




    return null;
  });

  
}

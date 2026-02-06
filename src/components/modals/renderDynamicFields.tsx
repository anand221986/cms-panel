import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { SECTION_FORM_CONFIG } from "@/lib/sectionFormConfig";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type OnChangeFn = (key: string, value: any) => void;

export function renderDynamicFields(
  meta: Record<string, any>,
  onChange: OnChangeFn,
  sectionKey: string,
  config: typeof SECTION_FORM_CONFIG
) {
  console.group(`Rendering section: ${sectionKey}`);
  console.log("Meta data for section:", meta);

  const section = config[sectionKey];

  if (!section) {
    console.warn(`No section found for key: ${sectionKey}`);
    console.groupEnd();
    return null;
  }

  console.log("Section config:", section);

  return section.fields.map((field) => {
    const rawValue = meta[field.name];
    const value =
      field.type === "cta"
        ? Array.isArray(rawValue)
          ? rawValue
          : []
        : field.type === "group"
        ? rawValue || {}
        : field.type === "list" || field.type === "array"
        ? Array.isArray(rawValue)
          ? rawValue
          : []
        : field.multiple
        ? Array.isArray(rawValue)
          ? rawValue
          : []
        : rawValue ?? "";

    console.group(`Field: ${field.name} (${field.type})`);
    console.log("Raw value:", rawValue);
    console.log("Processed value:", value);

    /* ---------------- TEXT ---------------- */
    if (field.type === "text") {
      console.groupEnd();
      return (
        <Input
          key={field.name}
          placeholder={field.label}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
    }

    /* ---------------- TEXTAREA ---------------- */
    if (field.type === "textarea") {
      console.groupEnd();
      return (
        <Textarea
          key={field.name}
          placeholder={field.label}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
    }

    // /* ---------------- JSON ---------------- */
    // if (field.type === "json") {
    //   console.groupEnd();
    //   return (
    //     <Textarea
    //       key={field.name}
    //       rows={6}
    //       placeholder={field.label}
    //       value={typeof value === "string" ? value : JSON.stringify(value, null, 2)}
    //       onChange={(e) => {
    //         try {
    //           onChange(field.name, JSON.parse(e.target.value));
    //         } catch {
    //           onChange(field.name, e.target.value);
    //         }
    //       }}
    //     />
    //   );
    // }

    /* ---------------- GROUP ---------------- */
    if (field.type === "group") {
      const groupValue = value || {};
      console.log("Group fields:", field.fields);
      Object.entries(groupValue).forEach(([k, v]) =>
        console.log(`  ${k}:`, v)
      );

      console.groupEnd();
      return (
        <div key={field.name} className="space-y-2">
          <label className="text-sm font-medium">{field.label}</label>
          {field.fields?.map((subField: any) => (
            <Input
              key={subField.name}
              placeholder={subField.label}
              value={groupValue[subField.name] || ""}
              onChange={(e) =>
                onChange(field.name, { ...groupValue, [subField.name]: e.target.value })
              }
            />
          ))}
        </div>
      );
    }

    /* ---------------- LIST / ARRAY ---------------- */
    if (field.type === "list" || field.type === "array") {
      const items = Array.isArray(value) ? value : [];
      console.log("Items:", items);

      const updateItem = (index: number, key: string, val: any) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [key]: val };
        onChange(field.name, updated);
      };

      console.groupEnd();
      return (
        <div key={field.name} className="space-y-4">
          <label className="text-sm font-medium">{field.label}</label>

          {items.map((item: any, index: number) => (
            <div key={index} className="rounded-lg border p-4 space-y-3">
              {field.fields?.map((subField: any) => (
                <Input
                  key={subField.name}
                  placeholder={subField.label}
                  value={item[subField.name] || ""}
                  onChange={(e) => updateItem(index, subField.name, e.target.value)}
                />
              ))}

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() =>
                  onChange(
                    field.name,
                    items.filter((_: any, i: number) => i !== index)
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
            size="sm"
            onClick={() => onChange(field.name, [...items, {}])}
          >
            + Add {field.label}
          </Button>
        </div>
      );
    }

    /* ---------------- IMAGE ---------------- */
    if (field.type === "image" || field.type === "file") {
      console.log("Image/file field, value:", value);
      console.groupEnd();

      return (
        <div key={field.name} className="space-y-2">
          <label className="text-sm font-medium">{field.label}</label>
          <Input
            type="file"
            accept="image/*"
            multiple={Boolean(field.multiple)}
            onChange={async (e) => {
              const files = Array.from(e.target.files || []);
              if (!files.length) return;

              if (field.multiple) {
                const uploaded: string[] = [];
                for (const file of files) {
                  const fd = new FormData();
                  fd.append("file", file);
                  const res = await fetch(`${API_BASE_URL}/upload`, {
                    method: "POST",
                    body: fd,
                  });
                  const data = await res.json();
                  uploaded.push(data.url);
                }
                onChange(field.name, [...value, ...uploaded]);
              } else {
                const fd = new FormData();
                fd.append("file", files[0]);
                const res = await fetch(`${API_BASE_URL}/upload`, {
                  method: "POST",
                  body: fd,
                });
                const data = await res.json();
                onChange(field.name, data.url);
              }

              e.target.value = "";
            }}
          />

          {field.multiple && value.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {value.map((url: string, i: number) => (
                <img
                  key={i}
                  src={url}
                  className="h-24 w-32 rounded border object-cover"
                />
              ))}
            </div>
          )}

          {!field.multiple && value && (
            <img src={value} className="h-28 rounded border object-cover" />
          )}
        </div>
      );
    }

    /* ---------------- QUILL ---------------- */
    if (field.type === "quill") {
      console.groupEnd();
      return (
        <div key={field.name} className="space-y-2">
          <label className="text-sm font-medium">{field.label}</label>
          <ReactQuill
            theme="snow"
            value={value || ""}
            onChange={(html) => onChange(field.name, html)}
          />
        </div>
      );
    }

    /* ---------------- CTA ---------------- */
    if (field.type === "cta") {
      const ctas = Array.isArray(value) ? value : [];
      console.log("CTA items:", ctas);

      if (ctas.length === 0) {
        onChange(field.name, [
          { label: "", url: "", variant: "primary", color: "#2563eb" },
        ]);
        console.groupEnd();
        return null;
      }

      console.groupEnd();
      return (
        <div key={field.name} className="space-y-3">
          <label className="text-sm font-medium">{field.label}</label>

          {ctas.map((cta: any, index: number) => (
            <div key={index} className="grid grid-cols-12 gap-2 border p-3 rounded">
              <Input
                className="col-span-3"
                placeholder="Label"
                value={cta.label}
                onChange={(e) => {
                  const updated = [...ctas];
                  updated[index] = { ...cta, label: e.target.value };
                  onChange(field.name, updated);
                }}
              />
              <Input
                className="col-span-3"
                placeholder="URL"
                value={cta.url}
                onChange={(e) => {
                  const updated = [...ctas];
                  updated[index] = { ...cta, url: e.target.value };
                  onChange(field.name, updated);
                }}
              />
              <select
                className="col-span-2 border rounded px-2"
                value={cta.variant}
                onChange={(e) => {
                  const updated = [...ctas];
                  updated[index] = { ...cta, variant: e.target.value };
                  onChange(field.name, updated);
                }}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>

              <input
                type="color"
                className="col-span-2 h-10 border rounded"
                value={cta.color}
                onChange={(e) => {
                  const updated = [...ctas];
                  updated[index] = { ...cta, color: e.target.value };
                  onChange(field.name, updated);
                }}
              />

              <Button
                className="col-span-2"
                variant="destructive"
                size="sm"
                onClick={() =>
                  onChange(
                    field.name,
                    ctas.filter((_: any, i) => i !== index)
                  )
                }
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      );
    }

    console.groupEnd();
    return null;
  });
}

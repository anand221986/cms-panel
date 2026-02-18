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
  const section = config[sectionKey];
  if (!section) return null;

  /* ───────────────────────────────
     FILE UPLOAD HELPER
  ─────────────────────────────── */
  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    return data.url;
  };

  /* ───────────────────────────────
     VALUE NORMALIZER
  ─────────────────────────────── */
  const normalizeValue = (field: any, rawValue: any) => {
    if (field.type === "cta") return Array.isArray(rawValue) ? rawValue : [];

    if (
      field.type === "group" ||
      field.type === "footer"
    )
      return rawValue || {};

    if (
      field.type === "list" ||
      field.type === "array" ||
      field.type === "client_items"
    )
      return Array.isArray(rawValue) ? rawValue : [];

    if (field.multiple)
      return Array.isArray(rawValue) ? rawValue : [];

    return rawValue ?? "";
  };

  /* ───────────────────────────────
     MAIN RENDER
  ─────────────────────────────── */
  return section.fields.map((field) => {
    const value = normalizeValue(field, meta[field.name]);

    /* ================= TEXT ================= */
    if (field.type === "text") {
      return (
        <Input
          key={field.name}
          placeholder={field.label}
          value={value}
          onChange={(e) =>
            onChange(field.name, e.target.value)
          }
        />
      );
    }

    /* ================= TEXTAREA ================= */
    if (field.type === "textarea") {
      return (
        <Textarea
          key={field.name}
          placeholder={field.label}
          value={value}
          onChange={(e) =>
            onChange(field.name, e.target.value)
          }
        />
      );
    }

    /* ================= QUILL ================= */
    if (field.type === "quill") {
      return (
        <div key={field.name} className="space-y-2">
          <label className="text-sm font-medium">
            {field.label}
          </label>

          <ReactQuill
            theme="snow"
            value={value}
            onChange={(html) =>
              onChange(field.name, html)
            }
          />
        </div>
      );
    }

    /* ================= GROUP ================= */
    if (field.type === "group") {
      const groupValue = value || {};

      return (
        <div key={field.name} className="space-y-2">
          <label className="font-medium text-sm">
            {field.label}
          </label>

          {field.fields?.map((subField: any) => (
            <Input
              key={subField.name}
              placeholder={subField.label}
              value={groupValue[subField.name] || ""}
              onChange={(e) =>
                onChange(field.name, {
                  ...groupValue,
                  [subField.name]: e.target.value,
                })
              }
            />
          ))}
        </div>
      );
    }

    /* ================= FOOTER ================= */
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

                      const url =
                        await uploadFile(file);

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

   /* ---------------- CLIENT ITEMS ---------------- */
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

    /* ================= IMAGE ================= */
    if (field.type === "image") {
      return (
        <div key={field.name}>
          <label className="text-sm font-medium">
            {field.label}
          </label>

          <Input
            type="file"
            accept="image/*"
            multiple={field.multiple}
            onChange={async (e) => {
              const files = Array.from(
                e.target.files || []
              );

              if (!files.length) return;

              if (field.multiple) {
                const urls =
                  await Promise.all(
                    files.map(uploadFile)
                  );

                onChange(field.name, [
                  ...value,
                  ...urls,
                ]);
              } else {
                const url =
                  await uploadFile(files[0]);

                onChange(field.name, url);
              }
            }}
          />

          {field.multiple
            ? value?.map(
                (url: string, i: number) => (
                  <img
                    key={i}
                    src={url}
                    className="h-24 border rounded mt-2"
                  />
                )
              )
            : value && (
                <img
                  src={value}
                  className="h-24 border rounded mt-2"
                />
              )}
        </div>
      );
    }

    return null;
  });
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { SECTION_FORM_CONFIG } from "@/lib/sectionFormConfig";
import { renderDynamicFields } from "@/lib/renderDynamicFields";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ───────────────────────────────
   META NORMALIZER (🔥 IMPORTANT)
─────────────────────────────── */
function normalizeMeta(
  sectionKey: string,
  rawMeta: any = {},
  editingSection: any
) {
  const config = SECTION_FORM_CONFIG[sectionKey];
  if (!config) return rawMeta || {};

  const normalized: any = {};

  for (const field of config.fields) {
    const value = rawMeta?.[field.name];

    /* ---- CTA ---- */
    if (field.type === "cta") {
      normalized[field.name] = Array.isArray(value)
        ? value.map((cta: any) => ({
            label: cta.label ?? "",
            url: cta.url ?? "",
            variant: cta.variant ?? "primary",
            color: cta.color ?? "#2563eb",
          }))
        : value
          ? [{
              label: value.label ?? "",
              url: value.url ?? "",
              variant: value.variant ?? "primary",
              color: value.color ?? "#2563eb",
            }]
          : [];
      continue;
    }

    /* ---- IMAGE ---- */
    if (field.type === "image" && !field.multiple) {
      normalized[field.name] = value
        ? value.startsWith("http")
          ? value
          : `${API_BASE_URL}/uploads/sections/${value}`
        : null;
      continue;
    }

    /* ---- MULTIPLE IMAGE ---- */
    if (field.type === "image" && field.multiple) {
      normalized[field.name] = Array.isArray(value)
        ? value.map((img: string) =>
            img.startsWith("http")
              ? img
              : `${API_BASE_URL}/uploads/sections/${img}`
          )
        : [];
      continue;
    }

    /* ---- ARRAY ---- */
    if (field.type === "array") {
      normalized[field.name] = Array.isArray(value) ? value : [];
      continue;
    }

    /* ---- DEFAULT ---- */
    normalized[field.name] = value ?? "";
  }

  return normalized;
}

export default function SectionFormModal({
  open,
  setOpen,
  pageId,
  editingSection,
  refresh,
}: any) {
  const [form, setForm] = useState<any>({
    section_key: "",
    title: "",
    sub_title: "",
    sort_order: 0,
    is_active: true,
    meta: {},
  });

  /* ───────────────────────────────
     INIT FORM
  ─────────────────────────────── */
  useEffect(() => {
    if (!open) return;

    if (!editingSection) {
      setForm({
        section_key: "",
        title: "",
        sub_title: "",
        sort_order: 0,
        is_active: true,
        meta: {},
      });
      return;
    }

    const normalizedMeta = normalizeMeta(
      editingSection.section_key,
      editingSection.meta,
      editingSection
    );

    setForm({
      section_key: editingSection.section_key,
      title: editingSection.title ?? "",
      sub_title: editingSection.sub_title ?? "",
      sort_order: editingSection.sort_order ?? 0,
      is_active: editingSection.is_active ?? true,
      meta: normalizedMeta,
    });
  }, [open, editingSection]);

  /* ───────────────────────────────
     VALIDATION
  ─────────────────────────────── */
  const validateForm = () => {
    if (!form.section_key) return "Section key is required";
    if (!form.title.trim()) return "Title is required";
    if (form.sort_order < 0) return "Sort order must be ≥ 0";
    return null;
  };

  /* ───────────────────────────────
     SUBMIT
  ─────────────────────────────── */
  const handleSubmit = async () => {
    try {
      const error = validateForm();
      if (error) return toast.error(error);

      const formData = new FormData();

      ["section_key", "title", "sub_title", "sort_order", "is_active"].forEach(
        (key) => formData.append(key, String(form[key]))
      );

      const metaWithoutFiles: any = {};
      const fileMap: Record<string, File[]> = {};

      Object.entries(form.meta || {}).forEach(([key, value]: any) => {
        if (value instanceof File) {
          fileMap[key] = [value];
        } else if (Array.isArray(value) && value[0] instanceof File) {
          fileMap[key] = value;
        } else {
          metaWithoutFiles[key] = value;
        }
      });

      Object.entries(fileMap).forEach(([key, files]) =>
        files.forEach((file) => formData.append(key, file))
      );

      formData.append("meta", JSON.stringify(metaWithoutFiles));

      if (editingSection) {
        await axios.put(
          `${API_BASE_URL}/pages/${pageId}/sections/${editingSection.id}`,
          formData
        );
        toast.success("Section updated");
      } else {
        await axios.post(
          `${API_BASE_URL}/pages/${pageId}/sections`,
          formData
        );
        toast.success("Section created");
      }

      setOpen(false);
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  /* ───────────────────────────────
     UI
  ─────────────────────────────── */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingSection ? "Edit Section" : "Add Section"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Section Key */}
          <Select
            value={form.section_key}
            onValueChange={(val) =>
              setForm((p: any) => ({ ...p, section_key: val, meta: {} }))
            }
            disabled={!!editingSection}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select section key" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SECTION_FORM_CONFIG).map(([key, cfg]: any) => (
                <SelectItem key={key} value={key}>
                  {cfg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ReactQuill
            theme="snow"
            value={form.title}
            onChange={(html) =>
              setForm((p: any) => ({ ...p, title: html }))
            }
          />

          <Input
            placeholder="Sub Title"
            value={form.sub_title}
            onChange={(e) =>
              setForm((p: any) => ({ ...p, sub_title: e.target.value }))
            }
          />

          {/* Dynamic Meta */}
          {form.section_key && (
            <div className="space-y-2">
              {renderDynamicFields(
                form.meta,
                (key: string, value: any) =>
                  setForm((p: any) => ({
                    ...p,
                    meta: { ...p.meta, [key]: value },
                  })),
                form.section_key,
                SECTION_FORM_CONFIG
              )}
            </div>
          )}

          <Input
            type="number"
            placeholder="Sort Order"
            value={form.sort_order}
            onChange={(e) =>
              setForm((p: any) => ({
                ...p,
                sort_order: Number(e.target.value),
              }))
            }
          />

          <div className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <p className="font-medium">Active</p>
              <p className="text-sm text-muted-foreground">
                Show / Hide this section
              </p>
            </div>
            <Switch
              checked={form.is_active}
              onCheckedChange={(val) =>
                setForm((p: any) => ({ ...p, is_active: val }))
              }
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Save Section
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import RichEditor from "@/components/RichEditor";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

/* ================= TYPES ================= */

interface BlogsFormValues {
  title: string;
  description: string;
  badge: string; // ✅ category stored here
  author: string;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  image: File | null;
}

type BlogFormErrors = Partial<Record<keyof BlogsFormValues, string>>;

interface BlogsFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchPages: () => void;
  editingPage: any | null;
  setEditingPage: (page: any | null) => void;
}

/* ================= CONSTANTS ================= */

const categories = [
  "Career Tips",
  "HR Insights",
  "Industry News",
  "Tech Trends",
  "Remote Work",
  "General",
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getImageUrl = (url: string) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
};

const initialFormValues: BlogsFormValues = {
  title: "",
  description: "",
  badge: "",
  author: "",
  metaTitle: null,
  metaDescription: null,
  metaKeywords: null,
  ogTitle: null,
  ogDescription: null,
  ogImage: null,
  image: null,
};

/* ================= COMPONENT ================= */

export default function BlogsFormModal({
  open,
  setOpen,
  fetchPages,
  editingPage,
  setEditingPage,
}: BlogsFormModalProps) {
  const [formValues, setFormValues] =
    useState<BlogsFormValues>(initialFormValues);
  const [errors, setErrors] = useState<BlogFormErrors>({});

  /* ================= EDIT MODE ================= */

  useEffect(() => {
    if (editingPage) {
      setFormValues({
        title: editingPage.title || "",
        description: editingPage.description || "",
        badge: editingPage.badge || "",
        author: editingPage.author || "",
         metaTitle: editingPage.meta_title,
        metaDescription: editingPage.meta_description,
        metaKeywords: editingPage.meta_keywords,
        ogTitle: editingPage.og_title,
        ogDescription: editingPage.og_description,
        ogImage: editingPage.og_image,
        image: null, // file inputs cannot be prefilled
      });
    } else {
      setFormValues(initialFormValues);
    }
  }, [editingPage]);

  /* ================= VALIDATION ================= */

  const validate = () => {
    const newErrors: BlogFormErrors = {};

    if (!formValues.title.trim())
      newErrors.title = "Title is required";

    if (!formValues.description.trim())
      newErrors.description = "Content is required";

    if (!formValues.badge)
      newErrors.badge = "Please select a category";

    if (!editingPage && !formValues.image)
      newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const formData = new FormData();
      formData.append("title", formValues.title);
      formData.append("description", formValues.description);
      formData.append("badge", formValues.badge);
      formData.append("author", "Admin");
       // ✅ SEO fields (camelCase → snake_case)
    if (formValues.metaTitle)
      formData.append("metaTitle", formValues.metaTitle);

    if (formValues.metaDescription)
      formData.append("metaDescription", formValues.metaDescription);

    if (formValues.metaKeywords)
      formData.append("metaKeywords", formValues.metaKeywords);

    if (formValues.ogTitle)
      formData.append("ogTitle", formValues.ogTitle);

    if (formValues.ogDescription)
      formData.append("ogDescription", formValues.ogDescription);

    if (formValues.ogImage)
      formData.append("ogImage", formValues.ogImage);

    if (formValues.image) {
      formData.append("image", formValues.image);
    }

      if (editingPage?.id) {
        await axios.put(
          `${API_BASE_URL}/blogs/${editingPage.id}`,
          formData
        );
        toast.success("Blog updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/blogs`, formData);
        toast.success("Blog created successfully");
      }

      fetchPages();
      setOpen(false);
      setEditingPage(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save blog");
    }
  };

  /* ================= UI ================= */

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-5xl w-full rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingPage ? "Edit Blog" : "Add Blog"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formValues.title}
              onChange={(e) =>
                setFormValues({ ...formValues, title: e.target.value })
              }
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Category (Badge) */}
          <div className="space-y-2">
            <Label>Category</Label>

            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    setFormValues({ ...formValues, badge: cat })
                  }
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    formValues.badge === cat
                      ? "bg-emerald-600 text-white shadow-md scale-105"
                      : "bg-white border text-gray-600 hover:bg-emerald-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {errors.badge && (
              <p className="text-red-500 text-sm">{errors.badge}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2"
          >
            <Label>Content</Label>

              <ReactQuill
  theme="snow"
  value={formValues.description || ""}
  onChange={(html) =>
    setFormValues((prev) => ({
      ...prev,
      description: html === "<p><br></p>" ? "" : html,
    }))
  }
/>
          
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description}
              </p>
            )}
          </div>
                   {/* Meta Title */}
          <div className="space-y-2 w-full">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={formValues.metaTitle || ""}
              onChange={e => setFormValues({ ...formValues, metaTitle: e.target.value })}
            />
            {errors.metaTitle && <p className="text-red-500 text-sm">{errors.metaTitle}</p>}
          </div>

          {/* Meta Description */}
          <div className="space-y-2 w-full">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={formValues.metaDescription || ""}
              onChange={e => setFormValues({ ...formValues, metaDescription: e.target.value })}
              rows={2}
            />
            {errors.metaDescription && <p className="text-red-500 text-sm">{errors.metaDescription}</p>}
          </div>

          {/* OG Title */}
          <div className="space-y-2 w-full">
            <Label htmlFor="ogTitle">OG Title</Label>
            <Input
              id="ogTitle"
              value={formValues.ogTitle || ""}
              onChange={e => setFormValues({ ...formValues, ogTitle: e.target.value })}
            />
            {errors.ogTitle && <p className="text-red-500 text-sm">{errors.ogTitle}</p>}
          </div>

          {/* OG Description */}
          <div className="space-y-2 w-full">
            <Label htmlFor="ogDescription">OG Description</Label>
            <Textarea
              id="ogDescription"
              value={formValues.ogDescription || ""}
              onChange={e => setFormValues({ ...formValues, ogDescription: e.target.value })}
              rows={2}
            />
            {errors.ogDescription && <p className="text-red-500 text-sm">{errors.ogDescription}</p>}
          </div>

          {/* OG Image */}
          <div className="space-y-2 w-full">
            <Label htmlFor="ogImage">OG Image URL</Label>
            <Input
              id="ogImage"
              value={formValues.ogImage || ""}
              onChange={e => setFormValues({ ...formValues, ogImage: e.target.value })}
            />
          </div>



          {/* Image */}
          <div className="space-y-2">
            <Label>Blog Image</Label>

            {editingPage?.image_url && !formValues.image && (
              <img
                src={getImageUrl(editingPage.image_url)}
                alt="Current blog"
                className="h-24 rounded border mb-2"
              />
            )}

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setFormValues({ ...formValues, image: file });
              }}
            />

            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingPage ? "Update Blog" : "Create Blog"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

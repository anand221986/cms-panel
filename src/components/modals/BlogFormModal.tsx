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
import axios from "axios";
import { toast } from "sonner";
import RichEditor from "@/components/RichEditor";

/* ================= TYPES ================= */

interface BlogsFormValues {
  title: string;
  description: string;
  author: string;
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getImageUrl = (url: string) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
};

const initialFormValues: BlogsFormValues = {
  title: "",
  description: "",
  author: "",
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
        author: editingPage.author || "",
        image: null, // ❗ file inputs cannot be pre-filled
      });
    } else {
      setFormValues(initialFormValues);
    }
  }, [editingPage]);

  /* ================= VALIDATION ================= */

  const validate = () => {
    const newErrors: BlogFormErrors = {};

    if (!formValues.title.trim()) newErrors.title = "Title is required";
    if (!formValues.description.trim()) newErrors.description = "Content is required";
    if (!editingPage && !formValues.image) {
      newErrors.image = "Image is required";
    }
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
      formData.append("author", "Admin");
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

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Content */}
          <div className="space-y-2">
            <Label>Content</Label>
            <RichEditor
              value={formValues.description}
              onChange={(value: string) =>
                setFormValues((prev) => ({ ...prev, description: value }))
              }
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Author */}
          {/* <div className="space-y-2">
            <Label>Author</Label>
            <Input
              value={formValues.author}
              onChange={(e) =>
                setFormValues({ ...formValues, author: e.target.value })
              }
            />
            {errors.author && (
              <p className="text-red-500 text-sm">{errors.author}</p>
            )}
          </div> */}

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

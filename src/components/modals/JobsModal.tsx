import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ================================
   Editable Form Fields Only
================================ */
interface JobForm {
  title: string;
  company_name: string;
  location: string;
  employment_type: string;
  work_mode: string;
  description: string;
  salary_min: number | "";
  salary_max: number | "";
  currency: string;
  is_featured: boolean;
}

/* ================================
   Full Job From API (DB Model)
================================ */
interface Job extends JobForm {
  id: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  job?: Job;
}

/* ================================
   Default Form State
================================ */
const defaultForm: JobForm = {
  title: "",
  company_name: "",
  location: "",
  employment_type: "",
  work_mode: "",
  description: "",
  salary_min: "",
  salary_max: "",
  currency: "USD",
  is_featured: false,
};

const JobsModal = ({ open, onClose, onSuccess, job }: Props) => {
  const [form, setForm] = useState<JobForm>(defaultForm);
  const [errors, setErrors] =
    useState<Partial<Record<keyof JobForm, string>>>({});

  /* ================================
     Handle Open / Edit / Reset
  ================================= */
  useEffect(() => {
    if (!open) return;

    if (job) {
      const { id, created_at, updated_at, ...editableFields } = job;

      setForm({
        ...editableFields,
        salary_min: editableFields.salary_min ?? "",
        salary_max: editableFields.salary_max ?? "",
      });
    } else {
      setForm(defaultForm);
    }

    setErrors({});
  }, [job, open]);

  /* ================================
     Validation
  ================================= */
  const validate = () => {
    const newErrors: Partial<Record<keyof JobForm, string>> = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.company_name.trim())
      newErrors.company_name = "Company name is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.employment_type)
      newErrors.employment_type = "Employment type is required";
    if (!form.work_mode)
      newErrors.work_mode = "Work mode is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";

    if (form.salary_min === "")
      newErrors.salary_min = "Minimum salary is required";

    if (form.salary_max === "")
      newErrors.salary_max = "Maximum salary is required";

    if (
      form.salary_min !== "" &&
      form.salary_max !== "" &&
      form.salary_min > form.salary_max
    ) {
      newErrors.salary_max =
        "Maximum salary must be greater than minimum salary";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================================
     Close Handler
  ================================= */
  const handleClose = () => {
    setForm(defaultForm);
    setErrors({});
    onClose();
  };

  /* ================================
     Submit Handler
  ================================= */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const isEdit = Boolean(job?.id);

      const url = isEdit
        ? `${API_BASE_URL}/jobs/${job!.id}`
        : `${API_BASE_URL}/jobs`;

      const method = isEdit ? axios.put : axios.post;

      await method(url, form);

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="relative bg-white p-6 rounded w-[600px] space-y-3">

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold">
          {job ? "Edit Job" : "Add Job"}
        </h2>

        {/* Title */}
        <div>
          <input
            placeholder="Job Title"
            className="w-full border p-2"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <input
            placeholder="Company Name"
            className="w-full border p-2"
            value={form.company_name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                company_name: e.target.value,
              }))
            }
          />
          {errors.company_name && (
            <p className="text-red-500 text-sm">
              {errors.company_name}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <input
            placeholder="Location"
            className="w-full border p-2"
            value={form.location}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, location: e.target.value }))
            }
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
        </div>

        {/* Employment Type */}
        <select
          className="w-full border p-2"
          value={form.employment_type}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              employment_type: e.target.value,
            }))
          }
        >
          <option value="">Select Employment Type</option>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
          <option value="contract">Contract</option>
        </select>

        {/* Work Mode */}
        <select
          className="w-full border p-2"
          value={form.work_mode}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              work_mode: e.target.value,
            }))
          }
        >
          <option value="">Select Work Mode</option>
          <option value="remote">Remote</option>
          <option value="onsite">Onsite</option>
          <option value="hybrid">Hybrid</option>
        </select>

        {/* Salary */}
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Minimum Salary"
            className="w-full border p-2"
            value={form.salary_min}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                salary_min:
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value),
              }))
            }
          />

          <input
            type="number"
            placeholder="Maximum Salary"
            className="w-full border p-2"
            value={form.salary_max}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                salary_max:
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value),
              }))
            }
          />
        </div>

        {/* Description */}
        <textarea
          placeholder="Job Description"
          className="w-full border p-2"
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />

        {/* Featured */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                is_featured: e.target.checked,
              }))
            }
          />
          <label>Featured Job</label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {job ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobsModal;
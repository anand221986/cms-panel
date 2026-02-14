import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import JobsModal from "@/components/modals/JobsModal";
import JobsViewTable from "@/components/JobsViewTable";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* =========================
   Interfaces
========================= */

interface Job {
  id: number;
  title: string;
  company_name: string;
  location: string;
  employment_type: string;
  work_mode: string;
  description: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  is_featured: boolean;
  skills: string | null;
  created_at: string;
  updated_at: string;
}

interface JobApiResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
}

/* =========================
   Component
========================= */

const JobsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const response = await axios.get<JobApiResponse>(
        `${API_BASE_URL}/jobs`
      );

      setJobs(response.data.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800">
            Jobs Management
          </h1>

          <button
            onClick={() => {
              setSelectedJob(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Add Job
          </button>
        </div>

        {/* Table */}
        <JobsViewTable
          loading={loading}
          jobs={jobs}
          fetchJobs={fetchJobs}
          onEdit={(job: Job) => {
            setSelectedJob(job);
            setIsModalOpen(true);
          }}
        />

        {/* Modal */}
        <JobsModal
          open={isModalOpen}
          job={selectedJob}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchJobs();
          }}
        />
      </div>
    </Layout>
  );
};

export default JobsPage;
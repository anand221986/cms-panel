import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ===============================
   Updated Job Interface
================================= */

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

interface Props {
  jobs: Job[];
  loading: boolean;
  fetchJobs: () => void;
  onEdit: (job: Job) => void;
}

export default function JobsViewTable({
  jobs,
  loading,
  fetchJobs,
  onEdit,
}: Props) {
  const [localJobs, setLocalJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const itemsPerPage = 10;

  useEffect(() => {
    setLocalJobs(Array.isArray(jobs) ? jobs : []);
  }, [jobs]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return localJobs.slice(start, start + itemsPerPage);
  }, [localJobs, currentPage]);

  const totalPages = Math.ceil(localJobs.length / itemsPerPage);

  const allSelected =
    paginated.length > 0 &&
    paginated.every((j) => selected.has(j.id));

  const toggleAll = () => {
    if (allSelected) {
      const next = new Set(selected);
      paginated.forEach((j) => next.delete(j.id));
      setSelected(next);
    } else {
      setSelected(
        (prev) => new Set([...prev, ...paginated.map((j) => j.id)])
      );
    }
  };

  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const deleteJob = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/jobs/${id}`);
      toast.success("Job deleted successfully");
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete job");
    }
  };

  return (
    <div className="space-y-4 max-w-[95vw]">
      <Card className="border-0 bg-white/60 shadow-sm backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white/90 backdrop-blur-sm">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6">
                      No Jobs Found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.has(job.id)}
                          onCheckedChange={() => toggleOne(job.id)}
                        />
                      </TableCell>

                      <TableCell className="font-medium">
                        {job.title}
                      </TableCell>

                      <TableCell>{job.company_name}</TableCell>

                      <TableCell>{job.location}</TableCell>

                      <TableCell>
                        {job.employment_type} / {job.work_mode}
                      </TableCell>

                      <TableCell>
                        {job.salary_min} - {job.salary_max} {job.currency}
                      </TableCell>

                      <TableCell>
                        {job.is_featured ? "Yes" : "No"}
                      </TableCell>

                      <TableCell>
                        {new Date(
                          job.created_at
                        ).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(job)}
                        >
                          <Edit className="w-3 h-3 mr-1" /> Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                          onClick={() => deleteJob(job.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <CardContent className="flex justify-center gap-2 py-4">
          <Button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((p) => Math.max(1, p - 1))
            }
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <Button
                key={pageNum}
                variant={
                  currentPage === pageNum
                    ? "default"
                    : "outline"
                }
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            )
          )}

          <Button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
          >
            Next
          </Button>
        </CardContent>
      )}
    </div>
  );
}
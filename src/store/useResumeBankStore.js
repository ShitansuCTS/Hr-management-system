import { create } from "zustand";

const fallbackResumeBankData = [
  {
    id: 94,
    name: "Rohit Singh Yadav",
    email: "rohitsy5858@gmail.com",
    phone: "7000766595",
    subject:
      "Applying for <strong style=\"color:#0d6efd;\">Full Stack Developer</strong> <span style=\"display:inline-block;padding:2px 8px;background:#e7f1ff;color:#0d6efd;border-radius:12px;font-size:12px;font-weight:600;\">Software & Development</span>",
    attachment: "resume-20260728-234053.pdf",
    place: "Main Website(Career): https://crushaderstech.com/career",
    agree: "yes",
    updated_at: "2026-07-28 23:40:53",
    status_id: 1,
    remark_id: null,
    custom_remark: null,
    job_position: "Full Stack Developer",
    department: "Software & Development",
    status_name: "Applied",
    remark_name: null,
    resume_url: "https://crushaderstech.com/assets/img/resume/resume-20260728-234053.pdf",
  },
  {
    id: 95,
    name: "Aisha Khan",
    email: "aisha.khan@example.com",
    phone: "9876543210",
    subject:
      "Applying for <strong style=\"color:#0d6efd;\">Frontend Developer</strong> <span style=\"display:inline-block;padding:2px 8px;background:#e7f1ff;color:#0d6efd;border-radius:12px;font-size:12px;font-weight:600;\">Design & Product</span>",
    attachment: "resume-20260729-101530.pdf",
    place: "LinkedIn: https://linkedin.com/jobs",
    agree: "yes",
    updated_at: "2026-07-29 10:15:30",
    status_id: 2,
    remark_id: null,
    custom_remark: null,
    job_position: "Frontend Developer",
    department: "Design & Product",
    status_name: "Reviewed",
    remark_name: null,
    resume_url: "https://crushaderstech.com/assets/img/resume/resume-20260729-101530.pdf",
  },
];

export const useResumeBankStore = create((set, get) => ({
  resumeData: fallbackResumeBankData,
  loading: false,
  hasFetched: false,

  fetchResumeData: async (force = false) => {
    if (!force && get().hasFetched) return;

    set({ loading: true });

    const API_KEY = process.env.NEXT_PUBLIC_API_KEY || process.env.API_KEY;

    if (!API_KEY) {
      console.warn("Resume API key is missing. Add NEXT_PUBLIC_API_KEY to your .env file.");
      set({ loading: false, resumeData: fallbackResumeBankData });
      return;
    }

    try {
      const response = await fetch(
        `https://crushaderstech.com/career-api/api.php?action=get_careers&api_key=${API_KEY}`,
        {
          headers: {
            "X-API-Key": API_KEY,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`Resume API request failed: ${response.status}`);
      }

      const payload = await response.json();
      const data = Array.isArray(payload?.data?.data)
        ? payload.data.data
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

      set({
        resumeData: data.length ? data : fallbackResumeBankData,
        loading: false,
        hasFetched: true,
      });
    } catch (error) {
      console.error("Error fetching resume data:", error);
      set({
        resumeData: fallbackResumeBankData,
        loading: false,
        hasFetched: true,
      });
    }
  },

  clearResumeData: () =>
    set({
      resumeData: [],
      hasFetched: false,
    }),
}));

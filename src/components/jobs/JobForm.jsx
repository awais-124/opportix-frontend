import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../../lib/api.js";
import styles from "./JobForm.module.css";

const jobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  companyName: z.string().min(2, "Company name is required").max(200),
  category: z.string().regex(/^\d+$/, "Select a category"),
  location: z.string().min(2, "Location is required").max(255),
  salaryRange: z.string().optional().or(z.literal("")),
  duration: z.enum(["full_time", "part_time", "contract", "internship"], {
    errorMap: () => ({ message: "Select a duration" }),
  }),
  type: z.enum(["remote", "onsite", "hybrid"], {
    errorMap: () => ({ message: "Select a job type" }),
  }),
  description: z.string().min(20, "Description must be at least 20 characters"),
  requirements: z.string().min(20, "Requirements must be at least 20 characters"),
  department: z.string().min(2, "Department is required").max(255),
  experience: z.enum(["entry_level", "mid_level", "senior_level", "expert_level"], {
    errorMap: () => ({ message: "Select an experience level" }),
  }),
  skills: z.string().optional().or(z.literal("")),
});

export default function JobForm({ initialData, onSubmit, isSubmitting }) {
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: initialData
      ? {
          title: initialData.title || "",
          companyName: initialData.companyName || "",
          category: String(initialData.category || ""),
          location: initialData.location || "",
          salaryRange: initialData.salaryRange || "",
          duration: initialData.duration || "",
          type: initialData.type || "",
          description: initialData.description || "",
          requirements: initialData.requirements || "",
          department: initialData.department || "",
          experience: initialData.experience || "",
          skills: initialData.skills || "",
        }
      : {
          title: "",
          companyName: "",
          category: "",
          location: "",
          salaryRange: "",
          duration: "",
          type: "",
          description: "",
          requirements: "",
          department: "",
          experience: "",
          skills: "",
        },
  });

  useEffect(() => {
    api
      .get("/categories")
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setCatLoading(false));
  }, []);

  if (catLoading) {
    return (
      <div className={styles.skeletonForm}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`${styles.skel} ${styles.skelRow}`} />
        ))}
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>Basic Information</legend>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Job Title</label>
            <input className={`${styles.input} ${errors.title ? styles.inputError : ""}`} {...register("title")} />
            {errors.title && <span className={styles.fieldError}>{errors.title.message}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Department</label>
            <input className={`${styles.input} ${errors.department ? styles.inputError : ""}`} {...register("department")} />
            {errors.department && <span className={styles.fieldError}>{errors.department.message}</span>}
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Company Name</label>
          <input className={`${styles.input} ${errors.companyName ? styles.inputError : ""}`} {...register("companyName")} />
          {errors.companyName && <span className={styles.fieldError}>{errors.companyName.message}</span>}
        </div>
      </fieldset>

      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>Description</legend>
        <div className={styles.field}>
          <label className={styles.label}>Job Description</label>
          <textarea className={`${styles.textarea} ${errors.description ? styles.inputError : ""}`} rows="5" {...register("description")} />
          {errors.description && <span className={styles.fieldError}>{errors.description.message}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Requirements</label>
          <textarea className={`${styles.textarea} ${errors.requirements ? styles.inputError : ""}`} rows="5" {...register("requirements")} />
          {errors.requirements && <span className={styles.fieldError}>{errors.requirements.message}</span>}
        </div>
      </fieldset>

      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>Classification</legend>
        <div className={styles.field}>
          <label className={styles.label}>Category</label>
          <select className={`${styles.select} ${errors.category ? styles.inputError : ""}`} {...register("category")}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.title}</option>
            ))}
          </select>
          {categories.length === 0 && !catLoading && (
            <span className={styles.fieldError}>No categories available. Contact admin.</span>
          )}
          {errors.category && <span className={styles.fieldError}>{errors.category.message}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Job Type</label>
          <div className={styles.radioGroup}>
            {[
              { value: "remote", label: "Remote" },
              { value: "onsite", label: "On-site" },
              { value: "hybrid", label: "Hybrid" },
            ].map((opt) => (
              <label key={opt.value} className={`${styles.radio} ${styles.radioBtn}`}>
                <input type="radio" value={opt.value} {...register("type")} />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.type && <span className={styles.fieldError}>{errors.type.message}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Duration</label>
          <div className={styles.radioGroup}>
            {[
              { value: "full_time", label: "Full-time" },
              { value: "part_time", label: "Part-time" },
              { value: "contract", label: "Contract" },
              { value: "internship", label: "Internship" },
            ].map((opt) => (
              <label key={opt.value} className={`${styles.radio} ${styles.radioBtn}`}>
                <input type="radio" value={opt.value} {...register("duration")} />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.duration && <span className={styles.fieldError}>{errors.duration.message}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Experience Level</label>
          <div className={styles.radioGroup}>
            {[
              { value: "entry_level", label: "Entry Level" },
              { value: "mid_level", label: "Mid Level" },
              { value: "senior_level", label: "Senior" },
              { value: "expert_level", label: "Expert" },
            ].map((opt) => (
              <label key={opt.value} className={`${styles.radio} ${styles.radioBtn}`}>
                <input type="radio" value={opt.value} {...register("experience")} />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.experience && <span className={styles.fieldError}>{errors.experience.message}</span>}
        </div>
      </fieldset>

      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>Location & Compensation</legend>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Location</label>
            <input className={`${styles.input} ${errors.location ? styles.inputError : ""}`} {...register("location")} />
            {errors.location && <span className={styles.fieldError}>{errors.location.message}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Salary Range (optional)</label>
            <input className={styles.input} placeholder="e.g. PKR 80,000 - 120,000" {...register("salaryRange")} />
          </div>
        </div>
      </fieldset>

      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>Skills</legend>
        <div className={styles.field}>
          <label className={styles.label}>Skills (comma-separated)</label>
          <input className={styles.input} placeholder="e.g. Java, React, PostgreSQL" {...register("skills")} />
          <span className={styles.hint}>Separate skills with commas</span>
        </div>
      </fieldset>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Job" : "Post Job"}
        </button>
      </div>
    </form>
  );
}

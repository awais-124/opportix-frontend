import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import styles from "./HomePage.module.css";

const ROTATING_IMAGES = [
  { src: "/assets/images/hiring.png", alt: "Hiring" },
  { src: "/assets/images/laptop.png", alt: "Remote work" },
  { src: "/assets/images/apply.png", alt: "Job application" },
];

const STATS_DATA = [
  { number: "10,000+", label: "Active Jobs" },
  { number: "5,000+", label: "Companies" },
  { number: "1M+", label: "Job Seekers" },
];

const COMPANIES = [
  { name: "amazon", title: "AMAZON", logo: "amazon-prime-video.png" },
  { name: "discord", title: "DISCORD", logo: "discord.png" },
  { name: "github", title: "GITHUB", logo: "github.png" },
  { name: "hbo-max", title: "HBO", logo: "hbo-max.png" },
  { name: "riot-games", title: "RIOT", logo: "riot-games.png" },
  { name: "disney-plus", title: "DISNEY", logo: "disney-plus.png" },
  { name: "electronic-arts", title: "ELECTRONIC ARTS", logo: "electronic-arts.png" },
  { name: "tiktok", title: "TIKTOK", logo: "tiktok.png" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, featured, testis] = await Promise.all([
          api.get("/categories"),
          api.get("/featured-jobs"),
          api.get("/testimonials"),
        ]);
        setCategories(Array.isArray(cats) ? cats : []);
        setFeaturedJobs(Array.isArray(featured) ? featured : []);
        const allTestis = Array.isArray(testis) ? testis : [];
        const shuffled = allTestis.sort(() => Math.random() - 0.5);
        setTestimonials(shuffled.slice(0, 3));
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className={styles.homepage}>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Find your dream job now</h1>
          <p className={styles.heroSubtitle}>Kickstart your career journey with Opportix</p>
          <form className={styles.searchBox} onSubmit={handleSearch}>
            <div className={styles.searchInputWrap}>
              <img src="/assets/icons/search.png" alt="search-icon" className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.searchBtn}>Search</button>
          </form>
        </div>

        <div className={styles.animationContainer}>
          <div className={styles.rotatingCircle}>
            {ROTATING_IMAGES.map((img, i) => (
              <div key={i} className={styles.imageContainer} style={{ animationDelay: `${-i * 2.67}s` }}>
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className={styles.categories}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Popular Job Categories</h2>
          <div className={styles.categoriesGrid}>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`${styles.categoryCard} ${styles.skeletonCard}`}>
                  <div className={styles.skeletonLine} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
                </div>
              ))
            ) : categories.filter(cat => (cat.numberOfJobs ?? cat._count?.jobs ?? 0) > 0).length === 0 ? (
              <p className={styles.emptyText}>No categories available</p>
            ) : (
              categories
                .filter(cat => (cat.numberOfJobs ?? cat._count?.jobs ?? 0) > 0)
                .map((cat) => (
                  <Link key={cat.id} to={`/jobs?category=${cat.id}`} className={styles.categoryCard}>
                    <div className={styles.categoryInfo}>
                      <span className={styles.categoryName}>{cat.title}</span>
                      <span className={styles.jobCount}>{(cat.numberOfJobs ?? cat._count?.jobs ?? 0)} jobs</span>
                    </div>
                    <span className={styles.categoryArrow}>→</span>
                  </Link>
                ))
            )}
          </div>
        </div>
      </section>

      {/* ============ FEATURED JOBS ============ */}
      <section className={styles.featuredJobs} id="jobs-section">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Featured Jobs</h2>
          <div className={styles.jobsGrid}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.jobCard}>
                  <div className={styles.jobCardHeader}>
                    <div className={styles.skeletonLine} />
                  </div>
                  <div className={styles.jobCardBody}>
                    <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
                    <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
                    <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
                  </div>
                </div>
              ))
            ) : featuredJobs.length === 0 ? (
              <p className={styles.emptyText}>No featured jobs at the moment</p>
            ) : (
              featuredJobs.map((fj) => (
                <div key={fj.id} className={styles.jobCard}>
                  <div className={styles.jobCardHeader}>
                    <h3 className={styles.jobTitle}>{fj.job?.title || "Untitled Position"}</h3>
                  </div>
                  <div className={styles.jobCardBody}>
                    <p className={styles.jobDetail}>{fj.job?.companyName || "Unknown Company"}</p>
                    <p className={styles.jobDetail}>{fj.job?.location || "Location not specified"}</p>
                    <p className={styles.jobDetail}>
                      {fj.job?.salaryRange || "Salary not disclosed"} &bull; {fj.job?.duration?.replace("_", "-") || "N/A"}
                    </p>
                    <a
                      href="#"
                      className={styles.viewJob}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedJob(fj.job);
                      }}
                    >
                      View Details →
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ============ FEATURED JOB DETAILS MODAL ============ */}
      {selectedJob && (
        <div className={styles.modal} onClick={() => setSelectedJob(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={styles.close} onClick={() => setSelectedJob(null)}>&times;</span>
            <div id="modal-job-details" className={styles.modalJobDetails}>
              <h2>{selectedJob.title}</h2>
              <p><strong>Company:</strong> {selectedJob.companyName}</p>
              <p><strong>Location:</strong> {selectedJob.location}</p>
              <p><strong>Salary:</strong> {selectedJob.salaryRange || "Not disclosed"}</p>
              <p><strong>Type:</strong> {selectedJob.type}</p>
              <p><strong>Duration:</strong> {selectedJob.duration?.replace("_", "-")}</p>
              <p><strong>Posted On:</strong> {new Date(selectedJob.datePosted).toLocaleDateString()}</p>
              <p><strong>Description:</strong> {selectedJob.description}</p>
              <p><strong>Requirements:</strong> {selectedJob.requirements}</p>
              <p><strong>Skills:</strong> {selectedJob.skills || "N/A"}</p>
              <p><strong>Experience:</strong> {selectedJob.experience?.replace("_", "-")}</p>
              <p><strong>Department:</strong> {selectedJob.department}</p>
              <button 
                className={styles.applyButton} 
                onClick={() => {
                  setSelectedJob(null);
                  navigate(`/jobs/${selectedJob.id}/apply`);
                }}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ STATS ============ */}
      <section className={styles.statistics}>
        <div className={styles.container}>
          <div className={styles.statsFlex}>
            {STATS_DATA.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What Our Users Say</h2>
          {loading ? (
            <div className={styles.testimonialsGrid}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.testimonialCard}>
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLine} />
                </div>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <p className={styles.emptyText}>No testimonials available</p>
          ) : (
            <div className={styles.testimonialsGrid}>
              {testimonials.map((t, i) => (
                <div key={t.id} className={`${styles.testimonialCard} ${i === 1 ? styles.accent : ""}`}>
                  <div className={styles.quoteIcon} aria-hidden="true">"</div>
                  <p className={styles.testimonialText}>
                    {t.review || "Great platform for finding job opportunities!"}
                  </p>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.authorImg}>
                      <img src={`/assets/images/${t.image}`} alt={t.name || "User testimonial"} />
                    </div>
                    <div className={styles.authorInfo}>
                      <h4 className={styles.authorName}>{t.name || "Anonymous"}</h4>
                      <p className={styles.authorRole}>{t.occupation || "User"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ COMPANIES ============ */}
      <section className={styles.companies}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Top Companies Hiring</h2>
          <div className={styles.companiesGrid}>
            {COMPANIES.map((company) => (
              <div key={company.name} className={styles.companyLogo} title={company.title}>
                <img src={`/assets/logos/${company.logo}`} alt="company-logo" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

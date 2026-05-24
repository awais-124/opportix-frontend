import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        // Delay slightly to ensure rendering is complete
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div className={styles.aboutPage}>
      {/* Hero Banner */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>About Opportix</h1>
          <p className={styles.heroSubtitle}>
            Bridging the gap between brilliant minds and industry leading opportunities.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h2 className={styles.cardTitle}>Our Mission</h2>
              <p className={styles.cardText}>
                To empower individuals globally by connecting them with fulfilling careers, and to help businesses thrive by matching them with the perfect talent.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h2 className={styles.cardTitle}>Our Vision</h2>
              <p className={styles.cardText}>
                A future where job search is seamless, transparent, and equitable, enabling every professional to find their true path and potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.contactSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Get In Touch</h2>
          <p className={styles.sectionSubtitle}>
            Have questions or feedback? We would love to hear from you.
          </p>

          <div className={styles.contactLayout}>
            {/* Contact Details */}
            <div className={styles.contactInfo}>
              <div className={styles.infoBlock}>
                <div className={styles.infoIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <h4 className={styles.infoTitle}>Email Us</h4>
                  <p className={styles.infoText}>support@opportix.com</p>
                </div>
              </div>

              <div className={styles.infoBlock}>
                <div className={styles.infoIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <h4 className={styles.infoTitle}>Call Us</h4>
                  <p className={styles.infoText}>+1 (555) 019-2834</p>
                </div>
              </div>

              <div className={styles.infoBlock}>
                <div className={styles.infoIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <h4 className={styles.infoTitle}>Visit Us</h4>
                  <p className={styles.infoText}>100 Tech Venture Way, San Francisco, CA</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={styles.contactFormContainer}>
              {submitted ? (
                <div className={styles.successMessage}>
                  <svg className={styles.successIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <h3>Thank you for reaching out!</h3>
                  <p>Our team will get back to you as soon as possible.</p>
                  <button onClick={() => setSubmitted(false)} className={styles.resetBtn}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.contactForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="Your Name"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="How can we help?"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      className={styles.textarea}
                      placeholder="Write your message here..."
                      rows="5"
                    />
                  </div>
                  <button type="submit" className={styles.submitBtn}>
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

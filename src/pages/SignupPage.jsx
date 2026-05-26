import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { signupSchema } from "../lib/auth.schema.js";
import { ApiError } from "../lib/api.js";
import Logo from "../components/common/Logo.jsx";
import Toast from "../components/common/Toast.jsx";

const slides = [
  {
    title: "Opportix",
    tagline: "Connect with your future.",
    description: "The modern standard for high-growth teams and tech-savvy talent. Precision alignment for your next career move.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  {
    title: "Precision Matching",
    tagline: "Empowering career growth.",
    description: "Our intelligent matching algorithms bridge the gap between ambitious developers and industry-leading technology teams.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="22" y1="12" x2="18" y2="12" />
        <line x1="6" y1="12" x2="2" y2="12" />
        <line x1="12" y1="6" x2="12" y2="2" />
        <line x1="12" y1="22" x2="12" y2="18" />
      </svg>
    )
  },
  {
    title: "Elite Opportunities",
    tagline: "Scale your engineering team.",
    description: "Discover verified talent, filter candidates based on verified skills, and streamline your recruitment workflow from start to finish.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    )
  }
];

export default function SignupPage() {
  const { signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      linkedIn: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "applicant",
    },
  });

  const role = watch("role");

  async function onSubmit(data) {
    setServerError("");
    setSubmitting(true);
    try {
      const fullname = `${data.firstName} ${data.lastName}`.trim();
      await signUp({
        email: data.email,
        password: data.password,
        fullname,
        username: data.username,
        phone: data.phone,
        role: data.role,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setServerError(
            err.details?.email
              ? "This email is already registered."
              : err.details?.username
                ? "This username is already taken."
                : err.message === "Unique constraint violation"
                  ? "This email or username is already registered."
                  : err.message
          );
        } else {
          setServerError(err.message || "Something went wrong.");
        }
      } else {
        setServerError("Connection error. Make sure the server is running.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="auth-page bg-grid-pattern">
        <div className="auth-card">
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ fontWeight: 600, color: "#475569" }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="auth-page bg-grid-pattern">
        <div className="auth-card">
          <div className="auth-card-header">
            <h3 className="auth-card-title">Already Signed In</h3>
            <p className="auth-card-subtitle">
              You are already signed in as <strong>{user.fullname}</strong>.
            </p>
          </div>
          <Link to="/dashboard" className="btn-indigo-submit" style={{ textAlign: "center", textDecoration: "none", marginTop: 20 }}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      {serverError && (
        <Toast
          message={serverError}
          type="error"
          onClose={() => setServerError("")}
        />
      )}

      {/* Left Section (Form Area) */}
      <div className="register-left-col bg-grid-pattern">
        {/* Header Bar */}
        <header className="register-header-bar">
          <Logo size="medium" />
          <Link to="/auth" className="register-signin-link">
            Already have an account? <span>Sign In</span>
          </Link>
        </header>

        {/* Main Content Area */}
        <div className="register-form-container">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            
            {/* STEP 1: Choose Role */}
            <div className={step === 1 ? "signup-step-active" : "signup-step-hidden"}>
              <h2 className="register-hero-title">Create your account</h2>
              <p className="register-hero-subtitle">
                Join the next generation of professional talent acquisition.
              </p>

              <div className="role-section-wrapper">
                <span className="role-section-label">Choose your path</span>
                
                <div className="role-cards-grid">
                  <label className="role-card-label">
                    <input
                      type="radio"
                      value="applicant"
                      className="role-card-input"
                      disabled={submitting}
                      {...register("role")}
                    />
                    <div className="role-card-inner">
                      <div className="role-card-icon-container">
                        <img src="/assets/icons/user-avatar.png" alt="Job Seeker" className="role-card-icon" />
                      </div>
                      <div>
                        <h4 className="role-card-title">Job Seeker</h4>
                        <p className="role-card-desc">I want to find a new career path</p>
                      </div>
                    </div>
                  </label>

                  <label className="role-card-label">
                    <input
                      type="radio"
                      value="employer"
                      className="role-card-input"
                      disabled={submitting}
                      {...register("role")}
                    />
                    <div className="role-card-inner">
                      <div className="role-card-icon-container">
                        <img src="/assets/icons/building.png" alt="Employer" className="role-card-icon" />
                      </div>
                      <div>
                        <h4 className="role-card-title">Employer</h4>
                        <p className="role-card-desc">I want to hire elite talent</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="register-action-wrapper">
                <button
                  type="button"
                  className="btn-indigo-register"
                  onClick={() => setStep(2)}
                >
                  Continue
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "middle", marginLeft: "4px" }}>
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>

            {/* STEP 2: Fill Details */}
            <div className={step === 2 ? "signup-step-active" : "signup-step-hidden"}>
              <div className="signup-step2-header">
                <button
                  type="button"
                  className="btn-back-text"
                  onClick={() => setStep(1)}
                  disabled={submitting}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }}>
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Back to role selection
                </button>
                <div className="signup-role-badge">
                  Signing up as <span>{role === "employer" ? "Employer" : "Job Seeker"}</span>
                </div>
              </div>

              <h2 className="register-hero-title">Complete your profile</h2>
              <p className="register-hero-subtitle">
                Enter your credentials to set up your Opportix account.
              </p>



              <div className="signup-fields-grid">
                <div className="signup-input-group">
                  <label htmlFor="firstName" className="signup-input-label">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="e.g. John"
                    disabled={submitting}
                    className={`signup-input ${errors.firstName ? "input-error" : ""}`}
                    {...register("firstName")}
                  />
                  {errors.firstName && <span className="signup-field-error">{errors.firstName.message}</span>}
                </div>

                <div className="signup-input-group">
                  <label htmlFor="lastName" className="signup-input-label">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="e.g. Doe"
                    disabled={submitting}
                    className={`signup-input ${errors.lastName ? "input-error" : ""}`}
                    {...register("lastName")}
                  />
                  {errors.lastName && <span className="signup-field-error">{errors.lastName.message}</span>}
                </div>

                <div className="signup-input-group">
                  <label htmlFor="reg-username" className="signup-input-label">Username</label>
                  <input
                    id="reg-username"
                    type="text"
                    placeholder="e.g. johndoe123"
                    disabled={submitting}
                    className={`signup-input ${errors.username ? "input-error" : ""}`}
                    {...register("username")}
                  />
                  {errors.username && <span className="signup-field-error">{errors.username.message}</span>}
                </div>

                <div className="signup-input-group">
                  <label htmlFor="phone" className="signup-input-label">Phone Number</label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="e.g. 03001234567"
                    disabled={submitting}
                    className={`signup-input ${errors.phone ? "input-error" : ""}`}
                    {...register("phone")}
                  />
                  {errors.phone && <span className="signup-field-error">{errors.phone.message}</span>}
                </div>

                <div className="signup-input-group signup-full-width">
                  <label htmlFor="reg-email" className="signup-input-label">Email Address</label>
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="e.g. john@example.com"
                    disabled={submitting}
                    className={`signup-input ${errors.email ? "input-error" : ""}`}
                    {...register("email")}
                  />
                  {errors.email && <span className="signup-field-error">{errors.email.message}</span>}
                </div>

                <div className="signup-input-group signup-full-width">
                  <label htmlFor="linkedIn" className="signup-input-label">LinkedIn Username (Optional)</label>
                  <input
                    id="linkedIn"
                    type="text"
                    placeholder="e.g. john-doe-profile"
                    disabled={submitting}
                    className="signup-input"
                    {...register("linkedIn")}
                  />
                </div>

                <div className="signup-input-group">
                  <label htmlFor="reg-password" className="signup-input-label">Password</label>
                  <input
                    id="reg-password"
                    type="password"
                    placeholder="At least 8 characters"
                    disabled={submitting}
                    className={`signup-input ${errors.password ? "input-error" : ""}`}
                    {...register("password")}
                  />
                  {errors.password && <span className="signup-field-error">{errors.password.message}</span>}
                </div>

                <div className="signup-input-group">
                  <label htmlFor="confirmPassword" className="signup-input-label">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    disabled={submitting}
                    className={`signup-input ${errors.confirmPassword ? "input-error" : ""}`}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && <span className="signup-field-error">{errors.confirmPassword.message}</span>}
                </div>
              </div>

              <div className="register-action-wrapper" style={{ marginTop: "24px" }}>
                <button type="submit" className="btn-indigo-register" disabled={submitting}>
                  {submitting ? "Please wait..." : (
                    <>
                      Register Account
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "middle", marginLeft: "4px" }}>
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>

          <div className="register-bottom-nav">
            Already have an account?
            <Link to="/auth">Sign In</Link>
          </div>
        </div>
      </div>

      {/* Right Section (Brand Promo Panel) */}
      <div className="register-right-col">
        {/* Dashed concentric circles background */}
        <div className="promo-circles-pattern">
          <div className="promo-circle promo-circle-1">
            <div className="promo-node" style={{ top: "10%", left: "80%" }} />
          </div>
          <div className="promo-circle promo-circle-2">
            <div className="promo-node" style={{ top: "75%", left: "15%" }} />
          </div>
          <div className="promo-circle promo-circle-3">
            <div className="promo-node" style={{ top: "30%", left: "5%" }} />
            <div className="promo-node" style={{ top: "85%", left: "70%" }} />
          </div>
        </div>

        {/* Glassmorphic Promo Card */}
        <div className="promo-glass-card">
          <div className="promo-slide-wrapper">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`promo-slide-content ${idx === activeSlide ? "slide-active" : "slide-inactive"}`}
              >
                {/* Wireframe grayscale placeholder */}
                <div className="promo-image-box">
                  <div className="promo-image-box-text">
                    {slide.icon}
                    <span>[ Placeholder Image ]</span>
                  </div>
                </div>

                <div className="promo-brand">{slide.title}</div>
                <h3 className="promo-tagline">{slide.tagline}</h3>
                <p className="promo-description">{slide.description}</p>
              </div>
            ))}
          </div>

          {/* Carousel dots indicators */}
          <div className="promo-indicators">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`promo-indicator-dot ${idx === activeSlide ? "active" : ""}`}
                onClick={() => setActiveSlide(idx)}
                style={{ border: "none", cursor: "pointer", padding: 0 }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
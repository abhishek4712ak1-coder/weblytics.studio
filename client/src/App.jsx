import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronRight,
  Code2,
  Database,
  Globe,

  Mail,
  Menu,
  MessageCircle,
  Play,
  Sparkles,
  TrendingUp

} from "lucide-react";

import { FaInstagram, FaYoutube } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [mobileMenu, setMobileMenu] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Web Development",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setFormMessage("");
    setFormError("");

    try {
      const response = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit enquiry.");
      }

      setFormMessage(
        "Thank you! Your enquiry has been submitted successfully."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "Web Development",
        message: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);

      setFormError(
        "Unable to submit your enquiry. Please try again or contact us directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMobileMenu(false);
  };

  const services = [
    {
      icon: Code2,
      title: "Web Development",
      description:
        "Modern, responsive and scalable websites and web applications for businesses, startups and creators.",
      features: [
        "Business Websites",
        "MERN Applications",
        "Admin Panels",
        "E-commerce Solutions",
      ],
    },
    {
      icon: Bot,
      title: "AI & Automation",
      description:
        "Automate repetitive work and build intelligent systems that save time and improve productivity.",
      features: [
        "AI Chatbots",
        "Workflow Automation",
        "Social Media Automation",
        "AI-powered Applications",
      ],
    },
    {
      icon: BarChart3,
      title: "Data Analytics",
      description:
        "Turn raw business data into useful dashboards, reports and insights that support better decisions.",
      features: [
        "Business Dashboards",
        "Data Visualization",
        "Excel Reports",
        "Performance Analytics",
      ],
    },
  ];

  const projects = [
    {
      number: "01",
      title: "Business Management System",
      category: "Web Application",
      description:
        "A complete management platform with dashboards, role-based access and database integration.",
      tech: ["React", "Node.js", "MongoDB"],
    },
    {
      number: "02",
      title: "AI Automation Platform",
      category: "AI & Automation",
      description:
        "An intelligent automation workflow designed to reduce repetitive business tasks.",
      tech: ["AI", "Automation", "APIs"],
    },
    {
      number: "03",
      title: "Analytics Dashboard",
      category: "Data Analytics",
      description:
        "Interactive business dashboard providing clear performance metrics and actionable insights.",
      tech: ["React", "Charts", "Analytics"],
    },
  ];

  const pricing = [
    {
      name: "Starter",
      price: "₹1,999",
      description: "Perfect for individuals and small businesses.",
      features: [
        "Professional landing page",
        "Mobile responsive design",
        "Contact form",
        "Basic SEO",
        "Deployment assistance",
      ],
    },
    {
      name: "Business",
      price: "₹4,999",
      popular: true,
      description: "For businesses that need a complete online presence.",
      features: [
        "Multi-page website",
        "Modern premium UI",
        "Contact/lead system",
        "Database integration",
        "Admin panel",
        "Deployment",
      ],
    },
    {
      name: "Business Pro",
      price: "₹7,999+",
      description: "For advanced business requirements.",
      features: [
        "Full-stack application",
        "Custom admin dashboard",
        "Authentication",
        "Advanced database",
        "API integrations",
        "Priority support",
      ],
    },
  ];

  return (
    <div className="app">
      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <div className="container nav-container">
          <button
            className="logo"
            onClick={() => scrollToSection("home")}
            type="button"
          >
            <span className="logo-mark">
              <Sparkles size={18} />
            </span>

            <span>
              Weblytics<span className="logo-dot">.</span>
            </span>
          </button>

          <nav className={`nav-links ${mobileMenu ? "mobile-open" : ""}`}>
            <button onClick={() => scrollToSection("home")}>Home</button>
            <button onClick={() => scrollToSection("services")}>
              Services
            </button>
            <button onClick={() => scrollToSection("work")}>Work</button>
            <button onClick={() => scrollToSection("pricing")}>
              Pricing
            </button>
            <button onClick={() => scrollToSection("about")}>About</button>
            <button onClick={() => scrollToSection("contact")}>
              Contact
            </button>
          </nav>

          <button
            className="nav-cta"
            onClick={() => scrollToSection("contact")}
            type="button"
          >
            Start a Project
            <ArrowRight size={16} />
          </button>

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu(!mobileMenu)}
            type="button"
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        {/* ================= HERO ================= */}

        <section id="home" className="hero section">
          <div className="hero-grid" />

          <div className="container hero-container">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                Digital solutions for modern businesses
              </div>

              <h1>
                Build.
                <br />
                <span className="gradient-text">Automate.</span>
                <br />
                Analyze. <span className="outline-text">Grow.</span>
              </h1>

              <p className="hero-description">
                Weblytics Studio helps businesses, startups, creators and
                students build powerful digital solutions through
                <strong> web development, AI automation and data analytics.</strong>
              </p>

              <div className="hero-buttons">
                <button
                  className="primary-button"
                  onClick={() => scrollToSection("contact")}
                  type="button"
                >
                  Start a Project
                  <ArrowRight size={18} />
                </button>

                <button
                  className="secondary-button"
                  onClick={() => scrollToSection("work")}
                  type="button"
                >
                  <Play size={16} />
                  View Our Work
                </button>
              </div>

              <div className="hero-trust">
                <span>Built with</span>

                <div className="tech-stack">
                  <span>React</span>
                  <span>Node.js</span>
                  <span>MongoDB</span>
                  <span>AI</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="orb orb-one" />
              <div className="orb orb-two" />

              <div className="dashboard-card">
                <div className="dashboard-top">
                  <div className="window-controls">
                    <span />
                    <span />
                    <span />
                  </div>

                  <span className="dashboard-label">WEBLYTICS</span>
                </div>

                <div className="dashboard-body">
                  <div className="mini-sidebar">
                    <div className="sidebar-logo">
                      <Sparkles size={14} />
                    </div>

                    <span className="active" />
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="dashboard-content">
                    <div className="dashboard-heading">
                      <div>
                        <small>OVERVIEW</small>
                        <h3>Business Analytics</h3>
                      </div>

                      <div className="status-badge">
                        <span />
                        Live
                      </div>
                    </div>

                    <div className="metric-grid">
                      <div className="metric-card">
                        <small>Revenue</small>
                        <strong>₹48.2K</strong>
                        <span className="positive">
                          <TrendingUp size={12} /> +24.8%
                        </span>
                      </div>

                      <div className="metric-card">
                        <small>Customers</small>
                        <strong>1,284</strong>
                        <span className="positive">
                          <TrendingUp size={12} /> +18.2%
                        </span>
                      </div>
                    </div>

                    <div className="chart-card">
                      <div className="chart-header">
                        <span>Performance</span>
                        <small>Last 7 days</small>
                      </div>

                      <div className="fake-chart">
                        <div className="chart-line">
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="floating-card floating-ai">
                <div className="floating-icon">
                  <Bot size={18} />
                </div>

                <div>
                  <small>AI Automation</small>
                  <strong>Running smoothly</strong>
                </div>

                <span className="pulse-dot" />
              </div>

              <div className="floating-card floating-data">
                <div className="floating-icon">
                  <Database size={18} />
                </div>

                <div>
                  <small>Data Processed</small>
                  <strong>+42.8%</strong>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="scroll-indicator">
            <span />
            Scroll to explore
          </div>
        </section>

        {/* ================= SERVICES ================= */}

        <section id="services" className="section services-section">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-label">WHAT WE DO</span>

                <h2>
                  Digital solutions
                  <br />
                  <span>built for growth.</span>
                </h2>
              </div>

              <p>
                From your first website to advanced automation systems, we
                create practical technology that helps you move forward.
              </p>
            </div>

            <div className="services-grid">
              {services.map((service, index) => {
                const Icon = service.icon;

                return (
                  <motion.div
                    className="service-card"
                    key={service.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                    }}
                  >
                    <div className="service-icon">
                      <Icon size={24} />
                    </div>

                    <span className="service-number">
                      0{index + 1}
                    </span>

                    <h3>{service.title}</h3>

                    <p>{service.description}</p>

                    <div className="service-features">
                      {service.features.map((feature) => (
                        <div key={feature}>
                          <Check size={14} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      className="card-link"
                      onClick={() => scrollToSection("contact")}
                      type="button"
                    >
                      Get started
                      <ArrowRight size={15} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}

        <section className="stats-section">
          <div className="container stats-grid">
            <div className="stat">
              <strong>3+</strong>
              <span>Core Services</span>
            </div>

            <div className="stat">
              <strong>100%</strong>
              <span>Custom Solutions</span>
            </div>

            <div className="stat">
              <strong>24/7</strong>
              <span>Digital Presence</span>
            </div>

            <div className="stat">
              <strong>∞</strong>
              <span>Growth Potential</span>
            </div>
          </div>
        </section>

        {/* ================= WORK ================= */}

        <section id="work" className="section work-section">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-label">SELECTED WORK</span>

                <h2>
                  Ideas turned into
                  <br />
                  <span>digital products.</span>
                </h2>
              </div>

              <p>
                We combine design, development, automation and analytics to
                create solutions that actually solve problems.
              </p>
            </div>

            <div className="projects">
              {projects.map((project, index) => (
                <motion.div
                  className="project-card"
                  key={project.number}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                >
                  <div className="project-number">{project.number}</div>

                  <div className="project-info">
                    <span>{project.category}</span>

                    <h3>{project.title}</h3>

                    <p>{project.description}</p>

                    <div className="project-tech">
                      {project.tech.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                  </div>

                  <div className="project-arrow">
                    <ArrowRight size={22} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= PRICING ================= */}

        <section id="pricing" className="section pricing-section">
          <div className="container">
            <div className="section-header centered">
              <span className="section-label">SIMPLE PRICING</span>

              <h2>
                Start small.
                <br />
                <span>Scale when ready.</span>
              </h2>

              <p>
                Affordable packages designed for students, creators,
                startups and growing businesses.
              </p>
            </div>

            <div className="pricing-grid">
              {pricing.map((plan, index) => (
                <motion.div
                  className={`pricing-card ${
                    plan.popular ? "popular" : ""
                  }`}
                  key={plan.name}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                >
                  {plan.popular && (
                    <div className="popular-badge">MOST POPULAR</div>
                  )}

                  <span className="plan-name">{plan.name}</span>

                  <div className="plan-price">
                    {plan.price}
                  </div>

                  <p>{plan.description}</p>

                  <div className="plan-features">
                    {plan.features.map((feature) => (
                      <div key={feature}>
                        <Check size={15} />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <button
                    className={
                      plan.popular
                        ? "primary-button full-width"
                        : "secondary-button full-width"
                    }
                    onClick={() => scrollToSection("contact")}
                    type="button"
                  >
                    Choose {plan.name}
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              ))}
            </div>

            <p className="pricing-note">
              Need something different?{" "}
              <button
                onClick={() => scrollToSection("contact")}
                type="button"
              >
                Tell us about your project →
              </button>
            </p>
          </div>
        </section>

        {/* ================= ABOUT ================= */}

        <section id="about" className="section about-section">
          <div className="container about-grid">
            <div className="about-visual">
              <div className="about-box about-box-main">
                <div className="about-logo">
                  <Sparkles size={28} />
                </div>

                <span>WEBLYTICS</span>
                <strong>STUDIO</strong>
              </div>

              <div className="about-decoration about-decoration-one" />
              <div className="about-decoration about-decoration-two" />
            </div>

            <div className="about-content">
              <span className="section-label">ABOUT WEBLYTICS</span>

              <h2>
                Technology should
                <br />
                <span>solve problems.</span>
              </h2>

              <p>
                Weblytics Studio is a digital solutions studio focused on
                helping people and businesses use technology effectively.
              </p>

              <p>
                We build websites, web applications, automation systems and
                analytics dashboards that are practical, modern and designed
                around real-world requirements.
              </p>

              <div className="about-points">
                <div>
                  <div className="about-point-icon">
                    <Globe size={18} />
                  </div>

                  <div>
                    <strong>Modern Technology</strong>
                    <span>
                      Built using modern development tools and frameworks.
                    </span>
                  </div>
                </div>

                <div>
                  <div className="about-point-icon">
                    <MessageCircle size={18} />
                  </div>

                  <div>
                    <strong>Direct Communication</strong>
                    <span>
                      Clear communication from idea to final delivery.
                    </span>
                  </div>
                </div>

                <div>
                  <div className="about-point-icon">
                    <TrendingUp size={18} />
                  </div>

                  <div>
                    <strong>Growth Focused</strong>
                    <span>
                      Solutions designed to support your next stage of growth.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}

        <section className="cta-section">
          <div className="container">
            <div className="cta-box">
              <div className="cta-glow" />

              <span className="section-label">HAVE AN IDEA?</span>

              <h2>
                Let's turn your
                <br />
                <span>idea into reality.</span>
              </h2>

              <p>
                Tell us what you're building. We'll help you figure out the
                right technology and approach.
              </p>

              <button
                className="primary-button"
                onClick={() => scrollToSection("contact")}
                type="button"
              >
                Start a Conversation
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* ================= CONTACT ================= */}

        <section id="contact" className="section contact-section">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-info">
                <span className="section-label">CONTACT</span>

                <h2>
                  Let's build
                  <br />
                  <span>something useful.</span>
                </h2>

                <p>
                  Have a website idea, automation requirement or data
                  analytics project? Send us a message and let's discuss it.
                </p>

                <div className="contact-details">
                  <a href="mailto:team.weblytics@outlook.com">
                    <div className="contact-icon">
                      <Mail size={19} />
                    </div>

                    <div>
                      <small>Email</small>
                      <span>team.weblytics@outlook.com</span>
                    </div>
                  </a>

                  <a
                    href="https://www.instagram.com/team.weblytics/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="contact-icon">
                      <FaInstagram size={19} />
                    </div>

                    <div>
                      <small>Instagram</small>
                      <span>@team.weblytics</span>
                    </div>
                  </a>

                  <a
                    href="https://www.youtube.com/@team.weblytics"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="contact-icon">
                      <FaYoutube size={19} />
                    </div>

                    <div>
                      <small>YouTube</small>
                      <span>@team.weblytics</span>
                    </div>
                  </a>
                </div>
              </div>

              <div className="contact-form-wrapper">
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Name *</label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email *</label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="service">Service *</label>

                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                      >
                        <option value="Web Development">
                          Web Development
                        </option>

                        <option value="AI & Automation">
                          AI & Automation
                        </option>

                        <option value="Data Analytics">
                          Data Analytics
                        </option>

                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Project Details *</label>

                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      placeholder="Tell us about your project, requirements, budget or idea..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {formMessage && (
                    <div className="form-success">
                      <Check size={17} />
                      {formMessage}
                    </div>
                  )}

                  {formError && (
                    <div className="form-error">
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="primary-button submit-button"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Enquiry
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <p className="form-note">
                    We'll get back to you as soon as possible.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <button
                className="logo"
                onClick={() => scrollToSection("home")}
                type="button"
              >
                <span className="logo-mark">
                  <Sparkles size={17} />
                </span>

                <span>
                  Weblytics<span className="logo-dot">.</span>
                </span>
              </button>

              <p>
                Building digital solutions that help ideas,
                businesses and people grow.
              </p>
            </div>

            <div className="footer-links">
              <div>
                <span>Explore</span>

                <button onClick={() => scrollToSection("services")}>
                  Services
                </button>

                <button onClick={() => scrollToSection("work")}>
                  Work
                </button>

                <button onClick={() => scrollToSection("pricing")}>
                  Pricing
                </button>
              </div>

              <div>
                <span>Company</span>

                <button onClick={() => scrollToSection("about")}>
                  About
                </button>

                <button onClick={() => scrollToSection("contact")}>
                  Contact
                </button>
              </div>

              <div>
                <span>Connect</span>

                <a
                  href="https://www.instagram.com/team.weblytics/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>

                <a
                  href="https://www.youtube.com/@team.weblytics"
                  target="_blank"
                  rel="noreferrer"
                >
                  YouTube
                </a>

                <a href="mailto:team.weblytics@outlook.com">
                  Email
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} Weblytics Studio. All rights
              reserved.
            </span>

            <span>Built with technology & creativity.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
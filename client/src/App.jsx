import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronDown,
  Code2,
  Database,
  ExternalLink,

  Mail,
  Menu,
  MessageCircle,
  Play,
  Sparkles,
} from "lucide-react";

import {
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube
} from "react-icons/fa";

import "./index.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ============================================================
// CHANGE THIS TO YOUR REAL WHATSAPP NUMBER
// Format: country code + number, without + or spaces
// Example India: 919876543210
// ============================================================
const WHATSAPP_NUMBER = "918755720396";

const whatsappMessage = encodeURIComponent(
  "Hello Weblytics Studio, I want to discuss a project."
);

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

const services = [
  {
    icon: Code2,
    number: "01",
    title: "Web Development",
    description:
      "Modern, responsive websites and full-stack applications designed to help your business establish a powerful online presence.",
    tags: ["MERN", "React", "Node.js", "MongoDB"],
  },
  {
    icon: Bot,
    number: "02",
    title: "AI & Automation",
    description:
      "Automate repetitive workflows, content operations and business processes with AI, APIs and intelligent automation.",
    tags: ["AI", "Automation", "APIs", "n8n"],
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Data Analytics",
    description:
      "Turn raw business data into clear dashboards, reports and actionable insights that help you make better decisions.",
    tags: ["Dashboards", "Analytics", "Reports", "Insights"],
  },
];

const projects = [
  {
    category: "Management System",
    title: "Cold Store Management",
    description:
      "A full-stack management platform for farmers, managers and owners with inventory, records and reporting.",
    tech: ["React", "Node.js", "MongoDB"],
  },
  {
    category: "College Platform",
    title: "Event Management System",
    description:
      "A modern event registration and management platform designed for college events and organizations.",
    tech: ["React", "Express", "MongoDB"],
  },
  {
    category: "AI Automation",
    title: "Social Media Automation",
    description:
      "An automation workflow for researching, generating and managing social media content using AI.",
    tech: ["AI", "n8n", "APIs"],
  },
];

const pricing = [
  {
    name: "Starter",
    price: "₹1,999",
    description: "For individuals and small businesses starting online.",
    features: [
      "1–3 page responsive website",
      "Mobile-friendly design",
      "Contact / WhatsApp integration",
      "Basic deployment",
      "3–5 day delivery",
    ],
  },
  {
    name: "Business",
    price: "₹4,999",
    popular: true,
    description: "For businesses that need a complete online presence.",
    features: [
      "5–7 professional pages",
      "Responsive design",
      "Contact form",
      "WhatsApp integration",
      "Basic SEO setup",
      "Deployment",
      "7-day support",
    ],
  },
  {
    name: "Business Pro",
    price: "₹7,999+",
    description: "For businesses requiring custom functionality.",
    features: [
      "Full-stack application",
      "Backend & database",
      "Authentication",
      "Admin dashboard",
      "Custom business logic",
      "Deployment",
      "Post-launch support",
    ],
  },
];

const faqs = [
  {
    question: "What type of websites do you build?",
    answer:
      "We build business websites, portfolios, landing pages, college platforms, management systems, dashboards and custom full-stack applications.",
  },
  {
    question: "Can you build a custom application?",
    answer:
      "Yes. We can develop custom applications using technologies such as React, Node.js, Express, MongoDB and other suitable technologies based on the project requirements.",
  },
  {
    question: "Do you provide deployment?",
    answer:
      "Yes. Deployment can be included in the project depending on the selected package and requirements.",
  },
  {
    question: "Can you automate my business workflow?",
    answer:
      "Yes. We can analyze repetitive tasks and create automation workflows using APIs, AI and automation platforms.",
  },
  {
    question: "How do I start a project?",
    answer:
      "Send us your requirements through the contact form or WhatsApp. We'll understand your requirements and discuss the best solution.",
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Web Development",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const closeMenu = () => setMenuOpen(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    closeMenu();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setFormMessage("");

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
        throw new Error(
          data.message || "Failed to submit enquiry."
        );
      }

      setFormMessage(
        "Thanks! Your enquiry has been submitted. We'll get back to you soon."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "Web Development",
        message: "",
      });
    } catch (error) {
      setFormMessage(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app">
      {/* ======================================================
          NAVBAR
      ======================================================= */}
      <header className="navbar">
        <div className="container navbar-inner">
          <button
            className="brand"
            onClick={() => scrollTo("home")}
            aria-label="Weblytics Studio home"
          >
            <span className="brand-mark">W</span>

            <span className="brand-text">
              <strong>Weblytics</strong>
              <span>Studio</span>
            </span>
          </button>

          <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
            <button onClick={() => scrollTo("home")}>
              Home
            </button>

            <button onClick={() => scrollTo("services")}>
              Services
            </button>

            <button onClick={() => scrollTo("work")}>
              Work
            </button>

            <button onClick={() => scrollTo("pricing")}>
              Pricing
            </button>

            <button onClick={() => scrollTo("about")}>
              About
            </button>

            <button onClick={() => scrollTo("contact")}>
              Contact
            </button>

            <button
              className="nav-mobile-cta"
              onClick={() => scrollTo("contact")}
            >
              Start a Project
            </button>
          </nav>

          <div className="navbar-actions">
            <button
              className="nav-cta"
              onClick={() => scrollTo("contact")}
            >
              Start a Project
              <ArrowRight size={16} />
            </button>

            <button
              className="menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ====================================================
            HERO
        ===================================================== */}
        <section id="home" className="hero section">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />

          <div className="container hero-grid">
            <div className="hero-content">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                Digital solutions for modern businesses
              </div>

              <h1>
                Build.
                <br />
                <span>Automate.</span>
                <br />
                Analyze.
                <br />
                <strong>Grow.</strong>
              </h1>

              <p className="hero-description">
                We build modern websites, automate repetitive
                work and turn business data into actionable
                insights.
              </p>

              <div className="hero-buttons">
                <button
                  className="primary-button"
                  onClick={() => scrollTo("contact")}
                >
                  Start a Project
                  <ArrowRight size={18} />
                </button>

                <button
                  className="secondary-button"
                  onClick={() => scrollTo("work")}
                >
                  <Play size={16} />
                  View Our Work
                </button>
              </div>

              <div className="hero-trust">
                <div className="trust-item">
                  <Check size={15} />
                  Student-friendly pricing
                </div>

                <div className="trust-item">
                  <Check size={15} />
                  Modern technology
                </div>

                <div className="trust-item">
                  <Check size={15} />
                  Deployment support
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="visual-orbit orbit-one" />
              <div className="visual-orbit orbit-two" />

              <div className="dashboard-card">
                <div className="dashboard-top">
                  <div className="window-dots">
                    <span />
                    <span />
                    <span />
                  </div>

                  <span className="dashboard-label">
                    WEBLYTICS
                  </span>
                </div>

                <div className="dashboard-content">
                  <div className="dashboard-heading">
                    <div>
                      <span>Project Overview</span>
                      <strong>Digital Growth</strong>
                    </div>

                    <Sparkles size={22} />
                  </div>

                  <div className="mini-stats">
                    <div>
                      <span>Projects</span>
                      <strong>24+</strong>
                    </div>

                    <div>
                      <span>Solutions</span>
                      <strong>12+</strong>
                    </div>

                    <div>
                      <span>Growth</span>
                      <strong>↑</strong>
                    </div>
                  </div>

                  <div className="chart">
                    <div className="chart-line">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>

                  <div className="dashboard-services">
                    <span>
                      <Code2 size={14} />
                      Web
                    </span>

                    <span>
                      <Bot size={14} />
                      AI
                    </span>

                    <span>
                      <BarChart3 size={14} />
                      Data
                    </span>
                  </div>
                </div>
              </div>

              <div className="floating-card floating-card-one">
                <Code2 size={18} />
                <div>
                  <small>Development</small>
                  <strong>Modern Web</strong>
                </div>
              </div>

              <div className="floating-card floating-card-two">
                <Bot size={18} />
                <div>
                  <small>Automation</small>
                  <strong>AI Powered</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-scroll">
            <span>Scroll to explore</span>
            <ChevronDown size={18} />
          </div>
        </section>

        {/* ====================================================
            SERVICES
        ===================================================== */}
        <section id="services" className="section">
          <div className="container">
            <div className="section-heading">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                What we do
              </div>

              <h2>
                Technology that
                <br />
                <span>moves you forward.</span>
              </h2>

              <p>
                From websites to intelligent automation and
                analytics, we help turn ideas into useful digital
                products.
              </p>
            </div>

            <div className="services-grid">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <article
                    className="service-card"
                    key={service.title}
                  >
                    <div className="card-number">
                      {service.number}
                    </div>

                    <div className="service-icon">
                      <Icon size={25} />
                    </div>

                    <h3>{service.title}</h3>

                    <p>{service.description}</p>

                    <div className="tag-list">
                      {service.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>

                    <button
                      className="text-button"
                      onClick={() => scrollTo("contact")}
                    >
                      Discuss a project
                      <ArrowRight size={16} />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ====================================================
            WHY WEBLYTICS
        ===================================================== */}
        <section className="section why-section">
          <div className="container">
            <div className="why-grid">
              <div>
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  Why Weblytics
                </div>

                <h2>
                  Small team.
                  <br />
                  <span>Big possibilities.</span>
                </h2>

                <p className="large-text">
                  We combine development, automation and
                  analytics to create practical digital solutions
                  without unnecessary complexity.
                </p>

                <button
                  className="primary-button"
                  onClick={() => scrollTo("contact")}
                >
                  Let's build something
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="benefits-grid">
                <div className="benefit">
                  <span className="benefit-icon">
                    <Code2 size={20} />
                  </span>

                  <div>
                    <h3>Modern technology</h3>
                    <p>
                      Built using current, scalable development
                      technologies.
                    </p>
                  </div>
                </div>

                <div className="benefit">
                  <span className="benefit-icon">
                    <Sparkles size={20} />
                  </span>

                  <div>
                    <h3>Practical solutions</h3>
                    <p>
                      We focus on solving real problems instead
                      of adding unnecessary features.
                    </p>
                  </div>
                </div>

                <div className="benefit">
                  <span className="benefit-icon">
                    <MessageCircle size={20} />
                  </span>

                  <div>
                    <h3>Clear communication</h3>
                    <p>
                      Simple communication throughout the
                      project lifecycle.
                    </p>
                  </div>
                </div>

                <div className="benefit">
                  <span className="benefit-icon">
                    <Database size={20} />
                  </span>

                  <div>
                    <h3>End-to-end support</h3>
                    <p>
                      From development and deployment to
                      post-launch improvements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            WORK
        ===================================================== */}
        <section id="work" className="section">
          <div className="container">
            <div className="section-heading section-heading-row">
              <div>
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  Selected work
                </div>

                <h2>
                  Built to solve
                  <br />
                  <span>real problems.</span>
                </h2>
              </div>

              <p>
                Explore some of our demo and development
                projects. These demonstrate the type of systems
                we can build.
              </p>
            </div>

            <div className="projects-grid">
              {projects.map((project, index) => (
                <article
                  className="project-card"
                  key={project.title}
                >
                  <div className={`project-preview preview-${index}`}>
                    <div className="preview-window">
                      <div className="preview-bar">
                        <span />
                        <span />
                        <span />
                      </div>

                      <div className="preview-body">
                        <div className="preview-sidebar" />

                        <div className="preview-main">
                          <div className="preview-block large" />
                          <div className="preview-block" />
                          <div className="preview-block" />
                        </div>
                      </div>
                    </div>

                    <span className="demo-badge">
                      Demo Project
                    </span>
                  </div>

                  <div className="project-content">
                    <span className="project-category">
                      {project.category}
                    </span>

                    <h3>{project.title}</h3>

                    <p>{project.description}</p>

                    <div className="project-footer">
                      <div className="tag-list">
                        {project.tech.map((tech) => (
                          <span key={tech}>{tech}</span>
                        ))}
                      </div>

                      <button
                        className="circle-button"
                        onClick={() => scrollTo("contact")}
                        aria-label={`Discuss ${project.title}`}
                      >
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================
            PRICING
        ===================================================== */}
        <section id="pricing" className="section pricing-section">
          <div className="container">
            <div className="section-heading centered">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                Simple pricing
              </div>

              <h2>
                Start small.
                <br />
                <span>Scale when ready.</span>
              </h2>

              <p>
                Transparent starting prices for students,
                creators, startups and small businesses.
                Custom projects are quoted separately.
              </p>
            </div>

            <div className="pricing-grid">
              {pricing.map((plan) => (
                <article
                  className={`pricing-card ${
                    plan.popular ? "popular" : ""
                  }`}
                  key={plan.name}
                >
                  {plan.popular && (
                    <div className="popular-label">
                      Most Popular
                    </div>
                  )}

                  <span className="pricing-name">
                    {plan.name}
                  </span>

                  <div className="pricing-price">
                    {plan.price}
                  </div>

                  <p>{plan.description}</p>

                  <div className="pricing-divider" />

                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <Check size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={
                      plan.popular
                        ? "primary-button full-width"
                        : "secondary-button full-width"
                    }
                    onClick={() => scrollTo("contact")}
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </button>
                </article>
              ))}
            </div>

            <p className="pricing-note">
              Need something different? Custom requirements are
              welcome. Contact us for a personalized quote.
            </p>
          </div>
        </section>

        {/* ====================================================
            ABOUT
        ===================================================== */}
        <section id="about" className="section about-section">
          <div className="container about-grid">
            <div className="about-visual">
              <div className="about-card">
                <div className="about-logo">W</div>

                <span>WEBLYTICS</span>

                <strong>STUDIO</strong>

                <p>
                  Build.
                  <br />
                  Automate.
                  <br />
                  Analyze.
                  <br />
                  Grow.
                </p>
              </div>
            </div>

            <div className="about-content">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                About Weblytics
              </div>

              <h2>
                Technology should
                <br />
                <span>work for you.</span>
              </h2>

              <p>
                Weblytics Studio is a technology studio focused
                on building useful digital products for
                businesses, creators, startups, students and
                organizations.
              </p>

              <p>
                We bring together web development, AI-powered
                automation and data analytics to help ideas move
                from concept to reality.
              </p>

              <div className="about-points">
                <div>
                  <Check size={17} />
                  <span>Modern & responsive solutions</span>
                </div>

                <div>
                  <Check size={17} />
                  <span>Affordable starting packages</span>
                </div>

                <div>
                  <Check size={17} />
                  <span>Custom development available</span>
                </div>

                <div>
                  <Check size={17} />
                  <span>Deployment & support</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            FAQ
        ===================================================== */}
        <section className="section faq-section">
          <div className="container">
            <div className="section-heading centered">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                FAQ
              </div>

              <h2>
                Questions?
                <br />
                <span>We've got answers.</span>
              </h2>
            </div>

            <div className="faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div
                    className={`faq-item ${
                      isOpen ? "open" : ""
                    }`}
                    key={faq.question}
                  >
                    <button
                      className="faq-question"
                      onClick={() =>
                        setOpenFaq(isOpen ? null : index)
                      }
                    >
                      <span>{faq.question}</span>

                      <ChevronDown
                        size={20}
                        className="faq-chevron"
                      />
                    </button>

                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ====================================================
            CONTACT
        ===================================================== */}
        <section id="contact" className="section contact-section">
          <div className="contact-glow" />

          <div className="container">
            <div className="contact-grid">
              <div className="contact-intro">
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  Start a project
                </div>

                <h2>
                  Have an idea?
                  <br />
                  <span>Let's build it.</span>
                </h2>

                <p>
                  Tell us what you're working on. We'll
                  understand your requirements and help you find
                  the right digital solution.
                </p>

                <div className="contact-links">
                  <a
                    href="mailto:team.weblytics@outlook.com"
                  >
                    <span className="contact-icon">
                      <Mail size={18} />
                    </span>

                    <span>
                      <small>Email</small>
                      team.weblytics@outlook.com
                    </span>
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="contact-icon whatsapp-icon">
                      <MessageCircle size={18} />
                    </span>

                    <span>
                      <small>WhatsApp</small>
                      Start a conversation
                    </span>
                  </a>
                </div>

                <div className="social-links">
                  <a
                    href="https://www.instagram.com/team.weblytics/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={19} />
                  </a>  

                  <a
                    href="https://www.youtube.com/@team.weblytics"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                  >
                    <FaYoutube size={19} />
                  </a>

                  <a
                    href="mailto:team.weblytics@outlook.com"
                    aria-label="Email"
                  >
                    <Mail size={19} />
                  </a>
                </div>
              </div>

              <form
                className="contact-form"
                onSubmit={handleSubmit}
              >
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      Your Name *
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Email *
                    </label>

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
                    <label htmlFor="phone">
                      Phone / WhatsApp
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Optional"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="service">
                      Service *
                    </label>

                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                    >
                      <option>
                        Web Development
                      </option>

                      <option>
                        AI & Automation
                      </option>

                      <option>
                        Data Analytics
                      </option>

                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    Tell us about your project *
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    placeholder="What would you like us to build?"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {formMessage && (
                  <div
                    className={`form-message ${
                      formMessage.includes("Thanks")
                        ? "success"
                        : "error"
                    }`}
                  >
                    {formMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="primary-button submit-button"
                  disabled={submitting}
                >
                  {submitting
                    ? "Sending..."
                    : "Send Enquiry"}

                  {!submitting && <ArrowRight size={18} />}
                </button>

                <p className="form-note">
                  Your information is only used to respond to
                  your enquiry.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* ======================================================
          FOOTER
      ======================================================= */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <button
                className="brand footer-brand-button"
                onClick={() => scrollTo("home")}
              >
                <span className="brand-mark">W</span>

                <span className="brand-text">
                  <strong>Weblytics</strong>
                  <span>Studio</span>
                </span>
              </button>

              <p>
                Build. Automate. Analyze. Grow.
              </p>

              <p className="footer-description">
                Digital solutions for businesses, creators,
                startups and organizations.
              </p>
            </div>

            <div className="footer-column">
              <h4>Explore</h4>

              <button onClick={() => scrollTo("home")}>
                Home
              </button>

              <button onClick={() => scrollTo("services")}>
                Services
              </button>

              <button onClick={() => scrollTo("work")}>
                Work
              </button>

              <button onClick={() => scrollTo("pricing")}>
                Pricing
              </button>
            </div>

            <div className="footer-column">
              <h4>Company</h4>

              <button onClick={() => scrollTo("about")}>
                About
              </button>

              <button onClick={() => scrollTo("contact")}>
                Contact
              </button>

              <button onClick={() => scrollTo("contact")}>
                Start a Project
              </button>
            </div>

            <div className="footer-column">
              <h4>Connect</h4>

              <a
                href="https://www.instagram.com/team.weblytics/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
                <ExternalLink size={13} />
              </a>

              <a
                href="https://www.youtube.com/@team.weblytics"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
                <ExternalLink size={13} />
              </a>

              <a href="mailto:team.weblytics@outlook.com">
                Email
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} Weblytics Studio.
              All rights reserved.
            </span>

            <span>
              Built with purpose.
            </span>
          </div>
        </div>
      </footer>

      {/* ======================================================
          FLOATING WHATSAPP
      ======================================================= */}
      <a
        href={whatsappUrl}
        className="floating-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Weblytics Studio on WhatsApp"
      >
        <MessageCircle size={23} />
      </a>
    </div>
  );
}

export default App;
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, BarChart3, Bot, Check, ChevronDown, Code2, Database, Globe, Mail,
  Menu, MessageCircle, Monitor, Send, ShieldCheck, Sparkles, Target, TrendingUp,
  Users, Zap, X, Sun, Moon,
} from "lucide-react";
import { FaInstagram, FaYoutube, FaGithub } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const WHATSAPP_NUMBER = "YOUR_WHATSAPP_NUMBER";
const CONTACT_EMAIL = "team.weblytics@outlook.com";
const INSTAGRAM_URL = "https://www.instagram.com/team.weblytics/";
const YOUTUBE_URL = "https://www.youtube.com/@team.weblytics/";
const GITHUB_URL = "https://github.com/abhishek4712ak";
const THEME_KEY = "weblytics_theme";
const NAV = ["home", "services", "about", "projects", "contact"];

const fallbackServices = [
  { _id: "f-web", title: "Web Development", slug: "web-development",
    description: "Fast, responsive websites and web apps for businesses, startups, colleges and creators.",
    features: ["Business Websites", "MERN Applications", "Portfolio Websites", "Admin Dashboards", "Responsive Design"], status: "Active" },
  { _id: "f-ai", title: "AI & Automation", slug: "ai-automation",
    description: "AI-powered workflows that remove repetitive work and help your business move faster.",
    features: ["AI Integrations", "Workflow Automation", "Content Automation", "Chatbots", "API Integrations"], status: "Active" },
  { _id: "f-data", title: "Data Analytics", slug: "data-analytics",
    description: "Turn raw data into dashboards, reports and insights that support better decisions.",
    features: ["Data Cleaning", "Interactive Dashboards", "Business Reports", "Data Visualization", "Performance Analysis"], status: "Active" },
];

const projects = [
  { title: "Business Websites", icon: <Globe size={22} />, tags: ["React", "MERN", "Responsive"],
    description: "Professional websites that build trust and bring in enquiries." },
  { title: "Admin Dashboards", icon: <Monitor size={22} />, tags: ["React", "Node.js", "MongoDB"],
    description: "Secure panels to manage users, leads, services and reports." },
  { title: "AI Automation", icon: <Zap size={22} />, tags: ["AI", "Automation", "APIs"],
    description: "Workflows that handle repetitive business and content tasks." },
  { title: "Data Dashboards", icon: <TrendingUp size={22} />, tags: ["Analytics", "Charts", "Reports"],
    description: "Interactive analytics that turn numbers into decisions." },
];

const benefits = [
  { icon: <Target size={22} />, title: "Business focused", description: "We build around your goals, not around unnecessary complexity." },
  { icon: <Sparkles size={22} />, title: "Modern stack", description: "Scalable architecture and current tools for reliable products." },
  { icon: <ShieldCheck size={22} />, title: "Reliable by design", description: "Security, responsiveness and maintainability from day one." },
  { icon: <Users size={22} />, title: "Personal support", description: "Work directly with a small team that knows your project." },
];

const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

const getWhatsAppUrl = (msg = "Hello Weblytics Studio, I would like to discuss a project.") =>
  !WHATSAPP_NUMBER || WHATSAPP_NUMBER === "YOUR_WHATSAPP_NUMBER"
    ? null
    : `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const themes = {
  dark: {
    bg: "#070b17", bg2: "#0b1122", card: "rgba(255,255,255,0.045)", cardHover: "rgba(255,255,255,0.08)",
    border: "rgba(255,255,255,0.09)", text: "#f4f6fb", muted: "#a3adc2", dim: "#6b7690",
    accent: "#8b8cff", accentSoft: "rgba(139,140,255,0.14)", success: "#34d399", successSoft: "rgba(52,211,153,0.14)",
    danger: "#f87171", dangerSoft: "rgba(248,113,113,0.14)", input: "rgba(255,255,255,0.05)",
    nav: "rgba(7,11,23,0.72)", shadow: "0 20px 50px rgba(0,0,0,0.45)",
    glowA: "rgba(99,102,241,0.35)", glowB: "rgba(6,182,212,0.22)",
  },
  light: {
    bg: "#f6f7fc", bg2: "#eef0fa", card: "rgba(255,255,255,0.75)", cardHover: "#ffffff",
    border: "rgba(15,23,42,0.08)", text: "#0f172a", muted: "#506079", dim: "#8a94ab",
    accent: "#4f46e5", accentSoft: "rgba(79,70,229,0.1)", success: "#059669", successSoft: "rgba(5,150,105,0.1)",
    danger: "#dc2626", dangerSoft: "rgba(220,38,38,0.08)", input: "rgba(255,255,255,0.9)",
    nav: "rgba(246,247,252,0.78)", shadow: "0 20px 50px rgba(79,70,229,0.12)",
    glowA: "rgba(99,102,241,0.22)", glowB: "rgba(6,182,212,0.16)",
  },
};

const GRAD = "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)";
const gradText = { background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" };

/* Hover helper so inline styles can still react to the pointer */
function Hover({ as: Tag = "div", base, hover, children, ...rest }) {
  const [on, setOn] = useState(false);
  return (
    <Tag {...rest} style={{ ...base, ...(on ? hover : null) }}
      onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}>
      {children}
    </Tag>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [services, setServices] = useState(fallbackServices);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) || "dark"; } catch { return "dark"; }
  });
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  const c = themes[theme];
  const isMobile = w < 700;
  const isTablet = w < 1000;

  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => { if (!isTablet) setMenuOpen(false); }, [isTablet]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch {}
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setServicesLoading(true);
        const res = await fetch(`${API_URL}/services`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load services.");
        const list = (Array.isArray(data) ? data : data.services || []).filter(
          (s) => s.status === undefined || String(s.status).toLowerCase() === "active"
        );
        if (mounted && list.length) setServices(list);
      } catch (e) {
        console.error("Services loading error:", e);
        if (mounted) setServicesError("Showing our standard services. Live data is temporarily unavailable.");
      } finally {
        if (mounted) setServicesLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const getServiceIcon = (s) => {
    const k = (s?.slug || s?.title || "").toLowerCase();
    if (k.includes("ai") || k.includes("automation")) return <Bot size={26} />;
    if (k.includes("data") || k.includes("analytics")) return <BarChart3 size={26} />;
    return <Code2 size={26} />;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (formStatus.message) setFormStatus({ type: "", message: "" });
  };

  const handleServiceSelect = (s) => {
    setFormData((p) => ({ ...p, service: typeof s === "string" ? s : s?.title || "" }));
    scrollToSection("contact");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = (message) => setFormStatus({ type: "error", message });
    if (!formData.name.trim()) return err("Please enter your name.");
    if (!formData.email.trim()) return err("Please enter your email.");
    if (!formData.service.trim()) return err("Please select a service.");
    if (!formData.message.trim()) return err("Please enter your project details.");
    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/leads`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Unable to submit your enquiry.");
      setFormStatus({ type: "success", message: "Thank you! Your enquiry was sent. We will contact you soon." });
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (error) {
      console.error("Lead submission error:", error);
      err(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const url = getWhatsAppUrl();
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    else scrollToSection("contact");
  };

  const go = (id) => { setMenuOpen(false); scrollToSection(id); };
  const serviceCount = useMemo(() => services.length, [services]);

  /* ---------- shared styles ---------- */
  const pad = isMobile ? "64px 18px" : isTablet ? "80px 28px" : "104px 32px";
  const wrap = { maxWidth: 1180, margin: "0 auto" };
  const glass = {
    background: c.card, border: `1px solid ${c.border}`, borderRadius: 24,
    backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", boxShadow: c.shadow,
  };
  const cardHover = { background: c.cardHover, transform: "translateY(-6px)", borderColor: c.accent };
  const cardBase = { ...glass, transition: "all .3s ease" };
  const btnPrimary = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 26px",
    borderRadius: 999, border: "none", background: GRAD, color: "#fff", fontWeight: 600, fontSize: 15,
    cursor: "pointer", boxShadow: "0 12px 28px rgba(99,102,241,0.38)", transition: "all .25s ease", fontFamily: "inherit",
  };
  const btnGhost = {
    ...btnPrimary, background: c.card, color: c.text, border: `1px solid ${c.border}`, boxShadow: "none",
  };
  const input = {
    width: "100%", padding: "14px 16px", borderRadius: 14, border: `1px solid ${c.border}`,
    background: c.input, color: c.text, fontSize: 14, outline: "none", fontFamily: "inherit",
  };
  const label = { display: "block", marginBottom: 6, fontSize: 12, fontWeight: 500, color: c.muted };
  const eyebrow = { display: "inline-block", fontSize: 13, fontWeight: 600, color: c.accent, marginBottom: 12 };
  const h2 = {
    margin: "0 0 14px", fontSize: isMobile ? 28 : isTablet ? 34 : 42, fontWeight: 800,
    letterSpacing: "-0.03em", lineHeight: 1.15, color: c.text,
  };
  const iconBox = (size = 48, tone = c.accentSoft, color = c.accent) => ({
    width: size, height: size, borderRadius: 14, background: tone, color,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  });
  const cols = (n) => ({
    display: "grid", gap: 20,
    gridTemplateColumns: isMobile ? "1fr" : isTablet ? `repeat(${Math.min(n, 2)}, 1fr)` : `repeat(${n}, 1fr)`,
  });

  return (
    <div style={{ minHeight: "100vh", background: c.bg, color: c.text, lineHeight: 1.6, overflowX: "hidden",
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif", transition: "background .3s" }}>

      {/* ============ NAVBAR ============ */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: c.nav,
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${c.border}` }}>
        <div style={{ ...wrap, padding: isMobile ? "12px 18px" : "14px 32px", display: "flex",
          alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <button type="button" onClick={() => go("home")} aria-label="Weblytics Studio home"
            style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ ...iconBox(40, GRAD, "#fff"), fontWeight: 800, fontSize: 18, boxShadow: "0 8px 18px rgba(99,102,241,0.4)" }}>W</div>
            <div style={{ textAlign: "left", color: c.text }}>
              <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.1 }}>Weblytics</div>
              <div style={{ fontSize: 11, color: c.muted }}>Studio</div>
            </div>
          </button>

          {!isTablet && (
            <nav style={{ display: "flex", gap: 4, padding: 5, borderRadius: 999, background: c.card, border: `1px solid ${c.border}` }}>
              {NAV.map((item) => (
                <Hover as="button" key={item} type="button" onClick={() => go(item)}
                  base={{ background: "transparent", border: "none", color: c.muted, fontWeight: 500, fontSize: 14,
                    padding: "8px 16px", borderRadius: 999, cursor: "pointer", textTransform: "capitalize", transition: "all .2s", fontFamily: "inherit" }}
                  hover={{ color: c.text, background: c.accentSoft }}>
                  {item}
                </Hover>
              ))}
            </nav>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button type="button" onClick={toggleTheme} aria-label="Toggle theme"
              style={{ ...iconBox(42, c.card, c.muted), border: `1px solid ${c.border}`, cursor: "pointer" }}>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {!isTablet && (
              <button type="button" onClick={() => go("contact")} style={{ ...btnPrimary, padding: "11px 22px" }}>
                Start a project <ArrowRight size={16} />
              </button>
            )}
            {isTablet && (
              <button type="button" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu"
                style={{ ...iconBox(42, c.card, c.text), border: `1px solid ${c.border}`, cursor: "pointer" }}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>

        {isTablet && menuOpen && (
          <div style={{ padding: "8px 18px 20px", borderTop: `1px solid ${c.border}`, display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV.map((item) => (
              <button key={item} type="button" onClick={() => go(item)}
                style={{ background: "none", border: "none", color: c.text, fontWeight: 500, fontSize: 16, padding: "12px 10px",
                  borderRadius: 12, cursor: "pointer", textAlign: "left", textTransform: "capitalize", fontFamily: "inherit" }}>
                {item}
              </button>
            ))}
            <button type="button" onClick={() => go("contact")} style={{ ...btnPrimary, marginTop: 8 }}>
              Start a project <ArrowRight size={16} />
            </button>
          </div>
        )}
      </header>

      <main>
        {/* ============ HERO ============ */}
        <section id="home" style={{ position: "relative", overflow: "hidden", padding: isMobile ? "56px 18px 72px" : isTablet ? "72px 28px 90px" : "96px 32px 120px" }}>
          <div aria-hidden style={{ position: "absolute", top: -180, left: -140, width: 520, height: 520, borderRadius: "50%",
            background: `radial-gradient(circle, ${c.glowA}, transparent 70%)`, animation: "float 14s ease-in-out infinite", pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", bottom: -200, right: -120, width: 560, height: 560, borderRadius: "50%",
            background: `radial-gradient(circle, ${c.glowB}, transparent 70%)`, animation: "float 18s ease-in-out infinite reverse", pointerEvents: "none" }} />

          <div style={{ ...wrap, position: "relative", display: "grid", alignItems: "center",
            gridTemplateColumns: isTablet ? "1fr" : "1.05fr 0.95fr", gap: isTablet ? 48 : 64 }}>
            <div style={{ textAlign: isTablet ? "center" : "left" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 999,
                background: c.card, border: `1px solid ${c.border}`, color: c.muted, fontSize: 13, fontWeight: 500, marginBottom: 24 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.success, boxShadow: `0 0 0 4px ${c.successSoft}` }} />
                Digital solutions for growing businesses
              </div>

              <h1 style={{ margin: "0 0 20px", fontSize: isMobile ? 40 : isTablet ? 56 : 70, fontWeight: 800,
                lineHeight: 1.05, letterSpacing: "-0.04em" }}>
                Build. Automate.<br /><span style={gradText}>Grow.</span>
              </h1>

              <p style={{ margin: isTablet ? "0 auto 30px" : "0 0 30px", fontSize: isMobile ? 16 : 18, color: c.muted, maxWidth: 520, lineHeight: 1.7 }}>
                Weblytics Studio helps businesses, startups, colleges and creators ship better digital products with{" "}
                <strong style={{ color: c.text }}>web development, AI automation and data analytics.</strong>
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 30, justifyContent: isTablet ? "center" : "flex-start",
                flexDirection: isMobile ? "column" : "row" }}>
                <button type="button" onClick={() => go("contact")} style={btnPrimary}>Start your project <ArrowRight size={17} /></button>
                <button type="button" onClick={() => go("services")} style={btnGhost}>Explore services</button>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 22px", fontSize: 13, color: c.muted, justifyContent: isTablet ? "center" : "flex-start" }}>
                {["Modern technology", "Custom solutions", "Growth focused"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Check size={15} style={{ color: c.success }} /> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div style={{ position: "relative", maxWidth: 520, width: "100%", margin: "0 auto", padding: isMobile ? 0 : "20px 0" }}>
              <div style={{ ...glass, padding: isMobile ? 22 : 30, position: "relative", zIndex: 2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 12, color: c.dim, marginBottom: 2 }}>Weblytics Studio</div>
                    <h3 style={{ margin: 0, fontSize: 21, fontWeight: 700 }}>Digital growth</h3>
                  </div>
                  <div style={iconBox(44, GRAD, "#fff")}><Sparkles size={19} /></div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120, marginBottom: 24 }}>
                  {[38, 62, 48, 78, 55, 92].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "8px 8px 3px 3px",
                      background: i === 5 ? GRAD : c.accentSoft, boxShadow: i === 5 ? "0 8px 18px rgba(99,102,241,0.35)" : "none" }} />
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {[["Web", "Development"], ["AI", "Automation"], ["Data", "Analytics"]].map(([a, b]) => (
                    <div key={a} style={{ textAlign: "center", padding: "12px 6px", borderRadius: 14, background: c.input, border: `1px solid ${c.border}` }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{a}</div>
                      <div style={{ fontSize: 11, color: c.muted }}>{b}</div>
                    </div>
                  ))}
                </div>
              </div>

              {!isMobile && [
                { icon: <Code2 size={16} />, a: "MERN", b: "Development", pos: { top: -6, left: -28 }, delay: "0s" },
                { icon: <Bot size={16} />, a: "AI", b: "Automation", pos: { top: "48%", right: -30 }, delay: "1.2s" },
                { icon: <BarChart3 size={16} />, a: "Data", b: "Insights", pos: { bottom: -8, left: 14 }, delay: "2.4s" },
              ].map((f) => (
                <div key={f.a} style={{ ...glass, position: "absolute", ...f.pos, zIndex: 3, display: "flex", alignItems: "center",
                  gap: 10, padding: "10px 14px", borderRadius: 16, animation: `float 7s ease-in-out ${f.delay} infinite` }}>
                  <div style={iconBox(34)}>{f.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{f.a}</div>
                    <div style={{ fontSize: 11, color: c.muted }}>{f.b}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ SERVICES ============ */}
        <section id="services" style={{ padding: pad, background: c.bg2 }}>
          <div style={wrap}>
            <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
              <span style={eyebrow}>Our services</span>
              <h2 style={h2}>Everything you need to <span style={gradText}>grow online</span></h2>
              <p style={{ margin: 0, fontSize: 16, color: c.muted }}>
                From websites to AI automation and analytics, we build practical solutions around your goals.
              </p>
            </div>

            {servicesError && (
              <div style={{ textAlign: "center", padding: "12px 18px", borderRadius: 14, background: c.accentSoft, color: c.accent, fontSize: 14, marginBottom: 24 }}>
                {servicesError}
              </div>
            )}

            {servicesLoading ? (
              <div style={{ textAlign: "center", padding: 40, color: c.muted }}>
                <div style={{ width: 32, height: 32, border: `3px solid ${c.border}`, borderTopColor: c.accent, borderRadius: "50%", margin: "0 auto 12px", animation: "spin .8s linear infinite" }} />
                Loading services...
              </div>
            ) : (
              <div style={{ ...cols(3), marginBottom: 32 }}>
                {services.map((s, i) => (
                  <Hover as="article" key={s._id || s.slug || i} base={{ ...cardBase, padding: 28, display: "flex", flexDirection: "column" }} hover={cardHover}>
                    <div style={{ ...iconBox(54), marginBottom: 20 }}>{getServiceIcon(s)}</div>
                    <h3 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 700 }}>{s.title}</h3>
                    <p style={{ margin: "0 0 18px", fontSize: 14, color: c.muted, flex: 1 }}>{s.description}</p>
                    {Array.isArray(s.features) && s.features.length > 0 && (
                      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px", display: "flex", flexDirection: "column", gap: 8 }}>
                        {s.features.map((f, k) => (
                          <li key={k} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: c.muted }}>
                            <Check size={14} style={{ color: c.success, flexShrink: 0 }} /> {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <button type="button" onClick={() => handleServiceSelect(s)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: c.accent,
                        fontWeight: 600, fontSize: 14, cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
                      Get started <ArrowRight size={15} />
                    </button>
                  </Hover>
                ))}
              </div>
            )}

            <div style={{ ...glass, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 14, padding: "18px 24px", borderRadius: 18 }}>
              <span style={{ fontSize: 14, color: c.muted }}>{serviceCount} core services available</span>
              <button type="button" onClick={() => go("contact")}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: c.accent, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                Tell us what you need <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* ============ ABOUT ============ */}
        <section id="about" style={{ padding: pad }}>
          <div style={{ ...wrap, display: "grid", alignItems: "center", gridTemplateColumns: isTablet ? "1fr" : "0.95fr 1.05fr", gap: isTablet ? 48 : 72 }}>
            <div style={{ position: "relative", maxWidth: 520, width: "100%", margin: "0 auto" }}>
              <div style={{ ...glass, padding: isMobile ? 28 : 40, background: `linear-gradient(145deg, ${c.accentSoft}, ${c.card})` }}>
                <div style={{ ...iconBox(56, GRAD, "#fff"), fontWeight: 800, fontSize: 24, marginBottom: 20, boxShadow: "0 10px 22px rgba(99,102,241,0.38)" }}>W</div>
                <h3 style={{ margin: "0 0 12px", fontSize: isMobile ? 24 : 30, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                  Technology that<br />works for you.
                </h3>
                <p style={{ margin: 0, fontSize: 15, color: c.muted }}>
                  We combine development, automation and analytics into practical digital solutions.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
                  {[[<Code2 size={14} />, "MERN"], [<Database size={14} />, "MongoDB"], [<Zap size={14} />, "AI"]].map(([ic, t]) => (
                    <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 999,
                      background: c.input, border: `1px solid ${c.border}`, fontSize: 13, fontWeight: 600 }}>
                      <span style={{ color: c.accent, display: "flex" }}>{ic}</span>{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ textAlign: isTablet ? "center" : "left" }}>
              <span style={eyebrow}>About Weblytics</span>
              <h2 style={h2}>We turn ideas into <span style={gradText}>digital solutions</span></h2>
              <p style={{ margin: "0 0 14px", fontSize: 16, color: c.muted }}>
                Weblytics Studio is a technology-focused studio helping businesses, startups, colleges, students and creators build and improve their online presence.
              </p>
              <p style={{ margin: "0 0 26px", fontSize: 16, color: c.muted }}>
                We blend web development, AI automation and analytics so your technology looks good and does real work.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 30, textAlign: "left" }}>
                {["Custom-built solutions", "Scalable architecture", "Responsive experiences", "Practical automation"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                    <span style={{ ...iconBox(24, c.successSoft, c.success), borderRadius: 8 }}><Check size={14} /></span>{t}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => go("contact")} style={btnPrimary}>Work with us <ArrowRight size={16} /></button>
            </div>
          </div>
        </section>

        {/* ============ WHY US ============ */}
        <section style={{ padding: pad, background: c.bg2 }}>
          <div style={wrap}>
            <div style={{ textAlign: "center", maxWidth: 580, margin: "0 auto 48px" }}>
              <span style={eyebrow}>Why Weblytics</span>
              <h2 style={h2}>More than just <span style={gradText}>technology</span></h2>
              <p style={{ margin: 0, fontSize: 16, color: c.muted }}>We solve real problems and build systems that grow with you.</p>
            </div>
            <div style={cols(4)}>
              {benefits.map((b) => (
                <Hover key={b.title} base={{ ...cardBase, padding: "28px 24px" }} hover={cardHover}>
                  <div style={{ ...iconBox(48), marginBottom: 18 }}>{b.icon}</div>
                  <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700 }}>{b.title}</h3>
                  <p style={{ margin: 0, fontSize: 14, color: c.muted }}>{b.description}</p>
                </Hover>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PROJECTS ============ */}
        <section id="projects" style={{ padding: pad }}>
          <div style={wrap}>
            <div style={{ maxWidth: 600, marginBottom: 48, textAlign: isTablet ? "center" : "left", marginLeft: isTablet ? "auto" : 0, marginRight: isTablet ? "auto" : 0 }}>
              <span style={eyebrow}>What we build</span>
              <h2 style={h2}>Solutions for <span style={gradText}>real-world needs</span></h2>
              <p style={{ margin: 0, fontSize: 16, color: c.muted }}>The kinds of digital products we design, build and customize.</p>
            </div>
            <div style={cols(4)}>
              {projects.map((p) => (
                <Hover key={p.title} base={{ ...cardBase, padding: 24, display: "flex", flexDirection: "column" }} hover={cardHover}>
                  <div style={{ ...iconBox(46), marginBottom: 18 }}>{p.icon}</div>
                  <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700 }}>{p.title}</h3>
                  <p style={{ margin: "0 0 18px", fontSize: 14, color: c.muted, flex: 1 }}>{p.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {p.tags.map((t) => (
                      <span key={t} style={{ padding: "4px 11px", borderRadius: 999, background: c.input, border: `1px solid ${c.border}`, fontSize: 11, fontWeight: 500, color: c.muted }}>{t}</span>
                    ))}
                  </div>
                </Hover>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section style={{ padding: isMobile ? "0 18px 64px" : "0 32px 96px" }}>
          <div style={{ ...wrap, background: GRAD, borderRadius: 32, padding: isMobile ? "36px 24px" : "56px 60px", display: "flex",
            flexDirection: isTablet ? "column" : "row", alignItems: isTablet ? "flex-start" : "center", justifyContent: "space-between",
            gap: 28, boxShadow: "0 24px 60px rgba(99,102,241,0.35)", position: "relative", overflow: "hidden" }}>
            <div aria-hidden style={{ position: "absolute", top: -90, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ margin: "0 0 10px", fontSize: isMobile ? 26 : 36, fontWeight: 800, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                Let's build something useful together.
              </h2>
              <p style={{ margin: 0, fontSize: 15, color: "rgba(255,255,255,0.88)", maxWidth: 480 }}>
                Share your idea, business or project and we'll help you find the right digital solution.
              </p>
            </div>
            <button type="button" onClick={() => go("contact")}
              style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 26px", borderRadius: 999, border: "none",
                background: "#fff", color: "#4338ca", fontWeight: 700, fontSize: 15, cursor: "pointer", whiteSpace: "nowrap",
                boxShadow: "0 10px 24px rgba(0,0,0,0.18)", fontFamily: "inherit", width: isMobile ? "100%" : "auto", justifyContent: "center" }}>
              Start a conversation <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* ============ CONTACT ============ */}
        <section id="contact" style={{ padding: pad, background: c.bg2 }}>
          <div style={{ ...wrap, display: "grid", gridTemplateColumns: isTablet ? "1fr" : "0.9fr 1.1fr", gap: isTablet ? 40 : 56 }}>
            <div>
              <span style={eyebrow}>Contact us</span>
              <h2 style={h2}>Let's discuss your <span style={gradText}>project</span></h2>
              <p style={{ margin: "0 0 28px", fontSize: 16, color: c.muted }}>
                Have a website idea, an automation need or an analytics project? Send us the details.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 26 }}>
                <Hover as="a" href={`mailto:${CONTACT_EMAIL}`}
                  base={{ ...cardBase, display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 18, textDecoration: "none", color: "inherit" }}
                  hover={{ borderColor: c.accent }}>
                  <div style={iconBox(44)}><Mail size={18} /></div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: c.dim }}>Email</div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: c.text, wordBreak: "break-all" }}>{CONTACT_EMAIL}</div>
                  </div>
                </Hover>

                <Hover as="button" type="button" onClick={openWhatsApp}
                  base={{ ...cardBase, display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 18, cursor: "pointer", textAlign: "left", width: "100%", color: "inherit", fontFamily: "inherit" }}
                  hover={{ borderColor: c.success }}>
                  <div style={iconBox(44, c.successSoft, c.success)}><MessageCircle size={18} /></div>
                  <div>
                    <div style={{ fontSize: 11, color: c.dim }}>WhatsApp</div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: c.text }}>Start a conversation</div>
                  </div>
                </Hover>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[[INSTAGRAM_URL, <FaInstagram size={16} />, "Instagram"], [YOUTUBE_URL, <FaYoutube size={16} />, "YouTube"], [GITHUB_URL, <FaGithub size={16} />, "GitHub"]].map(([href, ic, t]) => (
                  <Hover as="a" key={t} href={href} target="_blank" rel="noreferrer"
                    base={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 999, background: c.card, border: `1px solid ${c.border}`, color: c.muted, textDecoration: "none", fontSize: 13, fontWeight: 500, transition: "all .2s" }}
                    hover={{ color: c.text, borderColor: c.accent }}>
                    {ic}{t}
                  </Hover>
                ))}
              </div>
            </div>

            <div style={{ ...glass, padding: isMobile ? 22 : 36 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 21, fontWeight: 700 }}>Tell us about your project</h3>
              <p style={{ margin: "0 0 24px", fontSize: 14, color: c.muted }}>We'll reply as soon as possible.</p>

              {formStatus.message && (
                <div role="status" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 14, marginBottom: 18, fontSize: 13,
                  background: formStatus.type === "success" ? c.successSoft : c.dangerSoft,
                  color: formStatus.type === "success" ? c.success : c.danger }}>
                  {formStatus.type === "success" ? <Check size={16} /> : <X size={16} />}
                  <span>{formStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label htmlFor="name" style={label}>Name *</label>
                    <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="Your name" autoComplete="name" style={input} />
                  </div>
                  <div>
                    <label htmlFor="email" style={label}>Email *</label>
                    <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" autoComplete="email" style={input} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label htmlFor="phone" style={label}>Phone</label>
                    <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="Optional" autoComplete="tel" style={input} />
                  </div>
                  <div>
                    <label htmlFor="service" style={label}>Service *</label>
                    <div style={{ position: "relative" }}>
                      <select id="service" name="service" value={formData.service} onChange={handleInputChange}
                        style={{ ...input, paddingRight: 40, appearance: "none", WebkitAppearance: "none", cursor: "pointer" }}>
                        <option value="">Select a service</option>
                        {services.map((s) => (<option key={s._id || s.slug} value={s.title}>{s.title}</option>))}
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown size={15} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: c.dim, pointerEvents: "none" }} />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <label htmlFor="message" style={label}>Project details *</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows={5}
                    placeholder="Tell us about your project, requirements, budget or goals..." style={{ ...input, resize: "vertical" }} />
                </div>

                <button type="submit" disabled={submitting} style={{ ...btnPrimary, width: "100%", opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}>
                  {submitting ? (
                    <>
                      <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                      Sending...
                    </>
                  ) : (<>Send enquiry <Send size={15} /></>)}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer style={{ borderTop: `1px solid ${c.border}`, padding: isMobile ? "48px 18px 24px" : "64px 32px 28px" }}>
        <div style={wrap}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1.5fr 1fr 1fr 1fr", gap: isMobile ? 32 : 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ ...iconBox(38, GRAD, "#fff"), fontWeight: 800, fontSize: 16 }}>W</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.1 }}>Weblytics</div>
                  <div style={{ fontSize: 11, color: c.muted }}>Studio</div>
                </div>
              </div>
              <p style={{ margin: "0 0 14px", fontSize: 13, color: c.muted, maxWidth: 280 }}>
                Building digital solutions with web development, AI automation and data analytics.
              </p>
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ display: "inline-flex", alignItems: "center", gap: 7, color: c.accent, fontSize: 13, fontWeight: 500, textDecoration: "none", wordBreak: "break-all" }}>
                <Mail size={14} /> {CONTACT_EMAIL}
              </a>
            </div>

            {[
              ["Company", ["about", "services", "projects", "contact"].map((i) => ({ k: i, t: i, f: () => go(i), cap: true }))],
              ["Services", services.slice(0, 4).map((s) => ({ k: s._id || s.slug, t: s.title, f: () => handleServiceSelect(s) }))],
            ].map(([title, items]) => (
              <div key={title}>
                <h4 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700 }}>{title}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.map((it) => (
                    <Hover as="button" key={it.k} type="button" onClick={it.f}
                      base={{ background: "none", border: "none", color: c.muted, fontSize: 13, cursor: "pointer", textAlign: "left", padding: 0, fontFamily: "inherit", textTransform: it.cap ? "capitalize" : "none", transition: "color .2s" }}
                      hover={{ color: c.text }}>
                      {it.t}
                    </Hover>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <h4 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700 }}>Follow us</h4>
              <div style={{ display: "flex", gap: 10 }}>
                {[[INSTAGRAM_URL, <FaInstagram size={16} />, "Instagram"], [YOUTUBE_URL, <FaYoutube size={16} />, "YouTube"], [GITHUB_URL, <FaGithub size={16} />, "GitHub"]].map(([href, ic, t]) => (
                  <Hover as="a" key={t} href={href} target="_blank" rel="noreferrer" aria-label={t}
                    base={{ ...iconBox(40, c.card, c.muted), border: `1px solid ${c.border}`, textDecoration: "none", transition: "all .2s" }}
                    hover={{ color: c.accent, borderColor: c.accent }}>
                    {ic}
                  </Hover>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10, paddingTop: 22, borderTop: `1px solid ${c.border}`, fontSize: 12, color: c.dim }}>
            <span>© {new Date().getFullYear()} Weblytics Studio. All rights reserved.</span>
            <span>Built with modern technology.</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <button type="button" onClick={openWhatsApp} aria-label="Contact on WhatsApp"
        style={{ position: "fixed", bottom: 22, right: 22, width: 56, height: 56, borderRadius: "50%", background: "#25D366", color: "#fff",
          border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 90,
          boxShadow: "0 10px 26px rgba(37,211,102,0.45)", animation: "pulse 2.6s ease-out infinite" }}>
        <MessageCircle size={25} />
      </button>

      {/* Keyframes, reset and focus styles (cannot be expressed inline) */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.5); } 70%,100% { box-shadow: 0 0 0 16px rgba(37,211,102,0); } }
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
        body { margin: 0; }
        button:active:not(:disabled) { transform: scale(0.97); }
        input::placeholder, textarea::placeholder { color: ${c.dim}; }
        input:focus, textarea:focus, select:focus, button:focus-visible, a:focus-visible { outline: 2px solid ${c.accent}; outline-offset: 2px; }
        select option { background: ${c.bg2}; color: ${c.text}; }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
      `}</style>
    </div>
  );
}
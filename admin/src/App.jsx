import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  Database,
  Eye,
  EyeOff,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  MoreVertical,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  Trash2,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
  Sun,
  Moon,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "weblytics_admin_token";
const THEME_KEY = "weblytics_theme";

const defaultStats = {
  totalLeads: 0,
  newLeads: 0,
  contactedLeads: 0,
  inProgressLeads: 0,
  convertedLeads: 0,
  closedLeads: 0,
  conversionRate: 0,
};

const emptyService = {
  title: "",
  slug: "",
  description: "",
  features: "",
  status: "Active",
  displayOrder: 0,
};

/* =========================================================
   THEME DEFINITIONS
========================================================= */
const themes = {
  dark: {
    name: "dark",
    bg: "#0b1120",
    bgSecondary: "#111827",
    sidebar: "#0f172a",
    card: "#1e293b",
    cardHover: "#243044",
    border: "#334155",
    text: "#f1f5f9",
    textMuted: "#94a3b8",
    textDim: "#64748b",
    accent: "#6366f1",
    accentHover: "#818cf8",
    accentSoft: "rgba(99, 102, 241, 0.15)",
    success: "#22c55e",
    successSoft: "rgba(34, 197, 94, 0.15)",
    warning: "#f59e0b",
    warningSoft: "rgba(245, 158, 11, 0.15)",
    danger: "#ef4444",
    dangerSoft: "rgba(239, 68, 68, 0.15)",
    inputBg: "#0f172a",
    shadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
    shadowSm: "0 4px 20px -4px rgba(0,0,0,0.4)",
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    overlay: "rgba(0,0,0,0.7)",
  },
  light: {
    name: "light",
    bg: "#f1f5f9",
    bgSecondary: "#e2e8f0",
    sidebar: "#ffffff",
    card: "#ffffff",
    cardHover: "#f8fafc",
    border: "#e2e8f0",
    text: "#0f172a",
    textMuted: "#475569",
    textDim: "#94a3b8",
    accent: "#4f46e5",
    accentHover: "#6366f1",
    accentSoft: "rgba(79, 70, 229, 0.1)",
    success: "#16a34a",
    successSoft: "rgba(22, 163, 74, 0.1)",
    warning: "#d97706",
    warningSoft: "rgba(217, 119, 6, 0.1)",
    danger: "#dc2626",
    dangerSoft: "rgba(220, 38, 38, 0.1)",
    inputBg: "#f8fafc",
    shadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
    shadowSm: "0 4px 20px -4px rgba(0,0,0,0.06)",
    gradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    overlay: "rgba(15, 23, 42, 0.5)",
  },
};

function App() {
  /* =========================================================
     AUTH
  ========================================================= */
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) || ""
  );
  const [admin, setAdmin] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  /* =========================================================
     THEME & RESPONSIVE
  ========================================================= */
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || "dark"
  );
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  const colors = themes[theme];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =========================================================
     DASHBOARD
  ========================================================= */
  const [dashboardStats, setDashboardStats] = useState(defaultStats);
  const [recentLeads, setRecentLeads] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  /* =========================================================
     LEADS
  ========================================================= */
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState(null);

  /* =========================================================
     SERVICES
  ========================================================= */
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [serviceError, setServiceError] = useState("");
  const [serviceSaving, setServiceSaving] = useState(false);

  /* =========================================================
     MESSAGES
  ========================================================= */
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageSearch, setMessageSearch] = useState("");
  const [messageServiceFilter, setMessageServiceFilter] = useState("All");
  const [messageReadFilter, setMessageReadFilter] = useState("All");
  const [messageError, setMessageError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageActionLoading, setMessageActionLoading] = useState("");

  /* =========================================================
     SETTINGS
  ========================================================= */
  const [apiStatus, setApiStatus] = useState("checking");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  /* =========================================================
     GENERAL
  ========================================================= */
  const [notification, setNotification] = useState({ type: "", message: "" });

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: "", message: "" }), 3500);
  };

  /* =========================================================
     AUTH HEADERS
  ========================================================= */
  const authHeaders = () => {
    const currentToken = localStorage.getItem(TOKEN_KEY) || token;
    return {
      Authorization: `Bearer ${currentToken}`,
      "Content-Type": "application/json",
    };
  };

  /* =========================================================
     AUTH CHECK
  ========================================================= */
  useEffect(() => {
    if (token) fetchCurrentAdmin();
  }, [token]);

  const fetchCurrentAdmin = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: authHeaders(),
      });
      if (response.status === 401) {
        handleLogout(false);
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to verify session.");
      setAdmin(data.admin || data.user || data);
    } catch (error) {
      console.error("Auth verification error:", error);
      handleLogout(false);
    }
  };

  /* =========================================================
     LOGIN
  ========================================================= */
  const handleLoginInput = (event) => {
    const { name, value } = event.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    setLoginError("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");
    if (!loginForm.email || !loginForm.password) {
      setLoginError("Please enter your email and password.");
      return;
    }
    try {
      setLoginLoading(true);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid email or password.");
      const receivedToken = data.token || data.accessToken || data.admin?.token;
      if (!receivedToken) throw new Error("Login succeeded but no authentication token was returned.");
      localStorage.setItem(TOKEN_KEY, receivedToken);
      setToken(receivedToken);
      setAdmin(data.admin || data.user || null);
      setLoginForm({ email: "", password: "" });
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error.message || "Unable to login. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */
  const handleLogout = (showMessage = true) => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setAdmin(null);
    setDashboardStats(defaultStats);
    setRecentLeads([]);
    setLeads([]);
    setServices([]);
    setMessages([]);
    setSelectedMessage(null);
    setMessageError("");
    if (showMessage) showNotification("success", "You have been logged out.");
  };

  /* =========================================================
     DASHBOARD
  ========================================================= */
  const fetchDashboardStats = async () => {
    try {
      setDashboardLoading(true);
      const response = await fetch(`${API_URL}/dashboard/stats`, {
        headers: authHeaders(),
      });
      if (response.status === 401) {
        handleLogout(false);
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load dashboard.");
      setDashboardStats({ ...defaultStats, ...(data.stats || {}) });
      setRecentLeads(data.recentLeads || []);
    } catch (error) {
      console.error("Dashboard loading error:", error);
      showNotification("error", error.message || "Failed to load dashboard.");
    } finally {
      setDashboardLoading(false);
    }
  };

  /* =========================================================
     LEADS
  ========================================================= */
  const fetchLeads = async () => {
    try {
      setLeadsLoading(true);
      const response = await fetch(`${API_URL}/leads`, { headers: authHeaders() });
      if (response.status === 401) {
        handleLogout(false);
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load leads.");
      setLeads(Array.isArray(data) ? data : data.leads || []);
    } catch (error) {
      console.error("Leads loading error:", error);
      showNotification("error", error.message || "Failed to load leads.");
    } finally {
      setLeadsLoading(false);
    }
  };

  const updateLeadStatus = async (leadId, status) => {
    try {
      const response = await fetch(`${API_URL}/leads/${leadId}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      if (response.status === 401) {
        handleLogout(false);
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update lead.");
      await fetchLeads();
      await fetchDashboardStats();
      if (selectedLead && selectedLead._id === leadId) {
        setSelectedLead((prev) => ({ ...prev, status }));
      }
      showNotification("success", "Lead status updated successfully.");
    } catch (error) {
      console.error("Lead status error:", error);
      showNotification("error", error.message || "Failed to update lead.");
    }
  };

  /* =========================================================
     SERVICES
  ========================================================= */
  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      const response = await fetch(`${API_URL}/services`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load services.");
      setServices(Array.isArray(data) ? data : data.services || []);
    } catch (error) {
      console.error("Services loading error:", error);
      showNotification("error", error.message || "Failed to load services.");
    } finally {
      setServicesLoading(false);
    }
  };

  const openCreateService = () => {
    setEditingService(null);
    setServiceForm({ ...emptyService });
    setServiceError("");
    setServiceModalOpen(true);
  };

  const openEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title || "",
      slug: service.slug || "",
      description: service.description || "",
      features: Array.isArray(service.features) ? service.features.join("\n") : "",
      status: service.status || "Active",
      displayOrder: service.displayOrder ?? 0,
    });
    setServiceError("");
    setServiceModalOpen(true);
  };

  const handleServiceInput = (event) => {
    const { name, value } = event.target;
    setServiceForm((prev) => ({ ...prev, [name]: value }));
    setServiceError("");
  };

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleServiceTitleChange = (event) => {
    const value = event.target.value;
    setServiceForm((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug ? prev.slug : generateSlug(value),
    }));
  };

  const saveService = async (event) => {
    event.preventDefault();
    setServiceError("");
    if (!serviceForm.title.trim()) {
      setServiceError("Service title is required.");
      return;
    }
    if (!serviceForm.description.trim()) {
      setServiceError("Service description is required.");
      return;
    }
    try {
      setServiceSaving(true);
      const features = serviceForm.features
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
      const payload = {
        title: serviceForm.title.trim(),
        slug: serviceForm.slug.trim() || generateSlug(serviceForm.title),
        description: serviceForm.description.trim(),
        features,
        status: serviceForm.status,
        displayOrder: Number(serviceForm.displayOrder) || 0,
      };
      const url = editingService
        ? `${API_URL}/services/${editingService._id}`
        : `${API_URL}/services`;
      const method = editingService ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      if (response.status === 401) {
        handleLogout(false);
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save service.");
      await fetchServices();
      setServiceModalOpen(false);
      setEditingService(null);
      setServiceForm({ ...emptyService });
      showNotification(
        "success",
        editingService ? "Service updated successfully." : "Service created successfully."
      );
    } catch (error) {
      console.error("Service save error:", error);
      setServiceError(error.message || "Failed to save service.");
    } finally {
      setServiceSaving(false);
    }
  };

  const deleteService = async (service) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${service.title}"?`);
    if (!confirmed) return;
    try {
      const response = await fetch(`${API_URL}/services/${service._id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (response.status === 401) {
        handleLogout(false);
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete service.");
      await fetchServices();
      showNotification("success", "Service deleted successfully.");
    } catch (error) {
      console.error("Service deletion error:", error);
      showNotification("error", error.message || "Failed to delete service.");
    }
  };

  /* =========================================================
     MESSAGES
  ========================================================= */
  const fetchMessages = async (showLoader = true) => {
    try {
      if (showLoader) setMessagesLoading(true);
      setMessageError("");
      const response = await fetch(`${API_URL}/messages`, {
        headers: authHeaders(),
      });
      if (response.status === 401) {
        handleLogout(false);
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load messages.");
      const receivedMessages = Array.isArray(data) ? data : data.messages || [];
      setMessages(receivedMessages);
    } catch (error) {
      console.error("Messages loading error:", error);
      setMessageError(error.message || "Unable to load messages.");
    } finally {
      if (showLoader) setMessagesLoading(false);
    }
  };

  const updateMessageInState = (updatedMessage) => {
    if (!updatedMessage?._id) return;
    setMessages((prev) =>
      prev.map((message) =>
        message._id === updatedMessage._id ? { ...message, ...updatedMessage } : message
      )
    );
    setSelectedMessage((prev) =>
      prev?._id === updatedMessage._id ? { ...prev, ...updatedMessage } : prev
    );
  };

  const messageAction = async (message, action) => {
    if (!message?._id) return;
    const loadingKey = `${message._id}-${action}`;
    try {
      setMessageActionLoading(loadingKey);
      const url = `${API_URL}/messages/${message._id}/${action}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: authHeaders(),
      });
      if (response.status === 401) {
        handleLogout(false);
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update message.");
      updateMessageInState(data.data || data.message);
      if (action === "read") showNotification("success", "Message marked as read.");
      if (action === "unread") showNotification("success", "Message marked as unread.");
      if (action === "replied") showNotification("success", "Message marked as replied.");
    } catch (error) {
      console.error("Message action error:", error);
      showNotification("error", error.message || "Unable to update message.");
    } finally {
      setMessageActionLoading("");
    }
  };

  const deleteMessage = async (message) => {
    if (!message?._id) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete the enquiry from "${message.name || "this customer"}"?`
    );
    if (!confirmed) return;
    try {
      setMessageActionLoading(`${message._id}-delete`);
      const response = await fetch(`${API_URL}/leads/${message._id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (response.status === 401) {
        handleLogout(false);
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to delete enquiry.");
      setMessages((prev) => prev.filter((item) => item._id !== message._id));
      setSelectedMessage((prev) => (prev?._id === message._id ? null : prev));
      showNotification("success", "Enquiry deleted successfully.");
    } catch (error) {
      console.error("Message deletion error:", error);
      showNotification("error", error.message || "Unable to delete enquiry.");
    } finally {
      setMessageActionLoading("");
    }
  };

  useEffect(() => {
    if (!token || activeSection !== "messages") return undefined;
    const interval = setInterval(() => fetchMessages(false), 30000);
    return () => clearInterval(interval);
  }, [activeSection, token]);

  /* =========================================================
     SETTINGS / API HEALTH
  ========================================================= */
  const checkApiHealth = async () => {
    try {
      setApiStatus("checking");
      const response = await fetch(`${API_URL}/health`);
      if (!response.ok) throw new Error("API returned an error.");
      setApiStatus("online");
    } catch (error) {
      console.error("API health error:", error);
      setApiStatus("offline");
    }
  };

  /* =========================================================
     CHANGE PASSWORD
  ========================================================= */
  const handlePasswordInput = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordMessage({ type: "", text: "" });
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage({ type: "", text: "" });
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage({ type: "error", text: "Please fill all password fields." });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: "New password must contain at least 8 characters." });
      return;
    }
    try {
      setPasswordLoading(true);
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      if (response.status === 401) {
        handleLogout(false);
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to change password.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordMessage({ type: "success", text: "Password changed successfully." });
    } catch (error) {
      console.error("Password change error:", error);
      setPasswordMessage({ type: "error", text: error.message || "Failed to change password." });
    } finally {
      setPasswordLoading(false);
    }
  };

  /* =========================================================
     SECTION LOADING
  ========================================================= */
  useEffect(() => {
    if (!token) return;
    if (activeSection === "dashboard") fetchDashboardStats();
    if (activeSection === "leads") fetchLeads();
    if (activeSection === "services") fetchServices();
    if (activeSection === "messages") fetchMessages();
    if (activeSection === "settings") checkApiHealth();
  }, [activeSection, token]);

  /* =========================================================
     FILTERED LEADS
  ========================================================= */
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const search = leadSearch.toLowerCase().trim();
      const matchesSearch =
        !search ||
        String(lead.name || "").toLowerCase().includes(search) ||
        String(lead.email || "").toLowerCase().includes(search) ||
        String(lead.phone || "").toLowerCase().includes(search) ||
        String(lead.service || "").toLowerCase().includes(search);
      const matchesStatus = leadStatusFilter === "All" || lead.status === leadStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, leadSearch, leadStatusFilter]);

  /* =========================================================
     FILTERED MESSAGES
  ========================================================= */
  const filteredMessages = useMemo(() => {
    const search = messageSearch.toLowerCase().trim();
    return messages.filter((message) => {
      const matchesSearch =
        !search ||
        String(message.name || "").toLowerCase().includes(search) ||
        String(message.email || "").toLowerCase().includes(search) ||
        String(message.phone || "").toLowerCase().includes(search) ||
        String(message.service || "").toLowerCase().includes(search) ||
        String(message.message || "").toLowerCase().includes(search);
      const matchesService =
        messageServiceFilter === "All" || message.service === messageServiceFilter;
      const matchesRead =
        messageReadFilter === "All" ||
        (messageReadFilter === "Unread" && !message.isRead) ||
        (messageReadFilter === "Read" && message.isRead) ||
        (messageReadFilter === "Replied" && message.isReplied);
      return matchesSearch && matchesService && matchesRead;
    });
  }, [messages, messageSearch, messageServiceFilter, messageReadFilter]);

  const unreadMessageCount = useMemo(
    () => messages.filter((message) => !message.isRead).length,
    [messages]
  );

  /* =========================================================
     FORMATTERS
  ========================================================= */
  const formatDate = (date) => {
    if (!date) return "—";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "—";
    try {
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "A";
    return parts
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getStatusClass = (status) =>
    String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-");

  /* =========================================================
     NAVIGATION
  ========================================================= */
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={19} /> },
    { id: "leads", label: "Leads", icon: <Users size={19} /> },
    { id: "services", label: "Services", icon: <Code2 size={19} /> },
    { id: "messages", label: "Messages", icon: <Mail size={19} /> },
    { id: "settings", label: "Settings", icon: <Settings size={19} /> },
  ];

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  /* =========================================================
     REUSABLE STYLE HELPERS
  ========================================================= */
  const s = {
    // Buttons
    primaryBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 18px",
      borderRadius: "10px",
      border: "none",
      background: colors.gradient,
      color: "#fff",
      fontWeight: 600,
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
    },
    outlineBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 18px",
      borderRadius: "10px",
      border: `1px solid ${colors.border}`,
      background: "transparent",
      color: colors.text,
      fontWeight: 500,
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    iconBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "36px",
      height: "36px",
      borderRadius: "8px",
      border: `1px solid ${colors.border}`,
      background: "transparent",
      color: colors.textMuted,
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    // Cards
    card: {
      background: colors.card,
      borderRadius: "16px",
      border: `1px solid ${colors.border}`,
      boxShadow: colors.shadowSm,
      overflow: "hidden",
    },
    // Inputs
    input: {
      width: "100%",
      padding: "12px 14px 12px 42px",
      borderRadius: "10px",
      border: `1px solid ${colors.border}`,
      background: colors.inputBg,
      color: colors.text,
      fontSize: "14px",
      outline: "none",
      transition: "border-color 0.2s ease",
    },
    // Status badges
    badge: (type) => {
      const map = {
        new: { bg: colors.warningSoft, color: colors.warning },
        contacted: { bg: colors.accentSoft, color: colors.accent },
        "in-progress": { bg: "rgba(139,92,246,0.15)", color: "#a78bfa" },
        converted: { bg: colors.successSoft, color: colors.success },
        closed: { bg: "rgba(100,116,139,0.15)", color: colors.textMuted },
        active: { bg: colors.successSoft, color: colors.success },
        inactive: { bg: "rgba(100,116,139,0.15)", color: colors.textMuted },
        read: { bg: colors.accentSoft, color: colors.accent },
        unread: { bg: colors.warningSoft, color: colors.warning },
        replied: { bg: colors.successSoft, color: colors.success },
      };
      const style = map[type] || map.new;
      return {
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        background: style.bg,
        color: style.color,
      };
    },
  };

  /* =========================================================
     LOGIN SCREEN
  ========================================================= */
  if (!token || !admin) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.bg,
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Decorative background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: theme === "dark"
              ? "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.1) 0%, transparent 40%)"
              : "radial-gradient(ellipse at 20% 50%, rgba(79,70,229,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.06) 0%, transparent 40%)",
          }}
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "420px",
            margin: "20px",
            background: colors.card,
            borderRadius: "24px",
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
            padding: isMobile ? "28px 24px" : "40px 36px",
          }}
        >
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              ...s.iconBtn,
            }}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: colors.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: "0 8px 20px rgba(99,102,241,0.4)",
              }}
            >
              <Zap size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "18px", color: colors.text }}>Weblytics</div>
              <div style={{ fontSize: "13px", color: colors.textMuted }}>Studio</div>
            </div>
          </div>

          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ margin: "0 0 8px", fontSize: "26px", fontWeight: 700, color: colors.text }}>
              Welcome back
            </h1>
            <p style={{ margin: 0, fontSize: "14px", color: colors.textMuted, lineHeight: 1.5 }}>
              Sign in to manage your Weblytics Studio website.
            </p>
          </div>

          {loginError && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: colors.dangerSoft,
                color: colors.danger,
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              <AlertCircle size={18} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "18px" }}>
              <label
                htmlFor="login-email"
                style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: colors.textMuted }}
              >
                Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={18}
                  style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: colors.textDim }}
                />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="admin@weblytics.local"
                  value={loginForm.email}
                  onChange={handleLoginInput}
                  autoComplete="email"
                  required
                  style={s.input}
                />
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                htmlFor="login-password"
                style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: colors.textMuted }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Zap
                  size={18}
                  style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: colors.textDim }}
                />
                <input
                  id="login-password"
                  type={showCurrentPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={handleLoginInput}
                  autoComplete="current-password"
                  required
                  style={{ ...s.input, paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((p) => !p)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: colors.textDim,
                    cursor: "pointer",
                    padding: "4px",
                  }}
                >
                  {showCurrentPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              style={{
                ...s.primaryBtn,
                width: "100%",
                justifyContent: "center",
                padding: "13px 18px",
                opacity: loginLoading ? 0.7 : 1,
              }}
            >
              {loginLoading ? (
                <>
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowUpRight size={18} />
                </>
              )}
            </button>
          </form>

          <div
            style={{
              marginTop: "28px",
              textAlign: "center",
              fontSize: "12px",
              color: colors.textDim,
            }}
          >
            Weblytics Studio Admin
          </div>
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          input::placeholder { color: ${colors.textDim}; }
        `}</style>
      </div>
    );
  }

  /* =========================================================
     ADMIN PANEL
  ========================================================= */
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside
        style={{
          width: isMobile ? "280px" : "260px",
          background: colors.sidebar,
          borderRight: `1px solid ${colors.border}`,
          display: "flex",
          flexDirection: "column",
          position: isMobile ? "fixed" : "sticky",
          top: 0,
          left: isMobile ? (sidebarOpen ? 0 : "-100%") : 0,
          height: "100vh",
          zIndex: 50,
          transition: "left 0.3s ease",
          boxShadow: isMobile && sidebarOpen ? colors.shadow : "none",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 18px",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <button
            onClick={() => handleSectionChange("dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: colors.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Zap size={20} />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: "15px", color: colors.text }}>Weblytics</div>
              <div style={{ fontSize: "11px", color: colors.textMuted }}>Studio</div>
            </div>
          </button>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={{ ...s.iconBtn, width: "32px", height: "32px" }}>
              <X size={18} />
            </button>
          )}
        </div>

        <div
          style={{
            padding: "16px 18px 8px",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: colors.textDim,
          }}
        >
          MAIN MENU
        </div>

        <nav style={{ flex: 1, padding: "0 12px", overflowY: "auto" }}>
          {navigationItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  padding: "11px 14px",
                  marginBottom: "4px",
                  borderRadius: "10px",
                  border: "none",
                  background: isActive ? colors.accentSoft : "transparent",
                  color: isActive ? colors.accent : colors.textMuted,
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                }}
              >
                {item.icon}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.id === "leads" && dashboardStats.newLeads > 0 && (
                  <span
                    style={{
                      background: colors.accent,
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: "999px",
                      minWidth: "20px",
                      textAlign: "center",
                    }}
                  >
                    {dashboardStats.newLeads}
                  </span>
                )}
                {item.id === "messages" && unreadMessageCount > 0 && (
                  <span
                    style={{
                      background: colors.warning,
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: "999px",
                      minWidth: "20px",
                      textAlign: "center",
                    }}
                  >
                    {unreadMessageCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: "16px", borderTop: `1px solid ${colors.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: colors.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              {getInitials(admin?.name || admin?.email || "Admin")}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: "13px", color: colors.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {admin?.name || "Administrator"}
              </div>
              <div style={{ fontSize: "11px", color: colors.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {admin?.email || "admin@weblytics.local"}
              </div>
            </div>
          </div>
          <button
            onClick={() => handleLogout(true)}
            style={{
              ...s.outlineBtn,
              width: "100%",
              justifyContent: "center",
              color: colors.danger,
              borderColor: colors.dangerSoft,
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: colors.overlay,
            zIndex: 40,
          }}
        />
      )}

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* HEADER */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "14px 16px" : "16px 28px",
            background: colors.card,
            borderBottom: `1px solid ${colors.border}`,
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} style={s.iconBtn}>
                <Menu size={20} />
              </button>
            )}
            <div>
              <div style={{ fontSize: "12px", color: colors.textDim, marginBottom: "2px" }}>Admin Panel</div>
              <h1 style={{ margin: 0, fontSize: isMobile ? "18px" : "22px", fontWeight: 700, color: colors.text, textTransform: "capitalize" }}>
                {activeSection}
              </h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={toggleTheme} style={s.iconBtn} title="Toggle theme">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => {
                if (activeSection === "dashboard") fetchDashboardStats();
                if (activeSection === "leads") fetchLeads();
                if (activeSection === "services") fetchServices();
                if (activeSection === "messages") fetchMessages();
                if (activeSection === "settings") checkApiHealth();
              }}
              style={s.iconBtn}
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
            {!isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "6px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: colors.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  {getInitials(admin?.name || admin?.email || "Admin")}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "13px", color: colors.text }}>
                    {admin?.name || "Administrator"}
                  </div>
                  <div style={{ fontSize: "11px", color: colors.textMuted }}>Administrator</div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* NOTIFICATION */}
        {notification.message && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              margin: "16px 16px 0",
              padding: "12px 16px",
              borderRadius: "12px",
              background: notification.type === "success" ? colors.successSoft : colors.dangerSoft,
              color: notification.type === "success" ? colors.success : colors.danger,
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {notification.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span style={{ flex: 1 }}>{notification.message}</span>
            <button
              onClick={() => setNotification({ type: "", message: "" })}
              style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: "2px" }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* CONTENT */}
        <div style={{ flex: 1, padding: isMobile ? "16px" : "24px 28px", overflowY: "auto" }}>
          {/* =================================================
              DASHBOARD
          ================================================= */}
          {activeSection === "dashboard" && (
            <section>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700, color: colors.text }}>
                    Welcome back, {admin?.name || "Admin"}!
                  </h2>
                  <p style={{ margin: 0, fontSize: "14px", color: colors.textMuted }}>
                    Here's what's happening with your business today.
                  </p>
                </div>
                <button onClick={fetchDashboardStats} style={s.outlineBtn}>
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>

              {/* Stat cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                {[
                  { label: "Total Leads", value: dashboardStats.totalLeads, icon: <Users size={20} />, color: colors.accent, soft: colors.accentSoft },
                  { label: "New Leads", value: dashboardStats.newLeads, icon: <Clock3 size={20} />, color: colors.warning, soft: colors.warningSoft },
                  { label: "In Progress", value: dashboardStats.inProgressLeads, icon: <TrendingUp size={20} />, color: "#a78bfa", soft: "rgba(167,139,250,0.15)" },
                  { label: "Converted", value: dashboardStats.convertedLeads, icon: <CheckCircle2 size={20} />, color: colors.success, soft: colors.successSoft },
                ].map((stat) => (
                  <div key={stat.label} style={{ ...s.card, padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "12px",
                          background: stat.soft,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </div>
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: 700, color: colors.text, marginBottom: "4px" }}>
                      {dashboardLoading ? "..." : stat.value}
                    </div>
                    <div style={{ fontSize: "13px", color: colors.textMuted }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Secondary grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div style={{ ...s.card, padding: "22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 600, color: colors.text }}>Lead Overview</h3>
                      <p style={{ margin: 0, fontSize: "13px", color: colors.textMuted }}>Current lead pipeline</p>
                    </div>
                    <BarChart3 size={20} style={{ color: colors.textDim }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      { label: "New", value: dashboardStats.newLeads },
                      { label: "Contacted", value: dashboardStats.contactedLeads },
                      { label: "In Progress", value: dashboardStats.inProgressLeads },
                      { label: "Converted", value: dashboardStats.convertedLeads },
                      { label: "Closed", value: dashboardStats.closedLeads },
                    ].map((row) => (
                      <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "14px", color: colors.textMuted }}>{row.label}</span>
                        <strong style={{ fontSize: "15px", color: colors.text }}>{row.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ ...s.card, padding: "22px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "20px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 600, color: colors.text }}>Conversion Rate</h3>
                      <p style={{ margin: 0, fontSize: "13px", color: colors.textMuted }}>Leads converted</p>
                    </div>
                    <TrendingUp size={20} style={{ color: colors.textDim }} />
                  </div>
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      borderRadius: "50%",
                      background: `conic-gradient(${colors.accent} ${dashboardStats.conversionRate * 3.6}deg, ${colors.border} 0deg)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "110px",
                        height: "110px",
                        borderRadius: "50%",
                        background: colors.card,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <strong style={{ fontSize: "28px", color: colors.text }}>{dashboardStats.conversionRate}%</strong>
                      <span style={{ fontSize: "12px", color: colors.textMuted }}>Conversion</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Leads */}
              <div style={s.card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "18px 22px",
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 600, color: colors.text }}>Recent Leads</h3>
                    <p style={{ margin: 0, fontSize: "13px", color: colors.textMuted }}>Latest enquiries from your website</p>
                  </div>
                  <button onClick={() => handleSectionChange("leads")} style={{ ...s.outlineBtn, padding: "8px 14px" }}>
                    View all
                    <ArrowUpRight size={14} />
                  </button>
                </div>
                {recentLeads.length === 0 ? (
                  <div style={{ padding: "48px 20px", textAlign: "center" }}>
                    <Users size={36} style={{ color: colors.textDim, marginBottom: "12px" }} />
                    <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: colors.text }}>No leads yet</h3>
                    <p style={{ margin: 0, fontSize: "14px", color: colors.textMuted }}>New website enquiries will appear here.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                      <thead>
                        <tr style={{ background: colors.bgSecondary }}>
                          {["Lead", "Service", "Status", "Date"].map((h) => (
                            <th
                              key={h}
                              style={{
                                padding: "12px 18px",
                                textAlign: "left",
                                fontWeight: 600,
                                fontSize: "12px",
                                color: colors.textMuted,
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recentLeads.map((lead) => (
                          <tr key={lead._id} style={{ borderTop: `1px solid ${colors.border}` }}>
                            <td style={{ padding: "14px 18px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div
                                  style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "10px",
                                    background: colors.accentSoft,
                                    color: colors.accent,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: "13px",
                                  }}
                                >
                                  {getInitials(lead.name)}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 600, color: colors.text }}>{lead.name}</div>
                                  <div style={{ fontSize: "12px", color: colors.textMuted }}>{lead.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "14px 18px", color: colors.textMuted }}>{lead.service || "—"}</td>
                            <td style={{ padding: "14px 18px" }}>
                              <span style={s.badge(getStatusClass(lead.status))}>{lead.status}</span>
                            </td>
                            <td style={{ padding: "14px 18px", color: colors.textMuted }}>{formatDate(lead.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* =================================================
              LEADS
          ================================================= */}
          {activeSection === "leads" && (
            <section>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700, color: colors.text }}>Leads</h2>
                  <p style={{ margin: 0, fontSize: "14px", color: colors.textMuted }}>
                    Manage enquiries submitted through your website.
                  </p>
                </div>
                <button onClick={fetchLeads} style={s.outlineBtn}>
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>

              <div style={s.card}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    padding: "16px 18px",
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
                    <Search
                      size={18}
                      style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: colors.textDim }}
                    />
                    <input
                      type="text"
                      placeholder="Search leads..."
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      style={{ ...s.input, paddingLeft: "40px" }}
                    />
                  </div>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg,
                      color: colors.text,
                      fontSize: "14px",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {leadsLoading ? (
                  <div style={{ padding: "48px", textAlign: "center", color: colors.textMuted }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "24px",
                        height: "24px",
                        border: `3px solid ${colors.border}`,
                        borderTopColor: colors.accent,
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                        marginBottom: "12px",
                      }}
                    />
                    <div>Loading leads...</div>
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div style={{ padding: "48px 20px", textAlign: "center" }}>
                    <Users size={36} style={{ color: colors.textDim, marginBottom: "12px" }} />
                    <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: colors.text }}>No leads found</h3>
                    <p style={{ margin: 0, fontSize: "14px", color: colors.textMuted }}>Try changing your search or filters.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "800px" }}>
                      <thead>
                        <tr style={{ background: colors.bgSecondary }}>
                          {["Lead", "Phone", "Service", "Message", "Status", "Date", "Action"].map((h) => (
                            <th
                              key={h}
                              style={{
                                padding: "12px 16px",
                                textAlign: "left",
                                fontWeight: 600,
                                fontSize: "12px",
                                color: colors.textMuted,
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead) => (
                          <tr key={lead._id} style={{ borderTop: `1px solid ${colors.border}` }}>
                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div
                                  style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "10px",
                                    background: colors.accentSoft,
                                    color: colors.accent,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: "13px",
                                  }}
                                >
                                  {getInitials(lead.name)}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 600, color: colors.text }}>{lead.name}</div>
                                  <div style={{ fontSize: "12px", color: colors.textMuted }}>{lead.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "14px 16px", color: colors.textMuted }}>{lead.phone || "—"}</td>
                            <td style={{ padding: "14px 16px", color: colors.textMuted }}>{lead.service || "—"}</td>
                            <td style={{ padding: "14px 16px" }}>
                              <button
                                onClick={() => setSelectedLead(lead)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: colors.textMuted,
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  textAlign: "left",
                                  maxWidth: "180px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {lead.message ? lead.message.slice(0, 35) : "No message"}
                                {lead.message && lead.message.length > 35 && "..."}
                              </button>
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <select
                                value={lead.status || "New"}
                                onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: "8px",
                                  border: `1px solid ${colors.border}`,
                                  background: colors.inputBg,
                                  color: colors.text,
                                  fontSize: "13px",
                                  cursor: "pointer",
                                  outline: "none",
                                }}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Converted">Converted</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                            <td style={{ padding: "14px 16px", color: colors.textMuted }}>{formatDate(lead.createdAt)}</td>
                            <td style={{ padding: "14px 16px" }}>
                              <button onClick={() => setSelectedLead(lead)} style={s.iconBtn} title="View">
                                <Eye size={17} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* =================================================
              SERVICES
          ================================================= */}
          {activeSection === "services" && (
            <section>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700, color: colors.text }}>Services</h2>
                  <p style={{ margin: 0, fontSize: "14px", color: colors.textMuted }}>
                    Manage the services displayed on your public website.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button onClick={fetchServices} style={s.outlineBtn}>
                    <RefreshCw size={16} />
                    Refresh
                  </button>
                  <button onClick={openCreateService} style={s.primaryBtn}>
                    <Plus size={17} />
                    Add Service
                  </button>
                </div>
              </div>

              {servicesLoading ? (
                <div style={{ padding: "48px", textAlign: "center", color: colors.textMuted }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: "24px",
                      height: "24px",
                      border: `3px solid ${colors.border}`,
                      borderTopColor: colors.accent,
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                      marginBottom: "12px",
                    }}
                  />
                  <div>Loading services...</div>
                </div>
              ) : services.length === 0 ? (
                <div style={{ ...s.card, padding: "48px 20px", textAlign: "center" }}>
                  <Code2 size={40} style={{ color: colors.textDim, marginBottom: "12px" }} />
                  <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: colors.text }}>No services found</h3>
                  <p style={{ margin: "0 0 20px", fontSize: "14px", color: colors.textMuted }}>
                    Add your first service to display it on the website.
                  </p>
                  <button onClick={openCreateService} style={s.primaryBtn}>
                    <Plus size={17} />
                    Add Service
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "18px",
                  }}
                >
                  {services
                    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                    .map((service) => (
                      <article key={service._id} style={{ ...s.card, display: "flex", flexDirection: "column" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "16px 18px",
                            borderBottom: `1px solid ${colors.border}`,
                          }}
                        >
                          <div
                            style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "12px",
                              background: colors.accentSoft,
                              color: colors.accent,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Code2 size={20} />
                          </div>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button onClick={() => openEditService(service)} style={s.iconBtn} title="Edit">
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => deleteService(service)}
                              style={{ ...s.iconBtn, color: colors.danger }}
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                        <div style={{ padding: "18px", flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: colors.text }}>
                              {service.title}
                            </h3>
                            <span style={s.badge(service.status === "Active" ? "active" : "inactive")}>
                              {service.status}
                            </span>
                          </div>
                          <div style={{ fontSize: "12px", color: colors.textDim, marginBottom: "10px" }}>
                            /{service.slug}
                          </div>
                          <p style={{ margin: "0 0 14px", fontSize: "13px", color: colors.textMuted, lineHeight: 1.5 }}>
                            {service.description}
                          </p>
                          {Array.isArray(service.features) && service.features.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              {service.features.map((feature, idx) => (
                                <div
                                  key={idx}
                                  style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: colors.textMuted }}
                                >
                                  <Check size={13} style={{ color: colors.success }} />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 18px",
                            borderTop: `1px solid ${colors.border}`,
                            fontSize: "12px",
                            color: colors.textDim,
                          }}
                        >
                          <span>Display order: {service.displayOrder ?? 0}</span>
                          <button
                            onClick={() => openEditService(service)}
                            style={{
                              background: "none",
                              border: "none",
                              color: colors.accent,
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: "13px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            Edit
                            <ArrowUpRight size={13} />
                          </button>
                        </div>
                      </article>
                    ))}
                </div>
              )}
            </section>
          )}

          {/* =================================================
              MESSAGES
          ================================================= */}
          {activeSection === "messages" && (
            <section>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700, color: colors.text }}>Messages</h2>
                  <p style={{ margin: 0, fontSize: "14px", color: colors.textMuted }}>
                    Manage enquiries submitted through your website.
                  </p>
                </div>
                <button onClick={() => fetchMessages(true)} disabled={messagesLoading} style={s.outlineBtn}>
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>

              {/* Message stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                {[
                  { label: "Total Messages", value: messages.length, icon: <Mail size={20} />, color: colors.accent, soft: colors.accentSoft },
                  { label: "Unread Messages", value: unreadMessageCount, icon: <Clock3 size={20} />, color: colors.warning, soft: colors.warningSoft },
                  {
                    label: "Replied Messages",
                    value: messages.filter((m) => m.isReplied).length,
                    icon: <CheckCircle2 size={20} />,
                    color: colors.success,
                    soft: colors.successSoft,
                  },
                ].map((stat) => (
                  <div key={stat.label} style={{ ...s.card, padding: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          background: stat.soft,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </div>
                    </div>
                    <div style={{ fontSize: "26px", fontWeight: 700, color: colors.text }}>{stat.value}</div>
                    <div style={{ fontSize: "13px", color: colors.textMuted }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div style={s.card}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    padding: "16px 18px",
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
                    <Search
                      size={18}
                      style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: colors.textDim }}
                    />
                    <input
                      type="text"
                      placeholder="Search name, email, phone or message..."
                      value={messageSearch}
                      onChange={(e) => setMessageSearch(e.target.value)}
                      style={{ ...s.input, paddingLeft: "40px" }}
                    />
                  </div>
                  <select
                    value={messageServiceFilter}
                    onChange={(e) => setMessageServiceFilter(e.target.value)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg,
                      color: colors.text,
                      fontSize: "14px",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="All">All Services</option>
                    <option value="Web Development">Web Development</option>
                    <option value="AI & Automation">AI & Automation</option>
                    <option value="Data Analytics">Data Analytics</option>
                    <option value="Other">Other</option>
                  </select>
                  <select
                    value={messageReadFilter}
                    onChange={(e) => setMessageReadFilter(e.target.value)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg,
                      color: colors.text,
                      fontSize: "14px",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="All">All Messages</option>
                    <option value="Unread">Unread</option>
                    <option value="Read">Read</option>
                    <option value="Replied">Replied</option>
                  </select>
                </div>

                {messageError && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      margin: "16px",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      background: colors.dangerSoft,
                      color: colors.danger,
                      fontSize: "13px",
                    }}
                  >
                    <AlertCircle size={18} />
                    <span style={{ flex: 1 }}>{messageError}</span>
                    <button onClick={() => fetchMessages(true)} style={{ ...s.outlineBtn, padding: "6px 12px", fontSize: "12px" }}>
                      Try again
                    </button>
                  </div>
                )}

                {messagesLoading ? (
                  <div style={{ padding: "48px", textAlign: "center", color: colors.textMuted }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "24px",
                        height: "24px",
                        border: `3px solid ${colors.border}`,
                        borderTopColor: colors.accent,
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                        marginBottom: "12px",
                      }}
                    />
                    <div>Loading enquiries...</div>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div style={{ padding: "48px 20px", textAlign: "center" }}>
                    <Mail size={36} style={{ color: colors.textDim, marginBottom: "12px" }} />
                    <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: colors.text }}>
                      {messages.length === 0 ? "No messages yet" : "No messages found"}
                    </h3>
                    <p style={{ margin: 0, fontSize: "14px", color: colors.textMuted }}>
                      {messages.length === 0
                        ? "Website enquiries will appear here when customers contact you."
                        : "Try changing your search or filters."}
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "780px" }}>
                      <thead>
                        <tr style={{ background: colors.bgSecondary }}>
                          {["Sender", "Service", "Message", "Status", "Date", "Action"].map((h) => (
                            <th
                              key={h}
                              style={{
                                padding: "12px 16px",
                                textAlign: "left",
                                fontWeight: 600,
                                fontSize: "12px",
                                color: colors.textMuted,
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMessages.map((message) => {
                          const statusLabel = message.isReplied ? "Replied" : message.isRead ? "Read" : "Unread";
                          const statusClass = message.isReplied ? "replied" : message.isRead ? "read" : "unread";
                          return (
                            <tr
                              key={message._id}
                              style={{
                                borderTop: `1px solid ${colors.border}`,
                                background: !message.isRead ? colors.accentSoft : "transparent",
                              }}
                            >
                              <td style={{ padding: "14px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                  <div
                                    style={{
                                      width: "36px",
                                      height: "36px",
                                      borderRadius: "10px",
                                      background: colors.accentSoft,
                                      color: colors.accent,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: 700,
                                      fontSize: "13px",
                                    }}
                                  >
                                    {getInitials(message.name)}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 600, color: colors.text }}>{message.name || "Unknown"}</div>
                                    <div style={{ fontSize: "12px", color: colors.textMuted }}>{message.email || "No email"}</div>
                                    {message.phone && (
                                      <div style={{ fontSize: "12px", color: colors.textDim }}>{message.phone}</div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: "14px 16px" }}>
                                <span style={{ fontSize: "13px", color: colors.textMuted }}>{message.service || "Other"}</span>
                              </td>
                              <td style={{ padding: "14px 16px" }}>
                                <button
                                  onClick={() => setSelectedMessage(message)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: colors.textMuted,
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    textAlign: "left",
                                    maxWidth: "200px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {String(message.message || "").slice(0, 45)}
                                  {String(message.message || "").length > 45 && "..."}
                                </button>
                              </td>
                              <td style={{ padding: "14px 16px" }}>
                                <span style={s.badge(statusClass)}>{statusLabel}</span>
                              </td>
                              <td style={{ padding: "14px 16px", color: colors.textMuted }}>{formatDate(message.createdAt)}</td>
                              <td style={{ padding: "14px 16px" }}>
                                <div style={{ display: "flex", gap: "6px" }}>
                                  <button onClick={() => setSelectedMessage(message)} style={s.iconBtn} title="View">
                                    <Eye size={16} />
                                  </button>
                                  {!message.isRead ? (
                                    <button
                                      disabled={messageActionLoading === `${message._id}-read`}
                                      onClick={() => messageAction(message, "read")}
                                      style={s.iconBtn}
                                      title="Mark as read"
                                    >
                                      <Check size={16} />
                                    </button>
                                  ) : (
                                    <button
                                      disabled={messageActionLoading === `${message._id}-unread`}
                                      onClick={() => messageAction(message, "unread")}
                                      style={s.iconBtn}
                                      title="Mark as unread"
                                    >
                                      <Mail size={16} />
                                    </button>
                                  )}
                                  <button
                                    disabled={messageActionLoading === `${message._id}-delete`}
                                    onClick={() => deleteMessage(message)}
                                    style={{ ...s.iconBtn, color: colors.danger }}
                                    title="Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* =================================================
              SETTINGS
          ================================================= */}
          {activeSection === "settings" && (
            <section>
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700, color: colors.text }}>Settings</h2>
                <p style={{ margin: 0, fontSize: "14px", color: colors.textMuted }}>
                  Manage your admin account and application connection.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "18px",
                }}
              >
                {/* Profile */}
                <div style={{ ...s.card, padding: "22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 600, color: colors.text }}>Admin Profile</h3>
                      <p style={{ margin: 0, fontSize: "13px", color: colors.textMuted }}>Current administrator account</p>
                    </div>
                    <User size={20} style={{ color: colors.textDim }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "16px",
                        background: colors.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "22px",
                      }}
                    >
                      {getInitials(admin?.name || admin?.email || "Admin")}
                    </div>
                    <div>
                      <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 600, color: colors.text }}>
                        {admin?.name || "Administrator"}
                      </h3>
                      <p style={{ margin: "0 0 6px", fontSize: "14px", color: colors.textMuted }}>
                        {admin?.email || "admin@weblytics.local"}
                      </p>
                      <span style={s.badge("active")}>Administrator</span>
                    </div>
                  </div>
                </div>

                {/* API Status */}
                <div style={{ ...s.card, padding: "22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 600, color: colors.text }}>API Connection</h3>
                      <p style={{ margin: 0, fontSize: "13px", color: colors.textMuted }}>Backend server status</p>
                    </div>
                    <Activity size={20} style={{ color: colors.textDim }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background:
                          apiStatus === "online"
                            ? colors.success
                            : apiStatus === "offline"
                            ? colors.danger
                            : colors.warning,
                        boxShadow:
                          apiStatus === "online"
                            ? `0 0 0 4px ${colors.successSoft}`
                            : apiStatus === "offline"
                            ? `0 0 0 4px ${colors.dangerSoft}`
                            : `0 0 0 4px ${colors.warningSoft}`,
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: colors.text }}>
                        {apiStatus === "online" ? "API Online" : apiStatus === "offline" ? "API Offline" : "Checking API..."}
                      </div>
                      <div style={{ fontSize: "12px", color: colors.textDim }}>{API_URL}</div>
                    </div>
                  </div>
                  <button onClick={checkApiHealth} style={{ ...s.outlineBtn, width: "100%", justifyContent: "center" }}>
                    <RefreshCw size={16} />
                    Check Connection
                  </button>
                </div>

                {/* Change Password */}
                <div style={{ ...s.card, padding: "22px", gridColumn: isMobile ? "auto" : "1 / -1" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 600, color: colors.text }}>Change Password</h3>
                      <p style={{ margin: 0, fontSize: "13px", color: colors.textMuted }}>Update your administrator password</p>
                    </div>
                    <Settings size={20} style={{ color: colors.textDim }} />
                  </div>

                  {passwordMessage.text && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        background: passwordMessage.type === "success" ? colors.successSoft : colors.dangerSoft,
                        color: passwordMessage.type === "success" ? colors.success : colors.danger,
                        fontSize: "13px",
                        marginBottom: "18px",
                      }}
                    >
                      {passwordMessage.type === "success" ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
                      {passwordMessage.text}
                    </div>
                  )}

                  <form onSubmit={changePassword}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
                        gap: "16px",
                        marginBottom: "20px",
                      }}
                    >
                      {[
                        { name: "currentPassword", label: "Current Password", show: showCurrentPassword, setShow: setShowCurrentPassword },
                        { name: "newPassword", label: "New Password", show: showNewPassword, setShow: setShowNewPassword, placeholder: "Minimum 8 characters" },
                        { name: "confirmPassword", label: "Confirm New Password", show: showConfirmPassword, setShow: setShowConfirmPassword, placeholder: "Repeat new password" },
                      ].map((field) => (
                        <div key={field.name}>
                          <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: colors.textMuted }}>
                            {field.label}
                          </label>
                          <div style={{ position: "relative" }}>
                            <Zap
                              size={16}
                              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: colors.textDim }}
                            />
                            <input
                              type={field.show ? "text" : "password"}
                              name={field.name}
                              value={passwordForm[field.name]}
                              onChange={handlePasswordInput}
                              placeholder={field.placeholder || field.label}
                              required
                              style={{ ...s.input, paddingRight: "42px" }}
                            />
                            <button
                              type="button"
                              onClick={() => field.setShow((p) => !p)}
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                color: colors.textDim,
                                cursor: "pointer",
                                padding: "4px",
                              }}
                            >
                              {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="submit" disabled={passwordLoading} style={{ ...s.primaryBtn, opacity: passwordLoading ? 0.7 : 1 }}>
                      {passwordLoading ? (
                        <>
                          <span
                            style={{
                              width: "16px",
                              height: "16px",
                              border: "2px solid rgba(255,255,255,0.3)",
                              borderTopColor: "#fff",
                              borderRadius: "50%",
                              animation: "spin 0.8s linear infinite",
                            }}
                          />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save size={17} />
                          Update Password
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* System Info */}
                <div style={{ ...s.card, padding: "22px", gridColumn: isMobile ? "auto" : "1 / -1" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 600, color: colors.text }}>System Information</h3>
                      <p style={{ margin: 0, fontSize: "13px", color: colors.textMuted }}>Weblytics Studio configuration</p>
                    </div>
                    <Database size={20} style={{ color: colors.textDim }} />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
                      gap: "16px",
                    }}
                  >
                    {[
                      { label: "Frontend", value: "React + Vite" },
                      { label: "Backend", value: "Node + Express" },
                      { label: "Database", value: "MongoDB" },
                      { label: "Authentication", value: "JWT" },
                    ].map((item) => (
                      <div key={item.label} style={{ padding: "14px", borderRadius: "10px", background: colors.bgSecondary }}>
                        <div style={{ fontSize: "12px", color: colors.textDim, marginBottom: "4px" }}>{item.label}</div>
                        <div style={{ fontWeight: 600, fontSize: "14px", color: colors.text }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* =====================================================
          SERVICE MODAL
      ===================================================== */}
      {serviceModalOpen && (
        <div
          onClick={() => setServiceModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: colors.overlay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              ...s.card,
              width: "100%",
              maxWidth: "560px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "20px 22px",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 700, color: colors.text }}>
                  {editingService ? "Edit Service" : "Add Service"}
                </h2>
                <p style={{ margin: 0, fontSize: "13px", color: colors.textMuted }}>
                  Configure the service shown on your public website.
                </p>
              </div>
              <button onClick={() => setServiceModalOpen(false)} style={s.iconBtn}>
                <X size={18} />
              </button>
            </div>

            {serviceError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  margin: "16px 22px 0",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: colors.dangerSoft,
                  color: colors.danger,
                  fontSize: "13px",
                }}
              >
                <AlertCircle size={17} />
                {serviceError}
              </div>
            )}

            <form onSubmit={saveService} style={{ padding: "20px 22px" }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: colors.textMuted }}>
                    Service Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={serviceForm.title}
                    onChange={handleServiceTitleChange}
                    placeholder="e.g. Web Development"
                    required
                    style={{ ...s.input, paddingLeft: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: colors.textMuted }}>
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={serviceForm.slug}
                    onChange={handleServiceInput}
                    placeholder="web-development"
                    required
                    style={{ ...s.input, paddingLeft: "14px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: colors.textMuted }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={serviceForm.description}
                  onChange={handleServiceInput}
                  placeholder="Describe this service..."
                  required
                  style={{
                    ...s.input,
                    paddingLeft: "14px",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: colors.textMuted }}>
                  Features
                </label>
                <textarea
                  name="features"
                  rows={5}
                  value={serviceForm.features}
                  onChange={handleServiceInput}
                  placeholder={`Business Websites\nMERN Applications\nResponsive Design\nAdmin Dashboards`}
                  style={{
                    ...s.input,
                    paddingLeft: "14px",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
                <div style={{ fontSize: "12px", color: colors.textDim, marginTop: "6px" }}>Add one feature per line.</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: colors.textMuted }}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={serviceForm.status}
                    onChange={handleServiceInput}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg,
                      color: colors.text,
                      fontSize: "14px",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: colors.textMuted }}>
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={serviceForm.displayOrder}
                    onChange={handleServiceInput}
                    min="0"
                    style={{ ...s.input, paddingLeft: "14px" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setServiceModalOpen(false)} style={s.outlineBtn}>
                  Cancel
                </button>
                <button type="submit" disabled={serviceSaving} style={{ ...s.primaryBtn, opacity: serviceSaving ? 0.7 : 1 }}>
                  {serviceSaving ? (
                    <>
                      <span
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      {editingService ? "Update Service" : "Create Service"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          LEAD MODAL
      ===================================================== */}
      {selectedLead && (
        <div
          onClick={() => setSelectedLead(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: colors.overlay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              ...s.card,
              width: "100%",
              maxWidth: "520px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "20px 22px",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 700, color: colors.text }}>Lead Details</h2>
                <p style={{ margin: 0, fontSize: "13px", color: colors.textMuted }}>Enquiry information</p>
              </div>
              <button onClick={() => setSelectedLead(null)} style={s.iconBtn}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    background: colors.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "20px",
                  }}
                >
                  {getInitials(selectedLead.name)}
                </div>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 600, color: colors.text }}>
                    {selectedLead.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: "14px", color: colors.textMuted }}>{selectedLead.email}</p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                {[
                  { label: "Email", value: selectedLead.email || "—" },
                  { label: "Phone", value: selectedLead.phone || "—" },
                  { label: "Service", value: selectedLead.service || "—" },
                  { label: "Submitted", value: formatDateTime(selectedLead.createdAt) },
                ].map((item) => (
                  <div key={item.label} style={{ padding: "12px", borderRadius: "10px", background: colors.bgSecondary }}>
                    <div style={{ fontSize: "11px", color: colors.textDim, marginBottom: "4px" }}>{item.label}</div>
                    <div style={{ fontWeight: 600, fontSize: "13px", color: colors.text }}>{item.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "12px", color: colors.textDim, marginBottom: "8px" }}>Project Details</div>
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    background: colors.bgSecondary,
                    fontSize: "14px",
                    color: colors.text,
                    lineHeight: 1.6,
                  }}
                >
                  {selectedLead.message || "No message provided."}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "12px", color: colors.textDim, marginBottom: "10px" }}>Update Status</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {["New", "Contacted", "In Progress", "Converted", "Closed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateLeadStatus(selectedLead._id, status)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        border: selectedLead.status === status ? "none" : `1px solid ${colors.border}`,
                        background: selectedLead.status === status ? colors.gradient : "transparent",
                        color: selectedLead.status === status ? "#fff" : colors.textMuted,
                        fontWeight: 600,
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MESSAGE MODAL
      ===================================================== */}
      {selectedMessage && (
        <div
          onClick={() => setSelectedMessage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: colors.overlay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              ...s.card,
              width: "100%",
              maxWidth: "560px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "20px 22px",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 700, color: colors.text }}>Enquiry Details</h2>
                <p style={{ margin: 0, fontSize: "13px", color: colors.textMuted }}>
                  Customer message and contact information
                </p>
              </div>
              <button onClick={() => setSelectedMessage(null)} style={s.iconBtn}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "22px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    background: colors.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "20px",
                  }}
                >
                  {getInitials(selectedMessage.name)}
                </div>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 600, color: colors.text }}>
                    {selectedMessage.name || "Unknown customer"}
                  </h3>
                  <p style={{ margin: 0, fontSize: "14px", color: colors.textMuted }}>
                    {selectedMessage.email || "No email provided"}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                {[
                  { label: "Service", value: selectedMessage.service || "Other" },
                  { label: "Date", value: formatDateTime(selectedMessage.createdAt) },
                  {
                    label: "Status",
                    value: selectedMessage.isReplied ? "Replied" : selectedMessage.isRead ? "Read" : "Unread",
                  },
                ].map((item) => (
                  <div key={item.label} style={{ padding: "12px", borderRadius: "10px", background: colors.bgSecondary }}>
                    <div style={{ fontSize: "11px", color: colors.textDim, marginBottom: "4px" }}>{item.label}</div>
                    <div style={{ fontWeight: 600, fontSize: "13px", color: colors.text }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {selectedMessage.phone && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "12px", color: colors.textDim, marginBottom: "6px" }}>Phone</div>
                  <div
                    style={{
                      padding: "12px 14px",
                      borderRadius: "10px",
                      background: colors.bgSecondary,
                      fontSize: "14px",
                      color: colors.text,
                    }}
                  >
                    {selectedMessage.phone}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "12px", color: colors.textDim, marginBottom: "6px" }}>Message</div>
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    background: colors.bgSecondary,
                    fontSize: "14px",
                    color: colors.text,
                    lineHeight: 1.6,
                  }}
                >
                  {selectedMessage.message || "No message."}
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  onClick={() => {
                    if (!selectedMessage.isReplied) messageAction(selectedMessage, "replied");
                  }}
                  style={{ ...s.primaryBtn, textDecoration: "none" }}
                >
                  <Send size={16} />
                  Reply by Email
                </a>
                {selectedMessage.phone && (
                  <a href={`tel:${selectedMessage.phone}`} style={{ ...s.outlineBtn, textDecoration: "none" }}>
                    <Phone size={16} />
                    Call Customer
                  </a>
                )}
                {!selectedMessage.isRead && (
                  <button
                    disabled={messageActionLoading === `${selectedMessage._id}-read`}
                    onClick={() => messageAction(selectedMessage, "read")}
                    style={s.outlineBtn}
                  >
                    <Check size={16} />
                    Mark Read
                  </button>
                )}
                {selectedMessage.isRead && !selectedMessage.isReplied && (
                  <button
                    disabled={messageActionLoading === `${selectedMessage._id}-unread`}
                    onClick={() => messageAction(selectedMessage, "unread")}
                    style={s.outlineBtn}
                  >
                    <Mail size={16} />
                    Mark Unread
                  </button>
                )}
                {!selectedMessage.isReplied && (
                  <button
                    disabled={messageActionLoading === `${selectedMessage._id}-replied`}
                    onClick={() => messageAction(selectedMessage, "replied")}
                    style={s.outlineBtn}
                  >
                    <CheckCircle2 size={16} />
                    Mark Replied
                  </button>
                )}
                <button
                  disabled={messageActionLoading === `${selectedMessage._id}-delete`}
                  onClick={() => deleteMessage(selectedMessage)}
                  style={{ ...s.outlineBtn, color: colors.danger, borderColor: colors.dangerSoft }}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
                <button onClick={() => setSelectedMessage(null)} style={s.outlineBtn}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        button:hover { filter: brightness(1.08); }
        input:focus, textarea:focus, select:focus {
          border-color: ${colors.accent} !important;
          outline: none;
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 3px; }
      `}</style>
    </div>
  );
}

export default App;
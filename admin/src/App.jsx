import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import "./index.css";

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_OPTIONS = [
  "All",
  "New",
  "Contacted",
  "In Progress",
  "Converted",
  "Closed",
];

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("weblytics_admin_token")
  );

  const [admin, setAdmin] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("weblytics_admin")
      );
    } catch {
      return null;
    }
  });

  const handleLogin = (data) => {
    localStorage.setItem(
      "weblytics_admin_token",
      data.token
    );

    localStorage.setItem(
      "weblytics_admin",
      JSON.stringify(data.admin)
    );

    setToken(data.token);
    setAdmin(data.admin);
  };

  const handleLogout = () => {
    localStorage.removeItem("weblytics_admin_token");
    localStorage.removeItem("weblytics_admin");

    setToken(null);
    setAdmin(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Dashboard
      token={token}
      admin={admin}
      onLogout={handleLogout}
    />
  );
}

/* =====================================================
   LOGIN
===================================================== */

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed."
        );
      }

      onLogin(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background"></div>

      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark">W</div>

          <div>
            <h1>Weblytics</h1>
            <span>Studio Admin</span>
          </div>
        </div>

        <div className="login-heading">
          <p className="eyebrow">ADMIN PORTAL</p>
          <h2>Welcome back</h2>
          <p>
            Sign in to manage your Weblytics Studio
            business.
          </p>
        </div>

        {error && (
          <div className="login-error">
            <X size={17} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>

            <input
              type="email"
              placeholder="admin@weblytics.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
            />
          </div>

          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-loader"></span>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="login-footer">
          <span>Weblytics Studio</span>
          <span>•</span>
          <span>Admin Dashboard</span>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   DASHBOARD
===================================================== */

function Dashboard({ token, admin, onLogout }) {
  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activePage, setActivePage] =
    useState("Dashboard");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [updatingLead, setUpdatingLead] =
    useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/leads`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        onLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load leads."
        );
      }

      setLeads(data.leads || []);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the backend. Make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (
    leadId,
    status
  ) => {
    try {
      setUpdatingLead(leadId);

      const response = await fetch(
        `${API_URL}/leads/${leadId}`,
        {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        onLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update status."
        );
      }

      setLeads((current) =>
        current.map((lead) =>
          lead._id === leadId
            ? data.lead
            : lead
        )
      );
    } catch (err) {
      console.error(err);
      alert(
        err.message ||
          "Unable to update lead status."
      );
    } finally {
      setUpdatingLead(null);
    }
  };

  const stats = useMemo(() => {
    return {
      total: leads.length,

      new: leads.filter(
        (lead) => lead.status === "New"
      ).length,

      contacted: leads.filter(
        (lead) => lead.status === "Contacted"
      ).length,

      progress: leads.filter(
        (lead) => lead.status === "In Progress"
      ).length,

      converted: leads.filter(
        (lead) => lead.status === "Converted"
      ).length,

      closed: leads.filter(
        (lead) => lead.status === "Closed"
      ).length,
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const query = search
      .toLowerCase()
      .trim();

    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        lead.name
          ?.toLowerCase()
          .includes(query) ||
        lead.email
          ?.toLowerCase()
          .includes(query) ||
        lead.phone
          ?.toLowerCase()
          .includes(query) ||
        lead.service
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        lead.status === statusFilter;

      return (
        matchesSearch && matchesStatus
      );
    });
  }, [leads, search, statusFilter]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Leads",
      icon: Users,
    },
    {
      name: "Services",
      icon: BarChart3,
    },
    {
      name: "Messages",
      icon: MessageSquare,
    },
    {
      name: "Settings",
      icon: Settings,
    },
  ];

  const renderStatus = (status) => {
    const className = status
      ?.toLowerCase()
      .replace(/\s+/g, "-");

    return (
      <span
        className={`status-badge ${className}`}
      >
        <span className="status-dot"></span>
        {status}
      </span>
    );
  };

  return (
    <div className="admin-app">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="brand-mark">
            W
          </div>

          <div>
            <h2>Weblytics</h2>
            <span>Studio Admin</span>
          </div>

          <button
            className="mobile-close"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setActivePage(
                    item.name
                  );
                  setSidebarOpen(false);
                }}
              >
                <Icon size={19} />

                <span>{item.name}</span>

                {item.name === "Leads" &&
                  leads.length > 0 && (
                    <span className="nav-count">
                      {leads.length}
                    </span>
                  )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-profile">
            <div className="avatar">
              {admin?.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            <div className="profile-info">
              <strong>
                {admin?.name ||
                  "Administrator"}
              </strong>

              <span>
                {admin?.email || ""}
              </span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <main className="main-content">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <Menu size={22} />
          </button>

          <div className="topbar-title">
            <span>
              Welcome back 👋
            </span>

            <h1>{activePage}</h1>
          </div>

          <div className="topbar-actions">
            <button className="icon-button">
              <Bell size={20} />

              <span className="notification-dot"></span>
            </button>

            <div className="top-avatar">
              {admin?.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* DASHBOARD */}

        {activePage === "Dashboard" && (
          <section className="page-content">
            <div className="page-intro">
              <div>
                <p className="eyebrow">
                  OVERVIEW
                </p>

                <h2>
                  Business Overview
                </h2>

                <p>
                  Monitor your enquiries
                  and track potential
                  clients.
                </p>
              </div>

              <button
                className="refresh-button"
                onClick={fetchLeads}
              >
                <TrendingUp size={17} />
                Refresh Data
              </button>
            </div>

            {error && (
              <div className="error-box">
                <X size={18} />
                {error}
              </div>
            )}

            <div className="stats-grid">
              <StatCard
                title="Total Leads"
                value={stats.total}
                icon={
                  <Users size={21} />
                }
                className="blue"
              />

              <StatCard
                title="New Leads"
                value={stats.new}
                icon={
                  <Bell size={21} />
                }
                className="purple"
              />

              <StatCard
                title="In Progress"
                value={stats.progress}
                icon={
                  <Clock3 size={21} />
                }
                className="orange"
              />

              <StatCard
                title="Converted"
                value={
                  stats.converted
                }
                icon={
                  <CheckCircle2
                    size={21}
                  />
                }
                className="green"
              />
            </div>

            <div className="mini-stats">
              <div>
                <span>Contacted</span>
                <strong>
                  {stats.contacted}
                </strong>
              </div>

              <div>
                <span>Closed</span>
                <strong>
                  {stats.closed}
                </strong>
              </div>

              <div>
                <span>
                  Conversion Rate
                </span>

                <strong>
                  {stats.total
                    ? `${Math.round(
                        (stats.converted /
                          stats.total) *
                          100
                      )}%`
                    : "0%"}
                </strong>
              </div>
            </div>

            <LeadSection
              leads={filteredLeads.slice(
                0,
                6
              )}
              loading={loading}
              search={search}
              setSearch={setSearch}
              statusFilter={
                statusFilter
              }
              setStatusFilter={
                setStatusFilter
              }
              updateLeadStatus={
                updateLeadStatus
              }
              updatingLead={
                updatingLead
              }
              formatDate={formatDate}
              renderStatus={
                renderStatus
              }
              showAll={() =>
                setActivePage("Leads")
              }
            />
          </section>
        )}

        {/* LEADS */}

        {activePage === "Leads" && (
          <section className="page-content">
            <div className="page-intro">
              <div>
                <p className="eyebrow">
                  CUSTOMERS
                </p>

                <h2>
                  Lead Management
                </h2>

                <p>
                  Manage all enquiries
                  received through your
                  website.
                </p>
              </div>

              <button
                className="refresh-button"
                onClick={fetchLeads}
              >
                <TrendingUp size={17} />
                Refresh
              </button>
            </div>

            <LeadSection
              leads={filteredLeads}
              loading={loading}
              search={search}
              setSearch={setSearch}
              statusFilter={
                statusFilter
              }
              setStatusFilter={
                setStatusFilter
              }
              updateLeadStatus={
                updateLeadStatus
              }
              updatingLead={
                updatingLead
              }
              formatDate={formatDate}
              renderStatus={
                renderStatus
              }
            />
          </section>
        )}

        {/* SERVICES */}

        {activePage === "Services" && (
          <section className="page-content">
            <div className="page-intro">
              <div>
                <p className="eyebrow">
                  OFFERINGS
                </p>

                <h2>Services</h2>

                <p>
                  Services currently
                  offered by Weblytics
                  Studio.
                </p>
              </div>
            </div>

            <div className="services-grid">
              <ServiceCard
                icon={
                  <FileText
                    size={24}
                  />
                }
                title="Web Development"
                description="Modern responsive websites, web applications and admin panels."
              />

              <ServiceCard
                icon={
                  <TrendingUp
                    size={24}
                  />
                }
                title="AI & Automation"
                description="AI-powered workflows, automation systems and business solutions."
              />

              <ServiceCard
                icon={
                  <BarChart3
                    size={24}
                  />
                }
                title="Data Analytics"
                description="Dashboards, reports and data-driven business insights."
              />
            </div>
          </section>
        )}

        {/* MESSAGES */}

        {activePage === "Messages" && (
          <section className="page-content">
            <EmptyPage
              icon={
                <MessageSquare
                  size={32}
                />
              }
              title="Messages"
              description="Your customer communication center will appear here."
            />
          </section>
        )}

        {/* SETTINGS */}

        {activePage === "Settings" && (
          <section className="page-content">
            <EmptyPage
              icon={
                <Settings size={32} />
              }
              title="Settings"
              description="Website and admin settings will be available here."
            />
          </section>
        )}
      </main>
    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  title,
  value,
  icon,
  className,
}) {
  return (
    <div className="stat-card">
      <div
        className={`stat-icon ${className}`}
      >
        {icon}
      </div>

      <div className="stat-content">
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

      <div className="stat-arrow">
        →
      </div>
    </div>
  );
}

/* =====================================================
   LEADS
===================================================== */

function LeadSection({
  leads,
  loading,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  updateLeadStatus,
  updatingLead,
  formatDate,
  renderStatus,
  showAll,
}) {
  return (
    <div className="lead-card">
      <div className="lead-card-header">
        <div>
          <h3>
            Recent Enquiries
          </h3>

          <p>
            {leads.length} lead
            {leads.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>
        </div>

        {showAll && (
          <button
            className="view-all-button"
            onClick={showAll}
          >
            View All →
          </button>
        )}
      </div>

      <div className="filters">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              className="clear-search"
              onClick={() =>
                setSearch("")
              }
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="filter-box">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >
            {STATUS_OPTIONS.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status === "All"
                    ? "All Statuses"
                    : status}
                </option>
              )
            )}
          </select>

          <ChevronDown size={16} />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loader"></div>
          <p>
            Loading leads...
          </p>
        </div>
      ) : leads.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Users size={28} />
          </div>

          <h3>
            No leads found
          </h3>

          <p>
            Enquiries submitted from
            your website will appear
            here.
          </p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>CLIENT</th>
                  <th>SERVICE</th>
                  <th>CONTACT</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead._id}
                  >
                    <td>
                      <div className="client-cell">
                        <div className="client-avatar">
                          {lead.name
                            ?.charAt(
                              0
                            )
                            ?.toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {lead.name}
                          </strong>

                          <span>
                            {lead.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="service-name">
                        {lead.service}
                      </span>
                    </td>

                    <td>
                      <span className="phone">
                        {lead.phone ||
                          "Not provided"}
                      </span>
                    </td>

                    <td>
                      {formatDate(
                        lead.createdAt
                      )}
                    </td>

                    <td>
                      <div className="status-select-wrapper">
                        {renderStatus(
                          lead.status
                        )}

                        <select
                          value={
                            lead.status
                          }
                          disabled={
                            updatingLead ===
                            lead._id
                          }
                          onChange={(
                            e
                          ) =>
                            updateLeadStatus(
                              lead._id,
                              e.target
                                .value
                            )
                          }
                        >
                          {STATUS_OPTIONS.filter(
                            (status) =>
                              status !==
                              "All"
                          ).map(
                            (status) => (
                              <option
                                key={
                                  status
                                }
                                value={
                                  status
                                }
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-leads">
            {leads.map((lead) => (
              <div
                className="mobile-lead-card"
                key={lead._id}
              >
                <div className="mobile-lead-top">
                  <div className="client-cell">
                    <div className="client-avatar">
                      {lead.name
                        ?.charAt(
                          0
                        )
                        ?.toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {lead.name}
                      </strong>

                      <span>
                        {lead.email}
                      </span>
                    </div>
                  </div>

                  {renderStatus(
                    lead.status
                  )}
                </div>

                <div className="mobile-info">
                  <div>
                    <span>
                      Service
                    </span>

                    <strong>
                      {lead.service}
                    </strong>
                  </div>

                  <div>
                    <span>Phone</span>

                    <strong>
                      {lead.phone ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <span>Date</span>

                    <strong>
                      {formatDate(
                        lead.createdAt
                      )}
                    </strong>
                  </div>
                </div>

                <select
                  value={lead.status}
                  disabled={
                    updatingLead ===
                    lead._id
                  }
                  onChange={(e) =>
                    updateLeadStatus(
                      lead._id,
                      e.target.value
                    )
                  }
                >
                  {STATUS_OPTIONS.filter(
                    (status) =>
                      status !== "All"
                  ).map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}
                </select>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* =====================================================
   SERVICE CARD
===================================================== */

function ServiceCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="service-card">
      <div className="service-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <div className="service-status">
        <CheckCircle2 size={15} />
        Active
      </div>
    </div>
  );
}

/* =====================================================
   EMPTY PAGE
===================================================== */

function EmptyPage({
  icon,
  title,
  description,
}) {
  return (
    <div className="empty-page">
      <div className="empty-icon">
        {icon}
      </div>

      <h2>{title}</h2>

      <p>{description}</p>

      <span>Coming soon</span>
    </div>
  );
}

export default App;
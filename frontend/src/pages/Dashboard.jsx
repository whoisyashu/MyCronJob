import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/authContext";
import { connectSocket } from "../socket/socket";
import StatusTimeline from "../components/StatusTimeline";

export default function Dashboard() {
  const { logout, token } = useAuth();
  const [websites, setWebsites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingIds, setDeletingIds] = useState(() => new Set());
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const [formValues, setFormValues] = useState({
    url: "",
    alertEmail: ""
  });

  // Load websites
  useEffect(() => {
    let isMounted = true;

    async function loadWebsites() {
      try {
        setIsLoading(true);
        setLoadError("");
        const res = await api.get("/websites");
        if (isMounted) {
          setWebsites(res.data);
        }
      } catch (err) {
        if (isMounted) {
          setLoadError(
            err.response?.data?.message || "Failed to load websites"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadWebsites();

    return () => {
      isMounted = false;
    };
  }, []);

  // WebSocket
  useEffect(() => {
    const socket = connectSocket(token);

    socket.on("WEBSITE_DOWN", data => {
      setWebsites(prev =>
        prev.map(w =>
          w._id === data.websiteId
            ? { ...w, currentStatus: "DOWN" }
            : w
        )
      );
    });

    socket.on("WEBSITE_RECOVERED", data => {
      setWebsites(prev =>
        prev.map(w =>
          w._id === data.websiteId
            ? { ...w, currentStatus: "UP" }
            : w
        )
      );
    });

    return () => socket.disconnect();
  }, [token]);

  const handleFieldChange = event => {
    const { name, value } = event.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleAddWebsite = async event => {
    event.preventDefault();
    setAddError("");
    setDeleteError("");

    const url = formValues.url.trim();
    const alertEmail = formValues.alertEmail.trim();

    if (!url || !alertEmail) {
      setAddError("Website URL and alert email are required");
      return;
    }

    try {
      setIsAdding(true);
      const res = await api.post("/websites", { url, alertEmail });
      setWebsites(prev => [res.data, ...prev]);
      setFormValues({ url: "", alertEmail: "" });
    } catch (err) {
      setAddError(
        err.response?.data?.message || "Failed to add website"
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteWebsite = async websiteId => {
    setDeleteError("");
    setAddError("");

    if (deletingIds.has(websiteId)) {
      return;
    }

    const nextIds = new Set(deletingIds);
    nextIds.add(websiteId);
    setDeletingIds(nextIds);

    try {
      await api.delete(`/websites/${websiteId}`);
      setWebsites(prev => prev.filter(site => site._id !== websiteId));
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || "Failed to delete website"
      );
    } finally {
      setDeletingIds(prev => {
        const updated = new Set(prev);
        updated.delete(websiteId);
        return updated;
      });
    }
  };

  const toggleTimeline = websiteId => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(websiteId)) {
        next.delete(websiteId);
      } else {
        next.add(websiteId);
      }
      return next;
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">MyCronJob</p>
          <h2 className="dashboard-title">Dashboard</h2>
        </div>
        <button className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>

      <form className="website-form" onSubmit={handleAddWebsite}>
        <div className="field">
          <label htmlFor="url">Website URL</label>
          <input
            id="url"
            name="url"
            placeholder="https://example.com"
            value={formValues.url}
            onChange={handleFieldChange}
          />
        </div>
        <div className="field">
          <label htmlFor="alertEmail">Alert Email</label>
          <input
            id="alertEmail"
            name="alertEmail"
            placeholder="alerts@example.com"
            value={formValues.alertEmail}
            onChange={handleFieldChange}
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={isAdding}>
          {isAdding ? "Adding..." : "Add website"}
        </button>
      </form>

      {addError && <p className="form-error">{addError}</p>}
      {deleteError && <p className="form-error">{deleteError}</p>}
      {loadError && <p className="form-error">{loadError}</p>}

      {isLoading ? (
        <p className="status-info">Loading websites...</p>
      ) : websites.length === 0 ? (
        <p className="status-info">No websites yet. Add your first one.</p>
      ) : (
        <ul className="status-list">
          {websites.map(w => {
            const isDeleting = deletingIds.has(w._id);
            const isExpanded = expandedIds.has(w._id);
            return (
              <li className="status-item" key={w._id}>
                <div className="status-main">
                  <div className="status-meta">
                    <span className="status-url">{w.url}</span>
                    <span
                      className={`status-pill ${
                        w.currentStatus === "DOWN" ? "is-down" : "is-up"
                      }`}
                    >
                      {w.currentStatus}
                    </span>
                  </div>
                  <div className="status-actions">
                    <button
                      className="btn btn-ghost btn-small"
                      type="button"
                      onClick={() => toggleTimeline(w._id)}
                    >
                      {isExpanded ? "Hide timeline" : "Show timeline"}
                    </button>
                    <button
                      className="btn btn-ghost btn-danger btn-small"
                      type="button"
                      onClick={() => handleDeleteWebsite(w._id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <StatusTimeline websiteId={w._id} isOpen={isExpanded} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

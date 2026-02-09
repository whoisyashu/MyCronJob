import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

export default function StatusTimeline({ websiteId, isOpen }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadLogs() {
      try {
        setIsLoading(true);
        setError("");
        const res = await api.get(`/status/${websiteId}`);
        if (isMounted) {
          setLogs(res.data || []);
          setHasLoaded(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message || "Failed to load status logs"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (isOpen && !hasLoaded) {
      loadLogs();
    }

    return () => {
      isMounted = false;
    };
  }, [hasLoaded, isOpen, websiteId]);

  const orderedLogs = useMemo(() => {
    return [...logs].reverse();
  }, [logs]);

  const summary = useMemo(() => {
    if (orderedLogs.length === 0) {
      return {
        uptimePercentage: null,
        lastDowntimeMs: null
      };
    }

    const totalChecks = orderedLogs.length;
    const upChecks = orderedLogs.filter(log => log.status === "UP").length;
    const uptimePercentage = (upChecks / totalChecks) * 100;

    let lastDownAt = null;
    let lastUpAfterDownAt = null;

    for (let i = orderedLogs.length - 1; i >= 0; i -= 1) {
      const log = orderedLogs[i];

      if (log.status === "DOWN" && !lastDownAt) {
        lastDownAt = new Date(log.checkedAt);
      }

      if (lastDownAt && log.status === "UP") {
        lastUpAfterDownAt = new Date(log.checkedAt);
        break;
      }
    }

    let lastDowntimeMs = null;
    if (lastDownAt) {
      const end = lastUpAfterDownAt || new Date();
      lastDowntimeMs = Math.max(0, end - lastDownAt);
    }

    return { uptimePercentage, lastDowntimeMs };
  }, [orderedLogs]);

  const formattedDowntime = useMemo(() => {
    if (summary.lastDowntimeMs === null) {
      return "No downtime recorded";
    }

    const totalSeconds = Math.floor(summary.lastDowntimeMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, [summary.lastDowntimeMs]);

  return (
    <div className="timeline">
      {isLoading && <p className="timeline-info">Loading status logs...</p>}
      {error && <p className="form-error">{error}</p>}
      {!isLoading && !error && orderedLogs.length === 0 && (
        <p className="timeline-info">No status logs yet.</p>
      )}
      {!isLoading && !error && orderedLogs.length > 0 && (
        <>
          <div className="timeline-summary">
            <div>
              <span className="timeline-label">Uptime</span>
              <strong>
                {summary.uptimePercentage.toFixed(2)}%
              </strong>
            </div>
            <div>
              <span className="timeline-label">Last downtime</span>
              <strong>{formattedDowntime}</strong>
            </div>
          </div>
          <div className="timeline-row">
            {orderedLogs.map(log => (
              <span
                key={log._id}
                className={`timeline-dot ${
                  log.status === "DOWN" ? "is-down" : "is-up"
                }`}
                title={`${new Date(log.checkedAt).toLocaleString()} | ${
                  log.status
                }${log.statusCode ? ` (${log.statusCode})` : ""}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

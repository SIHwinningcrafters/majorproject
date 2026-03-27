import { useState, useEffect, useCallback } from "react";
import { getIncidents, getStats } from "../services/incident.service";
import { INCIDENTS } from "../data/mockData"; // fallback

export function useIncidents(filters = {}) {
  const [incidents,  setIncidents]  = useState([]);
  const [stats,      setStats]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIncidents(filters);

      /* normalize API shape to match our frontend shape */
      const normalized = data.incidents.map((inc) => ({
        ...inc,
        id:          inc._id,
        time:        timeAgo(inc.createdAt),
        reportedBy:  inc.anonymous
          ? "Anonymous"
          : inc.reportedBy?.username ?? "Unknown",
      }));

      setIncidents(normalized);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.warn("API unavailable, using mock data:", err.message);
      /* graceful fallback to mock data while backend is offline */
      setIncidents(INCIDENTS);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchIncidents(); }, [fetchIncidents]);

  return { incidents, stats, loading, error, totalPages, refetch: fetchIncidents };
}

export function useStats() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}

/* ── helper: "2 hrs ago" ── */
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hrs   = Math.floor(mins / 60);
  const days  = Math.floor(hrs / 24);

  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (hrs  < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
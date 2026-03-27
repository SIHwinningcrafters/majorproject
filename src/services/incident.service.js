import api from "./api";

/* ── GET ALL ── */
export const getIncidents = async ({
  severity,
  category,
  sort   = "-createdAt",
  page   = 1,
  limit  = 20,
} = {}) => {
  const params = { sort, page, limit };
  if (severity) params.severity = severity;
  if (category) params.category = category;

  const { data } = await api.get("/incidents", { params });
  return data; // { incidents, total, page, totalPages }
};

/* ── GET SINGLE ── */
export const getIncident = async (id) => {
  const { data } = await api.get(`/incidents/${id}`);
  return data.incident;
};

/* ── CREATE ── */
export const createIncident = async ({
  category,
  severity,
  description,
  location,
  anonymous,
  images,
}) => {
  const { data } = await api.post("/incidents", {
    category,
    severity,
    description,
    location,
    anonymous,
    images: images || [],
  });
  return data.incident;
};

/* ── UPDATE ── */
export const updateIncident = async (id, updates) => {
  const { data } = await api.patch(`/incidents/${id}`, updates);
  return data.incident;
};

/* ── DELETE ── */
export const deleteIncident = async (id) => {
  const { data } = await api.delete(`/incidents/${id}`);
  return data;
};

/* ── UPVOTE ── */
export const upvoteIncident = async (id) => {
  const { data } = await api.post(`/incidents/${id}/upvote`);
  return data; // { upvotes, upvoted }
};

/* ── STATS ── */
export const getStats = async () => {
  const { data } = await api.get("/incidents/stats");
  return data; // { total, high, medium, low, byCategory }
};
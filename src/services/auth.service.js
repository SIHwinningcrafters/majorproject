import api from "./api";

/* ── SIGNUP ── */
export const signup = async ({ username, email, password, bio, avatar }) => {
  const { data } = await api.post("/auth/signup", {
    username,
    email,
    password,
    bio,
    avatar,
  });
  /* persist token + user */
  localStorage.setItem("safemap_token", data.token);
  localStorage.setItem("safemap_user",  JSON.stringify(data.user));
  return data;
};

/* ── LOGIN ── */
export const login = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem("safemap_token", data.token);
  localStorage.setItem("safemap_user",  JSON.stringify(data.user));
  return data;
};

/* ── LOGOUT ── */
export const logout = () => {
  localStorage.removeItem("safemap_token");
  localStorage.removeItem("safemap_user");
};

/* ── GET CURRENT USER ── */
export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data.user;
};

/* ── UPDATE PROFILE ── */
export const updateProfile = async ({ bio, avatar }) => {
  const { data } = await api.patch("/auth/me", { bio, avatar });
  localStorage.setItem("safemap_user", JSON.stringify(data.user));
  return data.user;
};

/* ── get persisted user from localStorage (for page refresh) ── */
export const getStoredUser = () => {
  try {
    const u = localStorage.getItem("safemap_user");
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};
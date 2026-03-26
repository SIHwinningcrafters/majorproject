import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("map"); // "map" | "feed" | "analytics" | "resources"
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [authModal, setAuthModal] = useState(null); // "login" | "signup" | null

  const toggleSidebar = () => setSidebarOpen((p) => !p);
  const openAuthModal = (type) => setAuthModal(type);
  const closeAuthModal = () => setAuthModal(null);

  return (
    <AppContext.Provider value={{
      sidebarOpen, toggleSidebar,
      activePage, setActivePage,
      selectedIncident, setSelectedIncident,
      authModal, openAuthModal, closeAuthModal,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
// import { createContext, useContext, useState } from "react";

// const AppContext = createContext(null);

// export function AppProvider({ children }) {
//   const [sidebarOpen, setSidebarOpen]       = useState(true);
//   const [activePage, setActivePage]         = useState("map");
//   const [selectedIncident, setSelectedIncident] = useState(null);
//   const [authModal, setAuthModal]           = useState(null);
//   const [reportModal, setReportModal]       = useState(false); // 👈 NEW

//   const toggleSidebar   = () => setSidebarOpen((p) => !p);
//   const openAuthModal   = (type) => setAuthModal(type);
//   const closeAuthModal  = () => setAuthModal(null);
//   const openReportModal  = () => setReportModal(true);  // 👈 NEW
//   const closeReportModal = () => setReportModal(false); // 👈 NEW

//   return (
//     <AppContext.Provider value={{
//       sidebarOpen, toggleSidebar,
//       activePage, setActivePage,
//       selectedIncident, setSelectedIncident,
//       authModal, openAuthModal, closeAuthModal,
//       reportModal, openReportModal, closeReportModal, // 👈 NEW
//     }}>
//       {children}
//     </AppContext.Provider>
//   );
// }

// export const useApp = () => useContext(AppContext);

import { createContext, useContext, useState, useCallback } from "react";


const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [sidebarOpen,      setSidebarOpen]      = useState(true);
  const [activePage,       setActivePage]        = useState("map");
  const [selectedIncident, setSelectedIncident]  = useState(null);
  const [authModal,        setAuthModal]          = useState(null);
  const [reportModal,      setReportModal]        = useState(false);
  const [profileOpen,      setProfileOpen]        = useState(false);
  const [refreshKey,       setRefreshKey]         = useState(0); // 👈 NEW

  const toggleSidebar    = () => setSidebarOpen((p) => !p);
  const openAuthModal    = (type) => setAuthModal(type);
  const closeAuthModal   = () => setAuthModal(null);
  const openReportModal  = () => setReportModal(true);
  const closeReportModal = () => setReportModal(false);
  const openProfile      = () => setProfileOpen(true);
  const closeProfile     = () => setProfileOpen(false);
  const triggerRefresh   = useCallback(() => setRefreshKey((k) => k + 1), []); // 👈 NEW

  return (
    <AppContext.Provider value={{
      sidebarOpen, toggleSidebar,
      activePage, setActivePage,
      selectedIncident, setSelectedIncident,
      authModal, openAuthModal, closeAuthModal,
      reportModal, openReportModal, closeReportModal,
      profileOpen, openProfile, closeProfile,
      refreshKey, triggerRefresh,                      // 👈 NEW
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
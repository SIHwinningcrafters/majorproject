// import { createContext, useContext, useState } from "react";

// const AppContext = createContext(null);

// export function AppProvider({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activePage, setActivePage] = useState("map"); // "map" | "feed" | "analytics" | "resources"
//   const [selectedIncident, setSelectedIncident] = useState(null);
//   const [authModal, setAuthModal] = useState(null); // "login" | "signup" | null

//   const toggleSidebar = () => setSidebarOpen((p) => !p);
//   const openAuthModal = (type) => setAuthModal(type);
//   const closeAuthModal = () => setAuthModal(null);

//   return (
//     <AppContext.Provider value={{
//       sidebarOpen, toggleSidebar,
//       activePage, setActivePage,
//       selectedIncident, setSelectedIncident,
//       authModal, openAuthModal, closeAuthModal,
//     }}>
//       {children}
//     </AppContext.Provider>
//   );
// }

// export const useApp = () => useContext(AppContext);



import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [activePage, setActivePage]         = useState("map");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [authModal, setAuthModal]           = useState(null);
  const [reportModal, setReportModal]       = useState(false); // 👈 NEW

  const toggleSidebar   = () => setSidebarOpen((p) => !p);
  const openAuthModal   = (type) => setAuthModal(type);
  const closeAuthModal  = () => setAuthModal(null);
  const openReportModal  = () => setReportModal(true);  // 👈 NEW
  const closeReportModal = () => setReportModal(false); // 👈 NEW

  return (
    <AppContext.Provider value={{
      sidebarOpen, toggleSidebar,
      activePage, setActivePage,
      selectedIncident, setSelectedIncident,
      authModal, openAuthModal, closeAuthModal,
      reportModal, openReportModal, closeReportModal, // 👈 NEW
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
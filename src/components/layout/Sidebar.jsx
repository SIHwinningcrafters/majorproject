import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { FILTER_CHIPS } from "../../data/mockData";
import { useIncidents } from "../../hooks/useIncidents";
import IncidentCard from "../shared/IncidentCard";

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, selectedIncident, setSelectedIncident } = useApp();
  const [search,     setSearch]     = useState("");
  const [activeChip, setActiveChip] = useState("All");
  const [isMobile,   setIsMobile]   = useState(window.innerWidth < 768);

  /* build filters for hook */
  const filters = {};
  if (["high","medium","low"].includes(activeChip.toLowerCase())) {
    filters.severity = activeChip.toLowerCase();
  }

  const { incidents, loading } = useIncidents(filters);

  /* client-side search + category filter on top of API results */
  const filtered = incidents.filter((inc) => {
    const matchSearch =
      inc.description.toLowerCase().includes(search.toLowerCase()) ||
      inc.category.toLowerCase().includes(search.toLowerCase()) ||
      inc.location.label.toLowerCase().includes(search.toLowerCase());

    const matchChip =
      activeChip === "All" ||
      ["high","medium","low"].includes(activeChip.toLowerCase()) || // already filtered by API
      inc.category.toLowerCase() === activeChip.toLowerCase();

    return matchSearch && matchChip;
  });

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const sidebarStyle = {
    ...styles.sidebar,
    ...(isMobile
      ? {
          position: "absolute", top: 0, left: 0,
          zIndex: 150, height: "100%",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          width: "var(--sidebar-w)",
        }
      : {
          width: sidebarOpen ? "var(--sidebar-w)" : 0,
          overflow: sidebarOpen ? "visible" : "hidden",
          borderRight: sidebarOpen ? "1px solid var(--border)" : "none",
        }),
  };

  return (
    <>
      {isMobile && sidebarOpen && (
        <div onClick={toggleSidebar} style={styles.overlay} />
      )}

      <aside style={sidebarStyle}>
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <span style={styles.sbTitle}>Incident Reports</span>
            <button style={styles.collapseBtn} onClick={toggleSidebar}>←</button>
          </div>
          <div style={styles.searchBox}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              style={styles.searchInput}
              placeholder="Search incidents…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")}
                style={{ background:"none",border:"none",color:"var(--muted)",fontSize:14,cursor:"pointer" }}>
                ✕
              </button>
            )}
          </div>
        </div>

        <div style={styles.chips}>
          {FILTER_CHIPS.map((chip) => (
            <button key={chip} onClick={() => setActiveChip(chip)}
              style={{ ...styles.chip, ...(activeChip === chip ? styles.chipActive : {}) }}>
              {chip}
            </button>
          ))}
        </div>

        <div style={styles.count}>
          {loading
            ? "Loading incidents…"
            : `${filtered.length} incident${filtered.length !== 1 ? "s" : ""} found`}
        </div>

        <div style={styles.list}>
          {loading ? (
            <LoadingSkeleton />
          ) : filtered.length === 0 ? (
            <div style={styles.empty}>No incidents match your search.</div>
          ) : (
            filtered.map((inc) => (
              <IncidentCard
                key={inc.id || inc._id}
                incident={inc}
                selected={selectedIncident?.id === inc.id}
                onClick={() =>
                  setSelectedIncident(selectedIncident?.id === inc.id ? null : inc)
                }
              />
            ))
          )}
        </div>
      </aside>
    </>
  );
}

/* ── loading skeleton ── */
function LoadingSkeleton() {
  return (
    <>
      {[1,2,3].map((i) => (
        <div key={i} style={{
          padding: "15px 20px",
          borderBottom: "1px solid var(--border)",
        }}>
          {[80, 60, 100].map((w, j) => (
            <div key={j} style={{
              height: 10, width: `${w}%`,
              background: "var(--dark4)",
              borderRadius: 4, marginBottom: 8,
              animation: "pulse-dot 1.5s ease-in-out infinite",
            }} />
          ))}
        </div>
      ))}
    </>
  );
}

const styles = {
  sidebar: {
    width: "var(--sidebar-w)", height: "100%",
    background: "var(--dark)", display: "flex",
    flexDirection: "column", overflow: "hidden",
    flexShrink: 0,
    transition: "width .28s cubic-bezier(.4,0,.2,1), transform .28s cubic-bezier(.4,0,.2,1)",
  },
  overlay: {
    position: "absolute", inset: 0,
    background: "rgba(0,0,0,0.5)", zIndex: 140,
  },
  header: {
    padding: "18px 20px 14px",
    borderBottom: "1px solid var(--border)", flexShrink: 0,
  },
  headerTop: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: 13,
  },
  sbTitle: {
    fontFamily: "var(--font-display)", fontSize: 12,
    fontWeight: 700, letterSpacing: "0.09em",
    textTransform: "uppercase", color: "var(--muted)",
  },
  collapseBtn: {
    width: 28, height: 28,
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
    background: "transparent", color: "var(--muted)",
    fontSize: 14, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  searchBox: {
    display: "flex", alignItems: "center", gap: 9,
    background: "var(--dark3)", border: "1px solid var(--border)",
    borderRadius: "var(--r-sm)", padding: "9px 13px", color: "var(--muted)",
  },
  searchInput: {
    flex: 1, background: "none", border: "none",
    outline: "none", color: "var(--text)",
    fontSize: 13, fontFamily: "var(--font-body)",
  },
  chips: {
    display: "flex", gap: 6, padding: "12px 20px",
    borderBottom: "1px solid var(--border)",
    overflowX: "auto", scrollbarWidth: "none", flexShrink: 0,
  },
  chip: {
    padding: "4px 11px", borderRadius: 20, fontSize: 12,
    fontWeight: 500, whiteSpace: "nowrap",
    border: "1px solid var(--border)", background: "transparent",
    color: "var(--muted)", cursor: "pointer", transition: "all .2s",
  },
  chipActive: {
    background: "var(--dark4)", color: "var(--text)",
    borderColor: "var(--border2)",
  },
  count: {
    padding: "8px 20px", fontSize: 11,
    color: "var(--muted)", borderBottom: "1px solid var(--border)", flexShrink: 0,
  },
  list: { flex: 1, overflowY: "auto" },
  empty: {
    padding: "32px 20px", textAlign: "center",
    color: "var(--muted)", fontSize: 13,
  },
};

// import { useState, useEffect } from "react";
// import { useApp } from "../../context/AppContext";
// import { INCIDENTS, FILTER_CHIPS } from "../../data/mockData";
// import IncidentCard from "../shared/IncidentCard";

// export default function Sidebar() {
//   const { sidebarOpen, toggleSidebar, selectedIncident, setSelectedIncident } = useApp();
//   const [search, setSearch]       = useState("");
//   const [activeChip, setActiveChip] = useState("All");
//   const [isMobile, setIsMobile]   = useState(window.innerWidth < 768);

//   /* track window width */
//   useEffect(() => {
//     const handler = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handler);
//     return () => window.removeEventListener("resize", handler);
//   }, []);

//   /* filter logic */
//   const filtered = INCIDENTS.filter((inc) => {
//     const matchSearch =
//       inc.description.toLowerCase().includes(search.toLowerCase()) ||
//       inc.category.toLowerCase().includes(search.toLowerCase()) ||
//       inc.location.label.toLowerCase().includes(search.toLowerCase());

//     const matchChip =
//       activeChip === "All" ||
//       inc.severity.toLowerCase() === activeChip.toLowerCase() ||
//       inc.category.toLowerCase() === activeChip.toLowerCase();

//     return matchSearch && matchChip;
//   });

//   /* on mobile, sidebar slides over content */
//   const sidebarStyle = {
//     ...styles.sidebar,
//     ...(isMobile
//       ? {
//           position: "absolute",
//           top: 0,
//           left: 0,
//           zIndex: 150,
//           height: "100%",
//           transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
//           width: "var(--sidebar-w)",
//         }
//       : {
//           width: sidebarOpen ? "var(--sidebar-w)" : 0,
//           overflow: sidebarOpen ? "visible" : "hidden",
//           borderRight: sidebarOpen ? "1px solid var(--border)" : "none",
//         }),
//   };

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isMobile && sidebarOpen && (
//         <div onClick={toggleSidebar} style={styles.overlay} />
//       )}

//       <aside style={sidebarStyle}>
//         {/* ── HEADER ── */}
//         <div style={styles.header}>
//           <div style={styles.headerTop}>
//             <span style={styles.sbTitle}>Incident Reports</span>
//             <button style={styles.collapseBtn} onClick={toggleSidebar}>
//               ←
//             </button>
//           </div>

//           {/* Search */}
//           <div style={styles.searchBox}>
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
//               stroke="currentColor" strokeWidth="2">
//               <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
//             </svg>
//             <input
//               style={styles.searchInput}
//               placeholder="Search incidents…"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             {search && (
//               <button
//                 onClick={() => setSearch("")}
//                 style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 14 }}
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ── FILTER CHIPS ── */}
//         <div style={styles.chips}>
//           {FILTER_CHIPS.map((chip) => (
//             <button
//               key={chip}
//               onClick={() => setActiveChip(chip)}
//               style={{
//                 ...styles.chip,
//                 ...(activeChip === chip ? styles.chipActive : {}),
//               }}
//             >
//               {chip}
//             </button>
//           ))}
//         </div>

//         {/* ── COUNT ── */}
//         <div style={styles.count}>
//           {filtered.length} incident{filtered.length !== 1 ? "s" : ""} found
//         </div>

//         {/* ── LIST ── */}
//         <div style={styles.list}>
//           {filtered.length === 0 ? (
//             <div style={styles.empty}>No incidents match your search.</div>
//           ) : (
//             filtered.map((inc) => (
//               <IncidentCard
//                 key={inc.id}
//                 incident={inc}
//                 selected={selectedIncident?.id === inc.id}
//                 onClick={() =>
//                   setSelectedIncident(
//                     selectedIncident?.id === inc.id ? null : inc
//                   )
//                 }
//               />
//             ))
//           )}
//         </div>
//       </aside>
//     </>
//   );
// }

// /* ── STYLES ── */
// const styles = {
//   sidebar: {
//     width: "var(--sidebar-w)",
//     height: "100%",
//     background: "var(--dark)",
//     display: "flex",
//     flexDirection: "column",
//     overflow: "hidden",
//     flexShrink: 0,
//     transition: "width .28s cubic-bezier(.4,0,.2,1), transform .28s cubic-bezier(.4,0,.2,1)",
//   },
//   overlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.5)",
//     zIndex: 140,
//   },
//   header: {
//     padding: "18px 20px 14px",
//     borderBottom: "1px solid var(--border)",
//     flexShrink: 0,
//   },
//   headerTop: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 13,
//   },
//   sbTitle: {
//     fontFamily: "var(--font-display)",
//     fontSize: 12,
//     fontWeight: 700,
//     letterSpacing: "0.09em",
//     textTransform: "uppercase",
//     color: "var(--muted)",
//   },
//   collapseBtn: {
//     width: 28,
//     height: 28,
//     borderRadius: "var(--r-sm)",
//     border: "1px solid var(--border)",
//     background: "transparent",
//     color: "var(--muted)",
//     fontSize: 14,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//   },
//   searchBox: {
//     display: "flex",
//     alignItems: "center",
//     gap: 9,
//     background: "var(--dark3)",
//     border: "1px solid var(--border)",
//     borderRadius: "var(--r-sm)",
//     padding: "9px 13px",
//     color: "var(--muted)",
//   },
//   searchInput: {
//     flex: 1,
//     background: "none",
//     border: "none",
//     outline: "none",
//     color: "var(--text)",
//     fontSize: 13,
//     fontFamily: "var(--font-body)",
//   },
//   chips: {
//     display: "flex",
//     gap: 6,
//     padding: "12px 20px",
//     borderBottom: "1px solid var(--border)",
//     overflowX: "auto",
//     scrollbarWidth: "none",
//     flexShrink: 0,
//   },
//   chip: {
//     padding: "4px 11px",
//     borderRadius: 20,
//     fontSize: 12,
//     fontWeight: 500,
//     whiteSpace: "nowrap",
//     border: "1px solid var(--border)",
//     background: "transparent",
//     color: "var(--muted)",
//     cursor: "pointer",
//     transition: "all .2s",
//   },
//   chipActive: {
//     background: "var(--dark4)",
//     color: "var(--text)",
//     borderColor: "var(--border2)",
//   },
//   count: {
//     padding: "8px 20px",
//     fontSize: 11,
//     color: "var(--muted)",
//     borderBottom: "1px solid var(--border)",
//     flexShrink: 0,
//   },
//   list: {
//     flex: 1,
//     overflowY: "auto",
//   },
//   empty: {
//     padding: "32px 20px",
//     textAlign: "center",
//     color: "var(--muted)",
//     fontSize: 13,
//   },
// };


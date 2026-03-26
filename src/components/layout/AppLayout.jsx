import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MapDashboard from "../map/MapDashboard";
import { useApp } from "../../context/AppContext";
import LoginModal from "../auth/LoginModal";
import SignupModal from "../auth/SignupModal";

// Pages
import FeedPage from "../../pages/FeedPage";
import AnalyticsPage from "../../pages/AnalyticsPage";
import ResourcesPage from "../../pages/ResourcesPage";

export default function AppLayout() {
  const { activePage, authModal } = useApp();

  const renderPage = () => {
    switch (activePage) {
      case "feed":       return <FeedPage />;
      case "analytics":  return <AnalyticsPage />;
      case "resources":  return <ResourcesPage />;
      default:           return <MapDashboard />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {renderPage()}
        </main>
      </div>

      {/* Auth Modals */}
      {authModal === "login"  && <LoginModal />}
      {authModal === "signup" && <SignupModal />}
    </div>
  );
}
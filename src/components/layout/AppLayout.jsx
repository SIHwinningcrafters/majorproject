import Navbar              from "./Navbar";
import Sidebar             from "./Sidebar";
import MapDashboard        from "../map/MapDashboard";
import { useApp }          from "../../context/AppContext";
import LoginModal          from "../auth/LoginModal";
import SignupModal         from "../auth/SignupModal";
import ReportIncidentModal from "../incidents/ReportIncidentModal";
import ProfileModal        from "../profile/ProfileModal";

import FeedPage      from "../../pages/FeedPage";
import AnalyticsPage from "../../pages/AnalyticsPage";
import ResourcesPage from "../../pages/ResourcesPage";

export default function AppLayout() {
  const { activePage, authModal, reportModal, profileOpen } = useApp();

  const renderPage = () => {
    switch (activePage) {
      case "feed":      return <FeedPage />;
      case "analytics": return <AnalyticsPage />;
      case "resources": return <ResourcesPage />;
      default:          return <MapDashboard />;
    }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh", overflow: "hidden",
      background: "#0D0F14", color: "#E8E6E0",
    }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {renderPage()}
        </main>
      </div>

      {authModal === "login"  && <LoginModal />}
      {authModal === "signup" && <SignupModal />}
      {reportModal            && <ReportIncidentModal />}
      {profileOpen            && <ProfileModal />}
    </div>
  );
}
// Dashboard.jsx
// ------------------------------------------------------
// Main authenticated dashboard.
// ------------------------------------------------------

import { useNavigate } from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import PageContainer from "../components/common/PageContainer";
import PageHeader from "../components/common/PageHeader";
import DashboardActions from "../components/dashboard/DashboardActions";

function Dashboard() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const handleLogout = async () => {
    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <PageContainer className="dashboard-page">

      <PageHeader
        title="Dashboard"
        description={
          user
            ? `Welcome, ${user.name}`
            : "Welcome to Watch Together"
        }
      />

      <DashboardActions />

      <section className="dashboard-info">

        <h2>
          Your Watch Together
        </h2>

        <p>
          Your rooms and watch history
          will appear here once the
          backend is connected.
        </p>

      </section>

      <button
        type="button"
        onClick={handleLogout}
      >
        Logout
      </button>

    </PageContainer>
  );
}

export default Dashboard;
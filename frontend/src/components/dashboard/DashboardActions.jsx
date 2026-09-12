// DashboardActions.jsx
// ------------------------------------------------------
// Main actions available from the dashboard.
// ------------------------------------------------------

import { Link } from "react-router-dom";

function DashboardActions() {
  return (
    <section className="dashboard-actions">

      <div>
        <h2>
          Create a Watch Room
        </h2>

        <p>
          Start a new room and invite
          your friends.
        </p>

        <Link to="/rooms/create">
          Create Room
        </Link>
      </div>

      <div>
        <h2>
          Join a Room
        </h2>

        <p>
          Enter a room code shared
          by your friend.
        </p>

        <Link to="/join">
          Join Room
        </Link>
      </div>

    </section>
  );
}

export default DashboardActions;
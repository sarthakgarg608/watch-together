// InvitePage.jsx
// ------------------------------------------------------
// Dedicated invitation page.
// Useful when someone opens a shared invitation URL.
// ------------------------------------------------------

import { Link, useParams } from "react-router-dom";

function InvitePage() {
  const { roomCode } = useParams();

  return (
    <main className="invite-page">
      <h1>You're Invited!</h1>

      <p>
        Your friend invited you to watch together.
      </p>

      <p>
        Room Code: <strong>{roomCode}</strong>
      </p>

      <Link to={`/rooms/${roomCode}`}>
        Join Watch Room
      </Link>

      <br />

      <Link to="/login">
        Login
      </Link>
    </main>
  );
}

export default InvitePage;
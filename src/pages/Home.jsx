// Home.jsx
// ------------------------------------------------------
// Landing page of the application.
// ------------------------------------------------------

import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import PageContainer from "../components/common/PageContainer";

function Home() {
  const {
    isAuthenticated,
    user,
  } = useAuth();

  return (
    <PageContainer className="home-page">

      <section className="hero">

        <h1>
          Watch Movies Together
        </h1>

        <p>
          Create a room, invite your friends,
          and enjoy movies together online.
        </p>

        <div className="hero-actions">

          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                Go to Dashboard
              </Link>

              <Link to="/rooms/create">
                Create Room
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                Login
              </Link>

              <Link to="/register">
                Get Started
              </Link>
            </>
          )}

        </div>

        {isAuthenticated && user && (
          <p>
            Welcome back, {user.name}!
          </p>
        )}

      </section>

      <section className="features">

        <div>
          <h2>Watch Together</h2>
          <p>
            Enjoy synchronized video
            playback with friends.
          </p>
        </div>

        <div>
          <h2>Chat</h2>
          <p>
            Talk with everyone inside
            your watch room.
          </p>
        </div>

        <div>
          <h2>Invite Friends</h2>
          <p>
            Share a room link and invite
            your friends instantly.
          </p>
        </div>

      </section>

    </PageContainer>
  );
}

export default Home;
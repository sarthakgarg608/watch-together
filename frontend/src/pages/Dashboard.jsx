// Dashboard.jsx
// ------------------------------------------------------
// Main authenticated user dashboard.
// ------------------------------------------------------

import { Link } from "react-router-dom";

import PageContainer from "../components/common/PageContainer";

import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <PageContainer>
      {/* ==================================================
          BACKGROUND GLOWS
      ================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute left-[-10%] top-[-10%]
            h-[450px] w-[450px]
            rounded-full
            bg-violet-600/10
            blur-[140px]
          "
        />

        <div
          className="
            absolute right-[-10%] top-[30%]
            h-[450px] w-[450px]
            rounded-full
            bg-fuchsia-600/10
            blur-[140px]
          "
        />

        <div
          className="
            absolute bottom-[-15%] left-[35%]
            h-[350px] w-[350px]
            rounded-full
            bg-indigo-600/10
            blur-[130px]
          "
        />
      </div>

      {/* ==================================================
          HEADER
      ================================================== */}

      <section className="relative">
        <div
          className="
            flex flex-col gap-6
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div>
            {/* Online status */}

            <div
              className="
                mb-4 inline-flex
                items-center gap-2
                rounded-full
                border border-violet-400/10
                bg-violet-500/[0.06]
                px-3 py-1.5
              "
            >
              <span
                className="
                  h-1.5 w-1.5
                  animate-pulse
                  rounded-full
                  bg-emerald-400
                "
              />

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-violet-300
                "
              >
                You're online
              </span>
            </div>

            {/* Greeting */}

            <h1
              className="
                text-3xl
                font-black
                tracking-tight
                sm:text-4xl
              "
            >
              Welcome back,{" "}
              <span
                className="
                  bg-gradient-to-r
                  from-violet-400
                  to-fuchsia-400
                  bg-clip-text
                  text-transparent
                "
              >
                {firstName}
              </span>
              .
            </h1>

            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-6
                text-slate-500
              "
            >
              Create a room, invite your friends, and enjoy your next movie
              together.
            </p>
          </div>

          {/* Header actions */}

          <div className="flex gap-3">
            <Link
              to="/rooms/join"
              className="
                rounded-xl
                border border-white/10
                bg-white/[0.035]
                px-5 py-3
                text-sm
                font-semibold
                text-slate-300
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-white/[0.07]
                hover:text-white
              "
            >
              Join Room
            </Link>

            <Link
              to="/rooms/create"
              className="
                rounded-xl
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-600
                px-5 py-3
                text-sm
                font-bold
                shadow-lg
                shadow-violet-900/20
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-xl
                hover:shadow-violet-900/30
              "
            >
              + Create Room
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================
          QUICK ACTIONS
      ================================================== */}

      <section className="relative mt-10">
        <div className="mb-4">
          <h2 className="text-lg font-black">Quick actions</h2>

          <p className="mt-1 text-xs text-slate-600">
            Everything you need to start watching together.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Create room */}

          <DashboardCard
            icon="▶"
            title="Create a room"
            description="Start a new private watch party and invite your friends."
            action="Start watching"
            to="/rooms/create"
            accent="violet"
          />

          {/* Join room */}

          <DashboardCard
            icon="↗"
            title="Join a room"
            description="Enter a room code and jump into an existing watch party."
            action="Join now"
            to="/rooms/join"
            accent="fuchsia"
          />

          {/* Explore */}

          <DashboardCard
            icon="◷"
            title="Watch together"
            description="Create or join a room to sync playback and chat with friends."
            action="Get started"
            to="/rooms/create"
            accent="indigo"
          />
        </div>
      </section>

      {/* ==================================================
          YOUR WATCH SPACE
      ================================================== */}

      <section className="relative mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-black">Your watch space</h2>

            <p className="mt-1 text-xs text-slate-600">
              Your active and recent watch rooms will appear here.
            </p>
          </div>
        </div>

        {/* Empty state */}

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            border border-white/10
            bg-white/[0.025]
            p-8
            text-center
            backdrop-blur-xl
            sm:p-12
          "
        >
          {/* Glow */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-40
              w-40
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-violet-600/10
              blur-[80px]
            "
          />

          {/* Icon */}

          <div
            className="
              relative
              z-10
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              border border-white/10
              bg-white/[0.04]
              text-2xl
              shadow-xl
              shadow-black/10
            "
          >
            🎬
          </div>

          <h3
            className="
              relative
              z-10
              mt-5
              text-base
              font-bold
            "
          >
            No watch rooms yet
          </h3>

          <p
            className="
              relative
              z-10
              mx-auto
              mt-2
              max-w-md
              text-sm
              leading-6
              text-slate-600
            "
          >
            Create your first watch room and invite your friends to start
            watching together.
          </p>

          {/* Primary CTA */}

          <div
            className="
              relative
              z-10
              mt-6
              flex
              flex-col
              items-center
              justify-center
              gap-3
              sm:flex-row
            "
          >
            <Link
              to="/rooms/create"
              className="
                inline-flex
                rounded-xl
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-600
                px-5
                py-3
                text-xs
                font-bold
                text-white
                shadow-lg
                shadow-violet-900/20
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-xl
              "
            >
              Create your first room
            </Link>

            <Link
              to="/rooms/join"
              className="
                inline-flex
                rounded-xl
                border border-white/10
                bg-white/[0.04]
                px-5
                py-3
                text-xs
                font-bold
                text-slate-300
                transition-all
                duration-300
                hover:bg-white/[0.08]
                hover:text-white
              "
            >
              Join an existing room
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================
          DASHBOARD FOOTER INFO
      ================================================== */}

      <section className="relative mt-10">
        <div
          className="
            grid
            gap-4
            sm:grid-cols-3
          "
        >
          <InfoCard
            icon="👥"
            title="Watch with friends"
            description="Invite people into your room with a simple room code."
          />

          <InfoCard
            icon="⏯"
            title="Stay in sync"
            description="Playback controls keep everyone watching together."
          />

          <InfoCard
            icon="💬"
            title="Chat together"
            description="Talk with everyone while the movie is playing."
          />
        </div>
      </section>
    </PageContainer>
  );
}

// ------------------------------------------------------
// Dashboard action card
// ------------------------------------------------------

function DashboardCard({ icon, title, description, action, to, accent }) {
  const accentClasses = {
    violet: "bg-violet-500/10 text-violet-300 group-hover:bg-violet-500/15",

    fuchsia: "bg-fuchsia-500/10 text-fuchsia-300 group-hover:bg-fuchsia-500/15",

    indigo: "bg-indigo-500/10 text-indigo-300 group-hover:bg-indigo-500/15",
  };

  return (
    <Link
      to={to}
      className="
        group
        rounded-2xl
        border border-white/10
        bg-white/[0.025]
        p-5
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-white/15
        hover:bg-white/[0.045]
        hover:shadow-2xl
        hover:shadow-black/20
      "
    >
      {/* Icon */}

      <div
        className={`
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          text-lg
          transition-all
          duration-300
          ${accentClasses[accent]}
          group-hover:scale-105
        `}
      >
        {icon}
      </div>

      {/* Title */}

      <h3 className="mt-5 text-sm font-bold">{title}</h3>

      {/* Description */}

      <p
        className="
          mt-2
          text-xs
          leading-5
          text-slate-600
        "
      >
        {description}
      </p>

      {/* Action */}

      <div
        className="
          mt-5
          flex
          items-center
          justify-between
          text-[10px]
          font-bold
          uppercase
          tracking-wider
          text-slate-700
          transition-colors
          group-hover:text-violet-400
        "
      >
        <span>{action}</span>

        <span className="text-sm">→</span>
      </div>
    </Link>
  );
}

// ------------------------------------------------------
// Dashboard information card
// ------------------------------------------------------

function InfoCard({ icon, title, description }) {
  return (
    <div
      className="
        rounded-2xl
        border border-white/10
        bg-white/[0.02]
        p-5
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          border border-white/10
          bg-white/[0.035]
          text-base
        "
      >
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-bold">{title}</h3>

      <p
        className="
          mt-2
          text-xs
          leading-5
          text-slate-600
        "
      >
        {description}
      </p>
    </div>
  );
}

export default Dashboard;

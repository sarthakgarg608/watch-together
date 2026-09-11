// InviteFriends.jsx
// ------------------------------------------------------
// Allows the user to copy the room invitation link.
// ------------------------------------------------------

import { useState } from "react";

function InviteFriends({ roomCode }) {
  const [copied, setCopied] = useState(false);

  const inviteLink =
    `${window.location.origin}/join/${roomCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        inviteLink
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Unable to copy invite link:",
        error
      );
    }
  };

  return (
    <section className="invite-friends">

      <h2>Invite Friends</h2>

      <p>
        Share this link with your friends.
      </p>

      <input
        type="text"
        value={inviteLink}
        readOnly
        aria-label="Room invitation link"
      />

      <button
        type="button"
        onClick={handleCopy}
      >
        {copied ? "Copied!" : "Copy Invite Link"}
      </button>

    </section>
  );
}

export default InviteFriends;
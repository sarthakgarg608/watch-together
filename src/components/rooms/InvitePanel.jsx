// InvitePanel.jsx
// ------------------------------------------------------
// Allows the user to copy the room invite link.
// ------------------------------------------------------

import {
  useState,
} from "react";

import { useRoom } from "../../context/RoomContext";

function InvitePanel() {
  const {
    room,
  } = useRoom();

  const [copied, setCopied] =
    useState(false);

  if (!room) {
    return null;
  }

  const inviteUrl =
    `${window.location.origin}/join/${room.roomCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        inviteUrl
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  };

  return (
    <section className="invite-panel">

      <h2>
        Invite Friends
      </h2>

      <p>
        Share this link with your friends.
      </p>

      <input
        type="text"
        value={inviteUrl}
        readOnly
        aria-label="Room invite link"
      />

      <button
        type="button"
        onClick={handleCopy}
      >
        {copied
          ? "Copied!"
          : "Copy Link"}
      </button>

    </section>
  );
}

export default InvitePanel;
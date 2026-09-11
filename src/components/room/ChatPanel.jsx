// ChatPanel.jsx
// ------------------------------------------------------
// Room chat UI.
//
// Current version:
// - Local frontend messages
//
// Later:
// - Socket.IO real-time messaging
// - Message persistence
// - Typing indicators
// ------------------------------------------------------

import {
  useState,
} from "react";

function ChatPanel() {
  const [messages, setMessages] =
    useState([
      {
        id: "message-1",
        sender: "System",
        text:
          "Welcome to the room!",
      },
    ]);

  const [message, setMessage] =
    useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanMessage =
      message.trim();

    if (!cleanMessage) {
      return;
    }

    const newMessage = {
      id:
        `message-${Date.now()}`,
      sender: "You",
      text: cleanMessage,
    };

    setMessages((previous) => [
      ...previous,
      newMessage,
    ]);

    setMessage("");
  };

  return (
    <section className="chat-panel">

      <h2>
        Chat
      </h2>

      <div className="chat-messages">

        {messages.map(
          (chatMessage) => (
            <div
              key={chatMessage.id}
              className="chat-message"
            >
              <strong>
                {chatMessage.sender}
              </strong>

              <p>
                {chatMessage.text}
              </p>
            </div>
          )
        )}

      </div>

      <form
        onSubmit={handleSubmit}
        className="chat-form"
      >

        <input
          type="text"
          value={message}
          onChange={(event) =>
            setMessage(
              event.target.value
            )
          }
          placeholder="Type a message..."
          maxLength={500}
          autoComplete="off"
        />

        <button type="submit">
          Send
        </button>

      </form>

    </section>
  );
}

export default ChatPanel;
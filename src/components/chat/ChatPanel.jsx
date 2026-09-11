// ChatPanel.jsx
// ------------------------------------------------------
// Watch-room chat UI.
//
// Currently frontend-only.
// Later Socket.IO will handle real-time messages.
// ------------------------------------------------------

import { useState } from "react";

function ChatPanel() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "System",
      text: "Welcome to the watch party!",
    },
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage =
      message.trim();

    if (!trimmedMessage) {
      return;
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        id: Date.now(),
        sender: "You",
        text: trimmedMessage,
      },
    ]);

    setMessage("");
  };

  return (
    <section className="flex h-full min-h-0 flex-col">

      <div className="border-b border-white/10 px-4 py-3">
        <h2 className="font-semibold text-white">
          Chat
        </h2>

        <p className="text-xs text-slate-500">
          Talk with everyone in the room
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">

        {messages.map((item) => (
          <div key={item.id}>
            <p className="text-xs font-medium text-slate-400">
              {item.sender}
            </p>

            <p className="mt-1 break-words rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-200">
              {item.text}
            </p>
          </div>
        ))}

      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-white/10 p-3"
      >
        <div className="flex gap-2">

          <input
            type="text"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            placeholder="Type a message..."
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500"
          />

          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 active:scale-95"
          >
            Send
          </button>

        </div>
      </form>

    </section>
  );
}

export default ChatPanel;
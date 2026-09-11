// ChatPanel.jsx
// ------------------------------------------------------
// Room chat interface.
//
// Current phase:
// - Local frontend-only messages
// - Message input
// - Auto-scroll
//
// Later:
// - WebSocket messages
// - Typing indicators
// - Message timestamps
// ------------------------------------------------------

import {
  useEffect,
  useRef,
  useState,
} from "react";

function ChatPanel({
  currentUser,
}) {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Watch Together",
      text: "Welcome to the watch party! 🍿",
      system: true,
    },
  ]);

  const messagesEndRef = useRef(null);

  // ----------------------------------------------------
  // Auto-scroll whenever messages change.
  // ----------------------------------------------------

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ----------------------------------------------------
  // Send message.
  // ----------------------------------------------------

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage) {
      return;
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        id: Date.now(),
        sender:
          currentUser?.name || "You",
        text: cleanMessage,
        system: false,
      },
    ]);

    setMessage("");
  };

  return (
    <section className="flex min-h-[320px] flex-1 flex-col">

      {/* ==================================================
          CHAT HEADER
      ================================================== */}

      <div className="border-b border-white/10 px-5 py-4">

        <h2 className="text-sm font-bold">
          Group chat
        </h2>

        <p className="mt-0.5 text-xs text-slate-600">
          Talk while you watch
        </p>

      </div>

      {/* ==================================================
          MESSAGES
      ================================================== */}

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">

        {messages.map((item) => {

          if (item.system) {
            return (
              <div
                key={item.id}
                className="
                  rounded-xl
                  border border-violet-400/10
                  bg-violet-500/[0.06]
                  px-3 py-2.5
                "
              >
                <p className="text-[11px] font-semibold text-violet-300">
                  {item.sender}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {item.text}
                </p>
              </div>
            );
          }

          const isCurrentUser =
            item.sender ===
            (currentUser?.name || "You");

          return (
            <div
              key={item.id}
              className={`flex ${
                isCurrentUser
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`
                  max-w-[85%] rounded-2xl
                  px-3.5 py-2.5
                  ${
                    isCurrentUser
                      ? "rounded-br-md bg-violet-600 text-white"
                      : "rounded-bl-md bg-white/[0.05] text-slate-300"
                  }
                `}
              >

                {!isCurrentUser && (
                  <p className="mb-1 text-[10px] font-bold text-violet-300">
                    {item.sender}
                  </p>
                )}

                <p className="break-words text-xs leading-5">
                  {item.text}
                </p>

              </div>

            </div>
          );
        })}

        <div ref={messagesEndRef} />

      </div>

      {/* ==================================================
          MESSAGE INPUT
      ================================================== */}

      <form
        onSubmit={handleSubmit}
        className="
          border-t border-white/10
          p-3
        "
      >

        <div
          className="
            flex items-center gap-2
            rounded-xl border border-white/10
            bg-black/20 p-1.5
            transition-all duration-300
            focus-within:border-violet-400/30
            focus-within:bg-white/[0.03]
          "
        >

          <input
            type="text"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            placeholder="Say something..."
            className="
              min-w-0 flex-1
              bg-transparent
              px-2 py-2
              text-sm text-white
              outline-none
              placeholder:text-slate-700
            "
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className="
              flex h-9 w-9
              shrink-0 items-center
              justify-center
              rounded-lg
              bg-violet-600
              text-sm font-bold
              transition-all duration-200
              hover:bg-violet-500
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            ↑
          </button>

        </div>

      </form>

    </section>
  );
}

export default ChatPanel;
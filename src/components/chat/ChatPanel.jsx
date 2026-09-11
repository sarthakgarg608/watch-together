import { useState } from "react";

function ChatPanel() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "System",
      text: "Welcome to the watch room!",
      system: true,
    },
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        sender: "You",
        text: cleanMessage,
      },
    ]);

    setMessage("");
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col">

      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">

        <div>
          <h2 className="text-sm font-bold text-white">
            Group Chat
          </h2>

          <p className="text-[10px] text-slate-500">
            Talk while you watch
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-emerald-400">
            Live
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">

        {messages.map((chat) => (
          <div
            key={chat.id}
            className={chat.system ? "text-center" : ""}
          >
            {chat.system ? (
              <div className="mx-auto max-w-[90%] rounded-xl bg-white/[0.03] px-3 py-2 text-xs text-slate-500">
                {chat.text}
              </div>
            ) : (
              <div className="flex gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[10px] font-bold">
                  Y
                </div>

                <div className="min-w-0">
                  <p className="mb-1 text-[10px] font-semibold text-violet-300">
                    {chat.sender}
                  </p>

                  <div className="rounded-2xl rounded-tl-sm border border-white/[0.06] bg-white/[0.04] px-3 py-2">
                    <p className="break-words text-xs leading-5 text-slate-300">
                      {chat.text}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-white/[0.08] p-3"
      >
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1.5 transition focus-within:border-violet-500/40">

          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Send a message..."
            className="min-w-0 flex-1 bg-transparent px-2 py-2 text-xs text-white outline-none placeholder:text-slate-600"
            maxLength={500}
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500 text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ↑
          </button>
        </div>
      </form>
    </section>
  );
}

export default ChatPanel;
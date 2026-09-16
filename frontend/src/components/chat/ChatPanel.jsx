import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useRoom,
} from "../../context/RoomContext";

import chatService from "../../services/chatService";

function ChatPanel() {
  const {
    user,
    accessToken,
  } = useAuth();

  const {
    room,
    socket,
    roomJoined,
  } = useRoom();

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    sending,
    setSending,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const messagesEndRef =
    useRef(null);

  const textareaRef =
    useRef(null);

  // --------------------------------------------------
  // Load Existing Messages
  // --------------------------------------------------

  useEffect(() => {
    if (
      !room?.roomCode ||
      !accessToken
    ) {
      return;
    }

    let cancelled = false;

    async function loadMessages() {
      setLoading(true);
      setError("");

      try {
        const response =
          await chatService.getMessages(
            room.roomCode,
            accessToken
          );

        const loadedMessages =
          response.data?.messages ||
          response.data ||
          [];

        if (
          !cancelled &&
          Array.isArray(
            loadedMessages
          )
        ) {
          setMessages(
            loadedMessages
          );
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error.message ||
              "Unable to load chat messages."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [
    room?.roomCode,
    accessToken,
  ]);

  // --------------------------------------------------
  // Socket Chat Events
  // --------------------------------------------------

  useEffect(() => {
    if (!socket) {
      return;
    }

    function handleChatMessage(
      newMessage
    ) {
      if (!newMessage) {
        return;
      }

      setMessages(
        (previous) => {
          /*
           * Avoid accidentally displaying the same
           * message twice if the server emits it
           * more than once.
           */
          const newMessageId =
            newMessage._id ||
            newMessage.id;

          if (
            newMessageId &&
            previous.some(
              (item) =>
                String(
                  item._id ||
                    item.id
                ) ===
                String(
                  newMessageId
                )
            )
          ) {
            return previous;
          }

          return [
            ...previous,
            newMessage,
          ];
        }
      );

      setError("");
      setSending(false);
    }

    function handleChatError(
      data
    ) {
      setSending(false);

      setError(
        data?.message ||
          "Unable to send message."
      );
    }

    socket.on(
      "chat:message",
      handleChatMessage
    );

    socket.on(
      "chat:error",
      handleChatError
    );

    return () => {
      socket.off(
        "chat:message",
        handleChatMessage
      );

      socket.off(
        "chat:error",
        handleChatError
      );
    };
  }, [socket]);

  // --------------------------------------------------
  // Auto Scroll
  // --------------------------------------------------

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // --------------------------------------------------
  // Send Message
  // --------------------------------------------------

  function sendMessage() {
    const trimmedMessage =
      message.trim();

    if (!trimmedMessage) {
      return;
    }

    if (
      trimmedMessage.length >
      1000
    ) {
      setError(
        "Message cannot exceed 1000 characters."
      );

      return;
    }

    if (
      !socket ||
      !socket.connected
    ) {
      setError(
        "You are not connected to the room."
      );

      return;
    }

    if (!roomJoined) {
      setError(
        "Joining room. Please wait a moment."
      );

      return;
    }

    setError("");
    setSending(true);

    socket.emit(
      "chat:send",
      {
        content:
          trimmedMessage,
      }
    );

    setMessage("");

    /*
     * Keep the input focused after sending.
     */
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }

  // --------------------------------------------------
  // Form Submit
  // --------------------------------------------------

  function handleSubmit(
    event
  ) {
    event.preventDefault();

    sendMessage();
  }

  // --------------------------------------------------
  // Input Change
  // --------------------------------------------------

  function handleMessageChange(
    event
  ) {
    const value =
      event.target.value;

    if (
      value.length <= 1000
    ) {
      setMessage(value);
      setError("");
    }
  }

  // --------------------------------------------------
  // Enter Key
  // --------------------------------------------------

  function handleKeyDown(
    event
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  }

  // --------------------------------------------------
  // Format Time
  // --------------------------------------------------

  function formatTime(
    value
  ) {
    if (!value) {
      return "";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  // --------------------------------------------------
  // Sender Name
  // --------------------------------------------------

  function getSenderName(
    chatMessage
  ) {
    if (
      chatMessage.sender?.name
    ) {
      return chatMessage.sender.name;
    }

    if (
      chatMessage.senderName
    ) {
      return chatMessage.senderName;
    }

    return "User";
  }

  // --------------------------------------------------
  // Sender Initial
  // --------------------------------------------------

  function getSenderInitial(
    chatMessage
  ) {
    const name =
      getSenderName(
        chatMessage
      );

    return (
      name
        .charAt(0)
        .toUpperCase() ||
      "U"
    );
  }

  // --------------------------------------------------
  // Own Message
  // --------------------------------------------------

  function isOwnMessage(
    chatMessage
  ) {
    const senderId =
      chatMessage.sender?._id ||
      chatMessage.sender?.userId ||
      chatMessage.sender;

    return (
      String(senderId) ===
      String(user?._id)
    );
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="flex h-full min-h-[420px] flex-col bg-[#070811]">

      {/* ------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------ */}

      <div className="shrink-0 border-b border-white/[0.08] bg-white/[0.015] px-4 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/15 bg-violet-500/10 text-sm">
              💬

              {roomJoined && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#070811] bg-emerald-400" />
              )}
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">
                Room Chat
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Talk with everyone watching
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
              roomJoined
                ? "border-emerald-500/10 bg-emerald-500/[0.06] text-emerald-300"
                : "border-amber-500/10 bg-amber-500/[0.06] text-amber-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                roomJoined
                  ? "bg-emerald-400"
                  : "bg-amber-400"
              }`}
            />

            <span className="text-[9px] font-semibold">
              {roomJoined
                ? "Live"
                : "Connecting"}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------ */}
      {/* Messages */}
      {/* ------------------------------------------ */}

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />

              <span className="text-[10px] text-slate-600">
                Loading conversation...
              </span>
            </div>
          </div>
        )}

        {!loading &&
          messages.length === 0 && (
            <div className="flex h-full min-h-[280px] items-center justify-center px-4 text-center">
              <div>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] text-xl shadow-xl">
                  💬
                </div>

                <p className="text-xs font-semibold text-slate-300">
                  No messages yet
                </p>

                <p className="mx-auto mt-1.5 max-w-[180px] text-[10px] leading-5 text-slate-600">
                  Start the conversation while you
                  watch together.
                </p>
              </div>
            </div>
          )}

        <div className="space-y-4">
          {messages.map(
            (
              chatMessage,
              index
            ) => {
              const own =
                isOwnMessage(
                  chatMessage
                );

              const senderName =
                getSenderName(
                  chatMessage
                );

              return (
                <div
                  key={
                    chatMessage._id ||
                    chatMessage.id ||
                    index
                  }
                  className={`flex gap-2 ${
                    own
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {/* Other user's avatar */}
                  {!own && (
                    <div className="mt-5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-violet-500/15 bg-violet-500/10 text-[9px] font-bold text-violet-300">
                      {getSenderInitial(
                        chatMessage
                      )}
                    </div>
                  )}

                  <div
                    className={`flex max-w-[82%] flex-col ${
                      own
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    {!own && (
                      <p className="mb-1 px-1 text-[9px] font-semibold text-violet-300">
                        {senderName}
                      </p>
                    )}

                    <div
                      className={`relative rounded-2xl px-3.5 py-2.5 shadow-sm ${
                        own
                          ? "rounded-br-md bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-violet-500/10"
                          : "rounded-bl-md border border-white/[0.07] bg-white/[0.035] text-slate-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words text-xs leading-5">
                        {
                          chatMessage.content
                        }
                      </p>
                    </div>

                    <p
                      className={`mt-1 px-1 text-[9px] text-slate-600 ${
                        own
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {formatTime(
                        chatMessage.createdAt
                      )}
                    </p>
                  </div>

                  {/* Own user's avatar */}
                  {own && (
                    <div className="mt-5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-violet-500/20 bg-violet-500/15 text-[9px] font-bold text-violet-300">
                      {(
                        user?.name ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>

        <div
          ref={
            messagesEndRef
          }
        />
      </div>

      {/* ------------------------------------------ */}
      {/* Error */}
      {/* ------------------------------------------ */}

      {error && (
        <div className="shrink-0 border-t border-red-500/10 bg-red-500/[0.03] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-[9px] font-bold text-red-400">
              !
            </span>

            <p className="text-[10px] text-red-400">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------ */}
      {/* Input */}
      {/* ------------------------------------------ */}

      <form
        onSubmit={
          handleSubmit
        }
        className="shrink-0 border-t border-white/[0.08] bg-white/[0.015] p-3"
      >
        <div className="rounded-xl border border-white/[0.08] bg-black/20 p-1.5 transition-colors duration-200 focus-within:border-violet-500/30 focus-within:bg-violet-500/[0.02]">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={
                handleMessageChange
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder={
                roomJoined
                  ? "Type a message..."
                  : "Connecting to chat..."
              }
              disabled={
                !roomJoined ||
                sending
              }
              rows={1}
              maxLength={1000}
              className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-xs leading-5 text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={
                !message.trim() ||
                !roomJoined ||
                sending
              }
              className="flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-violet-500 px-3 text-[10px] font-bold text-white shadow-lg shadow-violet-500/10 transition-all duration-200 hover:bg-violet-400 hover:shadow-violet-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
            >
              {sending ? (
                <div className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
              ) : (
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              )}

              <span className="hidden sm:inline">
                {sending
                  ? "Sending"
                  : "Send"}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-1.5 flex items-center justify-between px-1">
          <span className="text-[9px] text-slate-600">
            Enter to send · Shift+Enter for new line
          </span>

          <span
            className={`text-[9px] ${
              message.length >=
              900
                ? "text-amber-400"
                : "text-slate-600"
            }`}
          >
            {message.length}/1000
          </span>
        </div>
      </form>
    </div>
  );
}

export default ChatPanel;


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
        (previous) => [
          ...previous,
          newMessage,
        ]
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
    <div className="flex h-full min-h-[420px] flex-col">

      {/* ------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------ */}

      <div className="border-b border-white/[0.08] px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">
              Room Chat
            </h2>

            <p className="mt-0.5 text-[10px] text-slate-500">
              Talk with everyone watching
            </p>
          </div>

          <span
            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
              roomJoined
                ? "bg-emerald-500/10 text-emerald-300"
                : "bg-amber-500/10 text-amber-300"
            }`}
          >
            {roomJoined
              ? "Live"
              : "Connecting"}
          </span>
        </div>
      </div>

      {/* ------------------------------------------ */}
      {/* Messages */}
      {/* ------------------------------------------ */}

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">

        {loading && (
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />
          </div>
        )}

        {!loading &&
          messages.length === 0 && (
            <div className="flex h-full min-h-[280px] items-center justify-center text-center">
              <div>
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] text-lg">
                  💬
                </div>

                <p className="text-xs font-medium text-slate-400">
                  No messages yet
                </p>

                <p className="mt-1 text-[10px] text-slate-600">
                  Start the conversation.
                </p>
              </div>
            </div>
          )}

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
                className={`flex ${
                  own
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] ${
                    own
                      ? "items-end"
                      : "items-start"
                  }`}
                >
                  {!own && (
                    <p className="mb-1 px-1 text-[10px] font-semibold text-violet-300">
                      {senderName}
                    </p>
                  )}

                  <div
                    className={`rounded-2xl px-3 py-2 ${
                      own
                        ? "rounded-br-md bg-violet-500 text-white"
                        : "rounded-bl-md border border-white/[0.07] bg-white/[0.04] text-slate-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words text-xs leading-relaxed">
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
              </div>
            );
          }
        )}

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
        <div className="border-t border-white/[0.06] px-4 py-2">
          <p className="text-[10px] text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* ------------------------------------------ */}
      {/* Input */}
      {/* ------------------------------------------ */}

      <form
        onSubmit={
          handleSubmit
        }
        className="border-t border-white/[0.08] p-3"
      >
        <div className="flex items-end gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] p-1.5 focus-within:border-violet-500/30">
          <textarea
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
                : "Connecting..."
            }
            disabled={
              !roomJoined ||
              sending
            }
            rows={1}
            maxLength={1000}
            className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-xs text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={
              !message.trim() ||
              !roomJoined ||
              sending
            }
            className="rounded-lg bg-violet-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending
              ? "..."
              : "Send"}
          </button>
        </div>

        <div className="mt-1.5 flex justify-between px-1">
          <span className="text-[9px] text-slate-600">
            Enter to send · Shift+Enter for new line
          </span>

          <span className="text-[9px] text-slate-600">
            {message.length}/1000
          </span>
        </div>
      </form>
    </div>
  );
}

export default ChatPanel;


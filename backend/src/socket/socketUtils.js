const registerRateLimitedEvent = (
  socket,
  eventName,
  handler,
  rateLimiter,
  errorMessage
) => {
  socket.on(eventName, async (...args) => {
    const allowed = rateLimiter(
      socket,
      eventName
    );

    if (!allowed) {
      socket.emit("socket:rate-limit", {
        event: eventName,
        message:
          errorMessage ||
          "Too many requests. Please try again later.",
      });

      return;
    }

    try {
      await handler(...args);
    } catch (error) {
      console.error(
        `Socket event error [${eventName}]:`,
        error
      );

      socket.emit("socket:error", {
        event: eventName,
        message: "Something went wrong.",
      });
    }
  });
};

export {
  registerRateLimitedEvent,
};
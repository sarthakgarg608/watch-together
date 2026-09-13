const socketRateLimit = ({
  windowMs,
  maxEvents,
}) => {
  const events = new Map();

  const cleanupInterval = setInterval(() => {
    const now = Date.now();

    for (const [key, record] of events) {
      if (
        now - record.startTime >=
        windowMs
      ) {
        events.delete(key);
      }
    }
  }, windowMs);

  /*
   * Don't keep Node.js alive only because of
   * this cleanup timer.
   */
  cleanupInterval.unref();

  return (socket, eventName) => {
    const key =
      `${socket.user.userId}:${eventName}`;

    const now = Date.now();

    let record = events.get(key);

    if (
      !record ||
      now - record.startTime >= windowMs
    ) {
      record = {
        startTime: now,
        count: 0,
      };

      events.set(key, record);
    }

    record.count += 1;

    if (record.count > maxEvents) {
      return false;
    }

    return true;
  };
};

const generalSocketRateLimit =
  socketRateLimit({
    windowMs: 10 * 1000,
    maxEvents: 30,
  });

const chatSocketRateLimit =
  socketRateLimit({
    windowMs: 10 * 1000,
    maxEvents: 10,
  });

const playbackSocketRateLimit =
  socketRateLimit({
    windowMs: 5 * 1000,
    maxEvents: 20,
  });

export {
  generalSocketRateLimit,
  chatSocketRateLimit,
  playbackSocketRateLimit,
};
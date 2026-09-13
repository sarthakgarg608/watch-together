const roomPresence = new Map();

/*
  Structure:

  roomPresence = {
    "ABC123": {
      "userId1": 2,
      "userId2": 1
    }
  }

  The number represents how many active socket
  connections that user currently has in the room.

  We use a count because the same user may have:
  - multiple browser tabs
  - multiple devices
*/
const addPresence = (roomCode, userId) => {
  if (!roomPresence.has(roomCode)) {
    roomPresence.set(roomCode, new Map());
  }

  const members = roomPresence.get(roomCode);

  const currentCount = members.get(userId) || 0;

  members.set(userId, currentCount + 1);
};

const removePresence = (roomCode, userId) => {
  const members = roomPresence.get(roomCode);

  if (!members) {
    return false;
  }

  const currentCount = members.get(userId) || 0;

  if (currentCount <= 1) {
    members.delete(userId);
  } else {
    members.set(userId, currentCount - 1);
  }

  if (members.size === 0) {
    roomPresence.delete(roomCode);
  }

  return currentCount === 1;
};

const getRoomPresence = (roomCode) => {
  const members = roomPresence.get(roomCode);

  if (!members) {
    return [];
  }

  return Array.from(members.keys());
};

const isUserPresent = (roomCode, userId) => {
  const members = roomPresence.get(roomCode);

  return members?.has(userId) || false;
};

export {
  addPresence,
  removePresence,
  getRoomPresence,
  isUserPresent,
};
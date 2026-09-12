// roomService.js
// ------------------------------------------------------
// Room API abstraction.
//
// This is currently a MOCK service.
// No backend is required yet.
//
// Later:
// frontend
//    ↓
// roomService
//    ↓
// HTTP API
//    ↓
// Node/Express backend
// ------------------------------------------------------

const roomService = {
  async createRoom(roomData) {
    console.log(
      "Creating room:",
      roomData
    );

    const roomCode =
      `ROOM${Math.floor(
        1000 + Math.random() * 9000
      )}`;

    return {
      success: true,

      data: {
        ...roomData,

        roomCode,

        createdBy:
          "user-1",

        host:
          "user-1",
      },
    };
  },

  async getRoom(roomCode) {
    console.log(
      "Getting room:",
      roomCode
    );

    return {
      success: true,

      data: {
        roomCode,

        name:
          "Movie Night",

        description:
          "Watch together",

        accessType:
          "private",

        maxParticipants:
          5,

        createdBy:
          "user-1",

        host:
          "user-1",
      },
    };
  },

  async joinRoom(roomCode) {
    console.log(
      "Joining room:",
      roomCode
    );

    return {
      success: true,

      data: {
        roomCode,

        name:
          "Movie Night",

        description:
          "Watch together",

        accessType:
          "private",

        maxParticipants:
          5,

        createdBy:
          "user-1",

        host:
          "user-1",
      },
    };
  },

  async leaveRoom(roomCode) {
    console.log(
      "Leaving room:",
      roomCode
    );

    return {
      success: true,
    };
  },
};

export default roomService;
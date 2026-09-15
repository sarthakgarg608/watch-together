let ioInstance = null;

function setSocketIO(io) {
  ioInstance = io;
}

function emitToRoom(roomCode, event, data) {
  if (!ioInstance) {
    console.warn(
      "Socket.IO instance is not initialized."
    );
    return;
  }

  ioInstance
    .to(`room:${roomCode}`)
    .emit(event, data);
}

export {
  setSocketIO,
  emitToRoom,
};
import crypto from "crypto";

const ROOM_CODE_LENGTH = 6;

function generateRoomCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let roomCode = "";

  const randomBytes = crypto.randomBytes(ROOM_CODE_LENGTH);

  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    roomCode += characters[randomBytes[i] % characters.length];
  }

  return roomCode;
}

export default generateRoomCode;
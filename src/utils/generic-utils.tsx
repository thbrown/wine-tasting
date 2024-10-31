import { ConnectionSpecification } from "../parent";
import { v4 as uuidv4 } from "uuid";
import { generate } from "random-words";

export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${value}`);
};

// Move this to a util?
export const createNewRoom = (): ConnectionSpecification => {
  console.log("Creating new room");
  return {
    roomId: getWords(3),
    roomPwd: uuidv4(),
    localId: "host",
    localPwd: uuidv4(),
  };
};

export const getWords = (count: number): string => {
  return (generate(3) as string[]).join("-");
};

export const getNextLetter = (index: number): string => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const base = alphabet.length;

  let result = "";

  while (index >= 0) {
    const remainder = index % base;
    result = alphabet[remainder] + result;

    index = Math.floor(index / base) - 1;
  }

  return result;
};

export const toUrlPath = (connectionSpec: ConnectionSpecification): string => {
  return `/connect?roomId=${connectionSpec.roomId}&roomPwd=${connectionSpec.roomPwd}&localId=${connectionSpec.qrId}&localPwd=${connectionSpec.qrPwd}`;
};

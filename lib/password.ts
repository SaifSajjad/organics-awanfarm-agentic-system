import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);
const PASSWORD_ALGORITHM = "scrypt";
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_SALT_LENGTH = 16;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(PASSWORD_SALT_LENGTH).toString("base64url");
  const derivedKey = (await scrypt(password, salt, PASSWORD_KEY_LENGTH)) as Buffer;

  return `${PASSWORD_ALGORITHM}$${salt}$${derivedKey.toString("base64url")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string | null | undefined
): Promise<boolean> {
  if (!password || !storedHash) {
    return false;
  }

  const [algorithm, salt, encodedKey] = storedHash.split("$");

  if (algorithm !== PASSWORD_ALGORITHM || !salt || !encodedKey) {
    return false;
  }

  const storedKey = Buffer.from(encodedKey, "base64url");
  const derivedKey = (await scrypt(password, salt, storedKey.length)) as Buffer;

  if (derivedKey.length !== storedKey.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, storedKey);
}

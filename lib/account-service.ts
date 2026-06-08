import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

const MIN_PASSWORD_LENGTH = 8;
const CUSTOMER_ONBOARDING_PLACEHOLDER = "Pending onboarding";

export type AccountResult =
  | { ok: true }
  | { ok: false; status: 400 | 401 | 403 | 409 | 500; message: string };

type CustomerSignupInput = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  password?: unknown;
  role?: unknown;
};

type RiderAccountInput = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  password?: unknown;
  role?: unknown;
};

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value: unknown): string {
  return readString(value).toLowerCase();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hasSubmittedRole(value: unknown): boolean {
  return typeof value !== "undefined";
}

async function emailExists(email: string): Promise<boolean> {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  });

  return Boolean(existingUser);
}

export async function createCustomerAccount(
  input: CustomerSignupInput
): Promise<AccountResult> {
  const name = readString(input.name);
  const email = normalizeEmail(input.email);
  const phone = readString(input.phone);
  const password = readString(input.password);

  if (
    hasSubmittedRole(input.role) ||
    !name ||
    !isValidEmail(email) ||
    !phone ||
    password.length < MIN_PASSWORD_LENGTH
  ) {
    return {
      ok: false,
      status: 400,
      message: "Unable to create account."
    };
  }

  if (await emailExists(email)) {
    return {
      ok: false,
      status: 409,
      message: "Unable to create account."
    };
  }

  try {
    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: "CUSTOMER",
          customer: {
            create: {
              name,
              phone,
              area: CUSTOMER_ONBOARDING_PLACEHOLDER,
              address: CUSTOMER_ONBOARDING_PLACEHOLDER
            }
          }
        },
        select: {
          id: true
        }
      })
    ]);

    return { ok: true };
  } catch {
    return {
      ok: false,
      status: 500,
      message: "Unable to create account."
    };
  }
}

export async function createRiderAccount(
  input: RiderAccountInput
): Promise<AccountResult> {
  const name = readString(input.name);
  const email = normalizeEmail(input.email);
  const phone = readString(input.phone);
  const password = readString(input.password);

  if (
    hasSubmittedRole(input.role) ||
    !name ||
    !isValidEmail(email) ||
    password.length < MIN_PASSWORD_LENGTH
  ) {
    return {
      ok: false,
      status: 400,
      message: "Unable to create rider account."
    };
  }

  if (await emailExists(email)) {
    return {
      ok: false,
      status: 409,
      message: "Unable to create rider account."
    };
  }

  try {
    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: "RIDER",
          rider: {
            create: {
              name,
              phone: phone || null,
              active: true
            }
          }
        },
        select: {
          id: true
        }
      })
    ]);

    return { ok: true };
  } catch {
    return {
      ok: false,
      status: 500,
      message: "Unable to create rider account."
    };
  }
}

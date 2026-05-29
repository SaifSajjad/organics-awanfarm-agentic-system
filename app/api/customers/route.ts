import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { formatCustomer } from "@/lib/db-formatters";

const createCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  displayName: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  whatsapp: z.string().optional(),
  area: z.string().min(1),
  address: z.string().min(1).optional(),
  product: z.string().min(1).optional(),
  productId: z.string().min(1).optional(),
  frequency: z.string().optional(),
  quantity: z.coerce.number().positive().optional(),
  rate: z.coerce.number().positive().optional(),
  notes: z.string().optional()
});

function normalizeFrequency(value?: string) {
  const frequency = value?.trim().toUpperCase().replaceAll(" ", "_") ?? "DAILY";
  if (["DAILY", "WEEKLY", "CUSTOM_DAYS", "ONE_TIME"].includes(frequency)) {
    return frequency as "DAILY" | "WEEKLY" | "CUSTOM_DAYS" | "ONE_TIME";
  }
  return "DAILY";
}

export async function GET() {
  const customers = await prisma.customerProfile.findMany({
    include: {
      addresses: true,
      subscriptions: {
        include: { product: true },
        orderBy: { createdAt: "desc" }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(customers.map(formatCustomer));
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createCustomerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid customer request" }, { status: 400 });
  }

  const data = parsed.data;
  const displayName = data.displayName ?? data.name;

  if (!displayName) {
    return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
  }

  const product = await prisma.product.findFirst({
    where: data.productId ? { id: data.productId } : { name: data.product ?? "Cow Milk" }
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 400 });
  }

  const customer = await prisma.$transaction(async (tx) => {
    const createdCustomer = await tx.customerProfile.create({
      data: {
        displayName,
        phone: data.phone ?? "0339-5235323",
        whatsapp: data.whatsapp,
        notes: data.notes
      }
    });

    const address = await tx.address.create({
      data: {
        customerId: createdCustomer.id,
        label: "Home",
        line1: data.address ?? `${displayName}, ${data.area}, Lahore`,
        area: data.area,
        city: "Lahore",
        isDefault: true
      }
    });

    await tx.subscription.create({
      data: {
        customerId: createdCustomer.id,
        productId: product.id,
        addressId: address.id,
        frequency: normalizeFrequency(data.frequency),
        status: "ACTIVE",
        quantity: String(data.quantity ?? 1),
        rate: String(data.rate ?? product.price),
        startDate: new Date()
      }
    });

    return tx.customerProfile.findUniqueOrThrow({
      where: { id: createdCustomer.id },
      include: {
        addresses: true,
        subscriptions: { include: { product: true } }
      }
    });
  });

  return NextResponse.json(formatCustomer(customer), { status: 201 });
}

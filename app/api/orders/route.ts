import { DeliveryStatus, PaymentStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { formatOrder } from "@/lib/db-formatters";
import { prisma } from "@/lib/prisma";

const orderItemSchema = z.object({
  productId: z.string().min(1).optional(),
  product: z.string().min(1).optional(),
  quantity: z.coerce.number().positive().optional(),
  rate: z.coerce.number().positive().optional()
});

const createOrderSchema = z.object({
  customerId: z.string().min(1),
  addressId: z.string().min(1).optional(),
  subscriptionId: z.string().min(1).optional(),
  product: z.string().min(1).optional(),
  productId: z.string().min(1).optional(),
  quantity: z.coerce.number().positive().optional(),
  deliveryDate: z.string().optional(),
  deliveryStatus: z.string().optional(),
  paymentStatus: z.string().optional(),
  discount: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).optional()
});

function parseDeliveryStatus(value?: string) {
  const status = value?.trim().toUpperCase().replaceAll(" ", "_") ?? "PENDING";
  if (Object.values(DeliveryStatus).includes(status as DeliveryStatus)) {
    return status as DeliveryStatus;
  }
  return DeliveryStatus.PENDING;
}

function parsePaymentStatus(value?: string) {
  const status = value?.trim().toUpperCase().replaceAll(" ", "_") ?? "UNPAID";
  if (Object.values(PaymentStatus).includes(status as PaymentStatus)) {
    return status as PaymentStatus;
  }
  return PaymentStatus.UNPAID;
}

function decimal(value: unknown, fallback = "0") {
  return new Prisma.Decimal(String(value ?? fallback));
}

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      address: true,
      items: { include: { product: true } },
      delivery: true,
      payments: true
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(orders.map(formatOrder));
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order request" }, { status: 400 });
  }

  const data = parsed.data;
  const customer = await prisma.customerProfile.findUnique({
    where: { id: data.customerId },
    include: { addresses: true }
  });

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 400 });
  }

  const requestedItems = data.items?.length
    ? data.items
    : [
        {
          productId: data.productId,
          product: data.product,
          quantity: data.quantity
        }
      ];

  const orderItems = [];

  for (const item of requestedItems) {
    const product = await prisma.product.findFirst({
      where: item.productId ? { id: item.productId } : { name: item.product ?? "Cow Milk" }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 400 });
    }

    const quantity = decimal(item.quantity, "1");
    const rate = decimal(item.rate ?? product.price, product.price.toString());
    const total = quantity.mul(rate);

    orderItems.push({
      productId: product.id,
      quantity,
      rate,
      total
    });
  }

  const subtotal = orderItems.reduce((sum, item) => sum.add(item.total), new Prisma.Decimal(0));
  const discount = decimal(data.discount, "0");
  const totalAmount = subtotal.sub(discount);
  const addressId = data.addressId ?? customer.addresses.find((address) => address.isDefault)?.id ?? customer.addresses[0]?.id;

  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      addressId,
      subscriptionId: data.subscriptionId,
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : new Date(),
      status: parseDeliveryStatus(data.deliveryStatus),
      paymentStatus: parsePaymentStatus(data.paymentStatus),
      subtotal,
      discount,
      totalAmount,
      notes: data.notes,
      items: {
        create: orderItems
      }
    },
    include: {
      customer: true,
      address: true,
      items: { include: { product: true } },
      delivery: true,
      payments: true
    }
  });

  return NextResponse.json(formatOrder(order), { status: 201 });
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cowMilk = await prisma.product.upsert({
    where: { id: "cow-milk" },
    update: { name: "Cow Milk", type: "COW_MILK", price: 330, unit: "liter", active: true },
    create: {
      id: "cow-milk",
      name: "Cow Milk",
      type: "COW_MILK",
      price: 330,
      unit: "liter"
    }
  });

  const buffaloMilk = await prisma.product.upsert({
    where: { id: "buffalo-milk" },
    update: { name: "Buffalo Milk", type: "BUFFALO_MILK", price: 430, unit: "liter", active: true },
    create: {
      id: "buffalo-milk",
      name: "Buffalo Milk",
      type: "BUFFALO_MILK",
      price: 430,
      unit: "liter"
    }
  });

  await prisma.payment.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.customer.deleteMany();

  const modelTown = await prisma.customer.create({
    data: {
      name: "69 E Model Town",
      phone: "0339-5235323",
      area: "Model Town",
      address: "69 E Model Town, Lahore",
      notes: "Demo monthly subscription customer"
    }
  });

  const bahria = await prisma.customer.create({
    data: {
      name: "Bahria Sector B",
      phone: "0339-5235323",
      area: "Bahria",
      address: "Bahria Sector B, Lahore",
      notes: "Demo buffalo milk order customer"
    }
  });

  const johar = await prisma.customer.create({
    data: {
      name: "91 H3 Johar Town",
      phone: "0339-5235323",
      area: "Johar Town",
      address: "91 H3 Johar Town, Lahore",
      notes: "Demo delivered order customer"
    }
  });

  await prisma.subscription.createMany({
    data: [
      {
        customerId: modelTown.id,
        productId: cowMilk.id,
        type: "DAILY",
        status: "ACTIVE",
        quantity: 4,
        rate: 330
      },
      {
        customerId: bahria.id,
        productId: buffaloMilk.id,
        type: "DAILY",
        status: "ACTIVE",
        quantity: 4,
        rate: 430
      }
    ]
  });

  const order1 = await prisma.order.create({
    data: {
      customerId: modelTown.id,
      deliveryDate: new Date(),
      status: "PENDING",
      totalAmount: 1320,
      paymentStatus: "UNPAID",
      items: {
        create: {
          productId: cowMilk.id,
          quantity: 4,
          rate: 330,
          total: 1320
        }
      },
      delivery: {
        create: {
          area: "Model Town",
          status: "PENDING"
        }
      }
    }
  });

  await prisma.order.create({
    data: {
      customerId: bahria.id,
      deliveryDate: new Date(),
      status: "OUT_FOR_DELIVERY",
      totalAmount: 1720,
      paymentStatus: "UNPAID",
      items: {
        create: {
          productId: buffaloMilk.id,
          quantity: 4,
          rate: 430,
          total: 1720
        }
      },
      delivery: {
        create: {
          area: "Bahria",
          status: "OUT_FOR_DELIVERY"
        }
      }
    }
  });

  const paidOrder = await prisma.order.create({
    data: {
      customerId: johar.id,
      deliveryDate: new Date(),
      status: "DELIVERED",
      totalAmount: 330,
      paymentStatus: "PAID",
      items: {
        create: {
          productId: cowMilk.id,
          quantity: 1,
          rate: 330,
          total: 330
        }
      },
      delivery: {
        create: {
          area: "Johar Town",
          status: "DELIVERED"
        }
      }
    }
  });

  await prisma.payment.create({
    data: {
      customerId: johar.id,
      orderId: paidOrder.id,
      amount: 330,
      status: "PAID",
      method: "Cash",
      notes: "Seed paid demo order"
    }
  });

  await prisma.expense.createMany({
    data: [
      { type: "Fuel", amount: 900, description: "Fuel / Transport" },
      { type: "Packaging", amount: 2000, description: "Purchase bottles" },
      { type: "Rider", amount: 1220, description: "Rider and petrol mixed expense" }
    ]
  });

  console.log({ products: [cowMilk.id, buffaloMilk.id], firstOrder: order1.id });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

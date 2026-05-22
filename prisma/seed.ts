import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@awanfarm.com" },
    update: {},
    create: {
      name: "Awan Farms Admin",
      email: "admin@awanfarm.com",
      role: "ADMIN"
    }
  });

  await prisma.user.upsert({
    where: { email: "rider@awanfarm.com" },
    update: {},
    create: {
      name: "Demo Rider",
      email: "rider@awanfarm.com",
      role: "RIDER",
      rider: {
        create: {
          name: "Demo Rider",
          phone: "0339-5235323"
        }
      }
    }
  });

  const cowMilk = await prisma.product.upsert({
    where: { id: "cow-milk" },
    update: {},
    create: {
      id: "cow-milk",
      name: "Cow Milk",
      type: "COW_MILK",
      price: 330
    }
  });

  const buffaloMilk = await prisma.product.upsert({
    where: { id: "buffalo-milk" },
    update: {},
    create: {
      id: "buffalo-milk",
      name: "Buffalo Milk",
      type: "BUFFALO_MILK",
      price: 430
    }
  });

  const customer = await prisma.customer.create({
    data: {
      name: "69 E Model Town",
      phone: "0339-5235323",
      area: "Model Town",
      address: "69 E Model Town, Lahore",
      notes: "Excel record shows paid status but pending amount exists."
    }
  });

  await prisma.subscription.create({
    data: {
      customerId: customer.id,
      productId: cowMilk.id,
      type: "DAILY",
      quantity: 4,
      rate: 330
    }
  });

  const bahriaCustomer = await prisma.customer.create({
    data: {
      name: "Bahria Sector B",
      area: "Bahria",
      address: "Bahria Sector B, Lahore"
    }
  });

  const order = await prisma.order.create({
    data: {
      customerId: bahriaCustomer.id,
      deliveryDate: new Date(),
      totalAmount: 1720,
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
          status: "PENDING"
        }
      }
    }
  });

  await prisma.expense.createMany({
    data: [
      { type: "FUEL", amount: 900, description: "Fuel / Transport" },
      { type: "PACKAGING", amount: 2000, description: "Purchase bottles" },
      { type: "RIDER", amount: 1220, description: "Rider and petrol mixed expense" }
    ]
  });

  console.log({ admin: admin.email, order: order.id });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { scryptSync } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function demoPasswordHash(password: string, salt: string) {
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function atHour(base: Date, hour: number, minute = 0) {
  const date = new Date(base);
  date.setHours(hour, minute, 0, 0);
  return date;
}

async function clearDemoData() {
  await prisma.aiAgentAction.deleteMany();
  await prisma.aiConversation.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.milkProduction.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.route.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.subscriptionSchedule.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.address.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.riderProfile.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to run demo seed in production.");
  }

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  await clearDemoData();

  await prisma.user.createMany({
    data: [
      {
        id: "user-admin",
        email: "admin@organics.com",
        name: "Admin",
        passwordHash: demoPasswordHash("admin123", "organics-admin"),
        role: "ADMIN",
        phone: "0339-5235323"
      },
      {
        id: "user-staff",
        email: "staff@organics.com",
        name: "Operations Staff",
        passwordHash: demoPasswordHash("staff123", "organics-staff"),
        role: "STAFF",
        phone: "0339-5235323"
      },
      {
        id: "user-customer-model-town",
        email: "customer@organics.com",
        name: "69 E Model Town",
        passwordHash: demoPasswordHash("customer123", "organics-customer"),
        role: "CUSTOMER",
        phone: "0339-5235323"
      },
      {
        id: "user-rider-primary",
        email: "rider@organics.com",
        name: "Primary Rider",
        passwordHash: demoPasswordHash("rider123", "organics-rider"),
        role: "RIDER",
        phone: "0339-5235323"
      }
    ]
  });

  await prisma.customerProfile.createMany({
    data: [
      {
        id: "customer-model-town",
        userId: "user-customer-model-town",
        displayName: "69 E Model Town",
        phone: "0339-5235323",
        whatsapp: "923395235323",
        notes: "Daily cow milk household subscription"
      },
      {
        id: "customer-bahria-sector-b",
        displayName: "Bahria Sector B",
        phone: "0339-5235323",
        whatsapp: "923395235323",
        notes: "Buffalo milk family subscription"
      },
      {
        id: "customer-johar-town",
        displayName: "91 H3 Johar Town",
        phone: "0339-5235323",
        whatsapp: "923395235323",
        notes: "Delivered paid demo customer"
      }
    ]
  });

  await prisma.riderProfile.create({
    data: {
      id: "rider-primary",
      userId: "user-rider-primary",
      displayName: "Primary Rider",
      phone: "0339-5235323",
      vehicleLabel: "Milk Bike 1"
    }
  });

  await prisma.address.createMany({
    data: [
      {
        id: "address-model-town",
        customerId: "customer-model-town",
        label: "Home",
        line1: "69 E Model Town",
        area: "Model Town",
        city: "Lahore",
        landmark: "Near Model Town Park",
        isDefault: true
      },
      {
        id: "address-bahria-sector-b",
        customerId: "customer-bahria-sector-b",
        label: "Home",
        line1: "Bahria Sector B",
        area: "Bahria",
        city: "Lahore",
        landmark: "Sector B",
        isDefault: true
      },
      {
        id: "address-johar-town",
        customerId: "customer-johar-town",
        label: "Home",
        line1: "91 H3 Johar Town",
        area: "Johar Town",
        city: "Lahore",
        landmark: "Near main boulevard",
        isDefault: true
      }
    ]
  });

  await prisma.product.createMany({
    data: [
      {
        id: "product-cow-milk",
        name: "Cow Milk",
        type: "COW_MILK",
        unit: "liter",
        price: "330.00"
      },
      {
        id: "product-buffalo-milk",
        name: "Buffalo Milk",
        type: "BUFFALO_MILK",
        unit: "liter",
        price: "430.00"
      },
      {
        id: "product-blend-milk",
        name: "Cow + Buffalo Blend",
        type: "BLEND",
        unit: "liter",
        price: "380.00"
      },
      {
        id: "product-rice",
        name: "Farm Rice",
        type: "RICE",
        unit: "kg",
        price: "450.00"
      },
      {
        id: "product-wheat",
        name: "Farm Wheat",
        type: "WHEAT",
        unit: "kg",
        price: "220.00"
      }
    ]
  });

  await prisma.subscription.createMany({
    data: [
      {
        id: "sub-model-town-cow-daily",
        customerId: "customer-model-town",
        productId: "product-cow-milk",
        addressId: "address-model-town",
        status: "ACTIVE",
        frequency: "DAILY",
        quantity: "2.00",
        rate: "330.00",
        startDate: startOfMonth,
        notes: "Daily morning cow milk delivery"
      },
      {
        id: "sub-bahria-buffalo-daily",
        customerId: "customer-bahria-sector-b",
        productId: "product-buffalo-milk",
        addressId: "address-bahria-sector-b",
        status: "ACTIVE",
        frequency: "DAILY",
        quantity: "4.00",
        rate: "430.00",
        startDate: startOfMonth,
        notes: "Daily buffalo milk family subscription"
      },
      {
        id: "sub-johar-blend-custom",
        customerId: "customer-johar-town",
        productId: "product-blend-milk",
        addressId: "address-johar-town",
        status: "ACTIVE",
        frequency: "CUSTOM_DAYS",
        quantity: "1.50",
        rate: "380.00",
        startDate: startOfMonth,
        notes: "Monday, Wednesday, Friday blend milk"
      }
    ]
  });

  await prisma.subscriptionSchedule.createMany({
    data: [
      { id: "schedule-johar-mon", subscriptionId: "sub-johar-blend-custom", dayOfWeek: 1 },
      { id: "schedule-johar-wed", subscriptionId: "sub-johar-blend-custom", dayOfWeek: 3 },
      { id: "schedule-johar-fri", subscriptionId: "sub-johar-blend-custom", dayOfWeek: 5 }
    ]
  });

  await prisma.order.createMany({
    data: [
      {
        id: "order-model-town-pending",
        customerId: "customer-model-town",
        addressId: "address-model-town",
        subscriptionId: "sub-model-town-cow-daily",
        deliveryDate: now,
        status: "PENDING",
        paymentStatus: "UNPAID",
        subtotal: "660.00",
        discount: "0.00",
        totalAmount: "660.00",
        notes: "Today pending cow milk delivery"
      },
      {
        id: "order-bahria-out",
        customerId: "customer-bahria-sector-b",
        addressId: "address-bahria-sector-b",
        subscriptionId: "sub-bahria-buffalo-daily",
        deliveryDate: now,
        status: "OUT_FOR_DELIVERY",
        paymentStatus: "UNPAID",
        subtotal: "1720.00",
        discount: "0.00",
        totalAmount: "1720.00"
      },
      {
        id: "order-johar-delivered",
        customerId: "customer-johar-town",
        addressId: "address-johar-town",
        subscriptionId: "sub-johar-blend-custom",
        deliveryDate: yesterday,
        status: "DELIVERED",
        paymentStatus: "PAID",
        subtotal: "570.00",
        discount: "0.00",
        totalAmount: "570.00"
      }
    ]
  });

  await prisma.orderItem.createMany({
    data: [
      {
        id: "item-model-town-cow",
        orderId: "order-model-town-pending",
        productId: "product-cow-milk",
        quantity: "2.00",
        rate: "330.00",
        total: "660.00"
      },
      {
        id: "item-bahria-buffalo",
        orderId: "order-bahria-out",
        productId: "product-buffalo-milk",
        quantity: "4.00",
        rate: "430.00",
        total: "1720.00"
      },
      {
        id: "item-johar-blend",
        orderId: "order-johar-delivered",
        productId: "product-blend-milk",
        quantity: "1.50",
        rate: "380.00",
        total: "570.00"
      }
    ]
  });

  await prisma.route.create({
    data: {
      id: "route-today-primary",
      riderId: "rider-primary",
      routeDate: now,
      area: "Model Town / Bahria / Johar Town",
      status: "OUT_FOR_DELIVERY",
      notes: "Primary demo route for Lahore deliveries"
    }
  });

  await prisma.delivery.createMany({
    data: [
      {
        id: "delivery-model-town-pending",
        orderId: "order-model-town-pending",
        routeId: "route-today-primary",
        riderId: "rider-primary",
        addressId: "address-model-town",
        status: "PENDING",
        area: "Model Town",
        scheduledAt: atHour(now, 8)
      },
      {
        id: "delivery-bahria-out",
        orderId: "order-bahria-out",
        routeId: "route-today-primary",
        riderId: "rider-primary",
        addressId: "address-bahria-sector-b",
        status: "OUT_FOR_DELIVERY",
        area: "Bahria",
        scheduledAt: atHour(now, 9),
        outForDeliveryAt: atHour(now, 8, 30)
      },
      {
        id: "delivery-johar-delivered",
        orderId: "order-johar-delivered",
        routeId: "route-today-primary",
        riderId: "rider-primary",
        addressId: "address-johar-town",
        status: "DELIVERED",
        area: "Johar Town",
        scheduledAt: atHour(yesterday, 10),
        outForDeliveryAt: atHour(yesterday, 9, 30),
        deliveredAt: atHour(yesterday, 10, 15),
        proofNote: "Cash collected at door"
      }
    ]
  });

  await prisma.payment.create({
    data: {
      id: "payment-johar-cash",
      customerId: "customer-johar-town",
      orderId: "order-johar-delivered",
      amount: "570.00",
      status: "PAID",
      method: "Cash",
      reference: "CASH-JOHAR-001",
      notes: "Paid at delivery",
      paidAt: atHour(yesterday, 10, 20)
    }
  });

  await prisma.expense.createMany({
    data: [
      {
        id: "expense-fuel-today",
        type: "FUEL",
        amount: "900.00",
        description: "Fuel for Model Town and Bahria route",
        createdById: "user-admin"
      },
      {
        id: "expense-packaging-bottles",
        type: "PACKAGING",
        amount: "2000.00",
        description: "Milk bottles and seals",
        createdById: "user-admin"
      },
      {
        id: "expense-rider-allowance",
        type: "RIDER",
        amount: "1220.00",
        description: "Rider allowance and route expense",
        createdById: "user-admin"
      },
      {
        id: "expense-farm-ops-feed",
        type: "FARM_OPS",
        amount: "3500.00",
        description: "Animal feed and farm maintenance",
        createdById: "user-admin"
      }
    ]
  });

  await prisma.complaint.create({
    data: {
      id: "complaint-model-town-delay",
      customerId: "customer-model-town",
      orderId: "order-model-town-pending",
      title: "Delivery delay",
      message: "Customer asked for confirmation on today's delivery timing.",
      status: "OPEN"
    }
  });

  await prisma.milkProduction.createMany({
    data: [
      {
        id: "production-cow-today",
        productId: "product-cow-milk",
        productionDate: now,
        quantityLiters: "85.00",
        source: "Awan Farms morning milking",
        notes: "Fresh cow milk collected for Lahore delivery"
      },
      {
        id: "production-buffalo-today",
        productId: "product-buffalo-milk",
        productionDate: now,
        quantityLiters: "60.00",
        source: "Awan Farms morning milking",
        notes: "Premium buffalo milk batch"
      }
    ]
  });

  await prisma.inventoryLog.createMany({
    data: [
      {
        id: "inventory-cow-in-today",
        productId: "product-cow-milk",
        quantity: "85.00",
        unit: "liter",
        direction: "IN",
        reason: "Morning production"
      },
      {
        id: "inventory-buffalo-in-today",
        productId: "product-buffalo-milk",
        quantity: "60.00",
        unit: "liter",
        direction: "IN",
        reason: "Morning production"
      },
      {
        id: "inventory-milk-out-route",
        productId: "product-buffalo-milk",
        quantity: "4.00",
        unit: "liter",
        direction: "OUT",
        reason: "Bahria subscription delivery"
      },
      {
        id: "inventory-packaging-out",
        quantity: "12.00",
        unit: "bottle",
        direction: "OUT",
        reason: "Daily packaging usage"
      }
    ]
  });

  await prisma.aiConversation.create({
    data: {
      id: "ai-conversation-support-demo",
      userId: "user-admin",
      agentRole: "CUSTOMER_SUPPORT",
      prompt: "Model Town customer wants to know today's cow milk delivery status.",
      response:
        "Delivery is pending and assigned to the primary route. Share expected delivery timing with the customer.",
      metadata: {
        customerId: "customer-model-town",
        orderId: "order-model-town-pending",
        deliveryId: "delivery-model-town-pending"
      }
    }
  });

  await prisma.aiConversation.create({
    data: {
      id: "ai-conversation-finance-demo",
      userId: "user-admin",
      agentRole: "FINANCE",
      prompt: "Summarize today's paid, unpaid, and expense position.",
      response:
        "Johar Town is paid, Model Town and Bahria remain unpaid, and today's logged expenses include fuel, packaging, rider allowance, and farm operations.",
      metadata: {
        paidOrderId: "order-johar-delivered",
        unpaidOrderIds: ["order-model-town-pending", "order-bahria-out"]
      }
    }
  });

  await prisma.aiAgentAction.createMany({
    data: [
      {
        id: "ai-action-payment-reminder-bahria",
        conversationId: "ai-conversation-finance-demo",
        userId: "user-admin",
        agentRole: "FINANCE",
        actionType: "SUGGEST_PAYMENT_REMINDER",
        targetType: "ORDER",
        targetId: "order-bahria-out",
        status: "PENDING",
        payload: {
          message: "Please remind Bahria Sector B about today's unpaid buffalo milk delivery."
        }
      },
      {
        id: "ai-action-delivery-followup-model-town",
        conversationId: "ai-conversation-support-demo",
        userId: "user-admin",
        agentRole: "CUSTOMER_SUPPORT",
        actionType: "SUGGEST_DELIVERY_UPDATE",
        targetType: "DELIVERY",
        targetId: "delivery-model-town-pending",
        status: "PENDING",
        payload: {
          message: "Share expected delivery timing with 69 E Model Town."
        }
      }
    ]
  });

  console.log({
    users: 4,
    customers: 3,
    rider: "rider-primary",
    products: 5,
    route: "route-today-primary"
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { deliveryAreas, expenses, orders, products, todayDeliveries } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export type AgentType = "support" | "delivery" | "finance";

type DeliverySnapshot = {
  id: string;
  customer: string;
  area: string;
  product: string;
  quantity: number;
  status: string;
};

type OrderSnapshot = {
  id: string;
  customer: string;
  area: string;
  product: string;
  quantity: number;
  total: number;
  paymentStatus: string;
  deliveryStatus: string;
};

type ExpenseSnapshot = {
  id: string;
  type: string;
  amount: number;
  note: string;
};

export type DemoDataSnapshot = {
  deliveries?: DeliverySnapshot[];
  orders?: OrderSnapshot[];
  expenses?: ExpenseSnapshot[];
};

type AgentResponse = {
  title: string;
  response: string;
  actions: string[];
};

function getProductLine() {
  return products.map((product) => `${product.name}: ${formatCurrency(product.price)}/${product.unit}`).join(", ");
}

function getAreaLine() {
  return deliveryAreas.slice(0, 8).join(", ");
}

export function runDemoAgent(agent: AgentType, prompt: string, demoData?: DemoDataSnapshot): AgentResponse {
  const normalizedPrompt = prompt.toLowerCase();
  const activeDeliveries = demoData?.deliveries?.length ? demoData.deliveries : todayDeliveries;
  const activeOrders = demoData?.orders?.length ? demoData.orders : orders;
  const activeExpenses = demoData?.expenses?.length ? demoData.expenses : expenses;

  if (agent === "support") {
    const cow = products.find((product) => product.name === "Cow Milk");
    const buffalo = products.find((product) => product.name === "Buffalo Milk");
    const quantityMatch = normalizedPrompt.match(/(\d+)\s*(l|liter|litre)/);
    const quantity = quantityMatch ? Number(quantityMatch[1]) : 1;
    const product = normalizedPrompt.includes("buffalo") ? buffalo : cow;
    const monthly = product ? product.price * quantity * 30 : 0;

    return {
      title: "Customer Support Agent",
      response: `Yes, we can help. Current prices are ${getProductLine()}. For ${quantity}L daily ${
        product?.name ?? "Cow Milk"
      }, estimated 30-day bill is ${formatCurrency(monthly)}. Main Lahore routes include ${getAreaLine()}. Order number: 0339-5235323.`,
      actions: ["Share WhatsApp order link", "Create draft subscription", "Check delivery area"]
    };
  }

  if (agent === "delivery") {
    const routeAreas = Array.from(new Set(activeDeliveries.map((delivery) => delivery.area)));
    const totalLiters = activeDeliveries.reduce((sum, delivery) => sum + delivery.quantity, 0);
    const routeLines = routeAreas
      .map((area, index) => {
        const areaDeliveries = activeDeliveries.filter((delivery) => delivery.area === area);
        const liters = areaDeliveries.reduce((sum, delivery) => sum + delivery.quantity, 0);
        const pending = areaDeliveries.filter((delivery) => delivery.status !== "Delivered").length;
        return `${index + 1}. ${area}: ${areaDeliveries.length} deliveries, ${liters}L, ${pending} pending`;
      })
      .join("\n");

    return {
      title: "Delivery Planning Agent",
      response: `Suggested route plan:\n${routeLines}\n\nTotal milk required: ${totalLiters}L. Start with Model Town, then Johar Town, then Bahria if using the current demo route.`,
      actions: ["Group deliveries by area", "Assign rider", "Flag incomplete addresses"]
    };
  }

  const revenue = activeOrders.reduce((sum, order) => sum + order.total, 0);
  const paid = activeOrders
    .filter((order) => order.paymentStatus === "Paid")
    .reduce((sum, order) => sum + order.total, 0);
  const expenseTotal = activeExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pending = revenue - paid;
  const netProfit = paid - expenseTotal;
  const unpaidOrders = activeOrders.filter((order) => order.paymentStatus !== "Paid");

  return {
    title: "Finance Agent",
    response: `Current demo finance summary: total orders ${formatCurrency(revenue)}, paid ${formatCurrency(
      paid
    )}, expenses ${formatCurrency(expenseTotal)}, pending payments ${formatCurrency(pending)}, net profit ${formatCurrency(
      netProfit
    )}. ${
      unpaidOrders.length
        ? `Pending orders: ${unpaidOrders.map((order) => `${order.customer} ${formatCurrency(order.total)}`).join(", ")}.`
        : "All current orders are marked paid."
    }`,
    actions: ["Review pending customers", "Send payment reminders", "Fix payment contradiction"]
  };
}

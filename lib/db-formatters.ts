type DbOrder = {
  id: string;
  customer?: { name: string; area: string } | null;
  items?: Array<{ product?: { name: string } | null; quantity: number; total: number }>;
  totalAmount: number;
  paymentStatus: string;
  status: string;
};

type DbDelivery = {
  id: string;
  area: string;
  status: string;
  order?: {
    customer?: { name: string; area: string; address: string; phone?: string | null } | null;
    items?: Array<{ product?: { name: string } | null; quantity: number }>;
  } | null;
};

type DbExpense = {
  id: string;
  type: string;
  amount: number;
  description?: string | null;
};

type DbCustomer = {
  id: string;
  name: string;
  phone?: string | null;
  area: string;
  address: string;
  subscriptions?: Array<{ product?: { name: string } | null; quantity: number; rate: number; status: string }>;
};

export function formatOrder(order: DbOrder) {
  const firstItem = order.items?.[0];
  return {
    id: order.id,
    customer: order.customer?.name ?? "Unknown Customer",
    area: order.customer?.area ?? "Unknown Area",
    product: firstItem?.product?.name ?? "Milk",
    quantity: firstItem?.quantity ?? 0,
    total: order.totalAmount,
    paymentStatus: normalizeStatus(order.paymentStatus),
    deliveryStatus: normalizeStatus(order.status)
  };
}

export function formatDelivery(delivery: DbDelivery) {
  const firstItem = delivery.order?.items?.[0];
  const customer = delivery.order?.customer;
  return {
    id: delivery.id,
    customer: customer?.name ?? "Unknown Customer",
    area: delivery.area || customer?.area || "Unknown Area",
    address: customer?.address ?? "",
    phone: customer?.phone ?? "",
    product: firstItem?.product?.name ?? "Milk",
    quantity: firstItem?.quantity ?? 0,
    status: normalizeStatus(delivery.status)
  };
}

export function formatExpense(expense: DbExpense) {
  return {
    id: expense.id,
    type: expense.type,
    amount: expense.amount,
    note: expense.description ?? ""
  };
}

export function formatCustomer(customer: DbCustomer) {
  const subscription = customer.subscriptions?.[0];
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone ?? "",
    area: customer.area,
    address: customer.address,
    product: subscription?.product?.name ?? "Cow Milk",
    quantity: subscription?.quantity ?? 1,
    rate: subscription?.rate ?? 330,
    status: normalizeStatus(subscription?.status ?? "ACTIVE"),
    pending: (subscription?.quantity ?? 1) * (subscription?.rate ?? 330) * 30
  };
}

export function normalizeStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function dbStatus(status: string) {
  return status.trim().toUpperCase().replaceAll(" ", "_");
}

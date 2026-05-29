type Decimalish =
  | number
  | string
  | {
      toNumber?: () => number;
      toString: () => string;
    }
  | null
  | undefined;

type AddressLike = {
  line1?: string | null;
  area?: string | null;
  city?: string | null;
  isDefault?: boolean | null;
};

type CustomerLike = {
  name?: string | null;
  displayName?: string | null;
  phone?: string | null;
  area?: string | null;
  address?: string | null;
  addresses?: AddressLike[];
};

type OrderItemLike = {
  product?: { name: string } | null;
  quantity: Decimalish;
  total?: Decimalish;
};

type DbOrder = {
  id: string;
  customer?: CustomerLike | null;
  address?: AddressLike | null;
  items?: OrderItemLike[];
  totalAmount: Decimalish;
  paymentStatus: string;
  status: string;
};

type DbDelivery = {
  id: string;
  area?: string | null;
  address?: AddressLike | null;
  status: string;
  order?: DbOrder | null;
};

type DbExpense = {
  id: string;
  type: string;
  amount: Decimalish;
  description?: string | null;
};

type DbCustomer = CustomerLike & {
  id: string;
  subscriptions?: Array<{
    product?: { name: string } | null;
    quantity: Decimalish;
    rate: Decimalish;
    status: string;
  }>;
};

function decimalToNumber(value: Decimalish) {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  if (typeof value.toNumber === "function") return value.toNumber();
  return Number(value.toString()) || 0;
}

function customerName(customer?: CustomerLike | null) {
  return customer?.displayName ?? customer?.name ?? "Unknown Customer";
}

function addressLine(address?: AddressLike | null) {
  if (!address) return "";
  return [address.line1, address.area, address.city].filter(Boolean).join(", ");
}

function customerAddress(customer?: CustomerLike | null, address?: AddressLike | null) {
  if (address) return addressLine(address);
  if (customer?.address) return customer.address;

  const defaultAddress = customer?.addresses?.find((item) => item.isDefault) ?? customer?.addresses?.[0];
  return addressLine(defaultAddress);
}

function customerArea(customer?: CustomerLike | null, address?: AddressLike | null) {
  return address?.area ?? customer?.area ?? customer?.addresses?.find((item) => item.isDefault)?.area ?? customer?.addresses?.[0]?.area;
}

export function formatOrder(order: DbOrder) {
  const firstItem = order.items?.[0];
  return {
    id: order.id,
    customer: customerName(order.customer),
    area: customerArea(order.customer, order.address) ?? "Unknown Area",
    product: firstItem?.product?.name ?? "Milk",
    quantity: decimalToNumber(firstItem?.quantity),
    total: decimalToNumber(order.totalAmount),
    paymentStatus: normalizeStatus(order.paymentStatus),
    deliveryStatus: normalizeStatus(order.status)
  };
}

export function formatDelivery(delivery: DbDelivery) {
  const firstItem = delivery.order?.items?.[0];
  const customer = delivery.order?.customer;
  const address = delivery.address ?? delivery.order?.address;

  return {
    id: delivery.id,
    customer: customerName(customer),
    area: delivery.area || customerArea(customer, address) || "Unknown Area",
    address: customerAddress(customer, address),
    phone: customer?.phone ?? "",
    product: firstItem?.product?.name ?? "Milk",
    quantity: decimalToNumber(firstItem?.quantity),
    status: normalizeStatus(delivery.status)
  };
}

export function formatExpense(expense: DbExpense) {
  return {
    id: expense.id,
    type: normalizeStatus(expense.type),
    amount: decimalToNumber(expense.amount),
    note: expense.description ?? ""
  };
}

export function formatCustomer(customer: DbCustomer) {
  const subscription = customer.subscriptions?.[0];
  const address = customer.addresses?.find((item) => item.isDefault) ?? customer.addresses?.[0];
  const quantity = decimalToNumber(subscription?.quantity) || 1;
  const rate = decimalToNumber(subscription?.rate) || 330;

  return {
    id: customer.id,
    name: customerName(customer),
    phone: customer.phone ?? "",
    area: customerArea(customer, address) ?? "Unknown Area",
    address: customerAddress(customer, address),
    product: subscription?.product?.name ?? "Cow Milk",
    quantity,
    rate,
    status: normalizeStatus(subscription?.status ?? "ACTIVE"),
    pending: quantity * rate * 30
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

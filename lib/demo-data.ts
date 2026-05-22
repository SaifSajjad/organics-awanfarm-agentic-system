export const products = [
  {
    id: "cow-milk",
    name: "Cow Milk",
    price: 330,
    unit: "liter",
    description: "Farm-fresh cow milk for daily family use."
  },
  {
    id: "buffalo-milk",
    name: "Buffalo Milk",
    price: 430,
    unit: "liter",
    description: "Rich buffalo milk with a thicker taste."
  }
];

export const deliveryAreas = [
  "Model Town",
  "Bahria",
  "Bahria Sector B",
  "Bahria Sector D",
  "Cantt",
  "Izmir Town",
  "Askari 11",
  "Phase 5",
  "Gulberg",
  "Johar Town",
  "Iqbal Town",
  "State Life",
  "Calvary Ground",
  "Harbanspura"
];

export const dashboardStats = {
  monthlyIncome: 40920,
  weeklyIncome: 56440,
  totalIncome: 97360,
  expenses: 13770,
  netProfit: 83590,
  pendingPayments: 97360,
  activeCustomers: 9,
  todayDeliveries: 15
};

export const customers = [
  {
    id: "c1",
    name: "69 E Model Town",
    area: "Model Town",
    product: "Cow Milk",
    quantity: 4,
    rate: 330,
    status: "Paid",
    pending: 40920
  },
  {
    id: "c2",
    name: "47L Model Town",
    area: "Model Town",
    product: "Cow Milk",
    quantity: 2,
    rate: 330,
    status: "Unpaid",
    pending: 14520
  },
  {
    id: "c3",
    name: "State Life",
    area: "State Life",
    product: "Buffalo Milk",
    quantity: 4,
    rate: 380,
    status: "Unpaid",
    pending: 6080
  },
  {
    id: "c4",
    name: "Bahria Sector B",
    area: "Bahria",
    product: "Buffalo Milk",
    quantity: 4,
    rate: 430,
    status: "Unpaid",
    pending: 1720
  }
];

export const todayDeliveries = [
  {
    id: "d1",
    customer: "69 E Model Town",
    area: "Model Town",
    product: "Cow Milk",
    quantity: 4,
    status: "Pending"
  },
  {
    id: "d2",
    customer: "47L Model Town",
    area: "Model Town",
    product: "Cow Milk",
    quantity: 2,
    status: "Pending"
  },
  {
    id: "d3",
    customer: "Bahria Sector B",
    area: "Bahria",
    product: "Buffalo Milk",
    quantity: 4,
    status: "Out for delivery"
  },
  {
    id: "d4",
    customer: "91 H3 Johar Town",
    area: "Johar Town",
    product: "Cow Milk",
    quantity: 1,
    status: "Delivered"
  }
];

export const orders = [
  {
    id: "o1",
    customer: "69 E Model Town",
    area: "Model Town",
    product: "Cow Milk",
    quantity: 4,
    total: 1320,
    paymentStatus: "Unpaid",
    deliveryStatus: "Pending"
  },
  {
    id: "o2",
    customer: "Bahria Sector B",
    area: "Bahria",
    product: "Buffalo Milk",
    quantity: 4,
    total: 1720,
    paymentStatus: "Unpaid",
    deliveryStatus: "Out for delivery"
  },
  {
    id: "o3",
    customer: "91 H3 Johar Town",
    area: "Johar Town",
    product: "Cow Milk",
    quantity: 1,
    total: 330,
    paymentStatus: "Paid",
    deliveryStatus: "Delivered"
  }
];

export const expenses = [
  {
    id: "e1",
    type: "Fuel",
    amount: 900,
    note: "Fuel / Transport"
  },
  {
    id: "e2",
    type: "Packaging",
    amount: 2000,
    note: "Purchase bottles"
  },
  {
    id: "e3",
    type: "Rider",
    amount: 1220,
    note: "Rider and petrol mixed expense"
  }
];

import { RouteStatus, RouteStopStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type OrderItemForSummary = {
  quantity: number;
  product: {
    name: string;
    unit: string;
  };
};

type RouteStopForResponse = {
  id: string;
  sequence: number;
  status: RouteStopStatus;
  delivery: {
    area: string;
    status: string;
    order: {
      customer: {
        name: string;
        area: string;
      };
      items: OrderItemForSummary[];
    };
  } | null;
};

function formatDate(value: Date): string {
  return value.toISOString();
}

function formatCustomerDisplayName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "Customer";
  }

  if (parts.length === 1) {
    return parts[0];
  }

  const [firstName, ...rest] = parts;
  const lastInitial = rest[rest.length - 1]?.charAt(0).toUpperCase();

  return lastInitial ? `${firstName} ${lastInitial}.` : firstName;
}

function summarizeItems(items: OrderItemForSummary[]): {
  productSummary: string | null;
  quantity: number | null;
} {
  if (items.length === 0) {
    return {
      productSummary: null,
      quantity: null
    };
  }

  return {
    productSummary: items
      .map((item) => `${item.product.name} ${item.quantity} ${item.product.unit}`)
      .join(", "),
    quantity: items.reduce((total, item) => total + item.quantity, 0)
  };
}

function mapStopForRoute(stop: RouteStopForResponse) {
  const customer = stop.delivery?.order.customer;
  const summary = summarizeItems(stop.delivery?.order.items ?? []);

  return {
    id: stop.id,
    sequence: stop.sequence,
    customerDisplayName: customer
      ? formatCustomerDisplayName(customer.name)
      : null,
    area: stop.delivery?.area ?? customer?.area ?? null,
    status: stop.status,
    deliveryStatus: stop.delivery?.status ?? null,
    productSummary: summary.productSummary,
    quantity: summary.quantity
  };
}

export async function getCurrentRiderRoute(riderId: string) {
  const route = await prisma.route.findFirst({
    where: {
      riderId,
      status: {
        in: [RouteStatus.ASSIGNED, RouteStatus.IN_PROGRESS]
      }
    },
    orderBy: [{ startedAt: "desc" }, { assignedAt: "desc" }],
    select: {
      id: true,
      status: true,
      assignedAt: true,
      stops: {
        orderBy: {
          sequence: "asc"
        },
        select: {
          id: true,
          sequence: true,
          status: true,
          delivery: {
            select: {
              area: true,
              status: true,
              order: {
                select: {
                  customer: {
                    select: {
                      name: true,
                      area: true
                    }
                  },
                  items: {
                    select: {
                      quantity: true,
                      product: {
                        select: {
                          name: true,
                          unit: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!route) {
    return {
      route: null
    };
  }

  const stops = route.stops.map(mapStopForRoute);
  const completed = route.stops.filter(
    (stop) => stop.status === RouteStopStatus.DELIVERED
  ).length;
  const missed = route.stops.filter(
    (stop) => stop.status === RouteStopStatus.MISSED
  ).length;

  return {
    route: {
      id: route.id,
      label: null,
      date: formatDate(route.assignedAt),
      status: route.status,
      summary: {
        totalStops: route.stops.length,
        completed,
        remaining: route.stops.length - completed - missed,
        missed
      },
      stops
    }
  };
}

export async function getActiveRiderStop(riderId: string) {
  const stop = await prisma.routeStop.findFirst({
    where: {
      status: RouteStopStatus.ACTIVE,
      route: {
        riderId,
        status: RouteStatus.IN_PROGRESS
      }
    },
    orderBy: {
      sequence: "asc"
    },
    select: {
      id: true,
      sequence: true,
      delivery: {
        select: {
          area: true,
          order: {
            select: {
              customer: {
                select: {
                  name: true,
                  area: true,
                  address: true,
                  phone: true
                }
              },
              items: {
                select: {
                  quantity: true,
                  product: {
                    select: {
                      name: true,
                      unit: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!stop) {
    return {
      activeStop: null
    };
  }

  const customer = stop.delivery?.order.customer;
  const summary = summarizeItems(stop.delivery?.order.items ?? []);

  return {
    activeStop: {
      id: stop.id,
      sequence: stop.sequence,
      customerDisplayName: customer
        ? formatCustomerDisplayName(customer.name)
        : null,
      area: stop.delivery?.area ?? customer?.area ?? null,
      address: customer?.address ?? null,
      accessNote: null,
      productSummary: summary.productSummary,
      quantity: summary.quantity,
      callCustomerAvailable: Boolean(customer?.phone)
    }
  };
}

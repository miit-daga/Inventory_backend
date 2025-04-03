import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";

interface OrderItem {
  productId: string;
  quantity: number;
}

interface CreateOrderData {
  userId: string;
  status: string;
  orderItems: OrderItem[];
}

const getAllOrders = async (userId: string) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      payment: true,
    },
  });
};

const createOrder = async (data: CreateOrderData) => {
  // const TRANSACTION_TIMEOUT = 10000; // 10 seconds

  return await prisma.$transaction(
    async (tx) => {
      try {
        // Lock the products using a raw query
        const productIds = data.orderItems.map((item) => item.productId);

        await tx.$executeRaw`
        SELECT id, stock 
        FROM "Product" 
        WHERE id = ANY(${productIds}::text[]) 
        FOR UPDATE SKIP LOCKED
      `;

        // Get products after locking
        const productQuantities = await tx.product.findMany({
          where: {
            id: {
              in: productIds,
            },
          },
          select: {
            id: true,
            stock: true,
            price: true,
          },
          orderBy: {
            id: "asc",
          },
        });

        // Check if all products exist and were successfully locked
        if (productQuantities.length !== data.orderItems.length) {
          throw new Error(
            "One or more products not found or are currently locked"
          );
        }

        // Validate stock availability
        let totalAmount = 0;
        for (const product of productQuantities) {
          const orderItem = data.orderItems.find((item) => {
            if(item.productId === product.id) {
              totalAmount += product.price * item.quantity;
            }
            return item.productId === product.id;
          });
          if (orderItem && orderItem.quantity > product.stock) {
            throw new Error(`Insufficient stock for product: ${product.id}`);
          }
        }

        // Update product stock
        const updates = productQuantities.map(async (product) => {
          const orderItem = data.orderItems.find(
            (item) => item.productId === product.id
          );

          if (orderItem) {
            return await tx.product.update({
              where: { id: product.id },
              data: {
                stock: { decrement: orderItem.quantity },
              },
            });
          }
        });

        // Wait for all updates to complete
        await Promise.all(
          updates.filter(
            (update): update is Promise<any> => update !== undefined
          )
        );

        // Create the order with proper type handling
        const order = await tx.order.create({
          data: {
            userId: data.userId,
            totalAmount, // Use the parsed number
            status: data.status,
            orderItems: {
              create: data.orderItems.map((item) => ({
                productId: item.productId,
                quantity: Number(item.quantity), // Ensure quantity is a number
                price: productQuantities.find((product) => product.id === item.productId)?.price || 0,
              })),
            },
          },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        });

        return order;
      } catch (error) {
        throw error;
      }
    }
  );
};

const updateOrderStatus = async (orderId: string, status: string) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      payment: true,
    },
  });
};

const getOrdersByClientId = async (clientId: string) => {
  return await prisma.order.findMany({
    where: {
      orderItems: {
        some: {
          product: {
            clientId,
          },
        },
      },
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      payment: true,
      user: true,
    },
  });
};

const updateOrderReturnReason = async (orderId: string, returnReason: string) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { returnReason },
  });
}

export default {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  getOrdersByClientId,
  updateOrderReturnReason,
};

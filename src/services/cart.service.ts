// File: src/services/cart.service.ts
import prisma from "../config/prisma";

// Fetch all items in a user's cart
const getCartItems = async (userId: string) => {
  return await prisma.cart.findMany({
    where: { userId },
    include: {
      product: true, // Include product details in the response
    },
  });
};

// Add an item to the cart
const addToCart = async (userId: string, productId: string, quantity: number) => {
  // Check if the item already exists in the cart
  const existingCartItem = await prisma.cart.findFirst({
    where: { userId, productId },
  });

  if (existingCartItem) {
    // If it exists, update the quantity
    return await prisma.cart.update({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + quantity },
    });
  }

  // If it doesn't exist, create a new cart item
  return await prisma.cart.create({
    data: { userId, productId, quantity },
  });
};

// Remove an item from the cart
const removeFromCart = async (userId: string, productId: string) => {
  return await prisma.cart.deleteMany({
    where: { userId, productId },
  });
};

// Update the quantity of a cart item
const updateCartQuantity = async (userId: string, productId: string, quantity: number) => {
  return await prisma.cart.updateMany({
    where: { userId, productId },
    data: { quantity },
  });
};

// Clear the cart for a user
const clearCart = async (userId: string) => {
  return await prisma.cart.deleteMany({
    where: { userId },
  });
};

export default {
  getCartItems,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
};

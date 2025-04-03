import prisma from "../config/prisma";

const getCategories = async () => {
  return await prisma.category.findMany();
};

const createCategory = async (data: { name: string; description?: string }) => {
  return await prisma.category.create({ data });
};

export default { getCategories, createCategory };

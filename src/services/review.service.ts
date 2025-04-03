import prisma from "../config/prisma";

const getReviews = async (userId: string) => {
  return await prisma.review.findMany({
    where: { userId },
    include: {
      user: {
        select: { id: true, name: true }, 
      },
    },
  });
};

const createReview = async (data: {
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
}) => {
  return await prisma.review.create({
    data,
  });
};

const updateReview = async (
  reviewId: string,
  data: { rating?: number; comment?: string }
) => {
  return await prisma.review.update({
    where: { id: reviewId },
    data,
  });
};

const deleteReview = async (reviewId: string) => {
  return await prisma.review.delete({
    where: { id: reviewId },
  });
};

export default {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addReview = async (req, res) => {
    try {
      const { productId, rating, comment } = req.body;
      const userId = req.user.id;

      if (!productId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Invalid input for productId or rating' });
      }
  
      const review = await prisma.review.create({
        data: {
          userId,
          productId: parseInt(productId),
          rating: parseInt(rating),
          comment,
        },
      });
  
      res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ message: 'Failed to add review', error: error.message });
    }
  };

const getProductReviews = async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);

      if (isNaN(productId)) {
        return res.status(400).json({ message: 'Invalid productId' });
      }
  
      const reviews = await prisma.review.findMany({
        where: { productId },
        include: { user: true }, // Sertakan detail user
      });
  
      res.status(200).json({ reviews });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
    }
};
  
module.exports = { addReview, getProductReviews };

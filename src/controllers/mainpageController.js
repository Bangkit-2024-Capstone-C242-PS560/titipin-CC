const { generateRecommendations } = require('../models/purchaseRec');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getHomePage = async (req, res) => {
  try {
    // Fetch products from database (example: limit to 10)
    const products = await prisma.product.findMany({
      select: { id: true, name: true, price: true, quantity: true },
      take: 10,
    });

    // Generate recommendations
    const recommendations = await generateRecommendations(products);

    // Fetch other sections for homepage
    const latestEvents = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    res.status(200).json({
      message: 'Homepage data fetched successfully',
      recommendations,
      latestEvents,
    });
  } catch (error) {
    console.error('Error fetching homepage:', error);
    res.status(500).json({ message: 'Failed to fetch homepage', error: error.message });
  }
};

module.exports = { getHomePage };

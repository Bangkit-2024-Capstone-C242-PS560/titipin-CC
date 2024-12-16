const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Asumsi user sudah terautentikasi

    // Cek apakah produk sudah ada di cart
    const existingCart = await prisma.cart.findFirst({
      where: { userId, productId },
    });

    let cartItem;
    if (existingCart) {
      // Update quantity jika sudah ada
      cartItem = await prisma.cart.update({
        where: { id: existingCart.id },
        data: { quantity: existingCart.quantity + quantity },
      });
    } else {
      // Tambahkan produk baru ke cart
      cartItem = await prisma.cart.create({
        data: { userId, productId, quantity },
      });
    }

    res.status(201).json({ message: 'Product added to cart', cartItem });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Failed to add product to cart', error: error.message });
  }
};

const getCart = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const cartItems = await prisma.cart.findMany({
        where: { userId },
        include: {
          product: true, // Ambil detail produk
        },
      });
  
      res.status(200).json({ cartItems });
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
    }
  };
  
  const removeFromCart = async (req, res) => {
    try {
      const { id } = req.params;
  
      await prisma.cart.delete({
        where: { id: parseInt(id) },
      });
  
      res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ message: 'Failed to remove product from cart', error: error.message });
    }
  };
  

  
  
module.exports = { addToCart, getCart, removeFromCart };

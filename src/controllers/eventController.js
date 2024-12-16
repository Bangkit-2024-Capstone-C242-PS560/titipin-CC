const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { uploadImage } = require('../utils/cloudStorage');
const { generateRecommendations } = require('../models/purchaseRec');

const createEvent = async (req, res) => {
  try {
    const { name, category, description } = req.body;

    // Validasi input
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Upload image ke Cloud Storage
    const imageUrl = await uploadImage(req.file, 'event_image/');

    // Buat event di database
    const event = await prisma.event.create({
      data: {
        name,
        description,
        category,
        imageUrl,
        userId: req.user.id, // Ambil dari token user yang login
        createdBy: req.user.id
      },
    });

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
};
  
const updateEvent = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, description } = req.body;
  
      // Cari event berdasarkan ID
      const event = await prisma.event.findUnique({ where: { id: parseInt(id) } });
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      let imageUrl = event.imageUrl; // Gunakan gambar lama jika tidak ada gambar baru
  
      if (req.file) {
        // Upload gambar baru jika ada
        imageUrl = await uploadImage(req.file, 'event_image/');
      }
  
      // Update event di database
      const updatedEvent = await prisma.event.update({
        where: { id: parseInt(id) },
        data: {
          name: name || event.name, // Gunakan nama lama jika tidak diubah
          category: category || event.category,
          description: description || event.description, // Gunakan deskripsi lama jika tidak diubah
          imageUrl, // URL gambar baru atau lama
        },
      });
  
      res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ message: 'Failed to update event', error: error.message });
    }
  };
  
  const getAllEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany();
        res.status(200).json({ events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Failed to fetch events', error: error.message });
    }
};

const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await prisma.event.findUnique({
            where: { id: parseInt(id) },
        });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: "Failed to fetch event", error: error.message });
    }
};

const addProductToEvent = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, price, quantity, description } = req.body; 
      const event = await prisma.event.findUnique({
        where: { id: parseInt(id) },
      });
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: 'Image file is required' });
      }
  
      const imageUrl = await uploadImage(req.file, 'product_image/');
  
      const product = await prisma.product.create({
        data: {
          name,
          category,
          price: parseFloat(price),
          imageUrl,
          quantity: parseInt(quantity),
          description, 
          eventId: parseInt(id),
        },
      });
  
      res.status(201).json({
        message: 'Product added to event successfully',
        product,
      });
    } catch (error) {
      console.error('Error adding product to event:', error);
      res.status(500).json({ message: 'Failed to add product to event', error: error.message });
    }
  };
  
  const getProductsByEvent = async (req, res) => {
    try {
      const { id } = req.params;
  
      const event = await prisma.event.findUnique({
        where: { id: parseInt(id) },
        include: { products: true }, // Ambil relasi produk dari event
      });
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.status(200).json({
        message: 'Products retrieved successfully',
        products: event.products,
      });
    } catch (error) {
      console.error('Error fetching products for event:', error);
      res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
  };
  
  
const getHomepageData = async (req, res) => {
    try {
      // Fetch categories, events, and products
      const categories = await prisma.product.findMany({
        distinct: ['category'],
        select: { category: true },
        take: 5,
      });
  
      const events = await prisma.event.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
  
      const products = await prisma.product.findMany({
        take: 50,
      });
  
      // Generate product recommendations
      const recommendedProducts = await generateRecommendations(products);
  
      res.status(200).json({
        categories,
        recommendations: recommendedProducts,
        events,
      });
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      res.status(500).json({ message: 'Failed to fetch homepage data', error: error.message });
    }
};
  

module.exports = { createEvent, updateEvent, getAllEvents, getEventById, addProductToEvent, getProductsByEvent, getHomepageData };
  

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const eventRoutes = require('./src/routes/eventRoutes');
const prisma = new PrismaClient();
const cartRoutes = require('./src/routes/cartRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const mainpageRoutes = require('./src/routes/mainpageRoutes')


const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/homepage', mainpageRoutes);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


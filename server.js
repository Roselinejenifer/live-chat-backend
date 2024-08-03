const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat'); // Make sure this path is correct
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

require('dotenv').config();

mongoose.connect('mongodb+srv://Jas-13:123@jasper.cclnzjl.mongodb.net/livechat?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*', // Allow connections from any origin
    },
  });
  
app.use(cors({
  origin: '*', // Allow all origins, or specify the origin of your frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Authorization', 'Content-Type']
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes); // Register chat routes
 app.get('/',(req,res)=>{res.status(200).send({message:"server connected"})})
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (data) => {
    console.log('message:', data);
    io.emit('message', data); // Broadcast the message to all clients
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware - allow React frontend
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Body parser
app.use(express.json());

// Temporary in-memory store
let messages = [];
let idCounter = 1;

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// Routes
app.post('/api/messages', (req, res) => {
  const { group, message, dateTime } = req.body;
  if (!group || !message || !dateTime) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newMessage = {
    id: idCounter++,
    group,
    message,
    dateTime,
    status: 'scheduled'
  };

  messages.push(newMessage);
  res.status(201).json(newMessage);
});

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.put('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  const { group, message, dateTime } = req.body;
  const msg = messages.find((m) => m.id === parseInt(id));
  if (!msg) return res.status(404).json({ error: 'Message not found' });

  if (group) msg.group = group;
  if (message) msg.message = message;
  if (dateTime) msg.dateTime = dateTime;

  res.json(msg);
});

app.delete('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  messages = messages.filter((m) => m.id !== parseInt(id));
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

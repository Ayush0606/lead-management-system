
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './db.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));



import authRoutes from './routes/auth.js';
import leadsRoutes from './routes/leads.js';
app.use('/auth', authRoutes);
app.use('/leads', leadsRoutes);

app.get('/', (req, res) => {
  res.send('Lead Management Backend Running');
});


connectDB()
  .then(() => {
    app.listen(5000, () => {
      console.log('Backend running on port 5000');
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

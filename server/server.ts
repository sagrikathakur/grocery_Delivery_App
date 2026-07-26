import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import authRouter from "./routes/authRoutes.js";

const app = express();

// Middleware
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Server is Live!');
});

// Routes
app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
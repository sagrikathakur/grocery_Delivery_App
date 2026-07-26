import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
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

// error-handlings//

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
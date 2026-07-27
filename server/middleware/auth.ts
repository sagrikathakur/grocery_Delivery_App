import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";




export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ message: "no token provided , authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    (req as any).user = { id: decoded.id };
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'token is not valid' })
  }

}
export default auth;
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const genToken = (userId, res) => {
  const token = jwt.sign({ userId: userId.toString() }, process.env.JWT_KEY, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

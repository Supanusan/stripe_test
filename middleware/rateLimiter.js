import rateLimit from "express-rate-limit";

// Auth limiter
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res
      .status(429)
      .json({ message: "Too many requests, please try again later." });
  },
});

// Write limiter
export const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Read limiter
export const readLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

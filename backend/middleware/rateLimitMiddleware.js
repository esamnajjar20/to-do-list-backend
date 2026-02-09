import rateLimit from 'express-rate-limit';

const warnedIPs = new Set();

/**
 * Simple rate limiter for task routes.
 */
export const todosLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  handler: (req, res) => {
    const ip = req.ip;

    if (!warnedIPs.has(ip)) {
      warnedIPs.add(ip);
      return res.status(429).json({
        status: 429,
        message: 'Warning: Too many requests. Please slow down.'
      });
    }

    return res.status(429).json({
      status: 429,
      message: 'You are temporarily blocked due to repeated requests.'
    });
  },
  standardHeaders: true,
  legacyHeaders: false
});

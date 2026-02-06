import rateLimit from 'express-rate-limit';

const warnedIPs = new Set();

export const todosLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 3, 
  handler: (req, res, next) => {
    const ip = req.ip;

    if (!warnedIPs.has(ip)) {
      warnedIPs.add(ip);
      return res.status(429).json({
        status: 429,
        message: 'Warning: Too many requests! Next time you will be blocked.'
      });
    } else {
      return res.status(429).json({
        status: 429,
        message: 'You are blocked temporarily due to repeated requests.'
      });
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

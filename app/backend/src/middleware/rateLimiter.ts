import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 200, // Increased limit to 200 requests per minute for development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
  skipFailedRequests: true, // Don't count failed requests
});

export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Strict limit for sensitive operations
  message: 'Too many attempts, please try again later.',
});
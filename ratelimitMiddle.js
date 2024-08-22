// Define a function to create a rate limiting middleware
const rateLimit = (limit, interval) => {
  // Initialize requestCount to track the number of requests made
  let requestCount = 0;
  // Initialize resetTime to determine when the rate limit should be reset
  let resetTime = Date.now() + interval;

  // Return a middleware function
  return (req, res, next) => {
      // Get the current time
      const currentTime = Date.now();

      // Check if the current time is past the reset time
      if (currentTime > resetTime) {
          // Reset the resetTime and requestCount if the interval has passed
          resetTime = currentTime + interval;
          requestCount = 0;
      }

      // Check if the request count has reached the limit
      if (requestCount >= limit) {
          // If the limit is exceeded, respond with a 429 status code (Too Many Requests)
          return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
      }

      // Increment the request count
      requestCount++;
      // Call the next middleware or route handler
      next();
  };
};

// Export the rate limiting middleware function
module.exports = rateLimit;

const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key]
          .replace(/<[^>]*>/g, '')
          .replace(/[<>'"`;]/g, '')
          .trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  next();
};

module.exports = sanitizeInput;
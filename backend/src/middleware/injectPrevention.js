const preventInjection = (req, res, next) => {
  const dangerous = /(\$where|\$gt|\$lt|\$ne|\$in|\$nin|\$or|\$and|\$regex|\$expr)/i;

  const check = (obj) => {
    if (!obj || typeof obj !== 'object') return false;
    for (let key in obj) {
      if (dangerous.test(key)) return true;
      if (typeof obj[key] === 'string' && dangerous.test(obj[key])) return true;
      if (typeof obj[key] === 'object' && check(obj[key])) return true;
    }
    return false;
  };

  if (req.body && check(req.body)) {
    return res.status(400).json({ success: false, message: 'Invalid input detected' });
  }

  next();
};

module.exports = preventInjection;
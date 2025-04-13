module.exports = function checkApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(403).json({ error: 'Acesso não autorizado' });
  }
};

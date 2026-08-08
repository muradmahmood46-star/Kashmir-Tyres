try { module.exports = require('../server/index.cjs') } catch (e) { module.exports = (req, res) => res.status(500).json({ error: 'Failed to boot', details: e.message, stack: e.stack }) }

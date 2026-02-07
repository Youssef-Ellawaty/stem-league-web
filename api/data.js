const { loadData } = require('./data-store');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        try {
            const data = loadData();
            res.status(200).json(data);
        } catch (error) {
            console.error('Error loading data:', error);
            res.status(500).json({ error: 'Failed to load data' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
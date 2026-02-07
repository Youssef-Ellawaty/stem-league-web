const { loadData, saveData } = require('./data-store');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        try {
            const newData = req.body;
            const success = saveData(newData);
            
            if (success) {
                res.status(200).json({ success: true, message: 'Data saved successfully' });
            } else {
                res.status(500).json({ error: 'Failed to save data' });
            }
        } catch (error) {
            console.error('Error saving data:', error);
            res.status(500).json({ error: 'Failed to save data' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
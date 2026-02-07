const { loadData, saveData } = require('./data-store');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const data = loadData();

        // POST - إضافة أو تعديل مباراة
        if (req.method === 'POST') {
            const match = req.body;
            
            if (!data.matches) data.matches = [];
            
            const index = data.matches.findIndex(m => m.id === match.id);
            if (index >= 0) {
                data.matches[index] = match;
            } else {
                match.id = data.matches.length > 0 ? Math.max(...data.matches.map(m => m.id)) + 1 : 1;
                data.matches.push(match);
            }
            
            const success = saveData(data);
            
            if (success) {
                res.status(200).json({ success: true, match });
            } else {
                res.status(500).json({ error: 'Failed to save match' });
            }
            return;
        }

        // DELETE - حذف مباراة
        if (req.method === 'DELETE') {
            const { id } = req.query;
            const matchId = parseInt(id);
            
            if (!matchId) {
                res.status(400).json({ error: 'Match ID is required' });
                return;
            }
            
            data.matches = data.matches.filter(m => m.id !== matchId);
            const success = saveData(data);
            
            if (success) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ error: 'Failed to delete match' });
            }
            return;
        }

        // GET - الحصول على المباريات
        if (req.method === 'GET') {
            res.status(200).json(data.matches || []);
            return;
        }

        res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error in match API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
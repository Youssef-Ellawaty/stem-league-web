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
            const { playerId, goals, assists, yellowCards, redCards } = req.body;
            const data = loadData();
            
            const player = data.players.find(p => p.id === playerId);
            
            if (player) {
                if (goals !== undefined) player.goals = goals;
                if (assists !== undefined) player.assists = assists;
                if (yellowCards !== undefined) player.yellowCards = yellowCards;
                if (redCards !== undefined) player.redCards = redCards;
                
                const success = saveData(data);
                
                if (success) {
                    res.status(200).json({ success: true, player });
                } else {
                    res.status(500).json({ error: 'Failed to update player stats' });
                }
            } else {
                res.status(404).json({ error: 'Player not found' });
            }
        } catch (error) {
            console.error('Error updating player stats:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
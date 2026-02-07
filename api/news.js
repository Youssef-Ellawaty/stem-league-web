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

        // POST - إضافة خبر جديد
        if (req.method === 'POST') {
            const newsItem = req.body;
            
            if (!data.news) data.news = [];
            newsItem.id = data.news.length > 0 ? Math.max(...data.news.map(n => n.id)) + 1 : 1;
            newsItem.date = new Date().toISOString().split('T')[0];
            data.news.push(newsItem);
            
            const success = saveData(data);
            
            if (success) {
                res.status(200).json({ success: true, news: newsItem });
            } else {
                res.status(500).json({ error: 'Failed to save news' });
            }
            return;
        }

        // DELETE - حذف خبر
        if (req.method === 'DELETE') {
            const { id } = req.query;
            const newsId = parseInt(id);
            
            if (!newsId) {
                res.status(400).json({ error: 'News ID is required' });
                return;
            }
            
            data.news = data.news.filter(n => n.id !== newsId);
            const success = saveData(data);
            
            if (success) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ error: 'Failed to delete news' });
            }
            return;
        }

        // GET - الحصول على الأخبار
        if (req.method === 'GET') {
            res.status(200).json(data.news || []);
            return;
        }

        res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error in news API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
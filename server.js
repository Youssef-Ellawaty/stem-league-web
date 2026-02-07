const http = require('http');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// MongoDB Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'YOUR_MONGODB_URI_HERE';
const DB_NAME = 'stem-league';
const COLLECTION_NAME = 'league-data';

let mongoClient;
let db;
let isConnected = false;

// قراءة البيانات الافتراضية من data.json
let DEFAULT_DATA;
try {
    const dataPath = path.join(__dirname, 'data.json');
    DEFAULT_DATA = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (error) {
    console.log('⚠️  Could not load data.json, using minimal defaults');
    DEFAULT_DATA = {
        teams: [
            { id: 1, name: "King", group: "A", logo: "👑" },
            { id: 2, name: "صيادين البرايز", group: "A", logo: "🎯" },
            { id: 3, name: "Koom Elzawany Pro", group: "A", logo: "🔥" },
            { id: 4, name: "خدتك عليه", group: "A", logo: "💪" },
            { id: 5, name: "Kong", group: "B", logo: "🦍" },
            { id: 6, name: "7enkesh FC", group: "B", logo: "⚡" },
            { id: 7, name: "جبناهم فيك", group: "B", logo: "🏆" },
            { id: 8, name: "خليها على الله", group: "B", logo: "🌟" }
        ],
        players: [],
        matches: [],
        rounds: [
            { id: 1, name: "الجولة الأولى" },
            { id: 2, name: "الجولة الثانية" },
            { id: 3, name: "الجولة الثالثة" }
        ],
        news: [],
        tots: [],
        standings: {
            A: [
                { teamId: 1, teamName: "King", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 },
                { teamId: 2, teamName: "صيادين البرايز", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 },
                { teamId: 3, teamName: "Koom Elzawany Pro", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 },
                { teamId: 4, teamName: "خدتك عليه", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 }
            ],
            B: [
                { teamId: 5, teamName: "Kong", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 },
                { teamId: 6, teamName: "7enkesh FC", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 },
                { teamId: 7, teamName: "جبناهم فيك", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 },
                { teamId: 8, teamName: "خليها على الله", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 }
            ]
        },
        lastUpdate: new Date().toISOString()
    };
}

// الاتصال بـ MongoDB
async function connectDB() {
    if (isConnected) return;
    
    try {
        if (!MONGODB_URI || MONGODB_URI === 'YOUR_MONGODB_URI_HERE') {
            console.log('⚠️  MongoDB URI not configured. Using in-memory storage (data will be lost on restart)');
            console.log('💡 Set MONGODB_URI environment variable to enable persistent storage');
            return;
        }

        mongoClient = new MongoClient(MONGODB_URI);
        await mongoClient.connect();
        db = mongoClient.db(DB_NAME);
        isConnected = true;
        console.log('✓ Connected to MongoDB Atlas');
        
        // تأكد من وجود البيانات الأولية
        await initializeData();
    } catch (error) {
        console.error('✗ MongoDB connection error:', error.message);
        console.log('⚠️  Using in-memory storage');
    }
}

// تهيئة البيانات الأولية إذا لم تكن موجودة
async function initializeData() {
    if (!isConnected) return;
    
    try {
        const collection = db.collection(COLLECTION_NAME);
        const existingData = await collection.findOne({ _id: 'main' });
        
        if (!existingData) {
            await collection.insertOne({
                _id: 'main',
                ...DEFAULT_DATA
            });
            console.log('✓ Initial data created in MongoDB');
        }
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

// قراءة البيانات
async function getData() {
    if (!isConnected) {
        return DEFAULT_DATA;
    }
    
    try {
        const collection = db.collection(COLLECTION_NAME);
        const data = await collection.findOne({ _id: 'main' });
        
        if (!data) {
            return DEFAULT_DATA;
        }
        
        // Remove MongoDB _id field
        const { _id, ...cleanData } = data;
        return cleanData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return DEFAULT_DATA;
    }
}

// حفظ البيانات
async function saveData(newData) {
    if (!isConnected) {
        console.log('⚠️  Cannot save: MongoDB not connected');
        return false;
    }
    
    try {
        const collection = db.collection(COLLECTION_NAME);
        newData.lastUpdate = new Date().toISOString();
        
        await collection.updateOne(
            { _id: 'main' },
            { $set: newData },
            { upsert: true }
        );
        
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

// Parse JSON body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(error);
            }
        });
        req.on('error', reject);
    });
}

// Send JSON response
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    res.end(JSON.stringify(data));
}

// Serve static files
function serveStaticFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400'
            });
            res.end(content);
        }
    });
}

// Get MIME type
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.webp': 'image/webp'
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

// Server
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Handle CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    // Health check
    if (pathname === '/health') {
        sendJSON(res, 200, { 
            status: 'healthy',
            database: isConnected ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString()
        });
        return;
    }

    // API Routes
    if (pathname.startsWith('/api/')) {
        try {
            // GET /api/data
            if (pathname === '/api/data' && req.method === 'GET') {
                const data = await getData();
                sendJSON(res, 200, data);
                return;
            }

            // POST /api/data - Save all data
            if (pathname === '/api/data' && req.method === 'POST') {
                const body = await parseBody(req);
                const success = await saveData(body);
                if (success) {
                    sendJSON(res, 200, { success: true, message: 'Data saved successfully' });
                } else {
                    sendJSON(res, 500, { error: 'Failed to save data' });
                }
                return;
            }

            // POST /api/news - Add news
            if (pathname === '/api/news' && req.method === 'POST') {
                const newsItem = await parseBody(req);
                const data = await getData();
                
                if (!data.news) data.news = [];
                newsItem.id = data.news.length > 0 ? Math.max(...data.news.map(n => n.id)) + 1 : 1;
                newsItem.date = new Date().toISOString().split('T')[0];
                data.news.push(newsItem);
                
                const success = await saveData(data);
                sendJSON(res, success ? 200 : 500, success ? { success: true, news: newsItem } : { error: 'Failed to save news' });
                return;
            }

            // DELETE /api/news/:id
            if (pathname.startsWith('/api/news/') && req.method === 'DELETE') {
                const newsId = parseInt(pathname.split('/').pop());
                const data = await getData();
                data.news = data.news.filter(n => n.id !== newsId);
                const success = await saveData(data);
                sendJSON(res, success ? 200 : 500, success ? { success: true } : { error: 'Failed to delete news' });
                return;
            }

            // POST /api/match
            if (pathname === '/api/match' && req.method === 'POST') {
                const match = await parseBody(req);
                const data = await getData();
                
                const index = data.matches.findIndex(m => m.id === match.id);
                if (index >= 0) {
                    data.matches[index] = match;
                } else {
                    match.id = data.matches.length > 0 ? Math.max(...data.matches.map(m => m.id)) + 1 : 1;
                    data.matches.push(match);
                }
                
                const success = await saveData(data);
                sendJSON(res, success ? 200 : 500, success ? { success: true, match } : { error: 'Failed to save match' });
                return;
            }

            // DELETE /api/match/:id
            if (pathname.startsWith('/api/match/') && req.method === 'DELETE') {
                const matchId = parseInt(pathname.split('/').pop());
                const data = await getData();
                data.matches = data.matches.filter(m => m.id !== matchId);
                const success = await saveData(data);
                sendJSON(res, success ? 200 : 500, success ? { success: true } : { error: 'Failed to delete match' });
                return;
            }

            // POST /api/player/stats
            if (pathname === '/api/player/stats' && req.method === 'POST') {
                const { playerId, goals, assists, yellowCards, redCards } = await parseBody(req);
                const data = await getData();
                
                const player = data.players.find(p => p.id === playerId);
                if (player) {
                    if (goals !== undefined) player.goals = goals;
                    if (assists !== undefined) player.assists = assists;
                    if (yellowCards !== undefined) player.yellowCards = yellowCards;
                    if (redCards !== undefined) player.redCards = redCards;
                    
                    const success = await saveData(data);
                    sendJSON(res, success ? 200 : 404, success ? { success: true, player } : { error: 'Player not found' });
                } else {
                    sendJSON(res, 404, { error: 'Player not found' });
                }
                return;
            }

            sendJSON(res, 404, { error: 'API route not found' });
        } catch (error) {
            console.error('API Error:', error);
            sendJSON(res, 500, { error: 'Internal server error' });
        }
        return;
    }

    // Serve static files
    let filePath = pathname === '/' ? 'index.html' : pathname.substring(1);
    filePath = path.join(__dirname, filePath);

    // Security check - prevent directory traversal
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    const contentType = getMimeType(filePath);
    serveStaticFile(res, filePath, contentType);
});

// Start server
connectDB().then(() => {
    server.listen(PORT, '0.0.0.0', () => {
        console.log('');
        console.log('====================================');
        console.log('  🚀 STEM League Server Started');
        console.log('====================================');
        console.log(`  🌐 Server: http://0.0.0.0:${PORT}/`);
        console.log(`  💾 Database: ${isConnected ? 'MongoDB Atlas (Connected ✓)' : 'In-Memory (Temporary ⚠️)'}`);
        console.log(`  📅 Started: ${new Date().toLocaleString('ar-EG')}`);
        console.log('====================================');
        console.log('');
    });
}).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing server...');
    if (mongoClient) {
        await mongoClient.close();
    }
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
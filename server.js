const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'public', 'data.json');

// Initialize data file if it doesn't exist
function initDataFile() {
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = {
            teams: [],
            players: [],
            matches: [],
            rounds: [],
            news: [],
            tots: [],
            standings: { A: [], B: [] },
            lastUpdate: new Date().toISOString()
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
        console.log('Created initial data.json file');
    }
}

// Read data from file
function readData() {
    try {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Error reading data file:', error);
        return null;
    }
}

// Write data to file
function writeData(data) {
    try {
        data.lastUpdate = new Date().toISOString();
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing data file:', error);
        return false;
    }
}

// Parse JSON body from request
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
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
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

// Initialize data file
initDataFile();

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = url.pathname;

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    // API Routes
    if (pathname.startsWith('/api/')) {
        try {
            // GET /api/data - Get all data
            if (pathname === '/api/data' && req.method === 'GET') {
                const data = readData();
                if (data) {
                    sendJSON(res, 200, data);
                } else {
                    sendJSON(res, 500, { error: 'Failed to read data' });
                }
                return;
            }

            // POST /api/data - Save all data
            if (pathname === '/api/data' && req.method === 'POST') {
                const body = await parseBody(req);
                if (writeData(body)) {
                    sendJSON(res, 200, { success: true, message: 'Data saved successfully' });
                } else {
                    sendJSON(res, 500, { error: 'Failed to save data' });
                }
                return;
            }

            // POST /api/team - Add/Update team
            if (pathname === '/api/team' && req.method === 'POST') {
                const team = await parseBody(req);
                const data = readData();
                if (data) {
                    const index = data.teams.findIndex(t => t.id === team.id);
                    if (index >= 0) {
                        data.teams[index] = team;
                    } else {
                        team.id = data.teams.length > 0 ? Math.max(...data.teams.map(t => t.id)) + 1 : 1;
                        data.teams.push(team);
                    }
                    writeData(data);
                    sendJSON(res, 200, { success: true, team });
                } else {
                    sendJSON(res, 500, { error: 'Failed to update team' });
                }
                return;
            }

            // DELETE /api/team/:id - Delete team
            if (pathname.startsWith('/api/team/') && req.method === 'DELETE') {
                const teamId = parseInt(pathname.split('/').pop());
                const data = readData();
                if (data) {
                    data.teams = data.teams.filter(t => t.id !== teamId);
                    data.players = data.players.filter(p => p.teamId !== teamId);
                    writeData(data);
                    sendJSON(res, 200, { success: true });
                } else {
                    sendJSON(res, 500, { error: 'Failed to delete team' });
                }
                return;
            }

            // POST /api/player - Add/Update player
            if (pathname === '/api/player' && req.method === 'POST') {
                const player = await parseBody(req);
                const data = readData();
                if (data) {
                    const index = data.players.findIndex(p => p.id === player.id);
                    if (index >= 0) {
                        data.players[index] = player;
                    } else {
                        player.id = data.players.length > 0 ? Math.max(...data.players.map(p => p.id)) + 1 : 1;
                        data.players.push(player);
                    }
                    writeData(data);
                    sendJSON(res, 200, { success: true, player });
                } else {
                    sendJSON(res, 500, { error: 'Failed to update player' });
                }
                return;
            }

            // DELETE /api/player/:id - Delete player
            if (pathname.startsWith('/api/player/') && req.method === 'DELETE') {
                const playerId = parseInt(pathname.split('/').pop());
                const data = readData();
                if (data) {
                    data.players = data.players.filter(p => p.id !== playerId);
                    writeData(data);
                    sendJSON(res, 200, { success: true });
                } else {
                    sendJSON(res, 500, { error: 'Failed to delete player' });
                }
                return;
            }

            // POST /api/match - Add/Update match
            if (pathname === '/api/match' && req.method === 'POST') {
                const match = await parseBody(req);
                const data = readData();
                if (data) {
                    const index = data.matches.findIndex(m => m.id === match.id);
                    if (index >= 0) {
                        data.matches[index] = match;
                    } else {
                        match.id = data.matches.length > 0 ? Math.max(...data.matches.map(m => m.id)) + 1 : 1;
                        data.matches.push(match);
                    }
                    writeData(data);
                    sendJSON(res, 200, { success: true, match });
                } else {
                    sendJSON(res, 500, { error: 'Failed to update match' });
                }
                return;
            }

            // DELETE /api/match/:id - Delete match
            if (pathname.startsWith('/api/match/') && req.method === 'DELETE') {
                const matchId = parseInt(pathname.split('/').pop());
                const data = readData();
                if (data) {
                    data.matches = data.matches.filter(m => m.id !== matchId);
                    writeData(data);
                    sendJSON(res, 200, { success: true });
                } else {
                    sendJSON(res, 500, { error: 'Failed to delete match' });
                }
                return;
            }

            // POST /api/round - Add/Update round
            if (pathname === '/api/round' && req.method === 'POST') {
                const round = await parseBody(req);
                const data = readData();
                if (data) {
                    const index = data.rounds.findIndex(r => r.id === round.id);
                    if (index >= 0) {
                        data.rounds[index] = round;
                    } else {
                        round.id = data.rounds.length > 0 ? Math.max(...data.rounds.map(r => r.id)) + 1 : 1;
                        data.rounds.push(round);
                    }
                    writeData(data);
                    sendJSON(res, 200, { success: true, round });
                } else {
                    sendJSON(res, 500, { error: 'Failed to update round' });
                }
                return;
            }

            // DELETE /api/round/:id - Delete round
            if (pathname.startsWith('/api/round/') && req.method === 'DELETE') {
                const roundId = parseInt(pathname.split('/').pop());
                const data = readData();
                if (data) {
                    data.rounds = data.rounds.filter(r => r.id !== roundId);
                    writeData(data);
                    sendJSON(res, 200, { success: true });
                } else {
                    sendJSON(res, 500, { error: 'Failed to delete round' });
                }
                return;
            }

            // POST /api/news - Add/Update news
            if (pathname === '/api/news' && req.method === 'POST') {
                const newsItem = await parseBody(req);
                const data = readData();
                if (data) {
                    const index = data.news.findIndex(n => n.id === newsItem.id);
                    if (index >= 0) {
                        data.news[index] = newsItem;
                    } else {
                        newsItem.id = data.news.length > 0 ? Math.max(...data.news.map(n => n.id)) + 1 : 1;
                        data.news.push(newsItem);
                    }
                    writeData(data);
                    sendJSON(res, 200, { success: true, news: newsItem });
                } else {
                    sendJSON(res, 500, { error: 'Failed to update news' });
                }
                return;
            }

            // DELETE /api/news/:id - Delete news
            if (pathname.startsWith('/api/news/') && req.method === 'DELETE') {
                const newsId = parseInt(pathname.split('/').pop());
                const data = readData();
                if (data) {
                    data.news = data.news.filter(n => n.id !== newsId);
                    writeData(data);
                    sendJSON(res, 200, { success: true });
                } else {
                    sendJSON(res, 500, { error: 'Failed to delete news' });
                }
                return;
            }

            // POST /api/tots - Update Team of the Season
            if (pathname === '/api/tots' && req.method === 'POST') {
                const tots = await parseBody(req);
                const data = readData();
                if (data) {
                    data.tots = tots;
                    writeData(data);
                    sendJSON(res, 200, { success: true });
                } else {
                    sendJSON(res, 500, { error: 'Failed to update TOTS' });
                }
                return;
            }

            // POST /api/player/stats - Update player stats (goals, assists, cards)
            if (pathname === '/api/player/stats' && req.method === 'POST') {
                const { playerId, goals, assists, yellowCards, redCards } = await parseBody(req);
                const data = readData();
                if (data) {
                    const player = data.players.find(p => p.id === playerId);
                    if (player) {
                        if (goals !== undefined) player.goals = goals;
                        if (assists !== undefined) player.assists = assists;
                        if (yellowCards !== undefined) player.yellowCards = yellowCards;
                        if (redCards !== undefined) player.redCards = redCards;
                        writeData(data);
                        sendJSON(res, 200, { success: true, player });
                    } else {
                        sendJSON(res, 404, { error: 'Player not found' });
                    }
                } else {
                    sendJSON(res, 500, { error: 'Failed to update player stats' });
                }
                return;
            }

            // POST /api/match/events - Update match events
            if (pathname === '/api/match/events' && req.method === 'POST') {
                const { matchId, events } = await parseBody(req);
                const data = readData();
                if (data) {
                    const match = data.matches.find(m => m.id === matchId);
                    if (match) {
                        match.events = events;
                        writeData(data);
                        sendJSON(res, 200, { success: true, match });
                    } else {
                        sendJSON(res, 404, { error: 'Match not found' });
                    }
                } else {
                    sendJSON(res, 500, { error: 'Failed to update match events' });
                }
                return;
            }

            // 404 for unknown API routes
            sendJSON(res, 404, { error: 'API route not found' });
            return;
        } catch (error) {
            console.error('API Error:', error);
            sendJSON(res, 500, { error: 'Internal server error' });
            return;
        }
    }

    // Static file serving
    let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
    
    const extname = path.extname(filePath).toLowerCase();
    
    let contentType = 'text/html';
    switch(extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        case '.ico':
            contentType = 'image/x-icon';
            break;
    }
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error', 'utf-8');
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`STEM League Server running at http://0.0.0.0:${PORT}/`);
    console.log(`Data file location: ${DATA_FILE}`);
});

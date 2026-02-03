// STEM League - Championship App
// Data Storage using localStorage

// Initialize data
const ADMIN_PASSWORD = 'stemleague2025';

let data = {
    teams: [],
    players: [],
    matches: [],
    rounds: [],
    news: [],
    tots: [],
    standings: {
        A: [],
        B: []
    }
};

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('stemLeagueData');
    if (saved) {
        data = JSON.parse(saved);
    } else {
        // Initialize with sample data
        initSampleData();
    }
    updateUI();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('stemLeagueData', JSON.stringify(data));
}

// Initialize sample data
function initSampleData() {
    // Sample teams
    data.teams = [
        { id: 1, name: 'فريق الصقور', group: 'A', logo: '🦅' },
        { id: 2, name: 'فريق النجوم', group: 'A', logo: '⭐' },
        { id: 3, name: 'فريق الأسود', group: 'A', logo: '🦁' },
        { id: 4, name: 'فريق النسور', group: 'A', logo: '🦅' },
        { id: 5, name: 'فريق الفهود', group: 'B', logo: '🐆' },
        { id: 6, name: 'فريق الذئاب', group: 'B', logo: '🐺' },
        { id: 7, name: 'فريق العقبان', group: 'B', logo: '🦅' },
        { id: 8, name: 'فريق الأبطال', group: 'B', logo: '🏆' }
    ];

    // Sample players - 5 players per team
    // التشكيلات المتاحة (5 لاعبين):
    // 1-1-2-1: حارس، مدافع، وسطين، مهاجم
    // 1-2-1-1: حارس، مدافعين، وسط، مهاجم  
    // 1-1-1-2: حارس، مدافع، وسط، مهاجمين
    
    const teamFormations = {
        // يمكنك تغيير التشكيلة لكل فريق هنا
        1: [{ pos: 'GK', count: 1 }, { pos: 'DF', count: 1 }, { pos: 'MF', count: 2 }, { pos: 'FW', count: 1 }], // 1-1-2-1
        2: [{ pos: 'GK', count: 1 }, { pos: 'DF', count: 2 }, { pos: 'MF', count: 1 }, { pos: 'FW', count: 1 }], // 1-2-1-1
        3: [{ pos: 'GK', count: 1 }, { pos: 'DF', count: 1 }, { pos: 'MF', count: 1 }, { pos: 'FW', count: 2 }], // 1-1-1-2
        4: [{ pos: 'GK', count: 1 }, { pos: 'DF', count: 1 }, { pos: 'MF', count: 2 }, { pos: 'FW', count: 1 }], // 1-1-2-1
        5: [{ pos: 'GK', count: 1 }, { pos: 'DF', count: 2 }, { pos: 'MF', count: 1 }, { pos: 'FW', count: 1 }], // 1-2-1-1
        6: [{ pos: 'GK', count: 1 }, { pos: 'DF', count: 1 }, { pos: 'MF', count: 1 }, { pos: 'FW', count: 2 }], // 1-1-1-2
        7: [{ pos: 'GK', count: 1 }, { pos: 'DF', count: 1 }, { pos: 'MF', count: 2 }, { pos: 'FW', count: 1 }], // 1-1-2-1
        8: [{ pos: 'GK', count: 1 }, { pos: 'DF', count: 2 }, { pos: 'MF', count: 1 }, { pos: 'FW', count: 1 }]  // 1-2-1-1
    };
    
    // التشكيلة الافتراضية لأي فريق جديد
    const defaultFormation = [
        { pos: 'GK', count: 1 },
        { pos: 'DF', count: 1 },
        { pos: 'MF', count: 2 },
        { pos: 'FW', count: 1 }
    ];

    const playerNames = [
        'أحمد محمد', 'محمد علي', 'عمر حسن', 'يوسف إبراهيم', 'خالد أحمد'
    ];

    let playerId = 1;
    data.teams.forEach(team => {
        let playerIndex = 0;
        const formation = teamFormations[team.id] || defaultFormation;
        formation.forEach(({ pos, count }) => {
            for (let i = 0; i < count; i++) {
                data.players.push({
                    id: playerId++,
                    teamId: team.id,
                    name: playerNames[playerIndex % playerNames.length],
                    position: pos,
                    number: playerIndex + 1,
                    goals: 0,
                    assists: 0,
                    yellowCards: 0,
                    redCards: 0
                });
                playerIndex++;
            }
        });
    });

    // Sample rounds
    data.rounds = [
        { id: 1, name: 'الجولة الأولى' },
        { id: 2, name: 'الجولة الثانية' },
        { id: 3, name: 'الجولة الثالثة' }
    ];

    // Sample matches
    data.matches = [
        {
            id: 1,
            roundId: 1,
            team1Id: 1,
            team2Id: 2,
            score1: 2,
            score2: 1,
            date: '2025-02-10T15:00',
            status: 'finished',
            events: [
                { type: 'goal', playerId: 1, minute: 23 },
                { type: 'goal', playerId: 2, minute: 45 },
                { type: 'goal', playerId: 6, minute: 67 }
            ]
        },
        {
            id: 2,
            roundId: 1,
            team1Id: 3,
            team2Id: 4,
            score1: 0,
            score2: 0,
            date: '2025-02-10T17:00',
            status: 'upcoming',
            events: []
        },
        {
            id: 3,
            roundId: 1,
            team1Id: 5,
            team2Id: 6,
            score1: 1,
            score2: 1,
            date: '2025-02-11T15:00',
            status: 'live',
            events: []
        }
    ];

    // Sample news
    data.news = [
        {
            id: 1,
            title: 'انطلاق بطولة STEM League للموسم الجديد',
            content: 'تنطلق اليوم فعاليات بطولة STEM League في موسمها الجديد بمشاركة 8 فرق من أفضل مدارس STEM في المنطقة.',
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
            date: '2025-02-01'
        },
        {
            id: 2,
            title: 'فريق الصقور يحقق الفوز في المباراة الافتتاحية',
            content: 'حقق فريق الصقور فوزاً مستحقاً على فريق النجوم بنتيجة 2-1 في المباراة الافتتاحية للبطولة.',
            image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
            date: '2025-02-10'
        },
        {
            id: 3,
            title: 'تألق اللاعبين الشباب في الجولة الأولى',
            content: 'أظهر اللاعبون الشباب مستوى رائعاً في مباريات الجولة الأولى مما يبشر بموسم مثير.',
            image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800',
            date: '2025-02-12'
        }
    ];

    // Calculate standings
    calculateStandings();
    
    saveData();
}

// Calculate standings from matches
function calculateStandings() {
    // Reset standings
    data.standings = { A: [], B: [] };
    
    // Initialize team standings
    data.teams.forEach(team => {
        data.standings[team.group].push({
            teamId: team.id,
            teamName: team.name,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDiff: 0,
            points: 0
        });
    });

    // Calculate from finished matches
    data.matches.filter(m => m.status === 'finished').forEach(match => {
        const team1 = data.teams.find(t => t.id === match.team1Id);
        const team2 = data.teams.find(t => t.id === match.team2Id);
        
        if (team1 && team2 && team1.group === team2.group) {
            const group = team1.group;
            const standing1 = data.standings[group].find(s => s.teamId === match.team1Id);
            const standing2 = data.standings[group].find(s => s.teamId === match.team2Id);
            
            if (standing1 && standing2) {
                standing1.played++;
                standing2.played++;
                
                standing1.goalsFor += match.score1;
                standing1.goalsAgainst += match.score2;
                standing2.goalsFor += match.score2;
                standing2.goalsAgainst += match.score1;
                
                if (match.score1 > match.score2) {
                    standing1.won++;
                    standing1.points += 3;
                    standing2.lost++;
                } else if (match.score1 < match.score2) {
                    standing2.won++;
                    standing2.points += 3;
                    standing1.lost++;
                } else {
                    standing1.drawn++;
                    standing2.drawn++;
                    standing1.points += 1;
                    standing2.points += 1;
                }
                
                standing1.goalDiff = standing1.goalsFor - standing1.goalsAgainst;
                standing2.goalDiff = standing2.goalsFor - standing2.goalsAgainst;
            }
        }
    });

    // Sort standings
    ['A', 'B'].forEach(group => {
        data.standings[group].sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
            return b.goalsFor - a.goalsFor;
        });
    });
}

// Update all UI elements
function updateUI() {
    updateStats();
    renderNews();
    renderMatches();
    renderTeamSelector();
    renderStandings();
    renderBracket();
    renderTOTS();
    renderAdminLists();
}

// Update hero stats
function updateStats() {
    document.getElementById('totalTeams').textContent = data.teams.length;
    document.getElementById('totalMatches').textContent = data.matches.length;
    
    const totalGoals = data.matches.reduce((sum, m) => sum + (m.score1 || 0) + (m.score2 || 0), 0);
    document.getElementById('totalGoals').textContent = totalGoals;
}

// Render news
function renderNews() {
    const grid = document.getElementById('newsGrid');
    if (data.news.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📰</div>
                <p class="empty-state-text">لا توجد أخبار حالياً</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = data.news.map(news => `
        <div class="news-card">
            <img src="${news.image}" alt="${news.title}" class="news-image" onerror="this.src='https://via.placeholder.com/400x220/1a472a/ffffff?text=STEM+League'">
            <div class="news-content">
                <div class="news-date">${formatDate(news.date)}</div>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.content}</p>
            </div>
        </div>
    `).join('');
}

// Render matches
function renderMatches() {
    const upcoming = data.matches.filter(m => m.status === 'upcoming');
    const live = data.matches.filter(m => m.status === 'live');
    const finished = data.matches.filter(m => m.status === 'finished');
    
    document.getElementById('upcomingMatches').innerHTML = renderMatchList(upcoming, 'لا توجد مباريات قادمة');
    document.getElementById('liveMatches').innerHTML = renderMatchList(live, 'لا توجد مباريات جارية حالياً');
    document.getElementById('finishedMatches').innerHTML = renderMatchList(finished, 'لا توجد مباريات سابقة');
}

function renderMatchList(matches, emptyText) {
    if (matches.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">⚽</div>
                <p class="empty-state-text">${emptyText}</p>
            </div>
        `;
    }
    
    return matches.map(match => {
        const team1 = data.teams.find(t => t.id === match.team1Id);
        const team2 = data.teams.find(t => t.id === match.team2Id);
        const round = data.rounds.find(r => r.id === match.roundId);
        
        return `
            <div class="match-card" onclick="showMatchDetails(${match.id})">
                <div class="match-header">
                    <span class="match-round">${round ? round.name : ''}</span>
                    <span class="match-status ${match.status}">${getStatusText(match.status)}</span>
                </div>
                <div class="match-teams">
                    <div class="match-team">
                        <div class="team-logo">${team1 ? team1.logo : '⚽'}</div>
                        <div class="team-name">${team1 ? team1.name : 'فريق 1'}</div>
                    </div>
                    ${match.status === 'upcoming' ? `
                        <div class="match-vs">VS</div>
                    ` : `
                        <div class="match-score">
                            <span class="score">${match.score1}</span>
                            <span class="score-divider">-</span>
                            <span class="score">${match.score2}</span>
                        </div>
                    `}
                    <div class="match-team">
                        <div class="team-logo">${team2 ? team2.logo : '⚽'}</div>
                        <div class="team-name">${team2 ? team2.name : 'فريق 2'}</div>
                    </div>
                </div>
                <div class="match-time">${formatDateTime(match.date)}</div>
            </div>
        `;
    }).join('');
}

function getStatusText(status) {
    const texts = {
        upcoming: 'لم تُلعب',
        live: '🔴 جارية',
        finished: 'انتهت'
    };
    return texts[status] || status;
}

// Team selector and field
function renderTeamSelector() {
    const selector = document.getElementById('teamSelector');
    selector.innerHTML = `
        <option value="">اختر الفريق</option>
        ${data.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
    `;
}

document.getElementById('teamSelector')?.addEventListener('change', function() {
    const teamId = parseInt(this.value);
    if (teamId) {
        renderTeamFormation(teamId);
    } else {
        document.getElementById('playersFormation').innerHTML = '';
    }
});

function renderTeamFormation(teamId) {
    const formation = document.getElementById('playersFormation');
    const teamPlayers = data.players.filter(p => p.teamId === teamId);
    
    // حساب عدد اللاعبين في كل مركز
    const positionCounts = {
        GK: teamPlayers.filter(p => p.position === 'GK').length,
        DF: teamPlayers.filter(p => p.position === 'DF').length,
        MF: teamPlayers.filter(p => p.position === 'MF').length,
        FW: teamPlayers.filter(p => p.position === 'FW').length
    };
    
    // إحداثيات ديناميكية بناءً على عدد اللاعبين في كل مركز
    function getPositionCoords(position, count) {
        const coords = {
            GK: {
                1: [{ left: '50%', top: '88%' }]
            },
            DF: {
                1: [{ left: '50%', top: '70%' }],
                2: [{ left: '30%', top: '70%' }, { left: '70%', top: '70%' }]
            },
            MF: {
                1: [{ left: '50%', top: '45%' }],
                2: [{ left: '30%', top: '45%' }, { left: '70%', top: '45%' }]
            },
            FW: {
                1: [{ left: '50%', top: '18%' }],
                2: [{ left: '30%', top: '18%' }, { left: '70%', top: '18%' }]
            }
        };
        return coords[position]?.[count] || coords[position]?.[1] || [];
    }
    
    let positionIndex = { GK: 0, DF: 0, MF: 0, FW: 0 };
    
    formation.innerHTML = teamPlayers.map(player => {
        const count = positionCounts[player.position];
        const coords = getPositionCoords(player.position, count);
        const index = positionIndex[player.position];
        positionIndex[player.position]++;
        
        if (!coords || !coords[index]) return '';
        
        return `
            <div class="player-spot" style="left: ${coords[index].left}; top: ${coords[index].top}; transform: translate(-50%, -50%);" onclick="showPlayerCard(${player.id})">
                <div class="player-avatar">${player.number}</div>
                <div class="player-name">${player.name}</div>
                <div class="player-position-badge">${getPositionName(player.position)}</div>
            </div>
        `;
    }).join('');
}

function getPositionName(pos) {
    const names = {
        GK: 'حارس',
        DF: 'مدافع',
        MF: 'وسط',
        FW: 'مهاجم'
    };
    return names[pos] || pos;
}

// Render standings
function renderStandings() {
    ['A', 'B'].forEach(group => {
        const tbody = document.getElementById(`group${group}Standings`);
        tbody.innerHTML = data.standings[group].map((team, index) => `
            <tr>
                <td>${index + 1}</td>
                <td style="text-align: right; padding-right: 15px;">${team.teamName}</td>
                <td>${team.played}</td>
                <td>${team.won}</td>
                <td>${team.drawn}</td>
                <td>${team.lost}</td>
                <td>${team.goalsFor}</td>
                <td>${team.goalsAgainst}</td>
                <td>${team.goalDiff > 0 ? '+' : ''}${team.goalDiff}</td>
                <td><strong>${team.points}</strong></td>
            </tr>
        `).join('');
    });
}

// Render knockout bracket
function renderBracket() {
    const container = document.getElementById('bracketContainer');
    
    // Get top teams from each group
    const groupA = data.standings.A.slice(0, 3);
    const groupB = data.standings.B.slice(0, 3);
    
    container.innerHTML = `
        <div class="bracket-round">
            <div class="bracket-match">
                <div class="bracket-match-title">الملحق 1</div>
                <div class="bracket-team">${groupA[1]?.teamName || 'ثاني المجموعة A'} <span>-</span></div>
                <div class="bracket-team">${groupB[2]?.teamName || 'ثالث المجموعة B'} <span>-</span></div>
            </div>
            <div class="bracket-match">
                <div class="bracket-match-title">الملحق 2</div>
                <div class="bracket-team">${groupB[1]?.teamName || 'ثاني المجموعة B'} <span>-</span></div>
                <div class="bracket-team">${groupA[2]?.teamName || 'ثالث المجموعة A'} <span>-</span></div>
            </div>
        </div>
        <div class="bracket-round">
            <div class="bracket-match">
                <div class="bracket-match-title">نصف النهائي 1</div>
                <div class="bracket-team winner">${groupA[0]?.teamName || 'أول المجموعة A'} <span>-</span></div>
                <div class="bracket-team">الفائز من الملحق 2 <span>-</span></div>
            </div>
            <div class="bracket-match">
                <div class="bracket-match-title">نصف النهائي 2</div>
                <div class="bracket-team winner">${groupB[0]?.teamName || 'أول المجموعة B'} <span>-</span></div>
                <div class="bracket-team">الفائز من الملحق 1 <span>-</span></div>
            </div>
        </div>
        <div class="bracket-round">
            <div class="bracket-match">
                <div class="bracket-match-title">🏆 النهائي</div>
                <div class="bracket-team">الفائز 1 <span>-</span></div>
                <div class="bracket-team">الفائز 2 <span>-</span></div>
            </div>
        </div>
    `;
}

// Render Team of the Season
function renderTOTS() {
    const container = document.getElementById('totsPlayers');
    
    if (data.tots.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⭐</div>
                <p class="empty-state-text">سيتم الإعلان عن فريق الموسم قريباً</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = data.tots.map(playerId => {
        const player = data.players.find(p => p.id === playerId);
        if (!player) return '';
        const team = data.teams.find(t => t.id === player.teamId);
        
        return `
            <div class="tots-card" onclick="showPlayerCard(${player.id})">
                <div class="tots-avatar">${player.number}</div>
                <div class="tots-name">${player.name}</div>
                <div class="tots-position">${getPositionName(player.position)}</div>
            </div>
        `;
    }).join('');
}

// Player card modal
function showPlayerCard(playerId) {
    const player = data.players.find(p => p.id === playerId);
    if (!player) return;
    
    const team = data.teams.find(t => t.id === player.teamId);
    
    document.getElementById('playerCardContent').innerHTML = `
        <div class="player-card-avatar">${player.number}</div>
        <h2 class="player-card-name">${player.name}</h2>
        <p class="player-card-team">${team ? team.name : ''}</p>
        <p class="player-card-position">${getPositionName(player.position)}</p>
        <div class="player-stats">
            <div class="player-stat">
                <div class="player-stat-value">${player.goals}</div>
                <div class="player-stat-label">⚽ أهداف</div>
            </div>
            <div class="player-stat">
                <div class="player-stat-value">${player.assists}</div>
                <div class="player-stat-label">👟 تمريرات حاسمة</div>
            </div>
            <div class="player-stat">
                <div class="player-stat-value">${player.yellowCards}</div>
                <div class="player-stat-label">🟨 إنذارات</div>
            </div>
        </div>
    `;
    
    document.getElementById('playerModal').classList.add('active');
}

function closePlayerModal() {
    document.getElementById('playerModal').classList.remove('active');
}

// Match details modal
function showMatchDetails(matchId) {
    const match = data.matches.find(m => m.id === matchId);
    if (!match) return;
    
    const team1 = data.teams.find(t => t.id === match.team1Id);
    const team2 = data.teams.find(t => t.id === match.team2Id);
    
    let eventsHtml = '';
    if (match.events && match.events.length > 0) {
        eventsHtml = `
            <div class="match-events">
                <h4>أحداث المباراة</h4>
                ${match.events.map(event => {
                    const player = data.players.find(p => p.id === event.playerId);
                    const eventIcon = event.type === 'goal' ? '⚽' : event.type === 'assist' ? '👟' : event.type === 'yellowCard' ? '🟨' : '🟥';
                    return `
                        <div class="event-item">
                            <span class="event-icon">${eventIcon}</span>
                            <span class="event-time">${event.minute}'</span>
                            <span class="event-player">${player ? player.name : 'لاعب'}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    document.getElementById('matchDetails').innerHTML = `
        <div class="match-details-header">
            <div class="match-details-team">
                <div class="match-details-logo">${team1 ? team1.logo : '⚽'}</div>
                <div class="match-details-name">${team1 ? team1.name : 'فريق 1'}</div>
            </div>
            <div class="match-details-score">${match.score1} - ${match.score2}</div>
            <div class="match-details-team">
                <div class="match-details-logo">${team2 ? team2.logo : '⚽'}</div>
                <div class="match-details-name">${team2 ? team2.name : 'فريق 2'}</div>
            </div>
        </div>
        <p style="color: var(--text-secondary);">${formatDateTime(match.date)}</p>
        ${eventsHtml}
    `;
    
    document.getElementById('matchModal').classList.add('active');
}

function closeMatchModal() {
    document.getElementById('matchModal').classList.remove('active');
}

// Admin functions
function openAdminLogin() {
    document.getElementById('adminLoginModal').classList.add('active');
    document.getElementById('adminPassword').value = '';
    document.getElementById('loginError').textContent = '';
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').classList.remove('active');
}

function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        closeAdminLogin();
        openAdminPanel();
    } else {
        document.getElementById('loginError').textContent = 'كلمة المرور غير صحيحة';
    }
}

function openAdminPanel() {
    document.getElementById('adminPanel').classList.add('active');
    renderAdminLists();
}

function closeAdminPanel() {
    document.getElementById('adminPanel').classList.remove('active');
}

// Admin tabs
document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const panelId = this.dataset.panel;
        document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
        
        const panels = {
            'rounds': 'roundsPanel',
            'matches-admin': 'matchesAdminPanel',
            'teams-admin': 'teamsAdminPanel',
            'news-admin': 'newsAdminPanel',
            'tots-admin': 'totsAdminPanel'
        };
        
        document.getElementById(panels[panelId])?.classList.remove('hidden');
    });
});

// Match tabs
document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const tabId = this.dataset.tab;
        document.querySelectorAll('.matches-list').forEach(list => list.classList.add('hidden'));
        document.getElementById(`${tabId}Matches`)?.classList.remove('hidden');
    });
});

// Render admin lists
function renderAdminLists() {
    // Rounds
    document.getElementById('roundsList').innerHTML = data.rounds.map(round => `
        <div class="admin-item">
            <span class="admin-item-title">${round.name}</span>
            <div class="admin-item-actions">
                <button class="btn btn-danger btn-sm" onclick="deleteRound(${round.id})">حذف</button>
            </div>
        </div>
    `).join('');
    
    // Update round selector for matches
    const roundSelect = document.getElementById('matchRound');
    if (roundSelect) {
        roundSelect.innerHTML = `
            <option value="">اختر الجولة</option>
            ${data.rounds.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
        `;
    }
    
    // Team selectors
    const teamSelects = ['matchTeam1', 'matchTeam2', 'playerTeam'];
    teamSelects.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            select.innerHTML = `
                <option value="">${id.includes('player') ? 'اختر الفريق' : 'الفريق'}</option>
                ${data.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
            `;
        }
    });
    
    // Matches admin list
    document.getElementById('matchesAdminList').innerHTML = data.matches.map(match => {
        const team1 = data.teams.find(t => t.id === match.team1Id);
        const team2 = data.teams.find(t => t.id === match.team2Id);
        return `
            <div class="admin-item">
                <span class="admin-item-title">${team1?.name || '-'} vs ${team2?.name || '-'} (${getStatusText(match.status)})</span>
                <div class="admin-item-actions">
                    <button class="btn btn-primary btn-sm" onclick="editMatch(${match.id})">تعديل</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteMatch(${match.id})">حذف</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Teams admin list
    document.getElementById('teamsAdminList').innerHTML = data.teams.map(team => `
        <div class="admin-item">
            <span class="admin-item-title">${team.logo} ${team.name} (المجموعة ${team.group})</span>
            <div class="admin-item-actions">
                <button class="btn btn-danger btn-sm" onclick="deleteTeam(${team.id})">حذف</button>
            </div>
        </div>
    `).join('');
    
    // News admin list
    document.getElementById('newsAdminList').innerHTML = data.news.map(news => `
        <div class="admin-item">
            <span class="admin-item-title">${news.title}</span>
            <div class="admin-item-actions">
                <button class="btn btn-danger btn-sm" onclick="deleteNews(${news.id})">حذف</button>
            </div>
        </div>
    `).join('');
    
    // TOTS selection
    document.getElementById('totsSelection').innerHTML = data.players.map(player => {
        const team = data.teams.find(t => t.id === player.teamId);
        const isSelected = data.tots.includes(player.id);
        return `
            <div class="tots-select-item ${isSelected ? 'selected' : ''}" onclick="toggleTOTS(${player.id})">
                <input type="checkbox" ${isSelected ? 'checked' : ''} ${data.tots.length >= 5 && !isSelected ? 'disabled' : ''}>
                <span>${player.name} - ${team?.name || ''} (${getPositionName(player.position)})</span>
            </div>
        `;
    }).join('');
}

// Add functions
function addRound() {
    const name = document.getElementById('roundName').value.trim();
    if (!name) return alert('أدخل اسم الجولة');
    
    const id = Date.now();
    data.rounds.push({ id, name });
    saveData();
    document.getElementById('roundName').value = '';
    renderAdminLists();
}

function deleteRound(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الجولة؟')) return;
    data.rounds = data.rounds.filter(r => r.id !== id);
    saveData();
    renderAdminLists();
}

function addMatch() {
    const roundId = parseInt(document.getElementById('matchRound').value);
    const team1Id = parseInt(document.getElementById('matchTeam1').value);
    const team2Id = parseInt(document.getElementById('matchTeam2').value);
    const date = document.getElementById('matchDate').value;
    const status = document.getElementById('matchStatus').value;
    
    if (!roundId || !team1Id || !team2Id || !date) {
        return alert('أكمل جميع البيانات');
    }
    
    if (team1Id === team2Id) {
        return alert('اختر فريقين مختلفين');
    }
    
    const id = Date.now();
    data.matches.push({
        id,
        roundId,
        team1Id,
        team2Id,
        score1: 0,
        score2: 0,
        date,
        status,
        events: []
    });
    
    saveData();
    renderMatches();
    renderAdminLists();
}

function deleteMatch(id) {
    if (!confirm('هل أنت متأكد من حذف هذه المباراة؟')) return;
    data.matches = data.matches.filter(m => m.id !== id);
    calculateStandings();
    saveData();
    updateUI();
}

function editMatch(matchId) {
    const match = data.matches.find(m => m.id === matchId);
    if (!match) return;
    
    const team1 = data.teams.find(t => t.id === match.team1Id);
    const team2 = data.teams.find(t => t.id === match.team2Id);
    const team1Players = data.players.filter(p => p.teamId === match.team1Id);
    const team2Players = data.players.filter(p => p.teamId === match.team2Id);
    
    document.getElementById('matchEditContent').innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px;">تعديل المباراة</h3>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="text-align: center; flex: 1;">
                <div style="font-size: 2rem;">${team1?.logo || '⚽'}</div>
                <div>${team1?.name || ''}</div>
            </div>
            <div style="text-align: center;">
                <input type="number" id="editScore1" value="${match.score1}" min="0" style="width: 60px; text-align: center; font-size: 1.5rem;" class="admin-input">
                <span style="margin: 0 10px;">-</span>
                <input type="number" id="editScore2" value="${match.score2}" min="0" style="width: 60px; text-align: center; font-size: 1.5rem;" class="admin-input">
            </div>
            <div style="text-align: center; flex: 1;">
                <div style="font-size: 2rem;">${team2?.logo || '⚽'}</div>
                <div>${team2?.name || ''}</div>
            </div>
        </div>
        
        <div class="form-group">
            <label>حالة المباراة</label>
            <select id="editMatchStatus" class="admin-input">
                <option value="upcoming" ${match.status === 'upcoming' ? 'selected' : ''}>لم تُلعب بعد</option>
                <option value="live" ${match.status === 'live' ? 'selected' : ''}>جارية</option>
                <option value="finished" ${match.status === 'finished' ? 'selected' : ''}>انتهت</option>
            </select>
        </div>
        
        <h4 style="margin: 20px 0 10px;">إضافة حدث</h4>
        <div class="form-row">
            <select id="eventPlayer" class="admin-input">
                <option value="">اختر اللاعب</option>
                <optgroup label="${team1?.name || 'الفريق الأول'}">
                    ${team1Players.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                </optgroup>
                <optgroup label="${team2?.name || 'الفريق الثاني'}">
                    ${team2Players.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                </optgroup>
            </select>
            <select id="eventType" class="admin-input">
                <option value="goal">⚽ هدف</option>
                <option value="assist">👟 تمريرة حاسمة</option>
                <option value="yellowCard">🟨 إنذار</option>
                <option value="redCard">🟥 طرد</option>
            </select>
            <input type="number" id="eventMinute" placeholder="الدقيقة" min="1" max="120" class="admin-input">
            <button class="btn btn-success" onclick="addMatchEvent(${matchId})">إضافة</button>
        </div>
        
        <div id="matchEventsList" style="margin-top: 20px;">
            ${match.events.map((event, index) => {
                const player = data.players.find(p => p.id === event.playerId);
                const icon = event.type === 'goal' ? '⚽' : event.type === 'assist' ? '👟' : event.type === 'yellowCard' ? '🟨' : '🟥';
                return `
                    <div class="admin-item">
                        <span>${icon} ${player?.name || 'لاعب'} - الدقيقة ${event.minute}'</span>
                        <button class="btn btn-danger btn-sm" onclick="removeMatchEvent(${matchId}, ${index})">حذف</button>
                    </div>
                `;
            }).join('')}
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
            <button class="btn btn-primary" onclick="saveMatchEdit(${matchId})">حفظ التغييرات</button>
        </div>
    `;
    
    document.getElementById('matchEditModal').classList.add('active');
}

function closeMatchEdit() {
    document.getElementById('matchEditModal').classList.remove('active');
}

function addMatchEvent(matchId) {
    const match = data.matches.find(m => m.id === matchId);
    if (!match) return;
    
    const playerId = parseInt(document.getElementById('eventPlayer').value);
    const type = document.getElementById('eventType').value;
    const minute = parseInt(document.getElementById('eventMinute').value);
    
    if (!playerId || !type || !minute) {
        return alert('أكمل جميع البيانات');
    }
    
    match.events.push({ type, playerId, minute });
    
    // Update player stats
    const player = data.players.find(p => p.id === playerId);
    if (player) {
        if (type === 'goal') player.goals++;
        if (type === 'assist') player.assists++;
        if (type === 'yellowCard') player.yellowCards++;
        if (type === 'redCard') player.redCards++;
    }
    
    saveData();
    editMatch(matchId);
}

function removeMatchEvent(matchId, eventIndex) {
    const match = data.matches.find(m => m.id === matchId);
    if (!match) return;
    
    const event = match.events[eventIndex];
    if (event) {
        const player = data.players.find(p => p.id === event.playerId);
        if (player) {
            if (event.type === 'goal') player.goals = Math.max(0, player.goals - 1);
            if (event.type === 'assist') player.assists = Math.max(0, player.assists - 1);
            if (event.type === 'yellowCard') player.yellowCards = Math.max(0, player.yellowCards - 1);
            if (event.type === 'redCard') player.redCards = Math.max(0, player.redCards - 1);
        }
    }
    
    match.events.splice(eventIndex, 1);
    saveData();
    editMatch(matchId);
}

function saveMatchEdit(matchId) {
    const match = data.matches.find(m => m.id === matchId);
    if (!match) return;
    
    match.score1 = parseInt(document.getElementById('editScore1').value) || 0;
    match.score2 = parseInt(document.getElementById('editScore2').value) || 0;
    match.status = document.getElementById('editMatchStatus').value;
    
    calculateStandings();
    saveData();
    updateUI();
    closeMatchEdit();
}

function addTeam() {
    const name = document.getElementById('teamName').value.trim();
    const group = document.getElementById('teamGroup').value;
    
    if (!name) return alert('أدخل اسم الفريق');
    
    const id = Date.now();
    const logos = ['⚽', '🏆', '⭐', '🦁', '🦅', '🐺', '🐆', '🔥'];
    const logo = logos[data.teams.length % logos.length];
    
    data.teams.push({ id, name, group, logo });
    
    // Recalculate standings
    calculateStandings();
    saveData();
    document.getElementById('teamName').value = '';
    updateUI();
}

function deleteTeam(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الفريق؟')) return;
    data.teams = data.teams.filter(t => t.id !== id);
    data.players = data.players.filter(p => p.teamId !== id);
    data.matches = data.matches.filter(m => m.team1Id !== id && m.team2Id !== id);
    calculateStandings();
    saveData();
    updateUI();
}

function addPlayer() {
    const teamId = parseInt(document.getElementById('playerTeam').value);
    const name = document.getElementById('playerName').value.trim();
    const position = document.getElementById('playerPosition').value;
    const number = parseInt(document.getElementById('playerNumber').value);
    
    if (!teamId || !name || !position || !number) {
        return alert('أكمل جميع البيانات');
    }
    
    const id = Date.now();
    data.players.push({
        id,
        teamId,
        name,
        position,
        number,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
    });
    
    saveData();
    document.getElementById('playerName').value = '';
    document.getElementById('playerNumber').value = '';
    renderAdminLists();
}

function addNews() {
    const title = document.getElementById('newsTitle').value.trim();
    const content = document.getElementById('newsContent').value.trim();
    const image = document.getElementById('newsImage').value.trim();
    
    if (!title || !content) {
        return alert('أدخل العنوان والمحتوى');
    }
    
    const id = Date.now();
    const date = new Date().toISOString().split('T')[0];
    
    data.news.unshift({ id, title, content, image: image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', date });
    
    saveData();
    document.getElementById('newsTitle').value = '';
    document.getElementById('newsContent').value = '';
    document.getElementById('newsImage').value = '';
    updateUI();
}

function deleteNews(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;
    data.news = data.news.filter(n => n.id !== id);
    saveData();
    updateUI();
}

function toggleTOTS(playerId) {
    const index = data.tots.indexOf(playerId);
    if (index > -1) {
        data.tots.splice(index, 1);
    } else if (data.tots.length < 5) {
        data.tots.push(playerId);
    }
    saveData();
    renderTOTS();
    renderAdminLists();
}

// Utility functions
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-EG', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Update active nav link
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
    });
});

// Initialize on load
document.addEventListener('DOMContentLoaded', loadData);

// Handle Enter key in password field
document.getElementById('adminPassword')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') loginAdmin();
});

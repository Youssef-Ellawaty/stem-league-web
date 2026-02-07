// STEM League - Championship App
// Data Storage using Server API (data.json)

// Initialize data
const ADMIN_PASSWORD = 'stemleague2025';
const API_BASE = '/api';

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

// ============ PAGE NAVIGATION SYSTEM ============
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected page
    const pageId = pageName + '-page';
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
    }
    
    // Add active class to nav link
    const activeLink = document.querySelector(`[onclick*="showPage('${pageName}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Close mobile menu if open
    closeMobileMenu();
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// ============ MOBILE MENU ============
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    navLinks.classList.toggle('active');
    menuBtn.classList.toggle('active');
}

function closeMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    navLinks.classList.remove('active');
    menuBtn.classList.remove('active');
}

// ============ MATCH TABS SWITCHING ============
function switchMatchTab(button) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked tab
    button.classList.add('active');
    
    // Hide all match lists
    document.querySelectorAll('.matches-list').forEach(list => {
        list.classList.add('hidden');
    });
    
    // Show selected match list
    const tabName = button.getAttribute('data-tab');
    const listId = tabName + 'Matches';
    const list = document.getElementById(listId);
    if (list) {
        list.classList.remove('hidden');
    }
}

// Load data from server API فقط (بدون localStorage)
async function loadData() {
    try {
        const response = await fetch(`${API_BASE}/data`);
        if (response.ok) {
            const serverData = await response.json();
            if (serverData.teams && serverData.teams.length > 0) {
                data = serverData;
            } else {
                initSampleData();
            }
        } else {
            initSampleData();
        }
    } catch (error) {
        console.error('Error loading data from server:', error);
        initSampleData();
    }
    updateUI();
}

// Save data to server API فقط (بدون localStorage)
async function saveData() {
    try {
        const response = await fetch(`${API_BASE}/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Failed to save to server');
        }
        data.lastUpdate = new Date().toISOString();
    } catch (error) {
        console.error('Error saving data to server:', error);
    }
    updateDataInfo();
}

// Update data info display
function updateDataInfo() {
    const lastUpdate = data.lastUpdate;
    const lastUpdateEl = document.getElementById('lastUpdateTime');
    const dataSizeEl = document.getElementById('dataSize');
    
    if (lastUpdateEl && lastUpdate) {
        const date = new Date(lastUpdate);
        lastUpdateEl.textContent = date.toLocaleString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    if (dataSizeEl) {
        const dataStr = JSON.stringify(data);
        const sizeInBytes = new Blob([dataStr]).size;
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);
        dataSizeEl.textContent = sizeInKB + ' KB';
    }
}

// Export data as JSON file
function exportData() {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import data from JSON file
async function importData(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!importedData.teams || !importedData.players || !importedData.matches) {
                alert('ملف غير صالح: تأكد من أن الملف يحتوي على البيانات الصحيحة');
                return;
            }
            
            if (confirm('هل تريد استبدال جميع البيانات الحالية بالبيانات المستوردة؟')) {
                data = importedData;
                await saveData();
                updateUI();
                alert('تم استيراد البيانات بنجاح');
            }
        } catch (error) {
            alert('خطأ في قراءة الملف: تأكد من أن الملف بصيغة JSON صحيحة');
        }
    };
    reader.readAsText(file);
    
    // Reset input
    input.value = '';
}

// Clear all data
async function clearAllData() {
    if (confirm('هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء!')) {
        if (confirm('تأكيد نهائي: سيتم حذف جميع الفرق واللاعبين والمباريات والأخبار!')) {
            data = {
                teams: [],
                players: [],
                matches: [],
                rounds: [],
                news: [],
                tots: [],
                standings: { A: [], B: [] }
            };
            await saveData();
            updateUI();
            alert('تم مسح جميع البيانات');
        }
    }
}

// Initialize sample data
function initSampleData() {
    // Real teams
    data.teams = [
        { id: 1, name: 'King', group: 'A', logo: '👑' },
        { id: 2, name: 'صيادين البرايز', group: 'A', logo: '🎯' },
        { id: 3, name: 'Koom Elzawany Pro', group: 'A', logo: '🔥' },
        { id: 4, name: 'خدتك عليه', group: 'A', logo: '💪' },
        { id: 5, name: 'Kong', group: 'B', logo: '🦍' },
        { id: 6, name: '7enkesh FC', group: 'B', logo: '⚡' },
        { id: 7, name: 'جبناهم فيك', group: 'B', logo: '🏆' },
        { id: 8, name: 'خليها على الله', group: 'B', logo: '🌟' }
    ];

    // Real players with their actual positions وصور البطاقات
    data.players = [
        // Team 1: King
        { id: 1, teamId: 1, name: 'Ahmed Maher', position: 'FW', number: 9, photo: '/players/ahmed_maher-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 2, teamId: 1, name: 'Mohamed Elmasry', position: 'MF', number: 8, photo: '/players/mohamed_elmasry-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 3, teamId: 1, name: 'Mahmoud Saber', position: 'DF', number: 4, photo: '/players/mahmouf_saber-removebg-preview (1).png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 4, teamId: 1, name: 'Omar Bona', position: 'MF', number: 10, photo: '/players/omar_bona-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 5, teamId: 1, name: 'ELdegwy', position: 'GK', number: 1, photo: '/players/El-Degwy.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        // Team 2: صيادين البرايز
        { id: 6, teamId: 2, name: 'Amr Mohamed', position: 'MF', number: 8, photo: '/players/amr-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 7, teamId: 2, name: 'Yassin Hossam', position: 'FW', number: 9, photo: '/players/Yassin Hossam.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 8, teamId: 2, name: 'Hamo Ayman', position: 'MF', number: 10, photo: '/players/hamo_ayman-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 9, teamId: 2, name: 'Ali Elsaqa', position: 'DF', number: 4, photo: '/players/ali_elsaqa-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 10, teamId: 2, name: 'Youssef Ragab', position: 'GK', number: 1, photo: '/players/youssef_ragab-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        // Team 3: Koom Elzawany Pro
        { id: 11, teamId: 3, name: 'Mohamed Ashraf', position: 'FW', number: 9, photo: '/players/mohamed_ashraf-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 12, teamId: 3, name: 'Sherbo', position: 'MF', number: 8, photo: '/players/sherbo-removebg-preview (1).png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 13, teamId: 3, name: 'Omar Farag', position: 'DF', number: 4, photo: '/players/omar_farag-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 14, teamId: 3, name: 'Ali Arada', position: 'DF', number: 5, photo: '/players/ali_abdelmen3em-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 15, teamId: 3, name: 'Ammar', position: 'GK', number: 1, photo: '/players/ammar-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        // Team 4: خدتك عليه
        { id: 16, teamId: 4, name: 'Eyad', position: 'FW', number: 9, photo: '/players/eyad-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 17, teamId: 4, name: '3ayad', position: 'MF', number: 8, photo: '/players/Mo 3yaad (1).png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 18, teamId: 4, name: 'Zar3a', position: 'DF', number: 4, photo: '/players/youssef_gaber-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 19, teamId: 4, name: '7anafy', position: 'DF', number: 5, photo: '/players/ahmed_hanafi-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 20, teamId: 4, name: '7omos', position: 'GK', number: 1, photo: '/players/ahmed_adel-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        // Team 5: Kong
        { id: 21, teamId: 5, name: 'Mo Yasser', position: 'MF', number: 8, photo: '/players/Mo Yasser.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 22, teamId: 5, name: 'AbdelKareem', position: 'FW', number: 9, photo: '/players/abdelkareem-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 23, teamId: 5, name: 'Ellawaty', position: 'DF', number: 4, photo: '/players/Jo Ellawaty (1).png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 24, teamId: 5, name: 'Karezma', position: 'DF', number: 5, photo: '/players/karizma-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 25, teamId: 5, name: 'El4arqawy', position: 'GK', number: 1, photo: '/players/el4arqawy-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        // Team 6: 7enkesh FC
        { id: 26, teamId: 6, name: 'Zoz AbdelKareem', position: 'FW', number: 9, photo: '/players/zoz_abdelkareem-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 27, teamId: 6, name: 'Tharwat', position: 'MF', number: 8, photo: '/players/ahmed_tharwat-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 28, teamId: 6, name: 'A7med Ayman', position: 'MF', number: 10, photo: '/players/ahmed_ayman-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 29, teamId: 6, name: 'Osos', position: 'DF', number: 4, photo: '/players/osos-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 30, teamId: 6, name: 'Bahrawy', position: 'GK', number: 1, photo: '/players/elbahrawy-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        // Team 7: جبناهم فيك
        { id: 31, teamId: 7, name: 'Bavly Remon', position: 'FW', number: 9, photo: '/players/bavly-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 32, teamId: 7, name: 'Salem', position: 'FW', number: 11, photo: '/players/salem-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 33, teamId: 7, name: 'Turkey', position: 'MF', number: 8, photo: '/players/gasser_elturkey-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 34, teamId: 7, name: 'Omar Kamal', position: 'DF', number: 4, photo: '/players/omar_kamal-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 35, teamId: 7, name: 'A7med Reda', position: 'GK', number: 1, photo: '/players/ahmed_reda-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        // Team 8: خليها على الله
        { id: 36, teamId: 8, name: 'Omar Tamer', position: 'FW', number: 9, photo: '/players/omar_tamer-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 37, teamId: 8, name: 'Seif', position: 'MF', number: 8, photo: '/players/seif_abdelazeem-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 38, teamId: 8, name: 'M3z', position: 'MF', number: 10, photo: '/players/m3z-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 39, teamId: 8, name: 'Youssef Ali', position: 'DF', number: 4, photo: '/players/youssef_ali-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        { id: 40, teamId: 8, name: 'George Remon', position: 'GK', number: 1, photo: '/players/george_remon-removebg-preview.png', goals: 0, assists: 0, yellowCards: 0, redCards: 0 }
    ];

    // Rounds
    data.rounds = [
        { id: 1, name: 'الجولة الأولى' },
        { id: 2, name: 'الجولة الثانية' },
        { id: 3, name: 'الجولة الثالثة' }
    ];

    // Empty matches - to be added by admin
    data.matches = [];

    // Welcome news
    data.news = [
        {
            id: 1,
            title: 'انطلاق بطولة STEM League للموسم الجديد',
            content: 'ستنطلق اليوم فعاليات بطولة STEM League في موسمها الجديد بمشاركة 8 فرق متنافسة على اللقب.',
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
            date: '2026-02-09'
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
    renderStatistics();
    updateDataInfo();
}

// Render statistics page
function renderStatistics() {
    // Top Scorers
    const topScorers = [...data.players]
        .filter(p => p.goals > 0)
        .sort((a, b) => b.goals - a.goals)
        .slice(0, 10);
    
    const topScorersContainer = document.getElementById('topScorers');
    if (topScorersContainer) {
        topScorersContainer.innerHTML = topScorers.length === 0 
            ? '<div class="stat-empty">لا توجد أهداف مسجلة بعد</div>'
            : topScorers.map((player, index) => {
                const team = data.teams.find(t => t.id === player.teamId);
                return `
                    <div class="stat-row" onclick="showPlayerCard(${player.id})">
                        <span class="stat-rank ${index < 3 ? 'top-' + (index + 1) : ''}">${index + 1}</span>
                        <div class="stat-player-info">
                            <div class="stat-player-avatar">
                                ${player.photo ? `<img src="${player.photo}" alt="${player.name}">` : player.number}
                            </div>
                            <div class="stat-player-details">
                                <span class="stat-player-name">${player.name}</span>
                                <span class="stat-player-team">${team?.name || ''}</span>
                            </div>
                        </div>
                        <span class="stat-value goals">${player.goals}</span>
                    </div>
                `;
            }).join('');
    }
    
    // Top Assists
    const topAssists = [...data.players]
        .filter(p => p.assists > 0)
        .sort((a, b) => b.assists - a.assists)
        .slice(0, 10);
    
    const topAssistsContainer = document.getElementById('topAssists');
    if (topAssistsContainer) {
        topAssistsContainer.innerHTML = topAssists.length === 0 
            ? '<div class="stat-empty">لا توجد تمريرات حاسمة بعد</div>'
            : topAssists.map((player, index) => {
                const team = data.teams.find(t => t.id === player.teamId);
                return `
                    <div class="stat-row" onclick="showPlayerCard(${player.id})">
                        <span class="stat-rank ${index < 3 ? 'top-' + (index + 1) : ''}">${index + 1}</span>
                        <div class="stat-player-info">
                            <div class="stat-player-avatar">
                                ${player.photo ? `<img src="${player.photo}" alt="${player.name}">` : player.number}
                            </div>
                            <div class="stat-player-details">
                                <span class="stat-player-name">${player.name}</span>
                                <span class="stat-player-team">${team?.name || ''}</span>
                            </div>
                        </div>
                        <span class="stat-value assists">${player.assists}</span>
                    </div>
                `;
            }).join('');
    }
    
    // Calculate team stats from matches
    const teamStats = {};
    data.teams.forEach(team => {
        teamStats[team.id] = {
            teamId: team.id,
            teamName: team.name,
            logo: team.logo,
            wins: 0,
            cleanSheets: 0
        };
    });
    
    data.matches.filter(m => m.status === 'finished').forEach(match => {
        // Count wins
        if (match.score1 > match.score2) {
            if (teamStats[match.team1Id]) teamStats[match.team1Id].wins++;
        } else if (match.score2 > match.score1) {
            if (teamStats[match.team2Id]) teamStats[match.team2Id].wins++;
        }
        
        // Count clean sheets
        if (match.score2 === 0 && teamStats[match.team1Id]) {
            teamStats[match.team1Id].cleanSheets++;
        }
        if (match.score1 === 0 && teamStats[match.team2Id]) {
            teamStats[match.team2Id].cleanSheets++;
        }
    });
    
    // Most Wins
    const mostWins = Object.values(teamStats)
        .filter(t => t.wins > 0)
        .sort((a, b) => b.wins - a.wins);
    
    const mostWinsContainer = document.getElementById('mostWins');
    if (mostWinsContainer) {
        mostWinsContainer.innerHTML = mostWins.length === 0 
            ? '<div class="stat-empty">لا توجد انتصارات بعد</div>'
            : mostWins.map((team, index) => `
                <div class="stat-row team-row">
                    <span class="stat-rank ${index < 3 ? 'top-' + (index + 1) : ''}">${index + 1}</span>
                    <div class="stat-team-info">
                        <div class="stat-team-logo">${team.logo}</div>
                        <span class="stat-team-name">${team.teamName}</span>
                    </div>
                    <span class="stat-value wins">${team.wins}</span>
                </div>
            `).join('');
    }
    
    // Most Clean Sheets
    const mostCleanSheets = Object.values(teamStats)
        .filter(t => t.cleanSheets > 0)
        .sort((a, b) => b.cleanSheets - a.cleanSheets);
    
    const cleanSheetsContainer = document.getElementById('mostCleanSheets');
    if (cleanSheetsContainer) {
        cleanSheetsContainer.innerHTML = mostCleanSheets.length === 0 
            ? '<div class="stat-empty">لا توجد شباك نظيفة بعد</div>'
            : mostCleanSheets.map((team, index) => `
                <div class="stat-row team-row">
                    <span class="stat-rank ${index < 3 ? 'top-' + (index + 1) : ''}">${index + 1}</span>
                    <div class="stat-team-info">
                        <div class="stat-team-logo">${team.logo}</div>
                        <span class="stat-team-name">${team.teamName}</span>
                    </div>
                    <span class="stat-value clean-sheets">${team.cleanSheets}</span>
                </div>
            `).join('');
    }
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
    const homeGrid = document.getElementById('homeNewsGrid');
    
    if (data.news.length === 0) {
        const emptyHtml = `
            <div class="empty-state">
                <div class="empty-state-icon">📰</div>
                <p class="empty-state-text">لا توجد أخبار حالياً</p>
            </div>
        `;
        if (homeGrid) homeGrid.innerHTML = emptyHtml;
        return;
    }
    
    const newsHtml = data.news.map(news => `
        <article class="news-card">
            <div style="overflow: hidden; border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
                <img src="${news.image}" alt="${news.title}" class="news-image" onerror="this.src='https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop'" loading="lazy">
            </div>
            <div class="news-content">
                <time class="news-date">${formatDate(news.date)}</time>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.content}</p>
            </div>
        </article>
    `).join('');
    
    if (homeGrid) homeGrid.innerHTML = newsHtml;
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
            <article class="match-card" onclick="showMatchDetails(${match.id})" tabindex="0" role="button" aria-label="عرض تفاصيل المباراة">
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
            </article>
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
    
    // ترتيب: حارس ثم مدافعين ثم وسط ثم مهاجمين لضمان توزيع صحيح
    const order = { GK: 0, DF: 1, MF: 2, FW: 3 };
    const sortedPlayers = [...teamPlayers].sort((a, b) => order[a.position] - order[b.position]);
    
    const positionCounts = {
        GK: sortedPlayers.filter(p => p.position === 'GK').length,
        DF: sortedPlayers.filter(p => p.position === 'DF').length,
        MF: sortedPlayers.filter(p => p.position === 'MF').length,
        FW: sortedPlayers.filter(p => p.position === 'FW').length
    };
    
    function getPositionCoords(position, count) {
        const spread = (n, leftCenter, top) => {
            if (n <= 0) return [];
            if (n === 1) return [{ left: '50%', top }];
            const positions = [];
            const step = 40 / (n - 1);
            for (let i = 0; i < n; i++) {
                const pct = 30 + (i * step);
                positions.push({ left: pct + '%', top });
            }
            return positions;
        };
        const coords = {
            GK: { 1: [{ left: '50%', top: '88%' }] },
            DF: {
                1: [{ left: '50%', top: '70%' }],
                2: [{ left: '30%', top: '70%' }, { left: '70%', top: '70%' }],
                3: [{ left: '25%', top: '70%' }, { left: '50%', top: '70%' }, { left: '75%', top: '70%' }],
                4: [{ left: '20%', top: '70%' }, { left: '40%', top: '70%' }, { left: '60%', top: '70%' }, { left: '80%', top: '70%' }],
                5: spread(5, '50%', '70%')
            },
            MF: {
                1: [{ left: '50%', top: '45%' }],
                2: [{ left: '30%', top: '45%' }, { left: '70%', top: '45%' }],
                3: [{ left: '25%', top: '45%' }, { left: '50%', top: '45%' }, { left: '75%', top: '45%' }],
                4: [{ left: '20%', top: '45%' }, { left: '40%', top: '45%' }, { left: '60%', top: '45%' }, { left: '80%', top: '45%' }],
                5: spread(5, '50%', '45%')
            },
            FW: {
                1: [{ left: '50%', top: '18%' }],
                2: [{ left: '30%', top: '18%' }, { left: '70%', top: '18%' }],
                3: [{ left: '25%', top: '18%' }, { left: '50%', top: '18%' }, { left: '75%', top: '18%' }],
                4: [{ left: '20%', top: '18%' }, { left: '40%', top: '18%' }, { left: '60%', top: '18%' }, { left: '80%', top: '18%' }],
                5: spread(5, '50%', '18%')
            }
        };
        const arr = coords[position];
        if (!arr) return [];
        const list = arr[Math.min(count, 5)] || arr[1] || arr[Object.keys(arr)[0]];
        return Array.isArray(list) ? list : [];
    }
    
    let positionIndex = { GK: 0, DF: 0, MF: 0, FW: 0 };
    
    formation.innerHTML = sortedPlayers.map(player => {
        const count = positionCounts[player.position];
        const coords = getPositionCoords(player.position, count);
        const index = positionIndex[player.position];
        positionIndex[player.position]++;
        
        if (!coords || !coords[index]) return '';
        
        return `
            <div class="player-spot" style="left: ${coords[index].left}; top: ${coords[index].top}; transform: translate(-50%, -50%);" onclick="showPlayerCard(${player.id})" tabindex="0" role="button" aria-label="عرض بطاقة ${player.name}">
                <div class="player-avatar ${player.photo ? 'player-avatar--photo' : ''}">
                    ${player.photo ? `<img src="${player.photo}" alt="${player.name}" class="player-field-photo">` : `<span>${player.number}</span>`}
                </div>
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
            <div class="tots-card" onclick="showPlayerCard(${player.id})" tabindex="0" role="button" aria-label="عرض بطاقة ${player.name}">
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
        <div class="player-card-avatar">
            ${player.photo ? `<img src="${player.photo}" alt="${player.name}" class="player-photo">` : `<span class="player-number-display">${player.number}</span>`}
        </div>
        <h2 class="player-card-name" id="playerModalTitle">${player.name}</h2>
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
            <div class="player-stat">
                <div class="player-stat-value">${player.redCards}</div>
                <div class="player-stat-label">🟥 طرد</div>
            </div>
        </div>
    `;
    
    document.getElementById('playerModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePlayerModal() {
    document.getElementById('playerModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Match details modal
function showMatchDetails(matchId) {
    const match = data.matches.find(m => m.id === matchId);
    if (!match) return;
    
    const team1 = data.teams.find(t => t.id === match.team1Id);
    const team2 = data.teams.find(t => t.id === match.team2Id);
    
    // Separate events by team and type
    const team1Goals = [];
    const team2Goals = [];
    const otherEvents = [];
    
    if (match.events && match.events.length > 0) {
        match.events.forEach(event => {
            const player = data.players.find(p => p.id === event.playerId);
            if (player) {
                if (event.type === 'goal') {
                    if (player.teamId === match.team1Id) {
                        team1Goals.push({ ...event, player });
                    } else {
                        team2Goals.push({ ...event, player });
                    }
                } else {
                    otherEvents.push({ ...event, player });
                }
            }
        });
    }
    
    // Build scorers display
    let scorersHtml = '';
    if (team1Goals.length > 0 || team2Goals.length > 0) {
        scorersHtml = `
            <div class="match-scorers">
                <div class="scorers-team">
                    ${team1Goals.map(g => `
                        <div class="scorer-item">
                            <span class="scorer-name">${g.player.name}</span>
                            <span class="scorer-minute">${g.minute}'</span>
                        </div>
                    `).join('')}
                </div>
                <div class="scorers-divider">⚽</div>
                <div class="scorers-team">
                    ${team2Goals.map(g => `
                        <div class="scorer-item">
                            <span class="scorer-minute">${g.minute}'</span>
                            <span class="scorer-name">${g.player.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Build other events display
    let eventsHtml = '';
    if (otherEvents.length > 0) {
        eventsHtml = `
            <div class="match-events">
                <h4>أحداث أخرى</h4>
                ${otherEvents.map(event => {
                    const eventIcon = event.type === 'assist' ? '👟' : event.type === 'yellowCard' ? '🟨' : '🟥';
                    const eventLabel = event.type === 'assist' ? 'تمريرة حاسمة' : event.type === 'yellowCard' ? 'إنذار' : 'طرد';
                    return `
                        <div class="event-item">
                            <span class="event-icon">${eventIcon}</span>
                            <span class="event-time">${event.minute}'</span>
                            <span class="event-player">${event.player.name}</span>
                            <span class="event-label">${eventLabel}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    // Match status badge
    const statusBadge = match.status === 'live' 
        ? '<div class="match-status-badge live">🔴 جارية</div>'
        : match.status === 'finished' 
        ? '<div class="match-status-badge finished">انتهت</div>'
        : '<div class="match-status-badge upcoming">لم تُلعب</div>';
    
    document.getElementById('matchDetails').innerHTML = `
        ${statusBadge}
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
        <p style="color: var(--text-secondary); margin-bottom: 16px; text-align: center;">${formatDateTime(match.date)}</p>
        ${scorersHtml}
        ${eventsHtml}
    `;
    
    document.getElementById('matchModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMatchModal() {
    document.getElementById('matchModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Admin functions
function openAdminLogin() {
    document.getElementById('adminLoginModal').classList.add('active');
    document.getElementById('adminPassword').value = '';
    document.getElementById('loginError').textContent = '';
    document.body.style.overflow = 'hidden';
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').classList.remove('active');
    document.body.style.overflow = '';
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
    document.body.style.overflow = 'hidden';
    renderAdminLists();
    switchAdminTab('matches');
}

function closeAdminPanel() {
    document.getElementById('adminPanel').classList.remove('active');
    document.body.style.overflow = '';
}

// Admin tabs - switch which panel is visible
function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    const activeBtn = document.querySelector(`.admin-tab[onclick*="switchAdminTab('${tabName}')"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
    
    const panelIds = {
        matches: ['roundsPanel', 'matchesAdminPanel'],
        teams: ['teamsAdminPanel'],
        news: ['newsAdminPanel'],
        tots: ['totsAdminPanel'],
        data: ['dataAdminPanel']
    };
    const ids = panelIds[tabName];
    if (ids) {
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('hidden');
        });
    }
}

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
    document.body.style.overflow = 'hidden';
}

function closeMatchEdit() {
    document.getElementById('matchEditModal').classList.remove('active');
    document.body.style.overflow = '';
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
    const photo = document.getElementById('playerPhoto')?.value.trim() || '';
    
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
        photo,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
    });
    
    saveData();
    document.getElementById('playerName').value = '';
    document.getElementById('playerNumber').value = '';
    if (document.getElementById('playerPhoto')) {
        document.getElementById('playerPhoto').value = '';
    }
    renderAdminLists();
}

// Image source toggle state
let currentImageSource = 'url';
let uploadedImageData = null;

function toggleImageSource(source) {
    currentImageSource = source;
    
    // Update toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.toggle-btn[onclick*="${source}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Show/hide inputs
    const urlInput = document.getElementById('imageUrlInput');
    const fileInput = document.getElementById('imageFileInput');
    
    if (source === 'url') {
        if (urlInput) urlInput.classList.remove('hidden');
        if (fileInput) fileInput.classList.add('hidden');
    } else {
        if (urlInput) urlInput.classList.add('hidden');
        if (fileInput) fileInput.classList.remove('hidden');
    }
}

function handleImageUpload(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImageData = e.target.result;
            const preview = document.getElementById('imagePreview');
            const previewImg = document.getElementById('previewImg');
            if (previewImg) previewImg.src = uploadedImageData;
            if (preview) preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function removeImagePreview() {
    uploadedImageData = null;
    const fileInput = document.getElementById('newsImageFile');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    if (fileInput) fileInput.value = '';
    if (preview) preview.classList.add('hidden');
    if (previewImg) previewImg.src = '';
}

function addNews() {
    const title = document.getElementById('newsTitle').value.trim();
    const content = document.getElementById('newsContent').value.trim();
    
    let image = '';
    if (currentImageSource === 'url') {
        image = document.getElementById('newsImage').value.trim();
    } else {
        image = uploadedImageData || '';
    }
    
    if (!title || !content) {
        return alert('أدخل العنوان والمحتوى');
    }
    
    const id = Date.now();
    const date = new Date().toISOString().split('T')[0];
    
    data.news.unshift({ 
        id, 
        title, 
        content, 
        image: image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', 
        date 
    });
    
    saveData();
    
    // Reset form
    document.getElementById('newsTitle').value = '';
    document.getElementById('newsContent').value = '';
    document.getElementById('newsImage').value = '';
    removeImagePreview();
    
    updateUI();
}

function deleteNews(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;
    data.news = data.news.filter(n => n.id !== id);
    saveData();
    updateUI();
}

// ============ TEAM SELECTION ============
function selectTeam(teamId) {
    if (!teamId) {
        document.getElementById('playersFormation').innerHTML = '';
        return;
    }
    
    const team = data.teams.find(t => t.id == teamId);
    if (!team) return;
    
    renderTeamFormation(parseInt(teamId));
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

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Close modals on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePlayerModal();
        closeMatchModal();
        closeAdminLogin();
        closeMatchEdit();
        if (document.getElementById('adminPanel').classList.contains('active')) {
            closeAdminPanel();
        }
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', loadData);

// Handle Enter key in password field
document.getElementById('adminPassword')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') loginAdmin();
});

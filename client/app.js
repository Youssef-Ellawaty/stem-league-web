const API_BASE = '/api';

// State
let currentUser = null;

// Navigation
function navigate(page) {
  const main = document.getElementById('main-content');
  main.innerHTML = '';
  
  switch(page) {
    case 'home': renderHome(); break;
    case 'matches': renderMatches(); break;
    case 'teams': renderTeams(); break;
    case 'standings': renderStandings(); break;
    case 'admin': renderAdmin(); break;
    case 'login': window.location.href = '/api/login'; break;
    default: renderHome();
  }
}

function logout() {
  window.location.href = '/api/logout';
}

// Auth Check
async function checkAuth() {
  try {
    const res = await fetch('/api/auth/user');
    if (res.ok) {
      currentUser = await res.json();
      document.getElementById('login-link').style.display = 'none';
      document.getElementById('logout-link').style.display = 'inline';
      document.getElementById('admin-link').style.display = 'inline';
    } else {
      document.getElementById('login-link').style.display = 'inline';
      document.getElementById('logout-link').style.display = 'none';
      document.getElementById('admin-link').style.display = 'none';
    }
  } catch (e) {
    console.error("Auth check failed", e);
  }
}

// Components
async function renderHome() {
  const main = document.getElementById('main-content');
  main.innerHTML = '<h2>Latest News</h2><div class="news-grid" id="news-container">Loading...</div>';
  
  try {
    const res = await fetch(`${API_BASE}/news`);
    const news = await res.json();
    
    const container = document.getElementById('news-container');
    container.innerHTML = news.map(item => `
      <div class="card news-item">
        <img src="${item.imageUrl}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `).join('');
  } catch (e) {
    main.innerHTML = '<p>Error loading news.</p>';
  }
}

async function renderMatches() {
  const main = document.getElementById('main-content');
  main.innerHTML = '<h2>Matches</h2><div class="match-list" id="match-container">Loading...</div>';
  
  try {
    const res = await fetch(`${API_BASE}/matches`);
    const matches = await res.json();
    
    // Fetch team names helper
    const teamsRes = await fetch(`${API_BASE}/teams`);
    const teams = await teamsRes.json();
    const teamMap = {};
    teams.forEach(t => teamMap[t.id] = t);

    const container = document.getElementById('match-container');
    container.innerHTML = matches.map(m => `
      <div class="match-card">
        <div class="team-home">${teamMap[m.homeTeamId]?.name || 'Home'}</div>
        <div class="score">
          <span class="team-score">${m.homeScore}</span> - <span class="team-score">${m.awayScore}</span>
        </div>
        <div class="team-away">${teamMap[m.awayTeamId]?.name || 'Away'}</div>
        <div class="status-badge status-${m.status}">${m.status}</div>
      </div>
    `).join('');
  } catch (e) {
    main.innerHTML = '<p>Error loading matches.</p>';
  }
}

async function renderTeams() {
  const main = document.getElementById('main-content');
  main.innerHTML = '<h2>Teams</h2><div class="news-grid" id="team-container">Loading...</div>';
  
  try {
    const res = await fetch(`${API_BASE}/teams`);
    const teams = await res.json();
    
    const container = document.getElementById('team-container');
    container.innerHTML = teams.map(t => `
      <div class="card" onclick="viewTeam(${t.id})">
        <img src="${t.logoUrl}" style="width:50px;height:50px;">
        <h3>${t.name}</h3>
        <p>Group ${t.group}</p>
      </div>
    `).join('');
  } catch (e) {
    main.innerHTML = '<p>Error loading teams.</p>';
  }
}

async function renderStandings() {
   const main = document.getElementById('main-content');
   main.innerHTML = '<h2>Standings</h2><div id="standings-container">Loading...</div>';
   
   try {
     const res = await fetch(`${API_BASE}/teams`);
     const teams = await res.json();
     
     // Sort by points
     teams.sort((a,b) => b.points - a.points);
     
     const container = document.getElementById('standings-container');
     container.innerHTML = `
       <table style="width:100%; text-align:left;">
         <thead>
           <tr><th>Team</th><th>W</th><th>D</th><th>L</th><th>Pts</th></tr>
         </thead>
         <tbody>
           ${teams.map(t => `
             <tr>
               <td>${t.name}</td>
               <td>${t.wins}</td>
               <td>${t.draws}</td>
               <td>${t.losses}</td>
               <td>${t.points}</td>
             </tr>
           `).join('')}
         </tbody>
       </table>
     `;
   } catch (e) {
     main.innerHTML = '<p>Error loading standings.</p>';
   }
}

async function renderAdmin() {
  if (!currentUser) {
    navigate('login');
    return;
  }
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <h2>Admin Panel</h2>
    <div class="card">
      <h3>Add News</h3>
      <form onsubmit="createNews(event)">
        <div class="form-group"><label>Title</label><input name="title" required></div>
        <div class="form-group"><label>Description</label><input name="description" required></div>
        <div class="form-group"><label>Image URL</label><input name="imageUrl" required></div>
        <button type="submit" class="btn">Add News</button>
      </form>
    </div>
  `;
}

async function createNews(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  
  try {
    await fetch(`${API_BASE}/news`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    alert('News added!');
    e.target.reset();
  } catch (err) {
    alert('Failed to add news');
  }
}

// Modal Helpers
function openModal(content) {
  document.getElementById('modal-body').innerHTML = content;
  document.getElementById('modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// Init
window.onload = async () => {
  await checkAuth();
  navigate('home');
};

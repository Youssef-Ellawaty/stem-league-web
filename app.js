const API_BASE = '/api';

// State
let currentUser = null;

// Navigation
function navigate(page) {
  const links = document.querySelectorAll('nav a');
  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('onclick').includes(page)) link.classList.add('active');
  });

  const main = document.getElementById('main-content');
  main.style.opacity = '0';
  
  setTimeout(async () => {
    main.innerHTML = '';
    switch(page) {
      case 'home': await renderHome(); break;
      case 'matches': await renderMatches(); break;
      case 'teams': await renderTeams(); break;
      case 'standings': await renderStandings(); break;
      case 'admin': await renderAdmin(); break;
      default: await renderHome();
    }
    main.style.opacity = '1';
  }, 300);
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
      document.getElementById('logout-link').style.display = 'inline-block';
      document.getElementById('admin-link').style.display = 'inline-block';
    } else {
      document.getElementById('login-link').style.display = 'inline-block';
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
  main.innerHTML = '<h2>Latest Intelligence</h2><div class="news-grid" id="news-container"><div class="loading">Syncing Feed...</div></div>';
  
  try {
    const res = await fetch(`${API_BASE}/news`);
    const news = await res.json();
    
    const container = document.getElementById('news-container');
    container.innerHTML = news.map(item => `
      <div class="card news-item">
        <img src="${item.imageUrl}" alt="${item.title}">
        <div class="card-content">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      </div>
    `).join('');
  } catch (e) {
    main.innerHTML = '<p>Connection Error.</p>';
  }
}

async function renderMatches() {
  const main = document.getElementById('main-content');
  main.innerHTML = '<h2>Combat Schedule</h2><div class="match-list" id="match-container">Loading...</div>';
  
  try {
    const res = await fetch(`${API_BASE}/matches`);
    const matches = await res.json();
    const teamsRes = await fetch(`${API_BASE}/teams`);
    const teams = await teamsRes.json();
    const teamMap = {};
    teams.forEach(t => teamMap[t.id] = t);

    const container = document.getElementById('match-container');
    container.innerHTML = matches.map(m => `
      <div class="match-card">
        <div class="team-info team-home">
          <span class="team-name">${teamMap[m.homeTeamId]?.name || 'Home'}</span>
        </div>
        <div class="score-box">${m.homeScore} : ${m.awayScore}</div>
        <div class="team-info team-away">
          <span class="team-name">${teamMap[m.awayTeamId]?.name || 'Away'}</span>
        </div>
        <div class="status-badge status-${m.status}">${m.status}</div>
      </div>
    `).join('');
  } catch (e) {
    main.innerHTML = '<p>Schedule Link Offline.</p>';
  }
}

async function renderTeams() {
  const main = document.getElementById('main-content');
  main.innerHTML = '<h2>Active Units</h2><div class="news-grid" id="team-container">Loading...</div>';
  
  try {
    const res = await fetch(`${API_BASE}/teams`);
    const teams = await res.json();
    
    const container = document.getElementById('team-container');
    container.innerHTML = teams.map(t => `
      <div class="card team-card">
        <div class="card-content">
          <img src="${t.logoUrl}" style="width:100px; height:100px; margin-bottom: 1rem; filter: drop-shadow(0 0 10px var(--primary-glow))">
          <h3>${t.name}</h3>
          <p>Sector: ${t.group}</p>
          <p>Combat Points: ${t.points}</p>
        </div>
      </div>
    `).join('');
  } catch (e) {
    main.innerHTML = '<p>Unit Database Error.</p>';
  }
}

async function renderStandings() {
   const main = document.getElementById('main-content');
   main.innerHTML = '<h2>Global Rankings</h2><div class="table-container" id="standings-container">Loading...</div>';
   
   try {
     const res = await fetch(`${API_BASE}/teams`);
     const teams = await res.json();
     teams.sort((a,b) => b.points - a.points);
     
     const container = document.getElementById('standings-container');
     container.innerHTML = `
       <table>
         <thead>
           <tr><th>Unit</th><th>Wins</th><th>Losses</th><th>Power</th></tr>
         </thead>
         <tbody>
           ${teams.map(t => `
             <tr>
               <td>${t.name}</td>
               <td>${t.wins}</td>
               <td>${t.losses}</td>
               <td>${t.points} Pts</td>
             </tr>
           `).join('')}
         </tbody>
       </table>
     `;
   } catch (e) {
     main.innerHTML = '<p>Ranking System Failure.</p>';
   }
}

async function renderAdmin() {
  if (!currentUser) {
    window.location.href = '/api/login';
    return;
  }
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <h2>Command Center</h2>
    <div class="card" style="max-width: 600px; margin: 0 auto;">
      <div class="card-content">
        <h3>Broadcast News</h3>
        <form onsubmit="createNews(event)">
          <div class="form-group"><label>Headline</label><input name="title" required></div>
          <div class="form-group"><label>Data Summary</label><input name="description" required></div>
          <div class="form-group"><label>Visual Feed URL</label><input name="imageUrl" required></div>
          <button type="submit" class="btn">Transmit</button>
        </form>
      </div>
    </div>
  `;
}

async function createNews(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  
  try {
    const res = await fetch(`${API_BASE}/news`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    if (res.ok) {
      alert('Transmission Successful');
      e.target.reset();
    } else {
      alert('Transmission Blocked');
    }
  } catch (err) {
    alert('Communication Link Error');
  }
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// Init
window.onload = async () => {
  document.getElementById('main-content').style.transition = 'opacity 0.3s ease';
  await checkAuth();
  navigate('home');
};

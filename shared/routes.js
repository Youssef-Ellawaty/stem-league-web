export const errorSchemas = {
  validation: {
    message: null,
    field: null,
  },
  notFound: {
    message: null,
  },
  internal: {
    message: null,
  },
};

export const api = {
  teams: {
    list: {
      method: 'GET',
      path: '/api/teams',
    },
    get: {
      method: 'GET',
      path: '/api/teams/:id',
    },
    create: {
      method: 'POST',
      path: '/api/teams',
    },
    update: {
      method: 'PUT',
      path: '/api/teams/:id',
    },
    delete: {
      method: 'DELETE',
      path: '/api/teams/:id',
    },
  },
  players: {
    list: {
      method: 'GET',
      path: '/api/players',
    },
    get: {
      method: 'GET',
      path: '/api/players/:id',
    },
    create: {
      method: 'POST',
      path: '/api/players',
    },
    update: {
      method: 'PUT',
      path: '/api/players/:id',
    },
    delete: {
      method: 'DELETE',
      path: '/api/players/:id',
    },
  },
  matches: {
    list: {
      method: 'GET',
      path: '/api/matches',
    },
    get: {
      method: 'GET',
      path: '/api/matches/:id',
    },
    create: {
      method: 'POST',
      path: '/api/matches',
    },
    update: {
      method: 'PUT',
      path: '/api/matches/:id',
    },
    delete: {
      method: 'DELETE',
      path: '/api/matches/:id',
    },
  },
  matchEvents: {
    list: {
      method: 'GET',
      path: '/api/matches/:matchId/events',
    },
    create: {
      method: 'POST',
      path: '/api/matches/:matchId/events',
    },
    delete: {
      method: 'DELETE',
      path: '/api/match-events/:id',
    },
  },
  news: {
    list: {
      method: 'GET',
      path: '/api/news',
    },
    get: {
      method: 'GET',
      path: '/api/news/:id',
    },
    create: {
      method: 'POST',
      path: '/api/news',
    },
    update: {
      method: 'PUT',
      path: '/api/news/:id',
    },
    delete: {
      method: 'DELETE',
      path: '/api/news/:id',
    },
  },
};

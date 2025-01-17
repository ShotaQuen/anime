const http = require('http');
const fs = require('fs');
const path = require('path');

// Path to store anime data
const animeDataPath = path.join(__dirname, 'data', 'anime.json');

// Read anime data from JSON file
const getAnimeData = () => {
  return JSON.parse(fs.readFileSync(animeDataPath, 'utf8'));
};

// Save anime data to JSON file
const saveAnimeData = (data) => {
  fs.writeFileSync(animeDataPath, JSON.stringify(data, null, 2), 'utf8');
};

// Serve static files (HTML, CSS, JS)
const serveStaticFile = (res, filePath, contentType) => {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end(`Error: ${err}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
};

// Server request handler
const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  // Serve static files (HTML, CSS, JS)
  if (url === '/' || url.endsWith('.html')) {
    serveStaticFile(res, path.join(__dirname, 'views', 'index.html'), 'text/html');
  } else if (url.endsWith('.css')) {
    serveStaticFile(res, path.join(__dirname, 'public', 'css', 'tailwind.css'), 'text/css');
  } else if (url.endsWith('.js')) {
    serveStaticFile(res, path.join(__dirname, 'public', 'js', 'app.js'), 'application/javascript');
  } else if (url === '/api/anime' && method === 'GET') {
    // API: GET /api/anime - Fetch all anime
    const data = getAnimeData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } else if (url.match(/^\/api\/anime\/(\d+)\/like$/) && method === 'POST') {
    // API: POST /api/anime/:id/like - Add 1 like to anime by ID
    const id = url.split('/')[3];
    const data = getAnimeData();
    const anime = data.find(a => a.id == id);
    if (anime) {
      anime.likes++;
      saveAnimeData(data);
      res.writeHead(200);
      res.end();
    }
  } else if (url.match(/^\/api\/anime\/(\d+)\/dislike$/) && method === 'POST') {
    // API: POST /api/anime/:id/dislike - Add 1 dislike to anime by ID
    const id = url.split('/')[3];
    const data = getAnimeData();
    const anime = data.find(a => a.id == id);
    if (anime) {
      anime.dislikes++;
      saveAnimeData(data);
      res.writeHead(200);
      res.end();
    }
  } else if (url.match(/^\/api\/anime\/(\d+)\/comment$/) && method === 'POST') {
    // API: POST /api/anime/:id/comment - Add comment to anime
    const id = url.split('/')[3];
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      const data = getAnimeData();
      const anime = data.find(a => a.id == id);
      if (anime) {
        const comment = JSON.parse(body);
        anime.comments.push(comment);
        saveAnimeData(data);
        res.writeHead(200);
        res.end();
      }
    });
  } else if (url.match(/^\/api\/anime\/(\d+)\/episode\/(\d+)\/comment$/) && method === 'POST') {
    // API: POST /api/anime/:id/episode/:ep/comment - Add comment to anime episode
    const [ , id, ep ] = url.split('/');
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      const data = getAnimeData();
      const anime = data.find(a => a.id == id);
      if (anime) {
        const episode = anime.episodes.find(e => e.episode == ep);
        if (episode) {
          const comment = JSON.parse(body);
          episode.comments.push(comment);
          saveAnimeData(data);
          res.writeHead(200);
          res.end();
        }
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
};

// Export serverless function handler for Vercel
module.exports = (req, res) => {
  requestHandler(req, res);
};

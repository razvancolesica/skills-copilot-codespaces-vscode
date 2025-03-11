// Create web server
// Load comments from file
// Add new comments
// Save comments to file

// Import modules
const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

// Load comments from file
function loadComments() {
    try {
        return JSON.parse(fs.readFileSync('comments.json', 'utf8'));
    } catch (e) {
        return [];
    }
}

// Save comments to file
function saveComments(comments) {
    fs.writeFileSync('comments.json', JSON.stringify(comments));
}

// Create web server
const server = http.createServer((req, res) => {
    const {pathname, query} = url.parse(req.url, true);
    if (pathname === '/comments') {
        if (req.method === 'GET') {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(loadComments()));
        } else if (req.method === 'POST') {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                const comment = qs.parse(data);
                const comments = loadComments();
                comments.push(comment);
                saveComments(comments);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(comment));
            });
        }
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
});

// Start server
server.listen(8000, () => {
    console.log('Server is running at http://localhost:8000');
});
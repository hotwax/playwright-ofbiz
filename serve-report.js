const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const REPORT_DIR = path.join(__dirname, 'custom-report');
const FILE_PATH = path.join(REPORT_DIR, 'index.html');

const server = http.createServer((req, res) => {
    // Basic static file serving for the monocart report
    let filePath = path.join(REPORT_DIR, req.url === '/' ? 'index.html' : req.url);
    
    // Safety check to prevent directory traversal
    if (!filePath.startsWith(REPORT_DIR)) {
        res.statusCode = 403;
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.statusCode = 404;
                res.end('Report not found. Please run tests first.');
            } else {
                res.statusCode = 500;
                res.end('Internal Server Error');
            }
            return;
        }

        // Set content type based on extension
        const ext = path.extname(filePath);
        const contentTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.zip': 'application/zip'
        };
        res.setHeader('Content-Type', contentTypes[ext] || 'text/plain');
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 Test Report Server is running!`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`📝 Monitoring: ${FILE_PATH}`);
    console.log(`\nPress Ctrl+C to stop the server.`);
});

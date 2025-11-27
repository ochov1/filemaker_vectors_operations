const http = require('http');
const { routeRequest, sendJson } = require('./route.js');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
    try {
        const handled = await routeRequest(req, res);
        if (handled) return;

        if (req.method === 'GET' && req.url === '/health') {
            sendJson(res, 200, { status: 'ok' });
        } else {
            sendJson(res, 404, { error: 'Not found.' });
        }
    } catch (err) {
        console.error('Unexpected server error', err);
        sendJson(res, 500, { error: 'Internal server error.' });
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

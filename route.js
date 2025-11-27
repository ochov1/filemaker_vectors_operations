const { cosineSimilarity, normalizeVector } = require('./index.js');

/**
 * Send a JSON response with status code.
 */
function sendJson(res, status, payload) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
}

/**
 * Collect request body as text.
 */
function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => resolve(body));
        req.on('error', reject);
    });
}

async function handleSimilarity(req, res) {
    if (req.method !== 'POST' || req.url !== '/similarity') return false;

    try {
        const bodyText = await getRequestBody(req);
        const parsed = JSON.parse(bodyText || '{}');
        const { vectorA, vectorB } = parsed;

        if (!vectorA || !vectorB) {
            sendJson(res, 400, { error: 'vectorA and vectorB are required in the request body.' });
            return true;
        }

        const similarity = cosineSimilarity(JSON.stringify(vectorA), JSON.stringify(vectorB));
        if (similarity === -1) {
            sendJson(res, 400, { error: 'Vector dimension mismatch.' });
            return true;
        }

        sendJson(res, 200, { similarity });
    } catch (err) {
        console.error('Failed to process /similarity request', err);
        sendJson(res, 400, { error: 'Invalid JSON payload.' });
    }

    return true;
}

async function handleNormalize(req, res) {
    if (req.method !== 'POST' || req.url !== '/normalize') return false;

    try {
        const bodyText = await getRequestBody(req);
        const parsed = JSON.parse(bodyText || '{}');
        const { vector } = parsed;

        if (!vector) {
            sendJson(res, 400, { error: 'vector is required in the request body.' });
            return true;
        }

        const normalized = normalizeVector(vector);
        sendJson(res, 200, { normalized });
    } catch (err) {
        console.error('Failed to process /normalize request', err);
        sendJson(res, 400, { error: 'Invalid JSON payload.' });
    }

    return true;
}

/**
 * Main route dispatcher. Returns true if the request was handled.
 */
async function routeRequest(req, res) {
    if (await handleSimilarity(req, res)) return true;
    if (await handleNormalize(req, res)) return true;
    return false;
}

module.exports = {
    routeRequest,
    sendJson,
};

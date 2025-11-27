function cosineSimilarity(vectorA, vectorB) {

    const a = normalize(JSON.parse(vectorA));
    const b = normalize(JSON.parse(vectorB));

    console.log(a);
    console.log(b);
    let dot = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
    }
    if (a.length !== b.length) {
        console.error("Vector dimension mismatch:", a.length, b.length);
        return -1;
    }

    // REAL cosine similarity (value between -1 and 1)
    const similarity = dot;

    console.log(similarity);
    // send the similarity to FileMaker
    window.FileMaker.PerformScriptWithOption("search", similarity, 0);

}

function normalize(v) {
    let mag = 0;
    for (let i = 0; i < v.length; i++) {
        mag += v[i] * v[i];
    }
    mag = Math.sqrt(mag);

    // avoid division by zero (rare but possible with empty/zero vector)
    if (mag === 0) return v.map(() => 0);

    return v.map(x => x / mag);
}

function normalizeVector(v) {
    let mag = 0;
    for (let i = 0; i < v.length; i++) {
        mag += v[i] * v[i];
    }
    mag = Math.sqrt(mag);

    // avoid division by zero (rare but possible with empty/zero vector)
    if (mag === 0) return v.map(() => 0);

    return window.FileMaker.PerformScriptWithOption("search", {normalizeVector:v.map(x => x / mag)}, 0);
}

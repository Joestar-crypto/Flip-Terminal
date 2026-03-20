// Probe 3: Find L2beat throughput API for EigenDA

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

// Step 1: Get the HTML page to find JS chunk filenames
console.log('Fetching L2beat EigenDA page...');
const pageR = await fetch('https://l2beat.com/data-availability/projects/eigenda/eigenda', {
  headers: { 'User-Agent': UA }
});
const html = await pageR.text();
console.log('Page len:', html.length);

// Step 2: Extract all unique JS chunk paths
const chunkMatches = [...html.matchAll(/"\/_next\/static\/chunks\/([^"]+\.js)"/g)];
const chunks = [...new Set(chunkMatches.map(m => '/_next/static/chunks/' + m[1]))];
console.log('Found chunks:', chunks.length);

// Step 3: Also look for buildId in the HTML
const buildIdMatch = html.match(/"buildId"\s*:\s*"([^"]+)"/);
const buildId = buildIdMatch ? buildIdMatch[1] : null;
console.log('buildId:', buildId);

// Step 4: Search for relevant terms across all JS chunk files
const keywords = ['throughput', 'da-throughput', 'dataapi', 'eigenda', 'disperser'];
const found = [];

for (const chunkPath of chunks) {
  const url = 'https://l2beat.com' + chunkPath;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!r.ok) continue;
    const text = await r.text();
    const lower = text.toLowerCase();
    
    // Check if any keyword is present
    if (keywords.some(k => lower.includes(k))) {
      console.log('\n=== Found keywords in:', chunkPath, '===');
      // Extract all API path patterns
      const apiPaths = [...text.matchAll(/["'`](\/api\/[^"'`\s]{4,}|https?:\/\/[^"'`\s]*(?:throughput|eigenda|da-)[^"'`\s]*)/g)];
      const dispPaths = [...text.matchAll(/["'`]([^"'`\s]*(?:throughput|disperser|eigenda\.xyz)[^"'`\s]*)/g)];
      
      const allPaths = [...new Set([...apiPaths, ...dispPaths].map(m => m[1]))];
      allPaths.slice(0, 20).forEach(p => console.log('  path:', p));
      found.push(chunkPath);
    }
  } catch(e) {
    // ignore
  }
}

console.log('\nDone. Found', found.length, 'chunks with keywords');

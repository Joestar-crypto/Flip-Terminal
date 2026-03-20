// Probe 4: Test L2beat tRPC da.projectChart endpoint for EigenDA

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

// tRPC v10 GET query format
// /api/trpc/{procedure}?batch=1&input={"0":{"json":{...}}}
const input = { range: '1y', includeScalingOnly: false, projectId: 'eigenda' };
const inputStr = JSON.stringify({ "0": { json: input } });

const url = `https://l2beat.com/api/trpc/da.projectChart?batch=1&input=${encodeURIComponent(inputStr)}`;
console.log('URL:', url);

try {
  const r = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Accept': 'application/json',
      'Referer': 'https://l2beat.com/data-availability/projects/eigenda/eigenda',
    }
  });
  console.log('Status:', r.status);
  const body = await r.text();
  console.log('Body (2000):', body.substring(0, 2000));
} catch(e) {
  console.log('ERR:', e.message);
}

// Try alternate 1y range as [from, to] tuple
const now = Math.floor(Date.now() / 1000);
const from = now - 365 * 24 * 3600;
const input2 = { range: [from, now], includeScalingOnly: false, projectId: 'eigenda' };
const inputStr2 = JSON.stringify({ "0": { json: input2 } });
const url2 = `https://l2beat.com/api/trpc/da.projectChart?batch=1&input=${encodeURIComponent(inputStr2)}`;
console.log('\nURL2:', url2.substring(0, 200));

try {
  const r2 = await fetch(url2, {
    headers: { 'User-Agent': UA, 'Accept': 'application/json', 'Referer': 'https://l2beat.com/data-availability/projects/eigenda/eigenda' }
  });
  console.log('Status2:', r2.status);
  const body2 = await r2.text();
  console.log('Body2 (2000):', body2.substring(0, 2000));
} catch(e) {
  console.log('ERR2:', e.message);
}

// Probe 6: Test L2beat tRPC for other DA layers - celestia, near, ethereum
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

const toTs = Math.floor(Date.now() / 1000);
const fromTs = toTs - 90 * 24 * 3600; // 90 days

for (const pid of ['eigenda', 'celestia', 'near', 'ethereum', 'avail']) {
  const actualInput = { range: [fromTs, toTs], includeScalingOnly: false, projectId: pid };
  const batchInput = {'0': JSON.stringify(actualInput)};
  const inputParam = JSON.stringify(batchInput);
  const url = `https://l2beat.com/api/trpc/da.projectChart?batch=1&input=${encodeURIComponent(inputParam)}`;
  
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json' } });
    const body = await r.text();
    if (r.ok) {
      const parsed = JSON.parse(body);
      const dataStr = parsed?.[0]?.result?.data;
      if (dataStr) {
        const data = JSON.parse(dataStr);
        console.log(`${pid}: OK, ${data.chart?.length} rows, first=${JSON.stringify(data.chart?.[0])}`);
      } else {
        console.log(`${pid}: OK but no data. body=${body.substring(0,200)}`);
      }
    } else {
      console.log(`${pid}: HTTP ${r.status} - ${body.substring(0, 200)}`);
    }
  } catch(e) {
    console.log(`${pid}: ERR - ${e.message}`);
  }
}

const delay = ms => new Promise(r => setTimeout(r, ms));

const pageR = await fetch('https://l2beat.com/data-availability/projects/eigenda/eigenda', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml'
  }
});
const html = await pageR.text();

// Find __NEXT_DATA__ - contains all SSR page data
const ndIdx = html.indexOf('__NEXT_DATA__');
if (ndIdx >= 0) {
  const start = html.indexOf('{', ndIdx);
  const end = html.indexOf('</script>', ndIdx);
  const raw = html.slice(start, end);
  console.log('__NEXT_DATA__ length:', raw.length);
  const nd = JSON.parse(raw);
  console.log('buildId:', nd.buildId);
  console.log('top keys:', Object.keys(nd).join(', '));
  if (nd.props?.pageProps) {
    const pp = nd.props.pageProps;
    console.log('pageProps keys:', Object.keys(pp).join(', '));
    const str = JSON.stringify(pp);
    // find all chart data references
    const ti = str.indexOf('ThroughputSection');
    if (ti >= 0) console.log('ThroughputSection ctx (1000):', str.slice(ti, ti+1000));
    // find any 'chart' or 'data' arrays
    const ci = str.indexOf('"chart"');
    if (ci >= 0) console.log('chart ctx:', str.slice(ci, ci+300));
  }
  if (nd.buildId) {
    await delay(2000);
    // Try to get page data via Next.js json route
    const dataUrl = 'https://l2beat.com/_next/data/' + nd.buildId + '/data-availability/projects/eigenda/eigenda.json';
    console.log('trying:', dataUrl);
    const dr = await fetch(dataUrl, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' } });
    console.log('data status:', dr.status);
    if (dr.ok) {
      const dj = await dr.json();
      console.log('data keys:', Object.keys(dj));
    }
  }
}

// Extract ThroughputSection raw context from HTML (before JS parse)
const tRaw = html.indexOf('ThroughputSection');
if (tRaw >= 0) console.log('Raw ThroughputSection (500):', html.slice(tRaw, tRaw+500));

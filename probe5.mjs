// Probe 5: Test L2beat tRPC da.projectChart with correct ChartRange format

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

// ChartRange is a tuple [from_unix_or_null, to_unix]
const toTs = Math.floor(Date.now() / 1000);
const fromTs = toTs - 365 * 24 * 3600; // 1 year ago

const actualInput = {
  range: [fromTs, toTs],   // ChartRange tuple
  includeScalingOnly: false,
  projectId: 'eigenda',
};

// With transformer { serialize: JSON.stringify, deserialize: JSON.parse }
// tRPC expects the input in batch format.
// The transformer serializes the input as a JSON string.
// So the batch input is: {"0": JSON.stringify(actualInput)}

const formats = [
  // Format 1: double-serialized ({"0": stringified_input})
  { name: 'double-stringified', batchInput: {'0': JSON.stringify(actualInput)} },
  // Format 2: plain object ({"0": input})
  { name: 'plain-object', batchInput: {'0': actualInput} },
  // Format 3: tRPC v11 flat format
  { name: 'v11-flat', batchInput: actualInput },
];

for (const fmt of formats) {
  const inputParam = JSON.stringify(fmt.batchInput);
  const url = `https://l2beat.com/api/trpc/da.projectChart?batch=1&input=${encodeURIComponent(inputParam)}`;
  
  console.log(`\n=== Format: ${fmt.name} ===`);
  console.log('Input param (300):', inputParam.substring(0, 300));
  
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
    console.log('Body (500):', body.substring(0, 500));
  } catch(e) {
    console.log('ERR:', e.message);
  }
}

// Also try without "batch=1" in different ways
const url3 = `https://l2beat.com/api/trpc/da.projectChart?input=${encodeURIComponent(JSON.stringify(actualInput))}`;
console.log('\n=== Without batch ===');
try {
  const r3 = await fetch(url3, { headers: { 'User-Agent': UA, 'Accept': 'application/json' } });
  console.log('Status:', r3.status);
  const body3 = await r3.text();
  console.log('Body (500):', body3.substring(0, 500));
} catch(e) {
  console.log('ERR:', e.message);
}

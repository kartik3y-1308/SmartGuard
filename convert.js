const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'adult-sites.txt');
const outputFile = path.join(__dirname, 'extension', 'ruleset_adult.json');

const STARTING_RULE_ID = 10001; 

console.log('Starting conversion...');

try {
  const data = fs.readFileSync(inputFile, 'utf8');
  const lines = data.split('\n');
  const rules = [];
  const domains = new Set(); // Use a Set to avoid duplicate domains
  let currentId = STARTING_RULE_ID;

  for (const line of lines) {
    if (!line || line.startsWith('#')) {
      continue; 
    }

    const parts = line.trim().split(/\s+/);
    
    if (parts.length < 2) {
      continue; 
    }

    let urlString = parts[1]; // e.g., "stx14.sextracker.com"

    // --- THIS IS THE FIX ---
    // If the URL string doesn't start with http, add it.
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      urlString = 'http://' + urlString;
    }
    // ---------------------

    try {
      const url = new URL(urlString);
      const domain = url.hostname.replace('www.', ''); // "stx14.sextracker.com"

      // Add to Set to prevent duplicate rules
      if (domain && !domains.has(domain)) {
        domains.add(domain);
        
        const newRule = {
          "id": currentId,
          "priority": 1,
          "action": { "type": "block" },
          "condition": { 
            "urlFilter": `||${domain}/`, 
            "resourceTypes": ["main_frame"] 
          }
        };
        
        rules.push(newRule);
        currentId++;
      }
    } catch (error) {
      console.log(`Skipping invalid line: ${line}`);
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(rules, null, 2));

  console.log(`\nSuccessfully converted ${rules.length} unique domains.`);
  console.log(`New ruleset saved to: ${outputFile}`);

} catch (error) {
  console.error('Error during conversion:', error);
}
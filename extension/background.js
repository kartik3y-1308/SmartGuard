// --- Initialize Storage ---
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed. Setting default values.');
  chrome.storage.local.set({ 
    nextRuleId: 1,
    isEnabled: true,
    blockAdult: true
  });
  updateAdultBlocking(true); 
});

// --- API HELPER ---
async function apiCall(method, listType, domain = null) {
  const { token } = await chrome.storage.local.get('token');
  if (!token) throw new Error('Not logged in');
  let url = `http://localhost:5000/api/list/${listType}`;
  if (method === 'DELETE' && domain) {
    url += `/${domain}`;
  }
  const options = {
    method: method,
    headers: { 'Content-Type': 'application/json', 'x-auth-token': token }
  };
  if (method === 'POST') {
    options.body = JSON.stringify({ domain });
  }
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`API call failed: ${response.statusText}`);
  return response.json();
}

// --- BROWSER BLOCKING HELPERS ---
async function addLocalBlockRule(domain) {
  let { nextRuleId } = await chrome.storage.local.get('nextRuleId');
  if (!nextRuleId || nextRuleId < 20000) nextRuleId = 20000;
  
  const newRule = {
    id: nextRuleId, priority: 1,
    action: { type: 'block' },
    condition: { urlFilter: `||${domain}/`, resourceTypes: ['main_frame'] }
  };
  
  await chrome.declarativeNetRequest.updateDynamicRules({ addRules: [newRule] });
  await chrome.storage.local.set({ 
    nextRuleId: nextRuleId + 1,
    [`block_${domain}`]: newRuleId
  });
  console.log(`Local block rule added for ${domain}`);
}

async function removeLocalBlockRule(domain) {
  const key = `block_${domain}`;
  const { [key]: ruleIdToRemove } = await chrome.storage.local.get(key);
  
  if (ruleIdToRemove) {
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [ruleIdToRemove] });
    await chrome.storage.local.remove(key);
    console.log(`Local block rule removed for ${domain}`);
  }
}

// --- ADULT BLOCKING --- (Unchanged)
async function updateAdultBlocking(enabled) {
  if (enabled) {
    await chrome.declarativeNetRequest.updateEnabledRulesets({ enableRulesetIds: ["adult_ruleset"] });
  } else {
    await chrome.declarativeNetRequest.updateEnabledRulesets({ disableRulesetIds: ["adult_ruleset"] });
  }
  await chrome.storage.local.set({ blockAdult: enabled });
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (error) { return null; }
}

// --- SYNC FUNCTION ---
async function syncRulesFromDB() {
  console.log('Syncing rules from database...');
  try {
    const dbBlocklist = await apiCall('GET', 'blocklist');
    const dbWhitelist = await apiCall('GET', 'whitelist');

    const localRules = await chrome.declarativeNetRequest.getDynamicRules();
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: localRules.map(r => r.id) });
    
    const allStorage = await chrome.storage.local.get(null);
    const keysToRemove = Object.keys(allStorage).filter(k => k.startsWith('block_') || k === 'whitelist');
    await chrome.storage.local.remove(keysToRemove);
    
    let currentRuleId = 20000;
    const newStorage = { nextRuleId: 20000, whitelist: dbWhitelist };
    const newRules = [];
    
    for (const domain of dbBlocklist) {
      newRules.push({
        id: currentRuleId, priority: 1,
        action: { type: 'block' },
        condition: { urlFilter: `||${domain}/`, resourceTypes: ['main_frame'] }
      });
      newStorage[`block_${domain}`] = currentRuleId;
      currentRuleId++;
    }
    
    newStorage.nextRuleId = currentRuleId;
    await chrome.declarativeNetRequest.updateDynamicRules({ addRules: newRules });
    await chrome.storage.local.set(newStorage);
    
    console.log(`Sync complete. Added ${dbBlocklist.length} rules and ${dbWhitelist.length} whitelist.`);

  } catch (error) {
    console.error('Failed to sync rules:', error);
  }
}

// --- Main Message Listener ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // --- SYNC COMMAND ---
  if (request.command === "syncRules") {
    syncRulesFromDB().then(() => sendResponse({ success: true }));
    return true; // async
  }
  
  // --- REMOVED: addRule, removeRule, getRules, addWhitelist, removeWhitelist, getWhitelist ---
  
  // --- Other commands (unchanged) ---
  if (request.command === "setAdultBlocking") {
    updateAdultBlocking(request.enabled).then(() => sendResponse({ success: true }));
    return true; // async
  }
  if (request.command === "checkLink") {
    // ... (checkLink logic is unchanged)
    (async () => {
      try {
        const { token } = await chrome.storage.local.get(['token']);
        if (!token) throw new Error("User is not logged in.");
        
        // Check whitelist first
        const { whitelist } = await chrome.storage.local.get(['whitelist']);
        const domain = getDomain(request.url);
        if (whitelist && whitelist.includes(domain)) {
          sendResponse({ block: false }); // Whitelisted, do not scan
          return;
        }

        const response = await fetch('http://localhost:5000/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
          body: JSON.stringify({ url: request.url })
        });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        
        const result = await response.json();
        const isMalicious = result.unsafe || result.malware || result.phishing || result.suspicious || result.risk_score > 75;
        
        if (isMalicious) {
          if (domain) await addLocalBlockRule(domain); // Use local function
          sendResponse({ block: true });
        } else {
          sendResponse({ block: false });
        }
      } catch (error) {
        console.warn(`Failed to scan URL: ${error.message}`);
        sendResponse({ block: false });
      }
    })();
    return true; // async
  }
  return true; // Default for async
});
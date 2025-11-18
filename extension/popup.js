document.addEventListener('DOMContentLoaded', () => {
  // Get all elements
  const loginView = document.getElementById('login-view');
  const managerView = document.getElementById('manager-view');
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email-input');
  const passwordInput = document.getElementById('password-input');
  const loginMessage = document.getElementById('login-message');
  const settingsBtn = document.getElementById('settings-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const enabledToggle = document.getElementById('enabled-toggle');
  const adultToggle = document.getElementById('adult-toggle'); 
  const manageListsBtn = document.getElementById('manage-lists-btn');

  // --- Login/Logout/Settings ---
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginMessage.textContent = 'Logging in...';
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailInput.value, password: passwordInput.value })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || 'Login failed');
        
        await chrome.storage.local.set({ token: data.token });
        loginMessage.textContent = 'Syncing rules...';
        
        // --- SYNC ON LOGIN ---
        // This is the CRITICAL step. It fetches the lists from the DB.
        chrome.runtime.sendMessage({ command: "syncRules" }, () => {
          checkLoginStatus(); // Show manager view
        });
        
      } catch (error) {
        loginMessage.textContent = error.message;
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      // Clear all local rules and storage
      const localRules = await chrome.declarativeNetRequest.getDynamicRules();
      await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: localRules.map(r => r.id) });
      await chrome.storage.local.clear();
      checkLoginStatus();
    });
  }
  
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      // This still goes to the main profile page
      chrome.tabs.create({ url: 'http://localhost:5173/profile' });
    });
  }

  // --- THIS IS THE KEY CHANGE ---
  if (manageListsBtn) {
    manageListsBtn.addEventListener('click', () => {
      // This now opens the profile page, scrolled to the 'lists' tab
      chrome.tabs.create({ url: 'http://localhost:5173/profile?tab=lists' });
    });
  }

  // --- Toggle Logic (Unchanged) ---
  if (enabledToggle) {
    enabledToggle.addEventListener('click', async () => {
      await chrome.storage.local.set({ isEnabled: enabledToggle.checked });
    });
  }
  
  if (adultToggle) {
    adultToggle.addEventListener('click', () => {
      chrome.runtime.sendMessage({ 
        command: "setAdultBlocking", 
        enabled: adultToggle.checked 
      });
    });
  }

  // --- Main Function: Check Login Status (Unchanged) ---
  async function checkLoginStatus() {
    const { token } = await chrome.storage.local.get(['token']);
    if (token) {
      managerView.style.display = 'block';
      loginView.style.display = 'none';
      const { isEnabled } = await chrome.storage.local.get(['isEnabled']);
      enabledToggle.checked = isEnabled ?? true; 
      const enabledRulesets = await chrome.declarativeNetRequest.getEnabledRulesets();
      adultToggle.checked = enabledRulesets.includes("adult_ruleset");
    } else {
      managerView.style.display = 'none';
      loginView.style.display = 'block';
    }
  }

  checkLoginStatus();
});
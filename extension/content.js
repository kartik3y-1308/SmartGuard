document.addEventListener('click', async (event) => {
  // Check if the extension is still running.
  if (!chrome.runtime?.id) {
    return;
  }
  
  // 1. Check if scanning is enabled
  const { isEnabled } = await chrome.storage.local.get(['isEnabled']);
  if (isEnabled === false) {
    return;
  }

  const link = event.target.closest('a');
  if (!link || !link.href) {
    return;
  }
  if (link.href.startsWith(window.location.origin) && link.href.includes('#')) {
    return;
  }

  // 2. --- WHITELIST CHECK ---
  let domain;
  try {
    domain = new URL(link.href).hostname.replace('www.', '');
  } catch (error) {
    return; // Not a valid URL to scan
  }

  // Get whitelist from local storage
  const { whitelist } = await chrome.storage.local.get(['whitelist']);
  if (whitelist && whitelist.includes(domain)) {
    console.log(`[Security] Allowing whitelisted domain: ${domain}`);
    return; // Stop here, do not scan
  }
  // -----------------------------

  // 3. Proceed with scan
  try {
    const response = await chrome.runtime.sendMessage({
      command: "checkLink",
      url: link.href
    });

    if (response.block) {
      console.log(`[Security] Blocking navigation to malicious link: ${link.href}`);
      event.preventDefault(); 
      alert(`[Web Security Shield]\n\nBlocked navigation to a potentially malicious link:\n\n${link.href}`);
    }

  } catch (error) {
    if (error.message.includes("Could not establish connection")) {
      console.warn("Could not connect to extension background. Is user logged in?");
    } else if (error.message.includes("context invalidated")) {
      // This just silences the error.
    } else {
      console.error("Error checking link:", error);
    }
  }
}, true);
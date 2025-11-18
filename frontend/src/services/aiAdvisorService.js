// This function generates advice for URL scan results
export const getUrlAdvice = (result) => {
  if (!result) return null;

  let advice = {
    level: 'info', // 'info', 'warning', 'danger'
    title: 'Scan Complete',
    summary: 'This site appears to be safe, but always browse with caution.',
    nextSteps: [
      'Always check for "https" in the URL.',
      'Be wary of unexpected pop-ups or download requests.'
    ]
  };

  if (result.risk_score > 85 || result.malware || result.phishing) {
    advice.level = 'danger';
    advice.title = 'HIGH RISK: Do Not Proceed!';
    advice.summary = 'This site is flagged as extremely dangerous. It may be a phishing site or attempt to install malware on your computer.';
    advice.nextSteps = ['Close this browser tab immediately.', 'Do not enter any personal information.', 'We recommend adding this to your blocklist.'];
  } else if (result.risk_score > 60 || result.suspicious) {
    advice.level = 'warning';
    advice.title = 'Warning: Suspicious Site';
    advice.summary = 'This site is flagged as suspicious. It may be a new phishing site, contain spam, or have other concerning attributes.';
    advice.nextSteps = ['Avoid entering sensitive information.', 'Verify the company is legitimate before interacting.', 'Proceed with extreme caution.'];
  }

  return advice;
};

// This function generates advice for Email scan results
export const getEmailAdvice = (result) => {
  if (!result || result.success === false) return null;

  let advice = {
    level: 'info',
    title: 'Scan Complete: Email is Safe',
    summary: 'This email address appears to be valid and has not been found in a data breach. It is not a disposable address.',
    nextSteps: [
      'You can use this email with confidence.',
      'Remember to always use a strong, unique password.'
    ]
  };

  if (result.leaked) {
    advice.level = 'danger';
    advice.title = 'DANGER: Email Breached!';
    advice.summary = 'This email was found in a known data breach. Your password may be compromised.';
    advice.nextSteps = [
      'Change your password immediately on any site using this email.',
      'Enable two-factor authentication (2FA) on all critical accounts.'
    ];
  } else if (result.disposable || result.honeypot || result.fraud_score > 75) {
    advice.level = 'warning';
    advice.title = 'Warning: Risky Email';
    advice.summary = 'This email address is flagged as high-risk. It may be a disposable, temporary address or a known "spam trap".';
    advice.nextSteps = [
      'Do not trust this email for important communications.',
      'Avoid using this service if it requires a legitimate email.'
    ];
  }

  return advice;
};
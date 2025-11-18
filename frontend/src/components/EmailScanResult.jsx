import { ShieldCheck, ShieldAlert } from 'lucide-react';

// A reusable card for displaying individual stats
const StatCard = ({ title, value, description, isGood = false, isBad = false }) => {
  let valueClass = 'text-white';
  if (isGood) valueClass = 'text-green-400';
  if (isBad) valueClass = 'text-red-400';

  return (
    // 1. Add 'group' and 'relative' to the main div to enable the tooltip
    <div className="relative group p-4 bg-gray-700/50 rounded-lg">
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <p className={`text-xl font-bold ${valueClass} capitalize`}>{value.toString()}</p>
      
      {/* 2. This is the new Tooltip HTML */}
      {/* It's hidden by default and appears on group-hover */}
      <span className="absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-normal w-64 p-2 text-xs font-medium text-white bg-gray-900 border border-gray-600 rounded-md shadow-lg
                       transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200">
        {description}
      </span>
    </div>
  );
};

const EmailScanResult = ({ result }) => {
  if (!result) return null;

  if (result.success === false) {
    return (
      <div className="mt-8 bg-gray-800 p-8 rounded-lg shadow-lg animate-fade-in border border-red-700">
        <h3 className="text-2xl font-bold mb-4 text-red-400">Scan Failed</h3>
        <p className="text-gray-300">{result.message || 'The email could not be scanned. Please check the format.'}</p>
      </div>
    );
  }

  const isBreached = result.leaked;
  const category = result.category ? result.category.replace('_', ' ') : 'N/A';
  const isCategoryBad = result.category && result.category !== 'low_risk';

  return (
    <div className="mt-8 bg-gray-800 p-8 rounded-lg shadow-lg animate-fade-in border border-gray-700">
      {/* Main Breach Status */}
      <div className={`p-6 rounded-lg mb-8 flex items-center space-x-4 ${isBreached ? 'bg-red-900/50' : 'bg-green-900/50'}`}>
        {/* ... (icon and text) ... */}
      </div>

      <h3 className="text-2xl font-bold mb-6">Full Email Analysis</h3>
      
      {/* 3. We now pass a 'description' prop to each StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <StatCard 
          title="Fraud Score" 
          value={result.fraud_score}
          description="A 0-100 score. Higher scores indicate a higher risk of fraud or malicious activity."
          isBad={result.fraud_score > 60}
          isGood={result.fraud_score < 20}
        />
        
        <StatCard 
          title="Email Valid" 
          value={result.valid ? 'Yes' : 'No'}
          description="Checks if this email address actually exists and can receive mail."
          isGood={result.valid}
          isBad={!result.valid}
        />

        <StatCard 
          title="Risk Category" 
          value={category}
          description="The overall risk category. 'Low Risk' is good. Other categories indicate caution."
          isBad={isCategoryBad}
          isGood={!isCategoryBad}
        />

        <StatCard 
          title="Disposable" 
          value={result.disposable ? 'Yes' : 'No'}
          description="Indicates a temporary, throwaway email address (e.g., from a 10-minute mail service)."
          isGood={!result.disposable}
          isBad={result.disposable}
        />

        <StatCard 
          title="Honeypot" 
          value={result.honeypot ? 'Yes' : 'No'}
          description="This email is a known 'spam trap' used by services to catch and identify spammers."
          isGood={!result.honeypot}
          isBad={result.honeypot}
        />

        <StatCard 
          title="Recent Abuse" 
          value={result.recent_abuse ? 'Yes' : 'No'}
          description="Indicates if this email has been recently detected in abusive behavior (like spam or sign-up fraud)."
          isGood={!result.recent_abuse}
          isBad={result.recent_abuse}
        />

      </div>
    </div>
  );
};

export default EmailScanResult;
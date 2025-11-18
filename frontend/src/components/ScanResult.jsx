const ScanResult = ({ result }) => {
  // If there's no result object, render nothing.
  if (!result) {
    return null;
  }

  // --- Main Logic (UPDATED) ---
  // A URL is considered unsafe if the API says it is, if it's a specific threat,
  // OR if the risk score is very high (e.g., > 75).
  const isUnsafe =
    result.unsafe ||
    result.malware ||
    result.phishing ||
    result.suspicious ||
    result.risk_score > 75;

  const riskScore = result.risk_score;

  // Helper function to determine the color for the risk score badge.
  const getRiskColor = (score) => {
    if (score >= 85) return 'bg-red-600 text-red-100';
    if (score >= 60) return 'bg-yellow-600 text-yellow-100';
    return 'bg-green-600 text-green-100';
  };

  // Helper function to find the specific threat type.
  const getThreatType = () => {
    if (result.phishing) return 'Phishing';
    if (result.malware) return 'Malware';
    if (result.suspicious) return 'Suspicious';
    if (result.spamming) return 'Spam';
    return result.category || 'N/A';
  };

  return (
    <div className="mt-8 bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg border border-gray-700 animate-fade-in">
      <h3 className="text-2xl font-bold mb-6 text-white">Scan Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Safety Status Card */}
        <div className={`p-4 rounded-lg flex flex-col justify-center text-center ${isUnsafe ? 'bg-red-900/50' : 'bg-green-900/50'}`}>
          <p className="text-sm font-medium text-gray-400">Safety Status</p>
          <p className={`text-2xl font-bold ${isUnsafe ? 'text-red-400' : 'text-green-400'}`}>
            {isUnsafe ? 'Unsafe' : 'Safe'}
          </p>
        </div>

        {/* Risk Score Card */}
        <div className="p-4 bg-gray-700/50 rounded-lg flex flex-col justify-center text-center">
          <p className="text-sm font-medium text-gray-400">Risk Score</p>
          <p className={`text-2xl font-bold ${getRiskColor(riskScore).split(' ')[0]}`}>
            <span className={`px-3 py-1 text-sm rounded-full ${getRiskColor(riskScore)}`}>
              {riskScore} / 100
            </span>
          </p>
        </div>

        {/* Category Card */}
        <div className="p-4 bg-gray-700/50 rounded-lg flex flex-col justify-center text-center">
          <p className="text-sm font-medium text-gray-400">Threat Type / Category</p>
          <p className="text-xl font-semibold capitalize">{getThreatType()}</p>
        </div>
      </div>

      {/* Optional: Add more details */}
      <div className="mt-6 pt-6 border-t border-gray-700 text-sm">
        <p className="text-gray-400"><span className="font-semibold text-gray-200">Domain:</span> {result.domain}</p>
        <p className="text-gray-400"><span className="font-semibold text-gray-200">Domain Age:</span> {result.domain_age?.human || 'N/A'}</p>
      </div>
    </div>
  );
};

export default ScanResult;
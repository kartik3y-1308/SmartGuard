import { format } from 'date-fns';

const HistoryTable = ({ history, isFullPage = false }) => {
  if (!history || history.length === 0) {
    return (
      <div className="mt-8 bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <p className="text-gray-400">Your URL scan history is empty.</p>
      </div>
    );
  }

  return (
    <div className={`shadow-lg ${isFullPage ? '' : 'mt-8 bg-gray-800 rounded-lg overflow-hidden'}`}>
      {isFullPage ? null : (
        <h3 className="text-xl font-bold p-6">Recent URL Scans</h3>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">URL</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Risk Score</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {history.map((item) => {
              const result = item.scanResult;
              const isUnsafe = result.unsafe || result.malware || result.phishing || result.suspicious || result.risk_score > 75;
              
              return (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white truncate" style={{ maxWidth: '300px' }} title={item.url}>
                      {item.url}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isUnsafe ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-600/30 text-red-300">Unsafe</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-600/30 text-green-300">Safe</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-semibold ${isUnsafe ? 'text-red-400' : 'text-green-400'}`}>
                      {result.risk_score}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {format(new Date(item.createdAt), 'dd MMM yyyy, h:mm a')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
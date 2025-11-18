import { format } from 'date-fns';

const EmailHistoryTable = ({ history, isFullPage = false }) => {
  if (!history || history.length === 0) {
    return (
      <div className="mt-8 bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <p className="text-gray-400">Your email scan history is empty.</p>
      </div>
    );
  }

  return (
    <div className={`shadow-lg ${isFullPage ? '' : 'mt-8 bg-gray-800 rounded-lg overflow-hidden'}`}>
      {isFullPage ? null : (
        <h3 className="text-xl font-bold p-6">Recent Email Scans</h3>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Breached</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fraud Score</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {history.map((item) => {
              const result = item.scanResult;
              return (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white truncate" style={{ maxWidth: '250px' }} title={item.email}>
                      {item.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.isBreached ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-600/30 text-red-300">Yes</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-600/30 text-green-300">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-semibold ${result.fraud_score > 60 ? 'text-red-400' : 'text-green-400'}`}>
                      {result.fraud_score}
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

export default EmailHistoryTable;
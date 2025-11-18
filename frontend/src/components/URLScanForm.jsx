import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import scanService from '../services/scanService';

const URLScanForm = ({ setScanResult }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setScanResult(null);

    try {
      const response = await scanService.scanUrl(url, token);
      setScanResult(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred during the scan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="flex-grow px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ring-offset-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Scanning...' : 'Scan URL'}
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default URLScanForm;
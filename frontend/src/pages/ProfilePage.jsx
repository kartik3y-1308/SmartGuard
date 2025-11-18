import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import scanService from '../services/scanService'; 
import emailService from '../services/emailService'; 
import listService from '../services/listService';
import { ShieldAlert, ListChecks, MailCheck, Trash2, Zap, AlertCircle } from 'lucide-react'; // Added Zap and AlertCircle

import HistoryTable from '../components/HistoryTable';
import EmailHistoryTable from '../components/EmailHistoryTable';

// --- Reusable StatCard (No Change) ---
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

// --- List Management Component (No Change) ---
const ListManager = ({ listType, token }) => {
  const [list, setList] = useState([]);
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');

  const title = listType === 'blocklist' ? 'Blocklist' : 'Whitelist';
  const description = listType === 'blocklist' 
    ? 'Domains on this list will be blocked by your extension.'
    : 'Domains on this list will never be scanned or blocked.';

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await listService.getList(listType, token);
        setList(res.data); 
      } catch (err) {
        console.error(`Failed to fetch ${listType}`, err);
      }
    };
    fetchList();
  }, [listType, token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await listService.addDomain(listType, domain, token);
      setList(res.data);
      setDomain('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add domain');
    }
  };

  const handleRemove = async (domainToRemove) => {
    try {
      const res = await listService.removeDomain(listType, domainToRemove, token);
      setList(res.data);
    } catch (err) {
      console.error(`Failed to remove ${domainToRemove}`, err);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      
      <form onSubmit={handleAdd} className="flex gap-4 mb-4">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="e.g., example.com"
          className="flex-grow px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md"
          required
        />
        <button type="submit" className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Add</button>
      </form>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      
      <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
        {list.length === 0 ? (
          <p className="text-gray-500">Your {listType} is empty.</p>
        ) : (
          list.map((d) => (
            <div key={d} className="flex justify-between items-center bg-gray-700 p-3 rounded">
              <span className="text-white">{d}</span>
              <button onClick={() => handleRemove(d)} className="p-1 bg-red-600/50 hover:bg-red-600 rounded">
                <Trash2 size={18} className="text-red-300" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


// --- UPDATED Profile Page Component ---
const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'analytics');
  
  // UPDATED STATE TO REFLECT NEW BACKEND RESPONSE
  const [analytics, setAnalytics] = useState({ 
    totalUrlScans: 0, 
    totalMaliciousUrlScans: 0, 
    avgUrlRiskScore: 0,
    totalEmailScans: 0,
    totalBreachedEmails: 0
  });

  const [urlHistory, setUrlHistory] = useState([]);
  const [emailHistory, setEmailHistory] = useState([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [analyticsRes, urlHistoryRes, emailHistoryRes] = await Promise.all([
          userService.getAnalytics(token),
          scanService.getHistory(token), // Still needed for the history tab
          emailService.getHistory(token) // Still needed for the history tab
        ]);
        setAnalytics(analyticsRes.data); // Use the new analytics data
        setUrlHistory(urlHistoryRes.data);
        setEmailHistory(emailHistoryRes.data);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      }
    };
    fetchAllData();
  }, [token]);
  
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    try {
      const response = await userService.updatePassword({ currentPassword, newPassword }, token);
      setMessage({ type: 'success', text: response.data.msg });
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.msg || 'Failed to update password.' });
    }
  };
  
  const handleLogout = () => {
    setToken(null);
    navigate('/login');
  };
  
  const getTabClass = (tabName) => {
    return activeTab === tabName
      ? 'border-blue-500 text-blue-400'
      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500';
  };
  
  const totalThreats = analytics.totalMaliciousUrlScans + analytics.totalBreachedEmails;
  const isHighRisk = totalThreats > 3 || analytics.avgUrlRiskScore > 40;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar (unchanged) */}
      <nav className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="text-xl font-bold hover:text-gray-300">&larr; Back to Dashboard</Link>
          <button onClick={handleLogout} className="px-4 py-2 font-semibold bg-red-600 rounded-md hover:bg-red-700">Logout</button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">User Profile</h1>

        {/* Tab Navigation (unchanged) */}
        <div className="mb-8 border-b border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button onClick={() => setActiveTab('analytics')} className={`py-4 px-1 border-b-2 font-medium text-lg ${getTabClass('analytics')}`}>Analytics</button>
            <button onClick={() => setActiveTab('lists')} className={`py-4 px-1 border-b-2 font-medium text-lg ${getTabClass('lists')}`}>Manage Lists</button>
            <button onClick={() => setActiveTab('url-history')} className={`py-4 px-1 border-b-2 font-medium text-lg ${getTabClass('url-history')}`}>URL History</button>
            <button onClick={() => setActiveTab('email-history')} className={`py-4 px-1 border-b-2 font-medium text-lg ${getTabClass('email-history')}`}>Email History</button>
            <button onClick={() => setActiveTab('security')} className={`py-4 px-1 border-b-2 font-medium text-lg ${getTabClass('security')}`}>Security</button>
          </nav>
        </div>

        {/* --- Analytics Tab (UPDATED CONTENT) --- */}
        <div style={{ display: activeTab === 'analytics' ? 'block' : 'none' }}>
          <h2 className="text-2xl font-semibold mb-4">Overall Security Health</h2>
          
          <div className={`p-6 mb-8 rounded-lg shadow-xl ${isHighRisk ? 'bg-red-900/40 border border-red-500' : 'bg-green-900/40 border border-green-500'}`}>
            <div className="flex items-center space-x-4">
              {isHighRisk ? <AlertCircle size={32} className="text-red-400" /> : <ShieldAlert size={32} className="text-green-400" />}
              <div>
                <h3 className="text-xl font-bold">{isHighRisk ? 'ACTION REQUIRED: High Risk Profile' : 'GOOD: Low Risk Profile'}</h3>
                <p className="text-gray-300 text-sm">
                  {isHighRisk 
                    ? `You have encountered ${totalThreats} threats. Consider reviewing your scan history.`
                    : 'Your security profile is healthy. Keep up the good work!'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard icon={<Zap size={24} />} title="Average URL Risk" value={`${analytics.avgUrlRiskScore}%`} color="bg-yellow-600/30 text-yellow-300" />
            <StatCard icon={<ListChecks size={24} />} title="Total URL Scans" value={analytics.totalUrlScans} color="bg-blue-600/30 text-blue-300" />
            <StatCard icon={<ShieldAlert size={24} />} title="Malicious Sites Found" value={analytics.totalMaliciousUrlScans} color="bg-red-600/30 text-red-300" />
            <StatCard icon={<MailCheck size={24} />} title="Breached Emails" value={analytics.totalBreachedEmails} color="bg-purple-600/30 text-purple-300" />
          </div>
        </div>

        {/* Manage Lists Tab (unchanged) */}
        <div style={{ display: activeTab === 'lists' ? 'block' : 'none' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ListManager listType="blocklist" token={token} />
            <ListManager listType="whitelist" token={token} />
          </div>
        </div>
        
        {/* URL History Tab (unchanged) */}
        <div style={{ display: activeTab === 'url-history' ? 'block' : 'none' }}>
          <h2 className="text-2xl font-semibold mb-4">Full URL Scan History</h2>
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <HistoryTable history={urlHistory} isFullPage={true} />
          </div>
        </div>
        
        {/* Email History Tab (unchanged) */}
        <div style={{ display: activeTab === 'email-history' ? 'block' : 'none' }}>
          <h2 className="text-2xl font-semibold mb-4">Full Email Scan History</h2>
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <EmailHistoryTable history={emailHistory} isFullPage={true} />
          </div>
        </div>

        {/* Security/Password Tab (unchanged) */}
        <div style={{ display: activeTab === 'security' ? 'block' : 'none' }}>
          <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordUpdate} className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg">
            <div className="space-y-6">
              <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md" />
              <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md" />
            </div>
            {message.text && <p className={`mt-4 text-sm text-center ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{message.text}</p>}
            <button type="submit" className="w-full mt-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Update Password</button>
          </form>
        </div>

      </main>
    </div>
  );
};

export default ProfilePage;
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import adminService from '../services/adminService';
import { Users, Scan, Mail } from 'lucide-react';
import { format } from 'date-fns';

// Reusable Stat Card
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await adminService.getSiteStats(token);
        setStats(response.data);
      } catch (err) {
        setError('Failed to load site statistics. You may not have admin access.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) {
    return <div className="p-8 text-white text-center">Loading Admin Dashboard...</div>;
  }
  
  if (error) {
    return <div className="p-8 text-red-400 text-center">{error}</div>;
  }
  
  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Site-Wide Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={<Users size={24} />} title="Total Users" value={stats.totalUsers} color="bg-blue-600/30 text-blue-300" />
          <StatCard icon={<Scan size={24} />} title="Total URL Scans" value={stats.totalUrlScans} color="bg-green-600/30 text-green-300" />
          <StatCard icon={<Mail size={24} />} title="Total Email Scans" value={stats.totalEmailScans} color="bg-purple-600/30 text-purple-300" />
        </div>
      </section>

      {/* Recent Users Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Recently Joined Users</h2>
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Joined On</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {stats.recentUsers.map(user => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {format(new Date(user.createdAt), 'dd MMM yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
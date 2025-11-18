import { Link } from 'react-router-dom';
import { Trash2, ShieldOff, LogOut } from 'lucide-react';

const GuideCard = ({ title, description, link, icon }) => (
  <a 
    href={link} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="block p-6 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700/70 transition-colors"
  >
    <div className="flex items-center space-x-4 mb-3">
      {icon}
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    <p className="text-gray-400">{description}</p>
  </a>
);

const SecurityGuidesPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* --- Navbar --- */}
      <nav className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="text-xl font-bold hover:text-gray-300">&larr; Back to Dashboard</Link>
          {/* You can add a logout button here if you want */}
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Security Guides</h1>
        <p className="text-lg text-gray-400 mb-10">
          Here are quick, actionable steps you can take to improve your online security right now.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GuideCard
            title="How to Clear Your Cache"
            description="Clearing your browser's cache can fix performance issues and remove old, sensitive data."
            link="https://www.google.com/search?q=how+to+clear+browser+cache"
            icon={<Trash2 size={28} className="text-blue-400" />}
          />
          <GuideCard
            title="What to Do After a Breach"
            description="Learn the immediate steps to take if your email or password has been compromised in a data breach."
            link="https://www.google.com/search?q=what+to+do+if+my+email+is+in+a+data+breach"
            icon={<ShieldOff size={28} className="text-red-400" />}
          />
          <GuideCard
            title="How to Securely Log Out"
            description="Learn why it's important to fully 'end your session' by logging out, not just closing the tab."
            link="https://www.google.com/search?q=why+is+it+important+to+log+out+of+websites"
            icon={<LogOut size={28} className="text-green-400" />}
          />
        </div>
      </main>
    </div>
  );
};

export default SecurityGuidesPage;
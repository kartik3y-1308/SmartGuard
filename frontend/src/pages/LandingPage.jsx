import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, History } from 'lucide-react'; // Importing icons

const LandingPage = () => {
  return (
    <div className="bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">SafeBrowse</h1>
        <div>
          <Link to="/login" className="text-gray-300 hover:text-white mr-4">Login</Link>
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 text-center py-20 sm:py-32">
        <h2 className="text-4xl sm:text-6xl font-extrabold">Surf the Web with Confidence</h2>
        <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
          Our tool provides real-time scanning to protect you from malicious websites, phishing attacks, and online threats.
        </p>
        <Link to="/register" className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg">
          Get Started for Free
        </Link>
      </main>

      {/* Features Section */}
      <section className="bg-gray-800 py-20">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-12">Why Choose SafeBrowse?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-600/20 p-4 rounded-full">
                <ShieldCheck size={40} className="text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold mt-4 mb-2">Real-time Threat Detection</h4>
              <p className="text-gray-400">
                Scan any URL and get an instant safety assessment powered by advanced threat intelligence.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-600/20 p-4 rounded-full">
                <Zap size={40} className="text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold mt-4 mb-2">Instant & Accurate</h4>
              <p className="text-gray-400">
                Our powerful API provides fast and reliable results, so you can browse without delay.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-600/20 p-4 rounded-full">
                <History size={40} className="text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold mt-4 mb-2">Personal Scan History</h4>
              <p className="text-gray-400">
                Keep track of all your scanned URLs in a personal dashboard to stay aware of your browsing habits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <p>&copy; 2025 SafeBrowse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
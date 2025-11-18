import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import scanService from "../services/scanService";
import emailService from "../services/emailService";
import { User, BookOpen } from "lucide-react";

// Import all our components
import URLScanForm from "../components/URLScanForm";
import ScanResult from "../components/ScanResult";
import EmailScanForm from "../components/EmailScanForm";
import EmailScanResult from "../components/EmailScanResult";
import HistoryTable from "../components/HistoryTable";
import EmailHistoryTable from "../components/EmailHistoryTable";
import AIAdvisor from "../components/AIAdvisor"; // 1. Import AIAdvisor
import { getUrlAdvice, getEmailAdvice } from "../services/aiAdvisorService"; // 2. Import advice logic

const DashboardPage = () => {
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState("url");
  const [urlScanResult, setUrlScanResult] = useState(null);
  const [emailScanResult, setEmailScanResult] = useState(null);
  const [urlAdvice, setUrlAdvice] = useState(null); // 3. Add state for URL advice
  const [emailAdvice, setEmailAdvice] = useState(null); // 4. Add state for Email advice

  const [urlHistory, setUrlHistory] = useState([]);
  const [emailHistory, setEmailHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // --- Handlers ---
  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };

  const fetchUrlHistory = async () => {
    // Only set loading on the first fetch
    if (isLoadingHistory) setIsLoadingHistory(true);
    try {
      const response = await scanService.getHistory(token);
      setUrlHistory(response.data);
    } catch (error) {
      console.error("Failed to fetch URL history:", error);
    } finally {
      if (isLoadingHistory) setIsLoadingHistory(false);
    }
  };

  const fetchEmailHistory = async () => {
    try {
      const response = await emailService.getHistory(token);
      setEmailHistory(response.data);
    } catch (error) {
      console.error("Failed to fetch email history:", error);
    }
  };

  useEffect(() => {
    fetchUrlHistory();
    fetchEmailHistory();
  }, [token]);

  // 5. Update handlers to generate advice
  const handleNewUrlScan = (result) => {
    setUrlScanResult(result);
    setUrlAdvice(getUrlAdvice(result)); // Generate URL advice
    fetchUrlHistory();
  };

  const handleNewEmailScan = (result) => {
    setEmailScanResult(result);
    setEmailAdvice(getEmailAdvice(result)); // Generate Email advice
    fetchEmailHistory();
  };

  // --- Tab Styles ---
  const getTabClass = (tabName) => {
    return activeTab === tabName
      ? "border-blue-500 text-blue-400"
      : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* --- Navbar --- */}
      <nav className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">SmartGuard Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              <User size={16} />
              <span>Profile</span>
            </Link>{" "}
            <Link
              to="/guides"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              <BookOpen size={16} />
              <span>Security Guides</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 font-semibold bg-red-600 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* --- Main Content Area --- */}
      <main className="container mx-auto px-6 py-8">
        {/* --- Tab Navigation --- */}
        <div className="mb-6 border-b border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("url")}
              className={`py-4 px-1 border-b-2 font-medium text-lg ${getTabClass(
                "url"
              )}`}
            >
              URL Scanner
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`py-4 px-1 border-b-2 font-medium text-lg ${getTabClass(
                "email"
              )}`}
            >
              Email Breach Scanner
            </button>
          </nav>
        </div>

        {/* --- Tab Content --- */}

        {/* URL Scanner Tab */}
        <div style={{ display: activeTab === "url" ? "block" : "none" }}>
          <h2 className="text-3xl font-bold mb-6">Scan a New URL</h2>
          <URLScanForm setScanResult={handleNewUrlScan} />
          <ScanResult result={urlScanResult} />
          <AIAdvisor advice={urlAdvice} /> {/* 6. Add AI Advisor component */}
          {isLoadingHistory ? (
            <p className="mt-8 text-center text-gray-400">Loading history...</p>
          ) : (
            <>
              <HistoryTable history={urlHistory.slice(0, 5)} />
              {urlHistory.length > 5 && (
                <div className="text-right mt-4">
                  <Link
                    to="/profile?tab=url-history"
                    className="text-blue-400 hover:underline"
                  >
                    View Full History &rarr;
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Email Scanner Tab */}
        <div style={{ display: activeTab === "email" ? "block" : "none" }}>
          <h2 className="text-3xl font-bold mb-6">
            Scan an Email for Breaches
          </h2>
          <EmailScanForm setScanResult={handleNewEmailScan} />
          <EmailScanResult result={emailScanResult} />
          <AIAdvisor advice={emailAdvice} /> {/* 7. Add AI Advisor component */}
          {isLoadingHistory ? (
            <p className="mt-8 text-center text-gray-400">Loading history...</p>
          ) : (
            <>
              <EmailHistoryTable history={emailHistory.slice(0, 5)} />
              {emailHistory.length > 5 && (
                <div className="text-right mt-4">
                  <Link
                    to="/profile?tab=email-history"
                    className="text-blue-400 hover:underline"
                  >
                    View Full History &rarr;
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

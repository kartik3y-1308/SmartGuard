import { Bot, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

const AIAdvisor = ({ advice }) => {
  if (!advice) return null;

  // Determine icon and colors based on advice level
  let icon, titleColor, borderColor;
  switch (advice.level) {
    case 'danger':
      icon = <ShieldAlert size={32} className="text-red-400" />;
      titleColor = 'text-red-400';
      borderColor = 'border-red-700';
      break;
    case 'warning':
      icon = <AlertTriangle size={32} className="text-yellow-400" />;
      titleColor = 'text-yellow-400';
      borderColor = 'border-yellow-700';
      break;
    default:
      icon = <ShieldCheck size={32} className="text-green-400" />;
      titleColor = 'text-green-400';
      borderColor = 'border-green-700';
  }

  return (
    <div className={`mt-8 bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in border-l-4 ${borderColor}`}>
      <div className="flex items-center space-x-3 mb-4">
        <Bot size={24} className="text-blue-400" />
        <h3 className="text-2xl font-bold text-white">AI Security Advisor</h3>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="flex-shrink-0">{icon}</div>
        
        <div className="flex-grow">
          <h4 className={`text-xl font-semibold ${titleColor}`}>{advice.title}</h4>
          <p className="text-gray-300">{advice.summary}</p>
        </div>
      </div>

      {advice.nextSteps && advice.nextSteps.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <h5 className="text-lg font-semibold text-white mb-3">Recommended Next Steps:</h5>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            {advice.nextSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;
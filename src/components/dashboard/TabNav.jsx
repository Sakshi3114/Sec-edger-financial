import { useApp } from '../../context/AppContext';
import { TABS } from '../../constants';

export default function TabNav() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="border-b border-gray-200 flex gap-0 overflow-x-auto">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === key
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

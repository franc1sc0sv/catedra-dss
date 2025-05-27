// components/Tabs.tsx
type Tab = { label: string; key: string };

interface TabsProps {
  tabs: Tab[];
  activeKey: string;
  onTabChange: (key: string) => void;
}

export function Tabs({ tabs, activeKey, onTabChange }: TabsProps) {
  return (
    <div className="flex space-x-8 border-b border-gray-200 px-6 pt-4">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`pb-3 text-sm font-medium focus:outline-none transition-colors duration-200 ${
            activeKey === tab.key
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-blue-600'
          }`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
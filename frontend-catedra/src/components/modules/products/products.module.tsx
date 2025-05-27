// ProductsModule.tsx
import { useState } from 'react';
import { Tabs } from './components/Tabs';
import { AccountsSection } from './sections/AccountsSection';
import { CardsSection } from './sections/CardsSection';
import { LoansSection } from './sections/LoansSection';
import { InsurancesSection } from './sections/InsurancesSection';

const tabs = [
  { label: 'Cuentas', key: 'accounts' },
  { label: 'Tarjetas', key: 'cards' },
  { label: 'Préstamos', key: 'loans' },
  { label: 'Seguros', key: 'insurances' },
];

export function ProductsModule() {
  const [activeTab, setActiveTab] = useState('accounts');

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="bg-white rounded-lg shadow-md">
        <Tabs tabs={tabs} activeKey={activeTab} onTabChange={setActiveTab} />
        <div className="p-6">
          {activeTab === 'accounts' && <AccountsSection />}
          {activeTab === 'cards' && <CardsSection />}
          {activeTab === 'loans' && <LoansSection />}
          {activeTab === 'insurances' && <InsurancesSection />}
        </div>
      </div>
    </div>
  );
}
// Wallet.jsx
import  { useState, useEffect } from 'react';
import { getWalletData } from '../../api/wallet';// Ajusta la ruta si es necesario
import type { WalletOutput } from '../../interfaces/wallet.interface'; // Importa la interfaz

type InfoCardProps = {
  icon: { src: string; bgColor: string };
  title: string;
  count: number;
};

const InfoCard = ({ icon, title, count }: InfoCardProps) => (
  <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3 w-full">
    <div className={`p-2 rounded-md ${icon.bgColor}`}>
      <img src={icon.src} alt={title} className="w-8 h-8" />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-semibold text-gray-800">{count}</p>
    </div>
  </div>
);

type AccordionItemProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
};

const AccordionItem = ({ title, children, isOpen, onClick }: AccordionItemProps) => (
  <div className="border-b border-gray-200">
    <button
      className="flex justify-between items-center w-full py-4 text-left text-gray-700 font-medium hover:bg-gray-50"
      onClick={onClick}
    >
      <span>{title}</span>
      <span>{isOpen ? '-' : '+'}</span>
    </button>
    {isOpen && <div className="pb-4 text-gray-600">{children}</div>}
  </div>
);

export const Wallet = () => {
  const [activeTab, setActiveTab] = useState('Productos');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<WalletOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const response = await getWalletData();
        console.log("Wallet data fetched successfully:", response.data);
        setWalletData(response.data);
      } catch (err) {
        console.error("Error fetching wallet data:", err);
        setError("Error al cargar los datos de la cartera.");
      } finally {
        setLoading(false);
      }
    };

   fetchWalletData();
  
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  const handleAccordionToggle = (item: string) => {
    setOpenAccordion(openAccordion === item ? null : item);
  };

  const navItems = ['Productos', 'Transacciones', 'Operaciones'];

  // Definición de los iconos (puedes ajustarlos a tu preferencia o importar de una librería)
  const productIcons = {
    accounts: { src: 'https://cdn-icons-png.flaticon.com/512/2874/2874742.png', bgColor: 'bg-blue-100' },
    cards: { src: 'https://cdn-icons-png.flaticon.com/512/1178/1178330.png', bgColor: 'bg-yellow-100' },
    loans: { src: 'https://cdn-icons-png.flaticon.com/512/1000/1000998.png', bgColor: 'bg-blue-100' },
    insurances: { src: 'https://cdn-icons-png.flaticon.com/512/2923/2923050.png', bgColor: 'bg-blue-100' },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700">Cargando datos de la cartera...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Si no hay datos después de cargar y sin error, mostrar un mensaje
  if (!walletData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700">No se encontraron datos para la cartera.</p>
      </div>
    );
  }

  const { client, products, recent_transactions } = walletData;

  // Prepara los datos para las InfoCards basándose en los totales de la API
  const infoCardsData = [
    {
      icon: productIcons.accounts,
      title: 'Cuentas',
      count: products.accounts.length, // Número de cuentas
    },
    {
      icon: productIcons.cards,
      title: 'Tarjetas',
      count: products.cards.length, // Número de tarjetas
    },
    {
      icon: productIcons.loans,
      title: 'Préstamos',
      count: products.loans.length, // Número de préstamos
    },
    {
      icon: productIcons.insurances,
      title: 'Seguros',
      count: products.insurances.length, // Número de seguros
    },
  ];



  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">
            Cartera de {client.username} 
          </h1>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-gray-600 text-sm">
            <span>
              <span className="font-medium">Documento:</span> {client.identity_document}
            </span>
            <span>
              <span className="font-medium">Teléfono:</span> {client.phones.join(', ')}
            </span>
            <span>
              <span className="font-medium">Correo:</span> {client.emails.join(', ')}
            </span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
          {infoCardsData.map((card, index) => (
            <InfoCard key={index} icon={card.icon} title={card.title} count={card.count} />
          ))}
        </div>

        {/* Navigation Tabs and Content */}
        <div className="p-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === item
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'Productos' && (
              <div className="space-y-4">
                <AccordionItem
                  title={`Cuentas (${products.accounts.length})`}
                  isOpen={openAccordion === 'Cuentas'}
                  onClick={() => handleAccordionToggle('Cuentas')}
                >
                  {/* Contenido dinámico para Cuentas */}
                  {products.accounts.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {products.accounts.map((account) => (
                        <li key={account.id}>
                          **{account.account_number}**:  - Balance: $
                          {parseFloat(account.amount.toString())}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No tienes cuentas registradas.</p>
                  )}
                </AccordionItem>
                <AccordionItem
                  title={`Tarjetas (${products.cards.length})`}
                  isOpen={openAccordion === 'Tarjetas'}
                  onClick={() => handleAccordionToggle('Tarjetas')}
                >
                  {/* Contenido dinámico para Tarjetas */}
                  {products.cards.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {products.cards.map((card) => (
                        <li key={card.id}>
                          **{card.card_status}**: **** **** **** {card.card_number.slice(-4)} - Límite: $
                          {card.limit_amount} - CardNetwork: $
                          {card.network}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No tienes tarjetas registradas.</p>
                  )}
                </AccordionItem>
                <AccordionItem
                  title={`Préstamos (${products.loans.length})`}
                  isOpen={openAccordion === 'Préstamos'}
                  onClick={() => handleAccordionToggle('Préstamos')}
                >
                  {/* Contenido dinámico para Préstamos */}
                  {products.loans.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {products.loans.map((loan) => (
                        <li key={loan.id}>
                          **{loan.category}**: {loan.reference_number} - Monto: $
                          {loan.loan_amount} - Saldo Pendiente: $
                          {parseFloat(loan.payment_terms.toString())} - Fecha de Vencimiento: {new Date(loan.due_date).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No tienes préstamos registrados.</p>
                  )}
                </AccordionItem>
                <AccordionItem
                  title={`Seguros (${products.insurances.length})`}
                  isOpen={openAccordion === 'Seguros'}
                  onClick={() => handleAccordionToggle('Seguros')}
                >
                  {/* Contenido dinámico para Seguros */}
                  {products.insurances.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {products.insurances.map((insurance) => (
                        <li key={insurance.id}>
                          **{insurance.assistance_type}**: {insurance.reference_number} - Cuota: $
                          {insurance.fee_amount}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No tienes seguros registrados.</p>
                  )}
                </AccordionItem>
              </div>
            )}
            {activeTab === 'Transacciones' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Transacciones Recientes</h3>
                {recent_transactions.length > 0 ? (
                  <ul className="space-y-2">
                    {recent_transactions.map((transaction) => (
                      <li key={transaction.id} className="bg-gray-50 p-3 rounded-md shadow-sm">
                        <p>
                          <span className="font-medium">{transaction.transaction_type}</span> de $
                          {parseFloat(transaction.amount.toString())}{' '}
                          {transaction.product_reference && `en ${transaction.product_reference}`} el{' '}
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">Descripción: {transaction.description}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700">No hay transacciones recientes.</p>
                )}
              </div>
            )}
            {activeTab === 'Operaciones' && (
              <div>
                <p className="text-gray-700">Contenido de Operaciones (aún no implementado). Aquí podrías agregar formularios para transferencias, pagos, etc.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
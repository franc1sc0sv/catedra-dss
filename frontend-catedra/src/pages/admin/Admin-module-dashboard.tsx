
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- Componente de Tarjeta de Información ---
export const Adminmoduledashboard = ({ title = "nose", value = "0" }) => {
  return (
    <div className="flex items-center bg-white rounded-lg shadow-md p-6 flex-1 min-w-[200px] border-l-4 border-blue-500"> {/* Añadido un borde azul para el detalle visual */}
      <div className="flex-grow">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

// --- Datos del Gráfico de Barras ---
const productsChartData = {
  labels: ['Cuentas', 'Tarjetas', 'Préstamos', 'Seguros'],
  datasets: [
    {
      label: 'Cantidad',
      data: [350, 480, 250, 180], // Datos de ejemplo para las alturas de las barras
      backgroundColor: [
        '#4299E1', // Un azul estándar
        '#3182CE', // Un azul ligeramente más oscuro
        '#63B3ED', // Un azul más claro
        '#90CDF4', // Otro azul suave
      ],
      borderRadius: 4, // Bordes redondeados para las barras
    },
  ],
};

const productsChartOptions= { 
  responsive: true,
  maintainAspectRatio: false, // Permite que el gráfico no mantenga su relación de aspecto original
  plugins: {
    legend: {
      display: false, // Ocultar la leyenda del gráfico
    },
    title: {
      display: false, // Ocultar el título del gráfico si se define en la UI superior
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // Ocultar las líneas de la cuadrícula en el eje X
      },
      ticks: {
        font: {
          size: 12,
          weight: 'bold', // Explicitly type as 'bold'
        },
        color: '#4A5568', // Color del texto de las etiquetas del eje X
      },
    },
    y: {
      display: false, // Ocultar el eje Y
      grid: {
        display: false, // Ocultar las líneas de la cuadrícula en el eje Y
      },
      ticks: {
        display: false, // Ocultar las etiquetas de los ticks en el eje Y
      },
    },
  },
};


// --- Datos de Transacciones Recientes ---
const recentTransactions = [
  { referencia: 'TRX-001', cliente: 'Juan Pérez', monto: 500.00, fecha: '20/03/2025' },
  { referencia: 'TRX-002', cliente: 'María López', monto: -120.00, fecha: '20/03/2025' },
  { referencia: 'TRX-003', cliente: 'Carlos Ruiz', monto: 1200.00, fecha: '19/03/2025' },
  { referencia: 'TRX-004', cliente: 'Ana Martínez', monto: -350.00, fecha: '19/03/2025' },
];

// --- Componente Principal del Dashboard ---
export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-white p-6">
      {/* Encabezado del Dashboard */}
      

      {/* Tarjetas de Información */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Adminmoduledashboard title="Empleados" value="45" />
        <Adminmoduledashboard title="Clientes" value="1,250" />
        <Adminmoduledashboard title="Productos" value="3,478" />
        <Adminmoduledashboard title="Transacciones" value="8,945" />
      </div>

      {/* Sección de Gráficos y Tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos por Tipo - Gráfico de Barras */}
        <div className="bg-white rounded-lg shadow-md p-6 h-[400px]"> {/* Altura fija para el contenedor del gráfico */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Productos por Tipo</h2>
          <div className="h-[calc(100%-40px)]"> {/* Asegura que el gráfico tome el espacio restante */}
            <Bar data={productsChartData} options={productsChartOptions} />
          </div>
        </div>

        {/* Transacciones Recientes - Tabla */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Transacciones Recientes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referencia
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.referencia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.cliente}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      <span className={transaction.monto >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {transaction.monto >= 0 ? '+' : ''}${transaction.monto.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.fecha}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
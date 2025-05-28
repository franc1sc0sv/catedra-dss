import React from 'react';
import {
  toggleClientStatus,
  getClients,
  createClient,
} from "../../../api/clients";
import {
  type Client,
  type ToggleClientStatusResponse,
  type ListClientsResponse, // Assuming this is also defined in client.interface
} from '../../../interfaces/client.interface';

import { useState, useEffect } from 'react';

// Define the CreateClientInput interface directly within this file,
// or ensure it's correctly imported from client.interface.
// For this example, I'm including it directly as per your request.
export interface CreateClientInput {
  username: string;
  password: string;
  full_name: string;
  marital_status: "single" | "married" | "divorced" | "widowed";
  identity_document: string;
  birth_date: string;
  age: number;
  occupation: string;
  monthly_income: number;
  emails: string[];
  phones: string[];
}

// ClientTable component
interface ClientTableProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  loading: boolean;
  error: string | null;
}

const ClientTable: React.FC<ClientTableProps> = ({ clients, setClients, loading, error }) => {
  const toggleUserStatus = async (id: string) => {
    // Debugging: Log the ID being sent
    console.log('Toggling status for client ID:', id);
    try {
      const response: ToggleClientStatusResponse = await toggleClientStatus(id);
      if (response.success) {
        setClients(clients.map((client) =>
          client.id === id ? { ...client, is_active: response.data?.is_active ?? client.is_active } : client
        ));
      } else if (response.error) {
        alert(`Error toggling status: ${response.error}`);
      }
    } catch (err) {
      alert(`Failed to toggle client status: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando clientes...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Lista de Clientes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono(s)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo(s)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesión</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salario Mensual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No hay clientes registrados.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.identity_document}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {/* Defensive check for client.phones */}
                    {Array.isArray(client.phones) ? client.phones.join(', ') : client.phones || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {/* Defensive check for client.emails */}
                    {Array.isArray(client.emails) ? client.emails.join(', ') : client.emails || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.occupation}</td>
                  {/* Ensure monthly_income is a number before calling toFixed */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${typeof client.monthly_income === 'number' ? client.monthly_income.toFixed(2) : '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        client.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {client.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => toggleUserStatus(client.id)}
                      className={`px-3 py-1 rounded-md ${
                        client.is_active
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {client.is_active ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ClientsModule = () => {
  const [clientData, setClientData] = useState<CreateClientInput>({
    username: '',
    password: '', // Changed to empty string for user input
    full_name: '',
    marital_status: 'single',
    identity_document: '',
    birth_date: '',
    age: 0,
    occupation: '',
    monthly_income: 0,
    emails: [],
    phones: [],
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define InputChangeEvent more broadly to include all target elements
  interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {}


  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response: ListClientsResponse = await getClients();
        if (response.success && response.data) {
          const processedClients = response.data.map(client => ({
            ...client,
            phones: Array.isArray(client.phones) ? client.phones : (client.phones ? [client.phones] : []),
            emails: Array.isArray(client.emails) ? client.emails : (client.emails ? [client.emails] : []),
            // Ensure age and monthly_income are numbers when fetched from API
            age: Number(client.age),
            monthly_income: Number(client.monthly_income)
          }));
          setClients(processedClients);
        } else if (response.error) {
          setError(response.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching clients');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleInputChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      // Convert to number for 'age' and 'monthly_income' fields
      [name]: (name === 'age' || name === 'monthly_income') ? Number(value) : value,
    }));
  };

  const handleArrayInputChange = (e: InputChangeEvent, type: 'emails' | 'phones') => {
    const { value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [type]: value.split(',').map((item) => item.trim()).filter(item => item !== ''),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const parsedAge = Number(clientData.age);
    const parsedMonthlyIncome = Number(clientData.monthly_income);

    if (isNaN(parsedAge) || parsedAge <= 0) {
      setError('Age must be a positive number.');
      return;
    }
    if (isNaN(parsedMonthlyIncome) || parsedMonthlyIncome < 0) {
      setError('Monthly income must be a non-negative number.');
      return;
    }
    if (clientData.password.length < 6) { // Example validation for password length
        setError('Password must be at least 6 characters long.');
        return;
    }


    try {
      const dataToSend: CreateClientInput = {
        ...clientData,
        age: parsedAge,
        monthly_income: parsedMonthlyIncome,
        username: clientData.identity_document, // Assuming username is identity document
        marital_status: clientData.marital_status as "single" | "married" | "divorced" | "widowed",
      };

      const response = await createClient(dataToSend);
      if (response.success && response.data) {
        const newClient: Client = {
          ...response.data,
          // Ensure phones and emails are arrays, and age/monthly_income are numbers from the API response
          phones: Array.isArray(response.data.phones) ? response.data.phones : (response.data.phones ? [response.data.phones] : []),
          emails: Array.isArray(response.data.emails) ? response.data.emails : (response.data.emails ? [response.data.emails] : []),
          age: Number(response.data.age),
          monthly_income: Number(response.data.monthly_income),
        };
        setClients((prevClients) => [...prevClients, newClient]);

        setClientData({
          username: '',
          password: '', // Reset password field after successful submission
          full_name: '',
          marital_status: 'single',
          identity_document: '',
          birth_date: '',
          age: 0,
          occupation: '',
          monthly_income: 0,
          emails: [],
          phones: [],
        });
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error creating client');
      } else {
        setError('Error creating client');
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Datos del Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                placeholder="Nombre completo"
                value={clientData.full_name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="identity_document" className="block text-sm font-medium text-gray-700">Documento de Identidad</label>
              <input
                type="text"
                id="identity_document"
                name="identity_document"
                placeholder="00000000-0"
                value={clientData.identity_document}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* New Password Input Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Ingresa la contraseña"
                value={clientData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
              <div className="relative mt-1">
                <input
                  type="date"
                  id="birth_date"
                  name="birth_date"
                  value={clientData.birth_date}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Edad</label>
              <input
                type="number"
                id="age"
                name="age"
                placeholder="0"
                value={clientData.age}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="marital_status" className="block text-sm font-medium text-gray-700">Estado familiar</label>
              <select
                id="marital_status"
                name="marital_status"
                value={clientData.marital_status}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="single">Soltero(a)</option>
                <option value="married">Casado(a)</option>
                <option value="divorced">Divorciado(a)</option>
                <option value="widowed">Viudo(a)</option>
              </select>
            </div>
            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Profesión</label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                placeholder="Profesión"
                value={clientData.occupation}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="emails" className="block text-sm font-medium text-gray-700">Correo Electrónico (separar con comas)</label>
              <input
                type="text"
                id="emails"
                name="emails"
                placeholder="correo1@ejemplo.com, correo2@ejemplo.com"
                value={clientData.emails.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'emails')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="phones" className="block text-sm font-medium text-gray-700">Teléfono (separar con comas)</label>
              <input
                type="text"
                id="phones"
                name="phones"
                placeholder="0000-0000, 1111-1111"
                value={clientData.phones.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'phones')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="monthly_income" className="block text-sm font-medium text-gray-700">Salario Mensual</label>
              <input
                type="number"
                id="monthly_income"
                name="monthly_income"
                placeholder="0.00"
                value={clientData.monthly_income}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>

      <ClientTable clients={clients} setClients={setClients} loading={loading} error={error} />
    </div>
  );
};
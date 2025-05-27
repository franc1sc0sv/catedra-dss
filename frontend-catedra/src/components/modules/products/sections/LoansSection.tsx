// sections/LoansSection.tsx
import { useEffect, useState } from "react";
import axios from "axios";

interface Client {
  id: string;
  full_name: string;
}

interface Loan {
  id?: string;
  loan_number: string;
  client_id: string;
  client_name?: string;
  amount: number;
  category: string;
  interest_rate: number;
  payment_frequency: string;
  term_months: number;
  status?: string;
  created_at?: string;
}

const API_URL = "http://localhost:8000/api/loans";
const CLIENTS_URL = "http://localhost:8000/api/clients";

export function LoansSection() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<Omit<Loan, "id" | "client_name" | "status" | "created_at">>({
    loan_number: "",
    client_id: "",
    amount: 0,
    category: "",
    interest_rate: 0,
    payment_frequency: "",
    term_months: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // Cargar clientes
  useEffect(() => {
    axios
      .get(CLIENTS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClients(res.data.data || []))
      .catch(() => setClients([]));
  }, [token]);

  // Cargar préstamos al montar
  useEffect(() => {
    setLoading(true);
    axios
      .get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLoans(res.data.data || []);
        setError(null);
      })
      .catch(() => setError("No se pudieron cargar los préstamos"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: ["amount", "interest_rate", "term_months"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(API_URL, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Recargar lista
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoans(res.data.data || []);
      setForm({
        loan_number: "",
        client_id: "",
        amount: 0,
        category: "",
        interest_rate: 0,
        payment_frequency: "",
        term_months: 0,
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "No se pudo guardar el préstamo. Verifica los campos."
      );
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Agregar Préstamo</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Préstamo
            </label>
            <input
              type="text"
              name="loan_number"
              placeholder="LN-001"
              value={form.loan_number}
              onChange={handleFormChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <select
              name="client_id"
              value={form.client_id}
              onChange={handleFormChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Seleccione un cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto
            </label>
            <input
              type="number"
              name="amount"
              placeholder="Monto"
              value={form.amount}
              onChange={handleFormChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <input
              type="text"
              name="category"
              placeholder="Personal, Auto, etc."
              value={form.category}
              onChange={handleFormChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tasa de Interés
            </label>
            <input
              type="number"
              name="interest_rate"
              placeholder="5.5"
              value={form.interest_rate}
              onChange={handleFormChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia de Pago
            </label>
            <select
              name="payment_frequency"
              value={form.payment_frequency}
              onChange={handleFormChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Seleccione</option>
              <option value="Mensual">Mensual</option>
              <option value="Quincenal">Quincenal</option>
              <option value="Semanal">Semanal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plazo (meses)
            </label>
            <input
              type="number"
              name="term_months"
              placeholder="12"
              value={form.term_months}
              onChange={handleFormChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </form>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium bg-white hover:bg-gray-50"
            onClick={() =>
              setForm({
                loan_number: "",
                client_id: "",
                amount: 0,
                category: "",
                interest_rate: 0,
                payment_frequency: "",
                term_months: 0,
              })
            }
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            disabled={loading}
            formNoValidate={false}
          >
            Guardar
          </button>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Listado de Préstamos</h2>
        {loading ? (
          <div>Cargando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Préstamo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interés</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frecuencia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plazo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.loan_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.client_name || loan.client_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${loan.amount?.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.interest_rate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.payment_frequency}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.term_months}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
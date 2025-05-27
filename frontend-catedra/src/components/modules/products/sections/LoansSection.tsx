// sections/LoansSection.tsx
import { useEffect, useState } from "react";
import { getClients } from "../../../../api/clients";
import type { Client } from "../../../../interfaces/client.interface";
import type { Loan } from "../../../../interfaces/financial-products.interface";
import { LoanCategory } from "../../../../enums/loan-category.enum";
import { ProductStatus } from "../../../../enums/product-status.enum";
import { createLoan, getLoans } from "../../../../api/financial-products";

const DEFAULT_FORM_DATA = {
  client_id: "",
  reference_number: "",
  loan_amount: 0,
  payment_terms: 0,
  monthly_payment: 0,
  due_date: "",
  interest_rate: 0,
  insurance_fee: 0,
  beneficiaries: "",
  category: LoanCategory.PERSONAL,
  loan_status: ProductStatus.ACTIVE,
  issue_date: "",
};

export function LoansSection() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [form, setForm] =
    useState<Omit<Loan, "id" | "client_name" | "status" | "created_at">>(
      DEFAULT_FORM_DATA
    );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // Cargar clientes
  useEffect(() => {
    const fetcher = async () => {
      const clients = await getClients();
      setClients(clients.data || []);
    };
    fetcher();
  }, [token]);

  // Cargar préstamos al montar
  useEffect(() => {
    const fetcher = async () => {
      const loans = await getLoans();
      setLoans(loans.data || []);
    };
    fetcher();
  }, [token]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      await createLoan(form);
      // Recargar lista
      const loans = await getLoans();
      setLoans(loans.data || []);
      setForm(DEFAULT_FORM_DATA);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar el préstamo. Verifica los campos."
      );
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Agregar Préstamo
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Préstamo
            </label>
            <input
              type="text"
              name="reference_number"
              placeholder="LN-001"
              value={form.reference_number}
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
              name="loan_amount"
              placeholder="Monto"
              value={form.loan_amount}
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
              name="monthly_payment"
              value={form.monthly_payment}
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
              name="payment_terms"
              placeholder="12"
              value={form.payment_terms}
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
                ...DEFAULT_FORM_DATA,
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
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Listado de Préstamos
        </h2>
        {loading ? (
          <div>Cargando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Préstamo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interés
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frecuencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plazo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.reference_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.client_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${loan.loan_amount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.interest_rate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.monthly_payment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.payment_terms}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.loan_status}
                    </td>
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

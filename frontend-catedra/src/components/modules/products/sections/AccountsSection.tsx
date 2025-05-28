// sections/AccountsSection.tsx
import { useEffect, useState } from "react";
import { getAccounts, createAccount } from "../../../../api/financial-products";
import { getClients } from "../../../../api/clients";
import type {
  Account,
  AccountBeneficiary,
  CreateAccountInput,
} from "../../../../interfaces/financial-products.interface";
import type { Client } from "../../../../interfaces/client.interface";

const DEFAULT_FORM: Omit<CreateAccountInput, "account_number"> = {
  client_id: "",
  amount: 0,
  beneficiaries: [],
};

export function AccountsSection() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<CreateAccountInput>({
    ...DEFAULT_FORM,
    account_number: "",
  });
  const [currentBeneficiary, setCurrentBeneficiary] = useState<
    Omit<AccountBeneficiary, "id" | "account_id" | "created_at">
  >({
    full_name: "",
    relationship: "",
    percentage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar clientes
  useEffect(() => {
    getClients()
      .then((res) => setClients(res.data || []))
      .catch(() => setClients([]));
  }, []);

  // Cargar cuentas reales de la API
  useEffect(() => {
    setLoading(true);
    getAccounts()
      .then((res) =>
        setAccounts(
          (res.data || []).map((acc: Account) => ({
            ...acc,
            beneficiaries: Array.isArray(acc.beneficiaries)
              ? acc.beneficiaries
              : acc.beneficiaries
              ? JSON.parse(acc.beneficiaries)
              : [],
          }))
        )
      )
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleBeneficiaryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentBeneficiary((prev) => ({
      ...prev,
      [name]: name === "percentage" ? Number(value) : value,
    }));
  };

  const addBeneficiary = () => {
    if (
      currentBeneficiary.full_name &&
      currentBeneficiary.relationship &&
      currentBeneficiary.percentage > 0
    ) {
      setForm((prev) => ({
        ...prev,
        beneficiaries: [...prev.beneficiaries, currentBeneficiary],
      }));
      setCurrentBeneficiary({
        full_name: "",
        relationship: "",
        percentage: 0,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación simple
    if (
      !form.client_id ||
      !form.account_number ||
      !form.amount ||
      form.beneficiaries.length === 0
    ) {
      setError(
        "Por favor, completa todos los campos y agrega al menos un beneficiario."
      );
      return;
    }

    setLoading(true);
    try {
      await createAccount(form);
      const res = await getAccounts();
      setAccounts(res.data || []);
      setForm({ ...DEFAULT_FORM, account_number: "" });
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "No se pudo guardar la cuenta. Verifica los campos."
      );
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Datos de la Cuenta
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select
                name="client_id"
                value={form.client_id}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
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
                Número de Cuenta
              </label>
              <input
                type="text"
                name="account_number"
                value={form.account_number}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="0000-0000-0000" // <-- Este es el placeholder sugerido
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto de Apertura
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount === 0 ? "" : form.amount}
                onChange={handleFormChange}
                placeholder="0.00"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Beneficiarios */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              Beneficiarios
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={currentBeneficiary.full_name}
                  onChange={handleBeneficiaryChange}
                  placeholder="Nombre completo"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parentesco
                </label>
                <input
                  type="text"
                  name="relationship"
                  value={currentBeneficiary.relationship}
                  onChange={handleBeneficiaryChange}
                  placeholder="Parentesco"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porcentaje
                </label>
                <input
                  type="number"
                  name="percentage"
                  value={
                    currentBeneficiary.percentage === 0
                      ? ""
                      : currentBeneficiary.percentage
                  }
                  onChange={handleBeneficiaryChange}
                  placeholder="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addBeneficiary}
                  className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200"
                >
                  Agregar
                </button>
              </div>
            </div>
            {form.beneficiaries.length > 0 && (
              <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                {form.beneficiaries.map((b, idx) => (
                  <li key={idx} className="p-2 text-sm text-gray-600">
                    {b.full_name} - {b.relationship} - {b.percentage}%
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium bg-white hover:bg-gray-50"
              onClick={() => {
                setForm({ ...DEFAULT_FORM, account_number: "" });
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              Guardar
            </button>
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
      </div>

      {/* Lista de Cuentas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Lista de Cuentas
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Apertura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beneficiarios
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((acc) => (
                <tr key={acc.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {acc.account_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {clients.find((c) => c.id === acc.client_id)?.full_name ||
                      acc.client_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {acc.opening_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${Number(acc.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(Array.isArray(acc.beneficiaries) ? acc.beneficiaries : [])
                      .map((b) => b.full_name)
                      .join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

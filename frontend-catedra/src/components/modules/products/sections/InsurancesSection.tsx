// sections/InsurancesSection.tsx
import { useEffect, useState } from "react";
import { getClients } from "../../../../api/clients";
import { getInsurances, createInsurance } from "../../../../api/financial-products";
import type { Insurance, CreateInsuranceInput } from "../../../../interfaces/financial-products.interface";
import type { Client } from "../../../../interfaces/client.interface";
import { InsuranceType } from "../../../../enums/insurance-type.enum";
import { PaymentFrequency } from "../../../../enums/payment-frequency.enum";
import { AssistanceType } from "../../../../enums/assistance-type.enum";
// import { ProductStatus } from "../../../../enums/product-status.enum";

const DEFAULT_FORM: Omit<CreateInsuranceInput, "client_id"> & { client_id: string } = {
  client_id: "",
  reference_number: "",
  type: InsuranceType.LIFE,
  contract_date: "",
  end_date: "",
  payment_frequency: PaymentFrequency.MONTHLY,
  fee_amount: 0,
  insured_amount: 0,
  daily_hospital_rent: 0,
  coverage_conditions: "",
  assistance_type: AssistanceType.ROADSIDE, // <-- Corrige aquí
};

export function InsurancesSection() {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<CreateInsuranceInput & { client_id: string }>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar clientes
  useEffect(() => {
    getClients()
      .then((res) => setClients(res.data || []))
      .catch(() => setClients([]));
  }, []);

  // Cargar seguros
  useEffect(() => {
    setLoading(true);
    getInsurances()
      .then((res) => setInsurances(res.data || []))
      .catch(() => setInsurances([]))
      .finally(() => setLoading(false));
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: [
        "fee_amount",
        "insured_amount",
        "daily_hospital_rent"
      ].includes(name)
        ? value === "" ? "" : Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación simple
    if (
      !form.client_id ||
      !form.reference_number ||
      !form.type ||
      !form.contract_date ||
      !form.end_date ||
      !form.payment_frequency ||
      !form.fee_amount
    ) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    setLoading(true);
    try {
      await createInsurance(form);
      const res = await getInsurances();
      setInsurances(res.data || []);
      setForm(DEFAULT_FORM);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "No se pudo guardar el seguro. Verifica los campos."
      );
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Agregar Seguro</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Referencia</label>
            <input
              type="text"
              name="reference_number"
              value={form.reference_number}
              onChange={handleFormChange}
              placeholder="Referencia"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Seguro</label>
            <select
              name="type"
              value={form.type}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              {Object.values(InsuranceType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Contrato</label>
            <input
              type="date"
              name="contract_date"
              value={form.contract_date}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Finalización</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia de Pago</label>
            <select
              name="payment_frequency"
              value={form.payment_frequency}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              {Object.values(PaymentFrequency).map((freq) => (
                <option key={freq} value={freq}>
                  {freq}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto de la Cuota</label>
            <input
              type="number"
              name="fee_amount"
              value={form.fee_amount === 0 ? "" : form.fee_amount}
              onChange={handleFormChange}
              placeholder="Cuota"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto Asegurado</label>
            <input
              type="number"
              name="insured_amount"
              value={form.insured_amount === 0 ? "" : form.insured_amount}
              onChange={handleFormChange}
              placeholder="Monto asegurado"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Renta Hospitalaria Diaria</label>
            <input
              type="number"
              name="daily_hospital_rent"
              value={form.daily_hospital_rent === 0 ? "" : form.daily_hospital_rent}
              onChange={handleFormChange}
              placeholder="Renta diaria"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condiciones de Cobertura</label>
            <input
              type="text"
              name="coverage_conditions"
              value={form.coverage_conditions}
              onChange={handleFormChange}
              placeholder="Condiciones"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Asistencia</label>
            <select
              name="assistance_type"
              value={form.assistance_type}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              {Object.values(AssistanceType).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </form>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium bg-white hover:bg-gray-50"
            onClick={() => setForm(DEFAULT_FORM)}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            disabled={loading}
            onClick={handleSubmit}
          >
            Guardar
          </button>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      {/* Listado de Seguros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Listado de Seguros</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referencia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Contrato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Fin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuota</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {insurances.map((ins) => (
                <tr key={ins.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ins.reference_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {clients.find((c) => c.id === ins.client_id)?.full_name || ins.client_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ins.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ins.contract_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ins.end_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${Number(ins.fee_amount).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{ins.insurance_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
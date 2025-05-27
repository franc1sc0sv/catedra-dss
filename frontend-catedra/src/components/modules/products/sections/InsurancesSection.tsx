// sections/InsurancesSection.tsx
import { useState } from "react";

interface Insurance {
  reference_number: string;
  type: string;
  contract_date: string;
  end_date: string;
  payment_frequency: string;
  fee_amount: number;
  insured_amount?: number;
  daily_hospital_rent?: number;
  coverage_conditions?: string;
  assistance_type?: string;
  insurance_status: "active" | "inactive";
}

export function InsurancesSection() {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [form, setForm] = useState<Insurance>({
    reference_number: "",
    type: "",
    contract_date: "",
    end_date: "",
    payment_frequency: "",
    fee_amount: 0,
    insurance_status: "active",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: ["fee_amount", "insured_amount", "daily_hospital_rent"].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInsurances([...insurances, form]);
    setForm({
      reference_number: "",
      type: "",
      contract_date: "",
      end_date: "",
      payment_frequency: "",
      fee_amount: 0,
      insurance_status: "active",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Agregar Seguro</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          <div>
            <label htmlFor="reference_number" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Referencia
            </label>
            <input
              type="text"
              id="reference_number"
              name="reference_number"
              placeholder="Referencia"
              value={form.reference_number}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Seguro
            </label>
            <input
              type="text"
              id="type"
              name="type"
              placeholder="Tipo"
              value={form.type}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="contract_date" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Contrato
            </label>
            <input
              type="date"
              id="contract_date"
              name="contract_date"
              value={form.contract_date}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Finalización
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={form.end_date}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="payment_frequency" className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia de Pago
            </label>
            <input
              type="text"
              id="payment_frequency"
              name="payment_frequency"
              placeholder="Frecuencia de pago"
              value={form.payment_frequency}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="fee_amount" className="block text-sm font-medium text-gray-700 mb-1">
              Monto de la Cuota
            </label>
            <input
              type="number"
              id="fee_amount"
              name="fee_amount"
              placeholder="Cuota"
              value={form.fee_amount}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="insurance_status" className="block text-sm font-medium text-gray-700 mb-1">
              Estado del Seguro
            </label>
            <select
              id="insurance_status"
              name="insurance_status"
              value={form.insurance_status}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </form>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Guardar
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Listado de Seguros</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referencia
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Contrato
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Fin
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cuota
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {insurances.map((ins, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ins.reference_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ins.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ins.contract_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ins.end_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${ins.fee_amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{ins.insurance_status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
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
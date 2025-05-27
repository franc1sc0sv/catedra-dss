// sections/AccountsSection.tsx
import { useState } from "react";

interface Beneficiary {
  nombre: string;
  documento: string;
  parentesco: string;
  porcentaje: number;
}

interface Account {
  cliente: string;
  numero_cuenta: string;
  tipo_cuenta: string;
  fecha_apertura: string;
  monto_apertura: number;
  beneficiarios: Beneficiary[];
}

export function AccountsSection() {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      cliente: "Ana Martinez",
      numero_cuenta: "1234-5678-9012",
      tipo_cuenta: "Ahorro",
      fecha_apertura: "15/01/2025",
      monto_apertura: 500.00,
      beneficiarios: []
    },
    {
      cliente: "Roberto Gómez",
      numero_cuenta: "2345-6789-0123",
      tipo_cuenta: "Corriente",
      fecha_apertura: "20/02/2025",
      monto_apertura: 1000.00,
      beneficiarios: []
    },
  ]);
  const [form, setForm] = useState<Omit<Account, 'beneficiarios' | 'numero_cuenta'>>({
    cliente: "",
    tipo_cuenta: "",
    fecha_apertura: "",
    monto_apertura: 0,
  });
  const [currentBeneficiary, setCurrentBeneficiary] = useState<Beneficiary>({
    nombre: "",
    documento: "",
    parentesco: "",
    porcentaje: 0,
  });
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "monto_apertura" ? Number(value) : value,
    }));
  };

  const handleBeneficiaryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentBeneficiary((prevBeneficiary) => ({
      ...prevBeneficiary,
      [name]: name === "porcentaje" ? Number(value) : value,
    }));
  };

  const addBeneficiary = () => {
    if (currentBeneficiary.nombre && currentBeneficiary.documento && currentBeneficiary.parentesco && currentBeneficiary.porcentaje >= 0) {
      setBeneficiaries((prev) => [...prev, currentBeneficiary]);
      setCurrentBeneficiary({
        nombre: "",
        documento: "",
        parentesco: "",
        porcentaje: 0,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccountNumber = `0000-0000-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const newAccount: Account = {
      ...form,
      numero_cuenta: newAccountNumber,
      beneficiarios: beneficiaries,
    };
    setAccounts([...accounts, newAccount]);
    setForm({
      cliente: "",
      tipo_cuenta: "",
      fecha_apertura: "",
      monto_apertura: 0,
    });
    setBeneficiaries([]); // Clear beneficiaries after adding account
  };

  return (
    <div className="space-y-6">
      {/* Datos de la Cuenta */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Datos de la Cuenta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          <div>
            <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <select
              id="cliente"
              name="cliente"
              value={form.cliente}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Seleccione un cliente</option>
              <option value="Ana Martinez">Ana Martinez</option>
              <option value="Roberto Gómez">Roberto Gómez</option>
            </select>
          </div>
          <div>
            <label htmlFor="numero_cuenta" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Cuenta
            </label>
            <input
              type="text"
              id="numero_cuenta"
              name="numero_cuenta"
              value="0000-0000-0000"
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="tipo_cuenta" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Cuenta
            </label>
            <select
              id="tipo_cuenta"
              name="tipo_cuenta"
              value={form.tipo_cuenta}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Seleccione</option>
              <option value="Ahorro">Ahorro</option>
              <option value="Corriente">Corriente</option>
              <option value="Inversión">Inversión</option>
            </select>
          </div>
          <div className="relative">
            <label htmlFor="fecha_apertura" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Apertura
            </label>
            <input
              type="date"
              id="fecha_apertura"
              name="fecha_apertura"
              value={form.fecha_apertura}
              onChange={handleFormChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="mm/ dd/ yyyy"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none top-5">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
            </div>
          </div>
          <div>
            <label htmlFor="monto_apertura" className="block text-sm font-medium text-gray-700 mb-1">
              Monto de Apertura
            </label>
            <input
              type="number"
              id="monto_apertura"
              name="monto_apertura"
              value={form.monto_apertura}
              onChange={handleFormChange}
              placeholder="0.00"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Beneficiarios */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Beneficiarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 mb-4">
          <div>
            <label htmlFor="beneficiary_nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="beneficiary_nombre"
              name="nombre"
              value={currentBeneficiary.nombre}
              onChange={handleBeneficiaryChange}
              placeholder="Nombre completo"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="beneficiary_documento" className="block text-sm font-medium text-gray-700 mb-1">
              Documento
            </label>
            <input
              type="text"
              id="beneficiary_documento"
              name="documento"
              value={currentBeneficiary.documento}
              onChange={handleBeneficiaryChange}
              placeholder="00000000-0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="beneficiary_parentesco" className="block text-sm font-medium text-gray-700 mb-1">
              Parentesco
            </label>
            <input
              type="text"
              id="beneficiary_parentesco"
              name="parentesco"
              value={currentBeneficiary.parentesco}
              onChange={handleBeneficiaryChange}
              placeholder="Parentesco"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="beneficiary_porcentaje" className="block text-sm font-medium text-gray-700 mb-1">
              Porcentaje
            </label>
            <input
              type="number"
              id="beneficiary_porcentaje"
              name="porcentaje"
              value={currentBeneficiary.porcentaje}
              onChange={handleBeneficiaryChange}
              placeholder="0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="flex justify-start">
          <button
            type="button"
            onClick={addBeneficiary}
            className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
          >
            Agregar Beneficiario
          </button>
        </div>

        {beneficiaries.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Beneficiarios Agregados:</h3>
            <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
              {beneficiaries.map((b, idx) => (
                <li key={idx} className="p-3 text-sm text-gray-600">
                  {b.nombre} ({b.documento}) - {b.parentesco} - {b.porcentaje}%
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Action Buttons */}
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


      {/* Lista de Cuentas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Lista de Cuentas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Apertura
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((acc, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acc.numero_cuenta}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acc.cliente}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acc.tipo_cuenta}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acc.fecha_apertura}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${acc.monto_apertura.toFixed(2)}</td>
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
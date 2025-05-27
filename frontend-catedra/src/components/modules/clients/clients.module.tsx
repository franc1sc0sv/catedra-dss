import React, { useState } from 'react';

export const ClientsModule = () => {
  // State for form data (you'll likely manage this with a state management solution or form library)
  const [clientData, setClientData] = useState({
    nombreCompleto: '',
    documentoIdentidad: '',
    fechaNacimiento: '',
    edad: '',
    calle: '',
    casa: '',
    ciudad: '',
    departamento: '', // This will be "Lugar de Trabajo" from the image
    estadoFamiliar: '',
    profesion: '',
    correoElectronico: '',
    telefono: '',
    salarioMensual: '',
    otrosIngresos: '',
    direccionTrabajo: '', // New field from the image
  });


  interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement> {}

  const handleInputChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setClientData({
      ...clientData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Client Data Submitted:', clientData);
    // Here you would typically send this data to an API
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Client Data Form Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Datos del Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Nombre Completo */}
            <div>
              <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                placeholder="Nombre completo"
                value={clientData.nombreCompleto}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Documento de Identidad */}
            <div>
              <label htmlFor="documentoIdentidad" className="block text-sm font-medium text-gray-700">Documento de Identidad</label>
              <input
                type="text"
                id="documentoIdentidad"
                name="documentoIdentidad"
                placeholder="00000000-0"
                value={clientData.documentoIdentidad}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Fecha de Nacimiento */}
            <div>
              <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
              <div className="relative mt-1">
                <input
                  type="text"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  placeholder="mm/dd/yyyy"
                  value={clientData.fechaNacimiento}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {/* Calendar icon */}
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            {/* Edad */}
            <div>
              <label htmlFor="edad" className="block text-sm font-medium text-gray-700">Edad</label>
              <input
                type="number"
                id="edad"
                name="edad"
                placeholder="0"
                value={clientData.edad}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Calle */}
            <div>
              <label htmlFor="calle" className="block text-sm font-medium text-gray-700">Calle</label>
              <input
                type="text"
                id="calle"
                name="calle"
                placeholder="Calle principal"
                value={clientData.calle}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Casa */}
            <div>
              <label htmlFor="casa" className="block text-sm font-medium text-gray-700">Casa</label>
              <input
                type="text"
                id="casa"
                name="casa"
                placeholder="#123"
                value={clientData.casa}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Ciudad */}
            <div>
              <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700">Ciudad</label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                placeholder="Ciudad"
                value={clientData.ciudad}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Departamento (now Lugar de Trabajo) */}
            <div>
              <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">Lugar de Trabajo</label>
              <input
                type="text"
                id="departamento"
                name="departamento"
                placeholder="Empresa"
                value={clientData.departamento}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Estado Familiar */}
            <div>
              <label htmlFor="estadoFamiliar" className="block text-sm font-medium text-gray-700">Estado familiar</label>
              <select
                id="estadoFamiliar"
                name="estadoFamiliar"
                value={clientData.estadoFamiliar}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Seleccione</option>
                <option value="soltero">Soltero(a)</option>
                <option value="casado">Casado(a)</option>
                <option value="divorciado">Divorciado(a)</option>
                <option value="viudo">Viudo(a)</option>
                <option value="union_libre">Unión Libre</option>
              </select>
            </div>
            {/* Profesión */}
            <div>
              <label htmlFor="profesion" className="block text-sm font-medium text-gray-700">Profesión</label>
              <input
                type="text"
                id="profesion"
                name="profesion"
                placeholder="Profesión"
                value={clientData.profesion}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Correo Electrónico */}
            <div>
              <label htmlFor="correoElectronico" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                id="correoElectronico"
                name="correoElectronico"
                placeholder="correo@ejemplo.com"
                value={clientData.correoElectronico}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                placeholder="0000-0000"
                value={clientData.telefono}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Salario Mensual */}
            <div>
              <label htmlFor="salarioMensual" className="block text-sm font-medium text-gray-700">Salario Mensual</label>
              <input
                type="number"
                id="salarioMensual"
                name="salarioMensual"
                placeholder="0.00"
                value={clientData.salarioMensual}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Otros Ingresos */}
            <div>
              <label htmlFor="otrosIngresos" className="block text-sm font-medium text-gray-700">Otros Ingresos</label>
              <input
                type="number"
                id="otrosIngresos"
                name="otrosIngresos"
                placeholder="0.00"
                value={clientData.otrosIngresos}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Dirección de Trabajo */}
            <div>
              <label htmlFor="direccionTrabajo" className="block text-sm font-medium text-gray-700">Dirección de Trabajo</label>
              <input
                type="text"
                id="direccionTrabajo"
                name="direccionTrabajo"
                placeholder="Dirección"
                value={clientData.direccionTrabajo}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
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

      {/* Client List Section (Similar to your previous ClientTable) */}
      <ClientTable />
    </div>
  );
};

// ClientTable component (kept separate for clarity, but you could integrate it)
const ClientTable = () => {
  const [clients, setClients] = useState([
    {
      documento: '00000000-4',
      nombre: 'Ana Martinez',
      telefono: '7777-7777',
      correo: 'ana@ejemplo.com',
      trabajo: 'Empresa ABC',
      active: true
    },
    {
      documento: '00000000-5',
      nombre: 'Roberto Gómez',
      telefono: '8888-8888',
      correo: 'roberto@ejemplo.com',
      trabajo: 'Empresa XYZ',
      active: true
    },
    {
      documento: '00000000-6',
      nombre: 'Laura Sánchez',
      telefono: '9999-9999',
      correo: 'laura@ejemplo.com',
      trabajo: 'Empresa DEF',
      active: true
    }
  ]);

  const toggleUserStatus = (documento:unknown) => {
    setClients(clients.map(client => 
      client.documento === documento 
        ? { ...client, active: !client.active } 
        : client
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Lista de Clientes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lugar de Trabajo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.documento}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.documento}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.telefono}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.correo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.trabajo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => toggleUserStatus(client.documento)}
                    className={`px-3 py-1 rounded-md ${
                      client.active 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {client.active ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
    </div>
  );
};
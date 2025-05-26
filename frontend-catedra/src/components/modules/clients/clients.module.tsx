import React from 'react';

export const ClientsModule = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Employee Data Form Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Datos del Empleado</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Código */}
          <div>
            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">Código</label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value="EMP-001"
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
            />
          </div>
          {/* Nombre Completo */}
          <div>
            <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              placeholder="Nombre completo"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {/* Estado Familiar */}
          <div>
            <label htmlFor="estadoFamiliar" className="block text-sm font-medium text-gray-700">Estado familiar</label>
            <select
              id="estadoFamiliar"
              name="estadoFamiliar"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option>Seleccione</option>
              {/* Add more options here */}
            </select>
          </div>
          {/* Documento de Identidad */}
          <div>
            <label htmlFor="documentoIdentidad" className="block text-sm font-medium text-gray-700">Documento de Identidad</label>
            <input
              type="text"
              id="documentoIdentidad"
              name="documentoIdentidad"
              placeholder="00000000-0"
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {/* Calendar icon - you might use an actual SVG or icon library here */}
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
              value="30"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {/* Departamento */}
          <div>
            <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">Departamento</label>
            <input
              type="text"
              id="departamento"
              name="departamento"
              placeholder="Departamento"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {/* Puesto */}
          <div>
            <label htmlFor="puesto" className="block text-sm font-medium text-gray-700">Puesto</label>
            <input
              type="text"
              id="puesto"
              name="puesto"
              placeholder="Puesto"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {/* Departamento Laboral */}
          <div>
            <label htmlFor="departamentoLaboral" className="block text-sm font-medium text-gray-700">Departamento Laboral</label>
            <select
              id="departamentoLaboral"
              name="departamentoLaboral"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option>Seleccione</option>
              {/* Add more options here */}
            </select>
          </div>
          {/* Sueldo */}
          <div>
            <label htmlFor="sueldo" className="block text-sm font-medium text-gray-700">Sueldo</label>
            <input
              type="number"
              id="sueldo"
              name="sueldo"
              placeholder="0.00"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {/* Profesión */}
          <div>
            <label htmlFor="profesion" className="block text-sm font-medium text-gray-700">Profesión</label>
            <input
              type="text"
              id="profesion"
              name="profesion"
              placeholder="Profesión"
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
      </div>

      {/* Employee List Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Lista de Empleados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puesto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Example Data */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EMP-001</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Juan Pérez</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0000000-1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Gerente</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Finanzas</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* Action button - you might use an actual SVG or icon library here */}
                  <button className="text-blue-600 hover:text-blue-900">
                    <img src="/path/to/your/edit-icon.png" alt="Edit" className="h-6 w-6 rounded-full" /> {/* Replace with actual icon path */}
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EMP-002</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">María López</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0000000-2</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cajera</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Atención al Cliente</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <button className="text-blue-600 hover:text-blue-900">
                    <img src="/path/to/your/edit-icon.png" alt="Edit" className="h-6 w-6 rounded-full" /> {/* Replace with actual icon path */}
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EMP-003</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Carlos Ruiz</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0000000-3</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Asesor</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Atención al Cliente</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <button className="text-blue-600 hover:text-blue-900">
                    <img src="/path/to/your/edit-icon.png" alt="Edit" className="h-6 w-6 rounded-full" /> {/* Replace with actual icon path */}
                  </button>
                </td>
              </tr>
              {/* More rows can be added here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
import React from 'react';

export const TransactionsModule = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Transaction Data Form Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Datos de la Transacción</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Código de Transacción */}
          <div>
            <label htmlFor="codigoTransaccion" className="block text-sm font-medium text-gray-700">Código de Transacción</label>
            <input
              type="text"
              id="codigoTransaccion"
              name="codigoTransaccion"
              value="TRX-0000"
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
            />
          </div>
          {/* Tipo de Producto */}
          <div>
            <label htmlFor="tipoProducto" className="block text-sm font-medium text-gray-700">Tipo de Producto</label>
            <select
              id="tipoProducto"
              name="tipoProducto"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option>Seleccione</option>
              {/* Add more options here */}
            </select>
          </div>
          {/* Número de Referencia */}
          <div>
            <label htmlFor="numeroReferencia" className="block text-sm font-medium text-gray-700">Número de Referencia</label>
            <input
              type="text"
              id="numeroReferencia"
              name="numeroReferencia"
              placeholder="Referencia"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {/* Cliente */}
          <div>
            <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">Cliente</label>
            <input
              type="text"
              id="cliente"
              name="cliente"
              placeholder="Nombre del cliente"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {/* Tipo de Transacción */}
          <div>
            <label htmlFor="tipoTransaccion" className="block text-sm font-medium text-gray-700">Tipo de Transacción</label>
            <select
              id="tipoTransaccion"
              name="tipoTransaccion"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option>Seleccione</option>
              {/* Add more options here */}
            </select>
          </div>
          {/* Monto */}
          <div>
            <label htmlFor="monto" className="block text-sm font-medium text-gray-700">Monto</label>
            <input
              type="number"
              id="monto"
              name="monto"
              placeholder="0.00"
              defaultValue={0} // Cambiado de "0.00" a 0
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {/* Empty div to maintain grid layout for "Usuario que Atiende" to align */}
          <div className="hidden md:block"></div>
          {/* Usuario que Atiende */}
          <div>
            <label htmlFor="usuarioAtiende" className="block text-sm font-medium text-gray-700">Usuario que Atiende</label>
            <input
              type="text"
              id="usuarioAtiende"
              name="usuarioAtiende"
              value="Admin"
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
            />
          </div>
        </div>
        {/* Descripción (full width) */}
        <div className="mt-6">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={3}
            placeholder="Descripción de la transacción"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
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

      {/* Transaction History Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Historial de Transacciones</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Example Data */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TRX-001</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cuenta</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1234-5678-9012</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ana Martinez</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">+$500.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">20/03/2025 10:15</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cajero1</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* Search icon - you might use an actual SVG or icon library here */}
                  <button className="text-gray-600 hover:text-gray-900 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TRX-002</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Tarjeta</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">**** **** **** 1234</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ana Martinez</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-$120.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">20/03/2025 11:30</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cajero2</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <button className="text-gray-600 hover:text-gray-900 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TRX-003</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Préstamo</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PREST-001</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Roberto Gómez</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">+$1,200.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">19/03/2025 15:45</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cajero1</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <button className="text-gray-600 hover:text-gray-900 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
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
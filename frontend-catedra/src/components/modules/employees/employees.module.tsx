import React, { useState } from 'react';

export const EmployeesModule = () => {
  // State for form data (you'll likely manage this with a state management solution or form library)
  const [employeeData, setEmployeeData] = useState({
    codigo: 'EMP-001', // Pre-filled as in your original
    nombreCompleto: '',
    estadoFamiliar: '',
    documentoIdentidad: '',
    fechaNacimiento: '',
    edad: '',
    calle: '',
    casa: '',
    ciudad: '',
    lugarTrabajo: '', // Renamed from 'departamento' to be clearer for employee's workplace
    puesto: '',
    departamentoLaboral: '', // Specific to employee's department within the workplace
    sueldo: '',
    profesion: '',
    correoElectronico: '',
    telefono: '',
  });



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Employee Data Submitted:', employeeData);
    
  };

  // State for the employee list, including an 'active' status
  const [employees, setEmployees] = useState([
    {
      codigo: 'EMP-001',
      nombre: 'Juan Pérez',
      documento: '0000000-1',
      puesto: 'Gerente',
      departamento: 'Finanzas', // Assuming 'Departamento Laboral' for the list
      active: true, // Added active status
    },
    {
      codigo: 'EMP-002',
      nombre: 'María López',
      documento: '0000000-2',
      puesto: 'Cajera',
      departamento: 'Atención al Cliente',
      active: true, // Added active status
    },
    {
      codigo: 'EMP-003',
      nombre: 'Carlos Ruiz',
      documento: '0000000-3',
      puesto: 'Asesor',
      departamento: 'Ventas', // Updated department
      active: false, // Example of an inactive employee
    },
  ]);

  const toggleEmployeeStatus = (codigo:unknown) => {
    setEmployees(employees.map(employee =>
      employee.codigo === codigo
        ? { ...employee, active: !employee.active }
        : employee
    ));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Employee Data Form Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Datos del Empleado</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Código */}
            <div>
              <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">Código</label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={employeeData.codigo}
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
                value={employeeData.nombreCompleto}
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
                value={employeeData.estadoFamiliar}
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
            {/* Documento de Identidad */}
            <div>
              <label htmlFor="documentoIdentidad" className="block text-sm font-medium text-gray-700">Documento de Identidad</label>
              <input
                type="text"
                id="documentoIdentidad"
                name="documentoIdentidad"
                placeholder="00000000-0"
                value={employeeData.documentoIdentidad}
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
                  value={employeeData.fechaNacimiento}
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
                value={employeeData.edad}
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
                value={employeeData.calle}
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
                value={employeeData.casa}
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
                value={employeeData.ciudad}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Lugar de trabajo */}
            <div>
              <label htmlFor="lugarTrabajo" className="block text-sm font-medium text-gray-700">Lugar de trabajo</label>
              <input
                type="text"
                id="lugarTrabajo"
                name="lugarTrabajo"
                placeholder="Empresa"
                value={employeeData.lugarTrabajo}
                onChange={handleInputChange}
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
                value={employeeData.puesto}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Departamento Laboral */}
            <div>
              <label htmlFor="departamentoLaboral" className="block text-sm font-medium text-gray-700">Departamento Laboral</label>
              <select
                id="departamentoLaboral"
                name="departamentoLaboral"
                value={employeeData.departamentoLaboral}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Seleccione</option>
                <option value="finanzas">Finanzas</option>
                <option value="rrhh">Recursos Humanos</option>
                <option value="ventas">Ventas</option>
                <option value="marketing">Marketing</option>
                <option value="it">IT</option>
                <option value="atencion_cliente">Atención al Cliente</option>
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
                value={employeeData.sueldo}
                onChange={handleInputChange}
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
                value={employeeData.profesion}
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
                value={employeeData.correoElectronico}
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
                value={employeeData.telefono}
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
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.codigo}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.documento}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.puesto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.departamento}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => toggleEmployeeStatus(employee.codigo)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold ${
                        employee.active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {employee.active ? 'Activo' : 'Inactivo'}
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
};
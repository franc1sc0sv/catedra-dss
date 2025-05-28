// sections/CardsSection.tsx
import { useEffect, useState } from "react";
import { getClients } from "../../../../api/clients";
import { getCards, createCard } from "../../../../api/financial-products";
import type { Card, CreateCardInput } from "../../../../interfaces/financial-products.interface";
import type { Client } from "../../../../interfaces/client.interface";
// import { ProductStatus } from "../../../../enums/product-status.enum";

const DEFAULT_FORM: Omit<CreateCardInput, "card_number"> & { issue_date: string } = {
  client_id: "",
  limit_amount: 0,
  network: "Visa",
  category: "Classic",
  interest_rate: 0,
  membership_fee: 0,
  issue_date: "",
};

export function CardsSection() {
  const [cards, setCards] = useState<Card[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<CreateCardInput & { issue_date: string }>({
    ...DEFAULT_FORM,
    card_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar clientes
  useEffect(() => {
    getClients()
      .then((res) => setClients(res.data || []))
      .catch(() => setClients([]));
  }, []);

  // Cargar tarjetas
  useEffect(() => {
    setLoading(true);
    getCards()
      .then((res) => setCards(res.data || []))
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["limit_amount", "interest_rate", "membership_fee"].includes(name)
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
      !form.card_number ||
      !form.limit_amount ||
      !form.network ||
      !form.category ||
      !form.interest_rate ||
      !form.membership_fee ||
      !form.issue_date
    ) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      await createCard(form); // issue_date ya está en form
      const res = await getCards();
      setCards(res.data || []);
      setForm({ ...DEFAULT_FORM, card_number: "" });
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "No se pudo guardar la tarjeta. Verifica los campos."
      );
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Datos de la Tarjeta
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
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
              Número de Tarjeta
            </label>
            <input
              type="text"
              name="card_number"
              value={form.card_number}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="0000-0000-0000-0000"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Límite de Crédito
            </label>
            <input
              type="number"
              name="limit_amount"
              value={form.limit_amount === 0 ? "" : form.limit_amount}
              onChange={handleFormChange}
              placeholder="0.00"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Red
            </label>
            <select
              name="network"
              value={form.network}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="Visa">Visa</option>
              <option value="MasterCard">MasterCard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="Classic">Classic</option>
              <option value="Infinite">Infinite</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
              <option value="Business">Business</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tasa de Interés (%)
            </label>
            <input
              type="number"
              name="interest_rate"
              value={form.interest_rate === 0 ? "" : form.interest_rate}
              onChange={handleFormChange}
              placeholder="0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuota de Membresía
            </label>
            <input
              type="number"
              name="membership_fee"
              value={form.membership_fee === 0 ? "" : form.membership_fee}
              onChange={handleFormChange}
              placeholder="0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Emisión
            </label>
            <input
              type="date"
              name="issue_date"
              value={form.issue_date}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
        </form>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium bg-white hover:bg-gray-50"
            onClick={() => setForm({ ...DEFAULT_FORM, card_number: "" })}
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

      {/* Listado de Tarjetas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Listado de Tarjetas
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
                  Fecha Emisión
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Límite
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Red
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interés
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membresía
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cards.map((card) => (
                <tr key={card.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {card.card_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {clients.find((c) => c.id === card.client_id)?.full_name || card.client_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {card.issue_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${Number(card.limit_amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {card.network}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {card.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {card.interest_rate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${Number(card.membership_fee).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {card.card_status}
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
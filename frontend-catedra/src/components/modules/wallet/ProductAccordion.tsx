import React from "react";
import { WalletProducts } from "../../../interfaces/wallet.interface";

interface Props {
  products: WalletProducts;
}

export const ProductAccordion = ({ products }: Props) => {
  const sections = [
    { title: "Cuentas", items: products.accounts },
    { title: "Tarjetas", items: products.cards },
    { title: "Préstamos", items: products.loans },
    { title: "Seguros", items: products.insurances },
  ];

  return (
    <div>
      {sections.map((section, idx) => (
        <details key={idx} style={{ marginBottom: "1rem" }}>
          <summary style={{ fontWeight: "bold", cursor: "pointer" }}>{section.title}</summary>
          <ul>
            {section.items.map((item: any) => (
              <li key={item.id}>{item.name} - ${item.balance ?? 0} - Estado: {item.status}</li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
};

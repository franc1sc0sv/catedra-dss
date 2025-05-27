import React, { useState } from "react";
import { WalletProducts, TransactionOutput } from "../../../interfaces/wallet.interface";
import { ProductAccordion } from "./ProductAccordion";
import { TransactionTable } from "./TransactionTable";

interface Props {
  products: WalletProducts;
  transactions: TransactionOutput[];
}

export const WalletTabs = ({ products, transactions }: Props) => {
  const [activeTab, setActiveTab] = useState<"productos" | "transacciones" | "operaciones">("productos");

  return (
    <div style={{ marginTop: "2rem" }}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={() => setActiveTab("productos")}>Productos</button>
        <button onClick={() => setActiveTab("transacciones")}>Transacciones</button>
        <button onClick={() => setActiveTab("operaciones")}>Operaciones</button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        {activeTab === "productos" && <ProductAccordion products={products} />}
        {activeTab === "transacciones" && <TransactionTable transactions={transactions} />}
        {activeTab === "operaciones" && <p>(Aquí irían las operaciones futuras)</p>}
      </div>
    </div>
  );
};

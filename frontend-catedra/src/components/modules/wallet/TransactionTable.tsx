import React from "react";
import { TransactionOutput } from "../../../interfaces/wallet.interface";

interface Props {
  transactions: TransactionOutput[];
}

export const TransactionTable = ({ transactions }: Props) => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Descripción</th>
          <th>Monto</th>
          <th>Producto</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(tx => (
          <tr key={tx.id}>
            <td>{tx.date}</td>
            <td>{tx.description}</td>
            <td>${tx.amount}</td>
            <td>{tx.productType}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

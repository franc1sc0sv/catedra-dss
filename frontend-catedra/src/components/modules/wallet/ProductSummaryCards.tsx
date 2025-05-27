import React from 'react';
import { WalletProducts } from '../../interfaces/wallet.interface';
import { FaPiggyBank, FaCreditCard, FaHandHoldingUsd, FaShieldAlt } from 'react-icons/fa';

interface Props {
  products: WalletProducts;
}

export const ProductSummaryCards = ({ products }: Props) => {
  const items = [
    { label: 'Cuentas', count: products.accounts.length, icon: <FaPiggyBank /> },
    { label: 'Tarjetas', count: products.cards.length, icon: <FaCreditCard /> },
    { label: 'Préstamos', count: products.loans.length, icon: <FaHandHoldingUsd /> },
    { label: 'Seguros', count: products.insurances.length, icon: <FaShieldAlt /> }
  ];

  return (
    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
      {items.map((item, index) => (
        <div key={index} style={{ background: '#f3f3f3', padding: '1rem', borderRadius: '10px', flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
          <h4>{item.label}</h4>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{item.count}</p>
        </div>
      ))}
    </div>
  );
};

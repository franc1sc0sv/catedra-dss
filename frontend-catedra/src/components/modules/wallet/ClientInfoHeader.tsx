import React from 'react';
import { Client } from '../../interfaces/client.interface';

interface Props {
  client: Client;
}

export const ClientInfoHeader = ({ client }: Props) => {
  return (
    <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
      <h2>Cartera de {client.name}</h2>
      <p><strong>Documento:</strong> {client.document}</p>
      <p><strong>Teléfono:</strong> {client.phone}</p>
      <p><strong>Correo:</strong> {client.email}</p>
    </div>
  );
};

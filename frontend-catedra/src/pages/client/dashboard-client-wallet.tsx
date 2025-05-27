import { useEffect, useState } from "react";
import { DashboardClientTemplate } from "./index-dashboard-client";
import { getWalletData } from "../../api/wallet";
import { WalletOutput } from "../../interfaces/wallet.interface";

// 🧩 Componentes
import { ClientInfoHeader } from "../../components/modules/wallet/ClientInfoHeader";
import { ProductSummaryCards } from "../../components/modules/wallet/ProductSummaryCards";
import { WalletTabs } from "../../components/modules/wallet/WalletTabs";

export const DashboardClientWallet = () => {
  const [wallet, setWallet] = useState<WalletOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getWalletData();
        setWallet(res.data);
      } catch (error) {
        console.error("Error cargando la cartera:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Cargando cartera...</p>;
  if (!wallet) return <p>No se pudo cargar la cartera.</p>;

  return (
    <DashboardClientTemplate>
      <div className="wallet-container">
        <ClientInfoHeader client={wallet.client} />
        <ProductSummaryCards products={wallet.products} />
        <WalletTabs
          products={wallet.products}
          transactions={wallet.recent_transactions}
        />
      </div>
    </DashboardClientTemplate>
  );
};

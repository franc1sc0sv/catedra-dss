import React from "react";
import DashboardLayoutSidebar from "./dashboard-layout-sidebar";
import DashboardLayoutHeader from "./dashboard-layout-header";

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  links: { label: string; icon?: React.ReactNode; to: string }[];
  children: React.ReactNode;
}

const DashboardLayout = ({
  title,
  subtitle,
  links,
  children,
}: DashboardLayoutProps) => (
  <div className="flex min-h-screen bg-[#2c2f3a]">
    <DashboardLayoutSidebar
      links={links}      
      
    />
    <div className="flex-1 flex flex-col bg-[#f4f7fa]">
      <DashboardLayoutHeader title={title} subtitle={subtitle} />
      <main className="flex-1 p-8 shadow-lg m-6 rounded-lg bg-white">
        {children}
      </main>
    </div>
  </div>
);

export default DashboardLayout;

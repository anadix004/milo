"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ApprovalsGrid from "@/components/admin/ApprovalsGrid";
import DashboardView from "@/components/admin/DashboardView";
import ModerationStudio from "@/components/admin/ModerationStudio";
import UserDirectory from "@/components/admin/UserDirectory";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen w-full">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 h-full overflow-hidden flex flex-col p-8 md:p-12 relative z-10 overflow-y-auto no-scrollbar">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "approvals" && <ApprovalsGrid />}
        {activeTab === "moderation" && <ModerationStudio />}
        {activeTab === "users" && <UserDirectory />}
        {activeTab === "bulk" && <BulkUploadStudio />}
        
        {/* Placeholder for other tabs */}
        {["analytics", "settings"].includes(activeTab) && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl font-black text-white/20 uppercase tracking-tighter mb-4">
              {activeTab} Module
            </h2>
            <p className="text-white/40 font-mono text-xs uppercase tracking-widest">
              Under Construction
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

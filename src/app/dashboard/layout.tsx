import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* 🔹 Aquí se renderizarán las subrutas (Perfiles, Panel de Control, Settings) */}
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

// import { Outlet } from "react-router-dom";
// import { AppSidebar } from "@/components/app-sidebar";
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// export default function DashboardLayout() {
//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         {/* 🔹 Aquí se renderizarán las subrutas (Perfiles, Panel de Control, Settings) */}
//         <Outlet />
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// export default function DashboardLayout() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/"); // 🚨 Si no hay token, redirige al Login
//     }
//   }, [navigate]);

export default function DashboardLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Si el token ha expirado, redirige al Login
    if (!localStorage.getItem("token")) {
      navigate("/");
    }

  }, [navigate]);
  
  return (
    <SidebarProvider>
        <AppSidebar />
          <SidebarInset>
          <Outlet />
          </SidebarInset>
    </SidebarProvider>
  );
}

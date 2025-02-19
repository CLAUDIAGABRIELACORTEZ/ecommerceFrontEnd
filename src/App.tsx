

import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

import DashboardLayout from "./app/dashboard/layout"; // Importamos el Layout
import WellcomePage from "./app/dashboard/page"; // Página principal del Dashboard
import PanelDeControl from "./app/dashboard/panel-de-control/page";
import Perfiles from "./app/dashboard/perfiles/page";
import Settings from "./app/dashboard/settings/page";
import { ThemeProvider } from "./components/theme-provider";
import ProtectedRoute from "./routes/ProtecteRuote";
import PageLogin from "./app/login/page";
import UsersTable from "./Modules/User/Page/userTable";
import RolesTable from "./Modules/User/Page/RolesTable";
// import PermissionsTable from "./Modules/User/Page/PermissionsTable";

import { Toaster } from "react-hot-toast"; // ✅ Importamos Toaster
const AppRoutes = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Router>
      <Toaster position="bottom-right" /> {/* ✅ Agregamos Toaster aquí */}
      <Routes>
        {/* Ruta principal con el Login */}
        <Route path="/" element={<PageLogin />} />

        {/* Dashboard con Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<WellcomePage />} />
            <Route path="panel-de-control" element={<PanelDeControl />} />
            <Route path="perfiles" element={<Perfiles />} />
            <Route path="settings" element={<Settings />} />
            <Route path="usuarios" element={<UsersTable />} />
            <Route path="roles" element={<RolesTable />} />
            {/* <Route path="permisos" element={<PermissionsTable />} /> */}
          </Route>
        </Route>
      </Routes>
    </Router>
  </ThemeProvider>
  );
};

export default AppRoutes;


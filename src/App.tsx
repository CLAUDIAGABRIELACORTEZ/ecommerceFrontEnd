// import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
// import { LoginForm } from "./components/login-form";
// import Dashboard from "./app/dashboard/page";
// import PanelDeControl from "./app/dashboard/panel-de-control/page";
// import Perfiles from "./app/dashboard/perfiles/page";
// import Settings from "./app/dashboard/settings/page";


// const AppRoutes = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* Ruta principal con el Login */}
//         <Route path="/" element={<LoginForm />} />

//         {/* Rutas del Dashboard */}
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/dashboard/panel-de-control" element={<PanelDeControl />} />
//         <Route path="/dashboard/perfiles" element={<Perfiles />} />
//         <Route path="/dashboard/settings" element={<Settings />} />
//       </Routes>
//     </Router>
//   );
// };

// export default AppRoutes;

import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { LoginForm } from "./components/login-form";
import DashboardLayout from "./app/dashboard/layout"; // Importamos el Layout
import WellcomePage from "./app/dashboard/page"; // Página principal del Dashboard
import PanelDeControl from "./app/dashboard/panel-de-control/page";
import Perfiles from "./app/dashboard/perfiles/page";
import Settings from "./app/dashboard/settings/page";
import { ThemeProvider } from "./components/theme-provider";

const AppRoutes = () => {
  return (
    <ThemeProvider defaultTheme = "dark" storageKey="vite-ui-theme">
    <Router>
      <Routes>
        {/* Ruta principal con el Login */}
        <Route path="/" element={<LoginForm />} />

        {/* Dashboard con Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<WellcomePage />} /> {/* Página principal */}
          <Route path="panel-de-control" element={<PanelDeControl />} />
          <Route path="perfiles" element={<Perfiles />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
    </ThemeProvider>
  );
};

export default AppRoutes;


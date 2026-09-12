// App.jsx
// ------------------------------------------------------
// Application root.
//
// BrowserRouter is placed at the top so every component,
// including Navbar, can access routing.
// ------------------------------------------------------

import {
  BrowserRouter,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { RoomProvider } from "./context/RoomContext";

import AppLayout from "./components/layout/AppLayout";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <RoomProvider>

          <AppLayout>

            <AppRoutes />

          </AppLayout>

        </RoomProvider>

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;
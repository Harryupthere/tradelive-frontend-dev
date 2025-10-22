import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./utils/redux/store.ts";
import { AuthProvider } from "./context/authContext.tsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthWatcher from "./components/AuthWatcher"; // <-- new

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <AuthProvider>
          <AuthWatcher /> {/* <-- runs and monitors token */}
          <App />
        </AuthProvider>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
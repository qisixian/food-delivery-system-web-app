import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/app/i18n";
import "@/styles/index.css";
import { RouterProvider } from "react-router";
import { router } from "@/app/router.tsx";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { GlobalSnackbarProvider } from "@/app/providers/GlobalSnackbarProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <GlobalSnackbarProvider>
        <RouterProvider router={router} />
      </GlobalSnackbarProvider>
    </Provider>
  </StrictMode>
);

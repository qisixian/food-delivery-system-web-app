import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@/app/i18n";
import { RouterProvider } from "react-router";
import {router} from "@/app/router.tsx";
import { Provider } from "react-redux";
import {store} from "@/app/store";

import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          <RouterProvider router={router} />
      </Provider>
  </StrictMode>,
)

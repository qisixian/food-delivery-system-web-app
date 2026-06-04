import { X } from "lucide-react";
import {closeSnackbar, SnackbarProvider} from 'notistack'

export function GlobalSnackbarProvider({children}: {children: React.ReactNode }) {
    return (
        <SnackbarProvider
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            // maxSnack={3}
            // autoHideDuration={3000}
            preventDuplicate
            action={(key) => (
                <button
                    // size="small"
                    // color="inherit"
                    onClick={() => closeSnackbar(key)}
                >
                    <X />
                </button>
            )}
        >
            {children}
        </SnackbarProvider>
    );
}
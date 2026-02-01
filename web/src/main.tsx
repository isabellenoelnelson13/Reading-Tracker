import ReactDOM from "react-dom/client"
import App from "./App"

import "primereact/resources/themes/lara-light-teal/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import "primeflex/primeflex.css"

import "./index.css"


import { PrimeReactProvider } from "primereact/api"
import { ToastProvider } from "./components/ToastProvider"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <PrimeReactProvider value={{ ripple: true }}>
        <ToastProvider>
            <App />
        </ToastProvider>
    </PrimeReactProvider>
)

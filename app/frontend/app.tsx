import clientErrorHandling from "@/lib/clientErrorsReporting"
import Providers from "@/lib/providers"
import { updateStore } from "@/lib/store"
import sdk from "@farcaster/miniapp-sdk"
import { useEffect } from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import Header from "./components/Header"
import Home from "./pages/Home"

export default function App() {
  useEffect(() => {
    clientErrorHandling()
    ;(async function () {
      try {
        const { user, client } = await sdk.context
        const capabilities = await sdk.getCapabilities()
        updateStore({ user, client, capabilities })
      } catch (error) {}

      await sdk.actions.ready({ disableNativeGestures: true }).catch(() => {})

      try {
        const { token: session } = await sdk.quickAuth.getToken()
        updateStore({ session })
      } catch (error) {}
    })()
  }, [])

  return (
    <div onDragStart={e => e.preventDefault()}>
      <Providers>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Home />
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </Providers>
    </div>
  )
}

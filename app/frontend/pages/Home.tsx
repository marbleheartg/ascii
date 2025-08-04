import { store } from "@/lib/store"
import sdk from "@farcaster/miniapp-sdk"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import clsx from "clsx"

export default function Home() {
  const { user } = store()
  const pfpUrl = user?.pfpUrl

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pfpUrl", pfpUrl],
    queryFn: () => axios.get("/api/ascii", { params: { pfpUrl, width: window.innerWidth } }).then(res => res.data),
    enabled: !!pfpUrl,
  })

  return (
    <main className={clsx("fixed top-15 inset-x-0 bottom-0")}>
      <div className={clsx("flex justify-center")}>
        <div className={clsx("whitespace-pre font-mono leading-none")}>{isLoading ? "isLoading..." : data}</div>
      </div>

      <button
        onClick={() => sdk.actions.composeCast({ text: data, embeds: [`https://${process.env.NEXT_PUBLIC_HOST}`] })}
        className={clsx("absolute bottom-15 left-1/2 -translate-x-1/2", "text-lg lowercase")}
      >
        Share
      </button>
    </main>
  )
}

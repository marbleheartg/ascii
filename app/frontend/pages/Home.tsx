import { store } from "@/lib/store"
import sdk from "@farcaster/miniapp-sdk"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import clsx from "clsx"

// make txt ascii generation

export default function Home() {
  const { user } = store()
  const pfpUrl = user?.pfpUrl

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pfpUrl", pfpUrl],
    queryFn: () => axios.get("/api/ascii", { params: { pfpUrl, width: window.innerWidth } }).then(res => res.data),
    enabled: !!pfpUrl,
  })

  const placeholder =
    Array.from({ length: 4 })
      .map(_ => "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n")
      .join("") +
    Array.from({ length: Math.floor((33 - user?.username?.length!) / 2) + 1 })
      .map(_ => "⣿")
      .join("") +
    " " +
    user?.username +
    " " +
    Array.from({ length: Math.floor((33 - user?.username?.length!) / 2) + 1 })
      .map(_ => "⣿")
      .join("") +
    "\n" +
    Array.from({ length: 4 })
      .map(_ => "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n")
      .join("") +
    "\n"

  return (
    <main className={clsx("fixed top-5 inset-x-0 bottom-0", "overflow-hidden")}>
      <div className={clsx("flex justify-center")}>
        <div className={clsx("whitespace-pre font-mono leading-none")}>{isLoading ? "isLoading..." : data}</div>
      </div>

      <button
        onClick={() =>
          sdk.actions.composeCast({
            text: placeholder + data,
            embeds: [`https://${process.env.NEXT_PUBLIC_HOST}`],
          })
        }
        className={clsx("absolute bottom-15 left-1/2 -translate-x-1/2", "text-lg lowercase")}
      >
        Share
      </button>
    </main>
  )
}

import { store } from "@/lib/store"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import clsx from "clsx"

export default function Home() {
  const { user } = store()
  const pfpUrl = user?.pfpUrl

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pfpUrl", pfpUrl],
    queryFn: () => axios.get("/api/ascii", { params: { pfpUrl } }).then(res => res.data),
    enabled: !!pfpUrl,
  })

  return (
    <main className={clsx("fixed top-50 bottom-0 inset-x-0 whitespace-pre font-mono")}>
      <div>Home page</div>
      <div className={clsx("whitespace-pre font-mono leading-none")}>{data}</div>
    </main>
  )
}

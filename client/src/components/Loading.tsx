import { Loader2 } from "lucide-react"

const Loading = () => {
  return (
    <div className="flex-center min-h-96 h-full w-full">
      <Loader2 className="animate-spin size-8 text-green-950" />

    </div>
  )
}

export default Loading
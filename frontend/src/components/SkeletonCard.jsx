export default function SkeletonCard() {
  return (
    <div className="ticket-card animate-pulse">
      <div className="aspect-[2/3] w-full bg-marquee-line/60" />
      <div className="ticket-perf" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-3/4 rounded bg-marquee-line/60" />
        <div className="h-3 w-1/2 rounded bg-marquee-line/40" />
        <div className="h-3 w-full rounded bg-marquee-line/40" />
        <div className="mt-2 h-8 w-full rounded-md bg-marquee-line/40" />
      </div>
    </div>
  )
}

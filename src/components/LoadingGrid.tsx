export default function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: 'var(--color-card)' }}>
          <div style={{ paddingTop: '75%', background: 'rgba(255,255,255,0.05)' }} />
          <div className="p-3 space-y-2">
            <div className="h-3 rounded" style={{ background: 'rgba(255,255,255,0.07)', width: '85%' }} />
            <div className="h-3 rounded" style={{ background: 'rgba(255,255,255,0.05)', width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

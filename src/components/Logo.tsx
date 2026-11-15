/**
 * Marca do sistema: S6 MARTE · Mission Protocol.
 * O losango e o "6" usam o laranja da marca; o "S" e o texto usam o gelo.
 */
export function Logo({ compacto = false }: { compacto?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 100 100"
        className="h-8 w-8 shrink-0"
        role="img"
        aria-label="S6 Marte"
      >
        {/* Losango da marca */}
        <path
          d="M50 4 L96 50 L50 96 L4 50 Z"
          fill="none"
          stroke="#E66A2C"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        {/* S em gelo */}
        <text
          x="34"
          y="66"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="46"
          fontWeight="700"
          fill="#E9E8E2"
          textAnchor="middle"
        >
          S
        </text>
        {/* 6 em laranja */}
        <text
          x="66"
          y="66"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="46"
          fontWeight="700"
          fill="#E66A2C"
          textAnchor="middle"
        >
          6
        </text>
      </svg>

      {!compacto && (
        <div className="leading-none">
          <div className="text-[15px] font-semibold tracking-[0.18em] text-gelo">MARTE</div>
          <div className="mt-1 text-[11px] font-medium tracking-[0.2em] text-gelo/55">
            MISSION PROTOCOL
          </div>
        </div>
      )}
    </div>
  )
}

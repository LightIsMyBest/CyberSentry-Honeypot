import React, { useState, useEffect } from 'react';
import { Attack, Severity } from '../types';

interface WorldMapProps {
  attacks: Attack[];
  onSelectAttack: (attack: Attack) => void;
  selectedAttackId?: string;
}

const severityColor = {
    [Severity.Critical]: "red",
    [Severity.High]: "orange",
    [Severity.Medium]: "yellow",
    [Severity.Low]: "blue",
}

const WorldMap: React.FC<WorldMapProps> = ({ attacks, onSelectAttack, selectedAttackId }) => {
    const [points, setPoints] = useState<any[]>([]);
    const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

    useEffect(() => {
        const newPoints = attacks.map(attack => ({
            id: attack.id,
            x: attack.coords.x,
            y: attack.coords.y,
            severity: attack.severity,
            type: attack.type,
            ip: attack.ip
        })).slice(0, 20);
        setPoints(newPoints);
    }, [attacks]);
    
    const latestAttackId = attacks[0]?.id;
    const findAttackById = (id: string) => attacks.find(a => a.id === id);

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Simplified world map path */}
        <path
          d="M499.999 499.718c275.053 0 497.863-222.809 497.863-497.863C997.862 1.8 775.052-.001 499.999-.001S2.137 1.8.001 2.137C.001 276.909 224.946 499.718 499.999 499.718z M499.999-.001L499.999-.001z M235.031 285.872c-1.429 2.144-1.429 2.858-1.429 4.287s1.429 2.858 1.429 3.573l2.858-2.144c1.429 0 2.144-.714 2.144-2.144s-1.429-2.144-2.144-2.858l-2.858-.714z"
          fill="#111827"
          stroke="#059669"
          strokeWidth="0.5"
        />
        <path d="M428.571 300c-7.143-4.286-10-15-13.571-22.143-2.857-5.714-3.571-12.143-3.571-18.571 0-7.857 0-16.429 3.571-22.857 5-10 10.714-19.286 17.857-27.857 5.714-7.143 10-15 15.714-21.429C455 81.429 460.714 75 467.143 70c10.714-7.143 22.857-11.429 35.714-14.286 21.429-4.286 44.286-1.429 65 5.714 17.143 5.714 32.857 15.714 47.143 27.143 12.143 10 22.143 22.143 30 35.714 7.143 12.143 10.714 25.714 12.143 40 2.143 15.714.714 32.143-3.571 47.143-3.571 12.857-9.286 25-17.143 35.714-8.571 12.143-18.571 22.143-30.714 30.714-17.143 12.143-37.143 19.286-57.857 20.714-25 2.143-49.286-4.286-70.714-17.143-15-8.571-27.857-20.714-37.857-35-5.714-8.571-10.714-17.857-14.286-27.857z" fill="#1f2937" />
        {points.map((p) => {
           const isLatest = p.id === latestAttackId;
           const isSelected = p.id === selectedAttackId;
           const fullAttack = findAttackById(p.id);

           return (
            <g 
                key={p.id}
                onClick={() => fullAttack && onSelectAttack(fullAttack)}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer"
            >
                <circle
                    cx={`${p.x}%`}
                    cy={`${p.y}%`}
                    r={isSelected ? 6 : isLatest ? 5 : 3}
                    fill={severityColor[p.severity]}
                    fillOpacity={0.7}
                    stroke={isSelected ? 'white' : severityColor[p.severity]}
                    strokeWidth={isSelected ? 2 : isLatest ? 2 : 0.5}
                    strokeOpacity={0.9}
                    className="transition-all duration-200"
                >
                    {isLatest && !isSelected && (
                        <animate 
                            attributeName="r" 
                            from="5" 
                            to="15" 
                            dur="1.5s" 
                            begin="0s" 
                            repeatCount="indefinite"
                        />
                    )}
                    <animate 
                        attributeName="fill-opacity" 
                        from="0.7" 
                        to="0" 
                        dur="1.5s" 
                        begin="0s" 
                        repeatCount="indefinite"
                    />
                </circle>
            </g>
           )
        })}
        {hoveredPoint && (
            <g style={{pointerEvents: 'none'}} transform={`translate(${hoveredPoint.x / 100 * 1000 + 10}, ${hoveredPoint.y / 100 * 500})`}>
                <rect x="0" y="-18" width="150" height="36" fill="rgba(17, 24, 39, 0.85)" rx="4" stroke="#4b5563" />
                <text x="5" y="0" fill="#d1d5db" fontSize="12" fontWeight="bold">{hoveredPoint.type}</text>
                <text x="5" y="14" fill="#9ca3af" fontSize="10">{hoveredPoint.ip}</text>
            </g>
        )}
      </svg>
    </div>
  );
};

export default WorldMap;

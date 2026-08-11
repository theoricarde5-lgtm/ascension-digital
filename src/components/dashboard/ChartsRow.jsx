import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, LineChart, Line, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

const barData = [
  { d: '06', depot: 1200, retrait: 400 },
  { d: '09', depot: 2100, retrait: 800 },
  { d: '12', depot: 900, retrait: 300 },
  { d: '15', depot: 3400, retrait: 1200 },
  { d: '18', depot: 2800, retrait: 600 },
];

const lineData = [
  { m: 'Jan', v: 12 }, { m: 'Fév', v: 19 }, { m: 'Mar', v: 15 },
  { m: 'Avr', v: 27 }, { m: 'Mai', v: 22 },
];

function Card({ title, subtitle, children, height = 200 }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: '#FFFFFF', boxShadow: '0 4px 16px -6px rgba(100,116,139,0.25)' }}>
      <div className="mb-3">
        <h3 className="text-[14px] font-semibold" style={{ color: '#1E293B' }}>{title}</h3>
        {subtitle && <p className="text-[11.5px]" style={{ color: '#94A3B8' }}>{subtitle}</p>}
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

export default function ChartsRow() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
      <Card title="Mouvements du coffre" subtitle="Dépôts vs retraits sur la période">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} barGap={6}>
            <XAxis dataKey="d" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Bar dataKey="depot" fill="#FF5722" radius={[4, 4, 0, 0]} />
            <Bar dataKey="retrait" fill="#FFCCBC" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Objets ajoutés" subtitle="Évolution mensuelle">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Line type="monotone" dataKey="v" stroke="#2196F3" strokeWidth={2.5} dot={{ r: 3, fill: '#2196F3' }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Objectif mensuel" subtitle="100 objets / mois">
        <div className="relative h-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ v: 66 }]} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar dataKey="v" cornerRadius={20} fill="#FF5722" background={{ fill: '#F1F5F9' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute text-center">
            <div className="text-[24px] font-bold" style={{ color: '#1E293B' }}>66%</div>
            <div className="text-[11px]" style={{ color: '#94A3B8' }}>atteint</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
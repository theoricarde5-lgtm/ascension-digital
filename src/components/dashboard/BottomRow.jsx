import React from 'react';
import { AreaChart, Area, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Plus } from 'lucide-react';

const waveData = [
  { x: 'L', v: 30 }, { x: 'M', v: 45 }, { x: 'M', v: 28 },
  { x: 'J', v: 60 }, { x: 'V', v: 38 }, { x: 'S', v: 52 }, { x: 'D', v: 42 },
];

function Card({ title, subtitle, children, height = 160, action }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: '#FFFFFF', boxShadow: '0 4px 16px -6px rgba(100,116,139,0.25)' }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-[14px] font-semibold" style={{ color: '#1E293B' }}>{title}</h3>
          {subtitle && <p className="text-[11.5px]" style={{ color: '#94A3B8' }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

export default function BottomRow({ recentObjets }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="Valeur du coffre" subtitle="Variation hebdomadaire" action={<span className="text-[12px] font-semibold" style={{ color: '#F44336' }}>- 4%</span>}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={waveData}>
            <defs>
              <linearGradient id="wv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5722" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#FF5722" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke="#FF5722" strokeWidth={2} fill="url(#wv)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Bijoux ajoutés" subtitle="Total cumulé">
        <div className="relative h-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="75%" outerRadius="100%" data={[{ v: 25 }]} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar dataKey="v" cornerRadius={20} fill="#2196F3" background={{ fill: '#F1F5F9' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute text-center">
            <div className="text-[22px] font-bold" style={{ color: '#1E293B' }}>699</div>
            <div className="text-[10.5px]" style={{ color: '#94A3B8' }}>25%</div>
          </div>
        </div>
      </Card>

      <Card title="Dernier objet" subtitle="Ajouté récemment" height={160}>
        <div className="h-full flex flex-col justify-center">
          <div className="text-[13px] font-semibold mb-1" style={{ color: '#1E293B' }}>{recentObjets?.nom || 'Aucun objet'}</div>
          <div className="text-[11.5px] mb-2" style={{ color: '#94A3B8' }}>{recentObjets?.categorie || '—'}</div>
          <div className="text-[11px]" style={{ color: '#94A3B8' }}>{recentObjets?.description || 'Ajoutez votre premier objet au registre.'}</div>
        </div>
      </Card>

      <div className="rounded-2xl p-5 flex flex-col justify-between text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FF5722, #FF8A65)', minHeight: 200 }}>
        <div>
          <h3 className="text-[15px] font-bold mb-1">Quick To-Do List</h3>
          <p className="text-[11.5px] opacity-90 leading-snug">Gérez vos tâches et suivis en un clin d'œil.</p>
        </div>
        <button className="w-12 h-12 rounded-xl bg-white flex items-center justify-center self-end mt-4" style={{ color: '#FF5722' }}>
          <Plus size={22} />
        </button>
      </div>
    </div>
  );
}
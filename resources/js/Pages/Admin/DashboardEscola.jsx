const STATUS_CONFIG = {
    pendente:   { label: 'Pendentes',   cor: 'text-amber-600', bg: 'bg-amber-500',  badge: 'bg-amber-100 text-amber-700' },
    em_analise: { label: 'Em análise',  cor: 'text-blue-600',  bg: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700' },
    aprovada:   { label: 'Aprovadas',   cor: 'text-green-600', bg: 'bg-green-500',  badge: 'bg-green-100 text-green-700' },
    recusada:   { label: 'Recusadas',   cor: 'text-red-500',   bg: 'bg-red-400',    badge: 'bg-red-100 text-red-700' },
};

function KPI({ label, valor, cor, sub, href }) {
    const Tag = href ? 'a' : 'div';
    return (
        <Tag
            href={href}
            className={`flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 ${href ? 'cursor-pointer transition hover:shadow-md hover:ring-stone-300' : ''}`}
        >
            <p className={`text-2xl font-bold ${cor ?? 'text-stone-800'}`}>{valor}</p>
            <p className="mt-1 text-xs font-semibold text-stone-500">{label}</p>
            {sub && <p className="mt-0.5 text-xs text-stone-400">{sub}</p>}
        </Tag>
    );
}

function SecaoSeries({ porSerie, totalGeral }) {
    if (!porSerie || Object.keys(porSerie).length === 0) return null;

    const CORES = [
        'bg-amber-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
        'bg-pink-500', 'bg-teal-500', 'bg-orange-500', 'bg-sky-500',
    ];

    const series = Object.entries(porSerie).sort((a, b) => b[1] - a[1]);

    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-400">
                Solicitações por série
            </p>
            <div className="space-y-2.5">
                {series.map(([serie, total], i) => {
                    const pct = totalGeral > 0 ? Math.round((total / totalGeral) * 100) : 0;
                    return (
                        <div key={serie}>
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-stone-700">{serie}</span>
                                <span className="text-xs font-semibold text-stone-500">
                                    {total} <span className="text-stone-400">({pct}%)</span>
                                </span>
                            </div>
                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-stone-100">
                                <div
                                    className={`h-full rounded-full transition-all ${CORES[i % CORES.length]}`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function DashboardEscola({ dados }) {
    const esc = dados?.escola;
    if (!esc) return null;

    const total     = esc.total ?? 0;
    const porStatus = esc.por_status ?? {};

    const ocupadas    = (porStatus.aprovada ?? 0) + (porStatus.em_analise ?? 0);
    const disponiveis = Math.max(0, (esc.total_vagas ?? 0) - ocupadas);
    const pctOcupado  = esc.total_vagas > 0 ? Math.round((ocupadas / esc.total_vagas) * 100) : 0;
    const corOcupacao = pctOcupado >= 90 ? 'text-red-600' : pctOcupado >= 70 ? 'text-amber-600' : 'text-green-600';

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h1 className="text-xl font-bold text-stone-800">{esc.escola_nome}</h1>
                    <p className="mt-0.5 text-sm text-stone-500">Painel de matrículas</p>
                </div>
                <a
                    href="/admin/matriculas"
                    className="shrink-0 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-stone-900 hover:bg-amber-400"
                >
                    Ver matrículas →
                </a>
            </div>

            {/* Alerta: pendentes há mais de 3 dias */}
            {esc.pendentes_antigos > 0 && (
                <a
                    href="/admin/matriculas"
                    className="flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3 ring-1 ring-red-200 transition hover:bg-red-100"
                >
                    <span className="text-xl">🚨</span>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-red-800">Matrículas sem análise há mais de 3 dias</p>
                        <p className="text-xs text-red-600">
                            {esc.pendentes_antigos} matrícula{esc.pendentes_antigos > 1 ? 's' : ''} aguardam análise — verifique com urgência
                        </p>
                    </div>
                    <span className="text-xs font-semibold text-red-500">Ver →</span>
                </a>
            )}

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <KPI label="Total de solicitações" valor={total} href="/admin/matriculas" />
                <KPI label="Aprovadas este mês"    valor={esc.aprovadas_mes} cor="text-green-600"
                     sub={`de ${porStatus.aprovada ?? 0} no total`} />
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <KPI
                        key={key}
                        label={cfg.label}
                        valor={porStatus[key] ?? 0}
                        cor={cfg.cor}
                        href="/admin/matriculas"
                    />
                ))}
            </div>

            {/* Barra de ocupação de vagas */}
            {esc.total_vagas > 0 && (
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Ocupação de vagas</p>
                        <span className={`text-lg font-bold ${corOcupacao}`}>{pctOcupado}%</span>
                    </div>
                    <div className="flex h-4 overflow-hidden rounded-full bg-stone-100">
                        {[
                            { key: 'aprovada',   cor: 'bg-green-500' },
                            { key: 'em_analise', cor: 'bg-blue-400' },
                            { key: 'pendente',   cor: 'bg-amber-400' },
                        ].map(({ key, cor }) => {
                            const val = porStatus[key] ?? 0;
                            const pct = esc.total_vagas > 0 ? Math.min(100, Math.round((val / esc.total_vagas) * 100)) : 0;
                            if (pct === 0) return null;
                            return (
                                <div key={key}
                                    className={`h-full ${cor} transition-all`}
                                    style={{ width: `${pct}%` }}
                                    title={`${STATUS_CONFIG[key].label}: ${val}`}
                                />
                            );
                        })}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-stone-400">
                        <span className="flex gap-3">
                            <span className="flex items-center gap-1">
                                <span className="inline-block h-2 w-2 rounded-full bg-green-500" /> {porStatus.aprovada ?? 0} aprovadas
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="inline-block h-2 w-2 rounded-full bg-blue-400" /> {porStatus.em_analise ?? 0} em análise
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="inline-block h-2 w-2 rounded-full bg-amber-400" /> {porStatus.pendente ?? 0} pendentes
                            </span>
                        </span>
                        <span className="font-medium text-stone-500">
                            {disponiveis} de {esc.total_vagas} disponíveis
                        </span>
                    </div>
                </div>
            )}

            {/* Proporção por status */}
            {total > 0 && (
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400">
                        Proporção por status
                    </p>
                    <div className="flex h-3 overflow-hidden rounded-full bg-stone-100">
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                            const val = porStatus[key] ?? 0;
                            const pct = Math.round((val / total) * 100);
                            if (pct === 0) return null;
                            return (
                                <div key={key}
                                    title={`${cfg.label}: ${val} (${pct}%)`}
                                    className={`${cfg.bg} transition-all`}
                                    style={{ width: `${pct}%` }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Distribuição por série */}
            <SecaoSeries porSerie={esc.por_serie} totalGeral={total} />
        </div>
    );
}

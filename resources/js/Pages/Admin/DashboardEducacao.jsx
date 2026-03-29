import { router } from '@inertiajs/react';

const STATUS_CONFIG = {
    pendente:   { label: 'Pendentes',   cor: 'text-amber-600', bg: 'bg-amber-500',  badge: 'bg-amber-100 text-amber-700' },
    em_analise: { label: 'Em análise',  cor: 'text-blue-600',  bg: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700' },
    aprovada:   { label: 'Aprovadas',   cor: 'text-green-600', bg: 'bg-green-500',  badge: 'bg-green-100 text-green-700' },
    recusada:   { label: 'Recusadas',   cor: 'text-red-500',   bg: 'bg-red-400',    badge: 'bg-red-100 text-red-700' },
};

// ── KPI simples ────────────────────────────────────────────────────────────────
function KPI({ label, valor, cor, sub, href }) {
    const Tag = href ? 'a' : 'div';
    return (
        <Tag
            href={href}
            className={`flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 ${href ? 'transition hover:shadow-md hover:ring-stone-300 cursor-pointer' : ''}`}
        >
            <p className={`text-2xl font-bold ${cor ?? 'text-stone-800'}`}>{valor}</p>
            <p className="mt-1 text-xs font-semibold text-stone-500">{label}</p>
            {sub && <p className="mt-0.5 text-xs text-stone-400">{sub}</p>}
        </Tag>
    );
}

// ── Barra de progresso ────────────────────────────────────────────────────────
function Barra({ valor, total, cor, title }) {
    const pct = total > 0 ? Math.min(100, Math.round((valor / total) * 100)) : 0;
    return (
        <div title={title} className={`h-full ${cor} transition-all`} style={{ width: `${pct}%` }} />
    );
}

// ── Card de escola ────────────────────────────────────────────────────────────
function CardEscola({ escola }) {
    const ocupadas   = escola.aprovadas + escola.em_analise;
    const disponiveis = Math.max(0, escola.total_vagas - ocupadas);
    const pctOcupado  = escola.total_vagas > 0 ? Math.round((ocupadas / escola.total_vagas) * 100) : 0;

    const corOcupacao = pctOcupado >= 90 ? 'text-red-600' : pctOcupado >= 70 ? 'text-amber-600' : 'text-green-600';

    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
            {/* Cabeçalho */}
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="font-bold leading-snug text-stone-800">{escola.nome}</p>
                    {escola.series && (
                        <p className="mt-0.5 text-xs text-stone-500">Séries: {escola.series}</p>
                    )}
                </div>
                <div className="shrink-0 text-right">
                    <p className={`text-lg font-bold ${corOcupacao}`}>{pctOcupado}%</p>
                    <p className="text-xs text-stone-400">ocupado</p>
                </div>
            </div>

            {/* Barra de ocupação empilhada */}
            <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-stone-100">
                <Barra valor={escola.aprovadas}  total={escola.total_vagas} cor="bg-green-500" title={`${escola.aprovadas} aprovadas`} />
                <Barra valor={escola.em_analise} total={escola.total_vagas} cor="bg-blue-400"  title={`${escola.em_analise} em análise`} />
                <Barra valor={escola.pendentes}  total={escola.total_vagas} cor="bg-amber-400" title={`${escola.pendentes} pendentes`} />
            </div>

            {/* Legenda */}
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                <span className="flex items-center gap-1 text-xs text-stone-500">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" /> {escola.aprovadas} aprovadas
                </span>
                <span className="flex items-center gap-1 text-xs text-stone-500">
                    <span className="inline-block h-2 w-2 rounded-full bg-blue-400" /> {escola.em_analise} em análise
                </span>
                <span className="flex items-center gap-1 text-xs text-stone-500">
                    <span className="inline-block h-2 w-2 rounded-full bg-amber-400" /> {escola.pendentes} pendentes
                </span>
                <span className="flex items-center gap-1 text-xs text-stone-400 ml-auto">
                    {disponiveis} vaga{disponiveis !== 1 ? 's' : ''} disponível{disponiveis !== 1 ? 'is' : ''}
                    {escola.total_vagas > 0 && ` de ${escola.total_vagas}`}
                </span>
            </div>

            {/* Ação rápida */}
            {escola.pendentes > 0 && (
                <a
                    href={`/admin/matriculas`}
                    className="mt-3 flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-100"
                >
                    ⚠️ {escola.pendentes} matrícula{escola.pendentes > 1 ? 's' : ''} aguardando nesta escola
                    <span className="ml-auto">→</span>
                </a>
            )}
        </div>
    );
}

// ── Distribuição por série ────────────────────────────────────────────────────
function SecaoSeries({ porSerie, totalGeral }) {
    if (Object.keys(porSerie).length === 0) return null;

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

// ── Dashboard de Educação ─────────────────────────────────────────────────────
export default function DashboardEducacao({ dados }) {
    const ed = dados?.educacao;
    if (!ed) return null;

    const total     = ed.total ?? 0;
    const porStatus = ed.por_status ?? {};

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-stone-800">Dashboard — Educação</h1>
                    <p className="mt-0.5 text-sm text-stone-500">Matrículas escolares · visão geral</p>
                </div>
                <a
                    href="/admin/matriculas"
                    className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-stone-900 hover:bg-amber-400"
                >
                    Gerenciar matrículas →
                </a>
            </div>

            {/* Alerta: pendentes há mais de 3 dias */}
            {ed.pendentes_antigos > 0 && (
                <a
                    href="/admin/matriculas"
                    className="flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3 ring-1 ring-red-200 transition hover:bg-red-100"
                >
                    <span className="text-xl">🚨</span>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-red-800">Matrículas sem análise há mais de 3 dias</p>
                        <p className="text-xs text-red-600">
                            {ed.pendentes_antigos} matrícula{ed.pendentes_antigos > 1 ? 's' : ''} aguardam análise — verifique com urgência
                        </p>
                    </div>
                    <span className="text-xs text-red-500 font-semibold">Ver →</span>
                </a>
            )}

            {/* Alerta: renovações pendentes */}
            {ed.renovacoes_pendentes > 0 && (
                <a
                    href="/admin/matriculas"
                    className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 ring-1 ring-blue-200 transition hover:bg-blue-100"
                >
                    <span className="text-xl">🔄</span>
                    <p className="flex-1 text-sm font-medium text-blue-800">
                        {ed.renovacoes_pendentes} renovação{ed.renovacoes_pendentes > 1 ? 'ões' : ''} de matrícula pendente{ed.renovacoes_pendentes > 1 ? 's' : ''}
                    </p>
                    <span className="text-xs text-blue-500 font-semibold">Ver →</span>
                </a>
            )}

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <KPI label="Total de solicitações" valor={total} href="/admin/matriculas" />
                <KPI label="Aprovadas este mês"    valor={ed.aprovadas_mes} cor="text-green-600"
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

            {/* Barra de progresso geral por status */}
            {total > 0 && (
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400">
                        Proporção por status
                    </p>
                    <div className="flex h-4 overflow-hidden rounded-full bg-stone-100">
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                            const val = porStatus[key] ?? 0;
                            const pct = Math.round((val / total) * 100);
                            if (pct === 0) return null;
                            return (
                                <div key={key} title={`${cfg.label}: ${val} (${pct}%)`}
                                    className={`${cfg.bg} transition-all`}
                                    style={{ width: `${pct}%` }}
                                />
                            );
                        })}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                            <span key={key} className="flex items-center gap-1 text-xs text-stone-500">
                                <span className={`inline-block h-2 w-2 rounded-full ${cfg.bg}`} />
                                {cfg.label}: <strong>{porStatus[key] ?? 0}</strong>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Ocupação por escola */}
            {ed.escolas?.length > 0 && (
                <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400 px-1">
                        Ocupação por escola
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {ed.escolas.map(escola => (
                            <CardEscola key={escola.id} escola={escola} />
                        ))}
                    </div>
                </div>
            )}

            {/* Distribuição por série */}
            <SecaoSeries porSerie={ed.por_serie} totalGeral={total} />
        </div>
    );
}

import { Head } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';
import DashboardEducacao from './DashboardEducacao';
import DashboardEscola from './DashboardEscola';

const CARDS_CONFIG = {
    matriculas_pendentes:       { emoji: '🎒', label: 'Matrículas pendentes',        href: '/admin/matriculas',       cor: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    matriculas_em_analise:      { emoji: '📋', label: 'Matrículas em análise',        href: '/admin/matriculas',       cor: 'text-blue-600',  badge: 'bg-blue-100 text-blue-700' },
    estabelecimentos_pendentes: { emoji: '🏪', label: 'Estabelecimentos pendentes',   href: '/admin/estabelecimentos', cor: 'text-purple-600',badge: 'bg-purple-100 text-purple-700' },
    noticias_publicadas:        { emoji: '📰', label: 'Notícias publicadas',          href: '/admin/noticias',         cor: 'text-green-600', badge: 'bg-green-100 text-green-700' },
    noticias_rascunho:          { emoji: '📝', label: 'Rascunhos',                    href: '/admin/noticias',         cor: 'text-stone-500', badge: 'bg-stone-100 text-stone-500' },
    noticias_destaque:          { emoji: '⭐', label: 'Em destaque',                  href: '/admin/noticias',         cor: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    cursos_ativos:              { emoji: '💼', label: 'Cursos ativos',                href: '/admin/cursos',           cor: 'text-teal-600',  badge: 'bg-teal-100 text-teal-700' },
    telefones_ativos:           { emoji: '📞', label: 'Telefones ativos',             href: '/admin/telefones',        cor: 'text-stone-700', badge: 'bg-stone-100 text-stone-600' },
};

const ALERTAS = [
    { key: 'matriculas_pendentes',       msg: n => `${n} matrícula${n > 1 ? 's' : ''} aguardando análise`,        href: '/admin/matriculas',       cor: 'bg-amber-50 ring-amber-200 text-amber-800' },
    { key: 'estabelecimentos_pendentes', msg: n => `${n} estabelecimento${n > 1 ? 's' : ''} aguardando aprovação`, href: '/admin/estabelecimentos', cor: 'bg-blue-50 ring-blue-200 text-blue-800' },
];

function CardIndicador({ cfg, valor }) {
    return (
        <a href={cfg.href} className="flex flex-col gap-1 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200 transition hover:shadow-md hover:ring-stone-300">
            <div className="flex items-center justify-between">
                <span className="text-2xl">{cfg.emoji}</span>
                {valor > 0 && <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${cfg.badge}`}>{valor}</span>}
            </div>
            <p className={`mt-2 text-2xl font-bold ${cfg.cor}`}>{valor}</p>
            <p className="text-xs text-stone-500">{cfg.label}</p>
        </a>
    );
}

// ── Dashboard Geral ───────────────────────────────────────────────────────────
function DashboardGeral({ indicadores }) {
    const alertas = ALERTAS.filter(a => (indicadores[a.key] ?? 0) > 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold text-stone-800">Dashboard</h1>
                <p className="mt-0.5 text-sm text-stone-500">Visão geral do sistema</p>
            </div>

            {alertas.length > 0 && (
                <div className="space-y-2">
                    {alertas.map(a => (
                        <a key={a.key} href={a.href}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 ring-1 transition hover:opacity-90 ${a.cor}`}
                        >
                            <span className="text-lg">⚠️</span>
                            <p className="flex-1 text-sm font-medium">{a.msg(indicadores[a.key])}</p>
                            <span className="text-xs">Ver →</span>
                        </a>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Object.entries(indicadores).map(([key, valor]) => {
                    const cfg = CARDS_CONFIG[key];
                    if (!cfg) return null;
                    return <CardIndicador key={key} cfg={cfg} valor={valor} />;
                })}
            </div>
        </div>
    );
}

// ── Dashboard SECON ───────────────────────────────────────────────────────────
function DashboardSecon({ indicadores }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold text-stone-800">Dashboard — SECON</h1>
                <p className="mt-0.5 text-sm text-stone-500">Publicações e comunicação</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {['noticias_publicadas', 'noticias_rascunho', 'noticias_destaque'].map(key => {
                    const cfg = CARDS_CONFIG[key];
                    return cfg ? <CardIndicador key={key} cfg={cfg} valor={indicadores[key] ?? 0} /> : null;
                })}
            </div>
            <a href="/admin/noticias" className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 transition hover:ring-amber-300">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📰</span>
                    <div>
                        <p className="font-semibold text-stone-800">Gerenciar Notícias</p>
                        <p className="text-xs text-stone-500">Criar, editar, publicar e marcar destaques</p>
                    </div>
                </div>
                <span className="text-stone-400">→</span>
            </a>
        </div>
    );
}

// ── Dashboard Empreendedor ────────────────────────────────────────────────────
function DashboardEmpreendedor({ indicadores }) {
    const alertas = ALERTAS.filter(a => a.key === 'estabelecimentos_pendentes' && (indicadores[a.key] ?? 0) > 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold text-stone-800">Dashboard — Sala do Empreendedor</h1>
                <p className="mt-0.5 text-sm text-stone-500">Estabelecimentos e cursos</p>
            </div>

            {alertas.map(a => (
                <a key={a.key} href={a.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 ring-1 transition hover:opacity-90 ${a.cor}`}
                >
                    <span className="text-lg">⚠️</span>
                    <p className="flex-1 text-sm font-medium">{a.msg(indicadores[a.key])}</p>
                    <span className="text-xs">Ver →</span>
                </a>
            ))}

            <div className="grid grid-cols-2 gap-3">
                {['estabelecimentos_pendentes', 'cursos_ativos'].map(key => {
                    const cfg = CARDS_CONFIG[key];
                    return cfg ? <CardIndicador key={key} cfg={cfg} valor={indicadores[key] ?? 0} /> : null;
                })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {[
                    { href: '/admin/estabelecimentos', emoji: '🍽️', titulo: 'Estabelecimentos', desc: 'Aprovar e gerenciar cadastros' },
                    { href: '/admin/cursos',           emoji: '💼', titulo: 'Cursos',           desc: 'Criar e gerenciar treinamentos' },
                ].map(item => (
                    <a key={item.href} href={item.href}
                        className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 transition hover:ring-amber-300"
                    >
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                            <p className="font-semibold text-stone-800">{item.titulo}</p>
                            <p className="text-xs text-stone-500">{item.desc}</p>
                        </div>
                        <span className="ml-auto text-stone-400">→</span>
                    </a>
                ))}
            </div>
        </div>
    );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function AdminDashboard({ adminName, adminRole, indicadores, dados }) {
    function renderConteudo() {
        switch (adminRole) {
            case 'educacao':     return <DashboardEducacao dados={dados} />;
            case 'escola':       return <DashboardEscola dados={dados} />;
            case 'secon':        return <DashboardSecon indicadores={indicadores} />;
            case 'empreendedor': return <DashboardEmpreendedor indicadores={indicadores} />;
            default:             return <DashboardGeral indicadores={indicadores} />;
        }
    }

    return (
        <>
            <AdminLayout adminName={adminName} adminRole={adminRole} currentPath="/admin">
                {renderConteudo()}
            </AdminLayout>
        </>
    );
}

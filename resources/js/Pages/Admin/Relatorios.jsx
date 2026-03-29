import { Head } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';

const LABEL_CAT_NOTICIA = {
    saude: 'Saúde', educacao: 'Educação', assistencia: 'Assistência Social',
    infraestrutura: 'Infraestrutura', meio_ambiente: 'Meio Ambiente',
    esporte_lazer: 'Esporte e Lazer', cultura_turismo: 'Cultura e Turismo',
    desenvolvimento: 'Desenvolvimento', mulheres: 'Pol. para Mulheres',
    coleta_urbana: 'Coleta Urbana',
};

const STATUS_MATRICULA = { pendente: 'Pendente', em_analise: 'Em Análise', aprovada: 'Aprovada', recusada: 'Recusada' };
const STATUS_ESTAB = { pendente: 'Pendente', ativo: 'Ativo', inativo: 'Inativo' };

// ── Card de indicador simples ──────────────────────────────────────────────────
function KPI({ label, valor, cor = 'text-stone-800', sub }) {
    return (
        <div className="flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
            <p className={`text-2xl font-bold ${cor}`}>{valor}</p>
            <p className="mt-1 text-xs font-semibold text-stone-500">{label}</p>
            {sub && <p className="mt-0.5 text-xs text-stone-400">{sub}</p>}
        </div>
    );
}

// ── Barra de progresso simples ─────────────────────────────────────────────────
function Barra({ label, valor, total, cor = 'bg-amber-500' }) {
    const pct = total > 0 ? Math.round((valor / total) * 100) : 0;
    return (
        <div>
            <div className="flex items-center justify-between text-xs text-stone-600">
                <span>{label}</span>
                <span className="font-semibold">{valor} <span className="text-stone-400">({pct}%)</span></span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-stone-100">
                <div className={`h-full rounded-full ${cor}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

// ── Seção de matrículas ────────────────────────────────────────────────────────
function SecaoMatriculas({ dados }) {
    const total = dados.total;
    const statusCores = { pendente: 'bg-amber-500', em_analise: 'bg-blue-500', aprovada: 'bg-green-500', recusada: 'bg-red-400' };

    return (
        <section className="space-y-4">
            <h2 className="flex items-center gap-2 rounded-xl bg-stone-800 px-4 py-2.5 text-sm font-bold text-white">
                <span>🎒</span> Matrículas Escolares
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <KPI label="Total de matrículas" valor={dados.total} />
                <KPI label="Aprovadas este mês"  valor={dados.aprovadas_mes} cor="text-green-600" />
                <KPI label="Pendentes"            valor={dados.por_status?.pendente ?? 0} cor="text-amber-600" />
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-400">Por status</p>
                <div className="space-y-2.5">
                    {Object.entries(STATUS_MATRICULA).map(([key, label]) => (
                        <Barra key={key} label={label} valor={dados.por_status?.[key] ?? 0} total={total} cor={statusCores[key]} />
                    ))}
                </div>
            </div>

            {dados.por_escola?.length > 0 && (
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-400">Por escola</p>
                    <div className="space-y-2.5">
                        {dados.por_escola.map((e, i) => (
                            <Barra key={i} label={e.escola} valor={e.total} total={total} cor="bg-blue-500" />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

// ── Seção de notícias ──────────────────────────────────────────────────────────
function SecaoNoticias({ dados }) {
    const total = dados.total;

    return (
        <section className="space-y-4">
            <h2 className="flex items-center gap-2 rounded-xl bg-stone-800 px-4 py-2.5 text-sm font-bold text-white">
                <span>📰</span> Notícias e Publicações
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <KPI label="Total"           valor={dados.total} />
                <KPI label="Publicadas"      valor={dados.publicadas}     cor="text-green-600" />
                <KPI label="Rascunhos"       valor={dados.rascunhos}      cor="text-stone-500" />
                <KPI label="Destaques"       valor={dados.destaques}      cor="text-amber-600" />
            </div>

            <KPI label={`Publicadas este mês`} valor={dados.publicadas_mes} cor="text-blue-600" />

            {Object.keys(dados.por_categoria).length > 0 && (
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-400">Publicadas por categoria</p>
                    <div className="space-y-2.5">
                        {Object.entries(dados.por_categoria).map(([cat, qtd]) => (
                            <Barra key={cat} label={LABEL_CAT_NOTICIA[cat] ?? cat} valor={qtd} total={dados.publicadas} cor="bg-purple-500" />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

// ── Seção do empreendedor ──────────────────────────────────────────────────────
function SecaoEmpreendedor({ estab, cursos }) {
    return (
        <section className="space-y-4">
            <h2 className="flex items-center gap-2 rounded-xl bg-stone-800 px-4 py-2.5 text-sm font-bold text-white">
                <span>🍽️</span> Estabelecimentos e Cursos
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <KPI label="Estabelecimentos"  valor={estab.total} />
                <KPI label="Ativos"            valor={estab.por_status?.ativo ?? 0}    cor="text-green-600" />
                <KPI label="Pendentes"         valor={estab.por_status?.pendente ?? 0} cor="text-amber-600" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <KPI label="Cursos total"    valor={cursos.total} />
                <KPI label="Ativos"          valor={cursos.ativos}            cor="text-green-600" />
                <KPI label="Encerrados"      valor={cursos.encerrados}        cor="text-stone-500" />
                <KPI label="Inscrições"      valor={cursos.total_inscricoes}  cor="text-blue-600" />
            </div>

            {cursos.por_curso?.length > 0 && (
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-400">Inscrições por curso (top 10)</p>
                    <div className="space-y-2.5">
                        {cursos.por_curso.map((c, i) => (
                            <Barra key={i} label={c.titulo} valor={c.inscritos} total={c.vagas} cor="bg-emerald-500" />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

// ── Página ─────────────────────────────────────────────────────────────────────
export default function AdminRelatorios({ adminName, adminRole, dados, mes_ano }) {
    return (
        <>
            <Head title="Admin — Relatórios" />
            <AdminLayout adminName={adminName} adminRole={adminRole} currentPath="/admin/relatorios">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-xl font-bold text-stone-800">Relatórios</h1>
                        <p className="mt-0.5 text-sm text-stone-500">Dados consolidados · {mes_ano}</p>
                    </div>

                    {dados.matriculas    && <SecaoMatriculas dados={dados.matriculas} />}
                    {dados.noticias      && <SecaoNoticias   dados={dados.noticias} />}
                    {dados.estabelecimentos && <SecaoEmpreendedor estab={dados.estabelecimentos} cursos={dados.cursos} />}

                    {Object.keys(dados).length === 0 && (
                        <div className="rounded-2xl bg-white py-16 text-center shadow-sm ring-1 ring-stone-200">
                            <p className="text-stone-400">Nenhum relatório disponível para seu nível de acesso.</p>
                        </div>
                    )}
                </div>
            </AdminLayout>
        </>
    );
}

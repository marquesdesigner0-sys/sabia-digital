import { Head, Link } from '@inertiajs/react';

function barraVagas(disponiveis, total) {
    if (total === 0) return 0;
    return Math.round(((total - disponiveis) / total) * 100);
}

function corBarra(disponiveis, total) {
    if (total === 0) return 'bg-stone-200';
    const pct = disponiveis / total;
    if (pct <= 0) return 'bg-red-400';
    if (pct <= 0.2) return 'bg-orange-400';
    return 'bg-green-400';
}

export default function Vagas({ escola, vagas }) {
    const totalOcupadas = vagas.reduce((s, v) => s + v.ocupadas, 0);
    const totalDisponiveis = vagas.reduce((s, v) => s + v.disponiveis, 0);

    return (
        <>
            <Head title={`Vagas — ${escola.nome}`} />
            <div className="min-h-screen bg-stone-100">
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
                        <Link href="/educacao" className="text-stone-400 hover:text-stone-600">← Escolas</Link>
                        <span className="text-stone-300">/</span>
                        <span className="font-semibold text-stone-800">Consulta de vagas</span>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-4 py-8">
                    <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
                        <h1 className="text-xl font-bold text-stone-800">{escola.nome}</h1>
                        <p className="mt-1 text-sm text-stone-500">{escola.endereco}</p>
                        {escola.diretor && (
                            <p className="mt-1 text-sm text-stone-500">Diretor(a): {escola.diretor}</p>
                        )}

                        <div className="mt-4 flex gap-6 border-t border-stone-100 pt-4">
                            <div>
                                <p className="text-2xl font-bold text-green-600">{totalDisponiveis}</p>
                                <p className="text-xs text-stone-500">vagas disponíveis</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-stone-600">{totalOcupadas}</p>
                                <p className="text-xs text-stone-500">ocupadas</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-stone-800">{escola.total_vagas}</p>
                                <p className="text-xs text-stone-500">total</p>
                            </div>
                        </div>
                    </div>

                    {vagas.length === 0 ? (
                        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-stone-200">
                            <p className="text-stone-400">Nenhuma vaga por série cadastrada para esta escola.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">Por série</h2>
                            {vagas.map((v) => (
                                <div key={v.serie} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-stone-800">{v.serie}</span>
                                        <span className={`font-semibold ${v.disponiveis === 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {v.disponiveis === 0 ? 'Sem vagas' : `${v.disponiveis} disponíve${v.disponiveis > 1 ? 'is' : 'l'}`}
                                        </span>
                                    </div>
                                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-100">
                                        <div
                                            className={`h-2 rounded-full transition-all ${corBarra(v.disponiveis, v.total)}`}
                                            style={{ width: `${barraVagas(v.disponiveis, v.total)}%` }}
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-stone-400">
                                        {v.ocupadas} de {v.total} vagas ocupadas
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6">
                        <Link
                            href={`/educacao/matricula/${escola.id}`}
                            className="block w-full rounded-xl bg-amber-500 py-3 text-center text-sm font-semibold text-white transition hover:bg-amber-600"
                        >
                            Solicitar matrícula nesta escola
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}

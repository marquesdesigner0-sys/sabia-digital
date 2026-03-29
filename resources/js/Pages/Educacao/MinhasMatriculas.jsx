import { Head, Link } from '@inertiajs/react';

const STATUS = {
    pendente:   { label: 'Pendente',    bg: 'bg-stone-100',  text: 'text-stone-600' },
    em_analise: { label: 'Em análise',  bg: 'bg-amber-100',  text: 'text-amber-700' },
    aprovada:   { label: 'Aprovada',    bg: 'bg-green-100',  text: 'text-green-700' },
    recusada:   { label: 'Recusada',    bg: 'bg-red-100',    text: 'text-red-700'   },
};

function NavEducacao({ ativa }) {
    const abas = [
        { href: '/educacao',                   label: 'Escolas' },
        { href: '/educacao/mapa',              label: 'Mapa' },
        { href: '/educacao/calendario',        label: 'Calendário' },
        { href: '/educacao/minhas-matriculas', label: 'Minhas matrículas' },
    ];
    return (
        <div className="flex gap-1 border-b border-stone-200 bg-white px-4">
            <div className="mx-auto flex w-full max-w-3xl gap-1">
                {abas.map((a) => (
                    <a key={a.href} href={a.href}
                        className={`border-b-2 px-3 py-3 text-sm font-medium transition ${
                            a.href === ativa
                                ? 'border-amber-500 text-amber-600'
                                : 'border-transparent text-stone-500 hover:text-stone-800'
                        }`}
                    >
                        {a.label}
                    </a>
                ))}
            </div>
        </div>
    );
}

export default function MinhasMatriculas({ matriculas, sucesso }) {
    return (
        <>
            <Head title="Minhas matrículas" />
            <div className="min-h-screen bg-stone-100">
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
                        <a href="/" className="text-stone-400 hover:text-stone-600">← Início</a>
                        <span className="text-stone-300">/</span>
                        <span className="font-semibold text-stone-800">Educação</span>
                    </div>
                </header>

                <NavEducacao ativa="/educacao/minhas-matriculas" />

                <main className="mx-auto max-w-3xl px-4 py-8">
                    {sucesso && (
                        <div className="mb-6 rounded-2xl bg-green-50 p-4 ring-1 ring-green-200">
                            <p className="text-sm font-medium text-green-800">✓ {sucesso}</p>
                        </div>
                    )}

                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-stone-800">Minhas matrículas</h1>
                        <a
                            href="/educacao"
                            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                        >
                            Nova solicitação
                        </a>
                    </div>

                    {matriculas.length === 0 ? (
                        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-stone-200">
                            <p className="text-stone-400">Você ainda não tem matrículas solicitadas.</p>
                            <a
                                href="/educacao"
                                className="mt-4 inline-block text-sm font-medium text-amber-600 hover:underline"
                            >
                                Ver escolas disponíveis
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {matriculas.map((m) => {
                                const st = STATUS[m.status] ?? STATUS.pendente;
                                return (
                                    <div
                                        key={m.id}
                                        className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.bg} ${st.text}`}>
                                                        {st.label}
                                                    </span>
                                                    <span className="font-mono text-xs text-stone-400">
                                                        {m.protocolo}
                                                    </span>
                                                </div>
                                                <p className="mt-2 font-semibold text-stone-800">{m.aluno_nome}</p>
                                                <p className="text-sm text-stone-500">
                                                    {m.serie_solicitada} · {m.escola}
                                                </p>
                                            </div>
                                            <span className="shrink-0 text-xs text-stone-400">{m.created_at}</span>
                                        </div>

                                        {m.observacao && (
                                            <div className="mt-3 border-t border-stone-100 pt-3">
                                                <p className="text-xs text-stone-500">
                                                    <span className="font-medium">Obs.:</span> {m.observacao}
                                                </p>
                                            </div>
                                        )}

                                        {m.status === 'recusada' && (
                                            <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700 ring-1 ring-red-100">
                                                Solicitação recusada. Entre em contato com a escola para mais informações.
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

import { Head, Link } from '@inertiajs/react';

const STATUS_VAGAS = (ocupadas, total) => {
    if (total === 0) return { label: 'Sem informação', cor: 'text-stone-400' };
    const livres = total - ocupadas;
    if (livres <= 0) return { label: 'Sem vagas', cor: 'text-red-600' };
    if (livres <= 5) return { label: `${livres} vaga${livres > 1 ? 's' : ''}`, cor: 'text-amber-600' };
    return { label: `${livres} vagas`, cor: 'text-green-600' };
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
                    <a
                        key={a.href}
                        href={a.href}
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

export default function EducacaoIndex({ escolas }) {
    return (
        <>
            <Head title="Educação" />
            <div className="min-h-screen bg-stone-100">
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                            <a href="/" className="text-stone-400 hover:text-stone-600">← Início</a>
                            <span className="text-stone-300">/</span>
                            <span className="font-semibold text-stone-800">Educação</span>
                        </div>
                    </div>
                </header>

                <NavEducacao ativa="/educacao" />

                <main className="mx-auto max-w-3xl px-4 py-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-stone-800">Escolas municipais</h1>
                        <p className="mt-1 text-sm text-stone-500">
                            Selecione uma escola para ver vagas ou solicitar matrícula
                        </p>
                    </div>

                    {escolas.length === 0 ? (
                        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-stone-200">
                            <p className="text-stone-400">Nenhuma escola cadastrada ainda.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {escolas.map((escola) => {
                                const vagas = STATUS_VAGAS(escola.vagas_ocupadas, escola.total_vagas);
                                return (
                                    <div
                                        key={escola.id}
                                        className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h2 className="font-semibold text-stone-800">{escola.nome}</h2>
                                                <p className="mt-0.5 text-sm text-stone-500">{escola.endereco}</p>

                                                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                                                    {escola.diretor && (
                                                        <span className="text-stone-600">Dir.: {escola.diretor}</span>
                                                    )}
                                                    {escola.telefone && (
                                                        <a href={`tel:${escola.telefone}`} className="text-amber-600 hover:underline">
                                                            {escola.telefone}
                                                        </a>
                                                    )}
                                                </div>

                                                {escola.series_atendidas && (
                                                    <p className="mt-2 text-sm text-stone-500">
                                                        Séries: {escola.series_atendidas}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <span className={`text-sm font-semibold ${vagas.cor}`}>
                                                    {vagas.label}
                                                </span>
                                                {escola.total_vagas > 0 && (
                                                    <p className="text-xs text-stone-400">de {escola.total_vagas} vagas</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-2 border-t border-stone-100 pt-4">
                                            <a
                                                href={`/educacao/vagas/${escola.id}`}
                                                className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
                                            >
                                                Ver vagas por série
                                            </a>
                                            <a
                                                href={`/educacao/matricula/${escola.id}`}
                                                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                                            >
                                                Solicitar matrícula
                                            </a>
                                        </div>
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

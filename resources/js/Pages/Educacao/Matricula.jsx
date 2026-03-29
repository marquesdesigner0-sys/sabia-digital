import { Head, Link, useForm } from '@inertiajs/react';

const SERIES = [
    'Educação Infantil — Maternal',
    'Educação Infantil — Jardim I',
    'Educação Infantil — Jardim II',
    '1º ano — Ensino Fundamental',
    '2º ano — Ensino Fundamental',
    '3º ano — Ensino Fundamental',
    '4º ano — Ensino Fundamental',
    '5º ano — Ensino Fundamental',
    '6º ano — Ensino Fundamental',
    '7º ano — Ensino Fundamental',
    '8º ano — Ensino Fundamental',
    '9º ano — Ensino Fundamental',
];

function formatCpf(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .slice(0, 14);
}

export default function Matricula({ escola }) {
    const { data, setData, post, processing, errors } = useForm({
        aluno_nome: '',
        aluno_cpf: '',
        aluno_nascimento: '',
        serie_solicitada: '',
        observacao: '',
    });

    function submit(e) {
        e.preventDefault();
        post(`/educacao/matricula/${escola.id}`);
    }

    return (
        <>
            <Head title={`Matrícula — ${escola.nome}`} />
            <div className="min-h-screen bg-stone-100">
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
                        <Link href="/educacao" className="text-stone-400 hover:text-stone-600">
                            ← Escolas
                        </Link>
                        <span className="text-stone-300">/</span>
                        <span className="font-semibold text-stone-800">Solicitar matrícula</span>
                    </div>
                </header>

                <main className="mx-auto max-w-2xl px-4 py-8">
                    <div className="mb-6 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
                        <p className="text-sm font-medium text-amber-800">Escola selecionada</p>
                        <p className="mt-0.5 text-base font-semibold text-amber-900">{escola.nome}</p>
                        {escola.series_atendidas && (
                            <p className="mt-1 text-xs text-amber-700">Séries: {escola.series_atendidas}</p>
                        )}
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
                        <h1 className="mb-6 text-xl font-bold text-stone-800">Dados do aluno</h1>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">
                                    Nome completo do aluno
                                </label>
                                <input
                                    type="text"
                                    value={data.aluno_nome}
                                    onChange={(e) => setData('aluno_nome', e.target.value)}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="Nome completo"
                                    required
                                />
                                {errors.aluno_nome && (
                                    <p className="mt-1 text-xs text-red-600">{errors.aluno_nome}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-stone-700">
                                        CPF do aluno
                                    </label>
                                    <input
                                        type="text"
                                        value={data.aluno_cpf}
                                        onChange={(e) => setData('aluno_cpf', formatCpf(e.target.value))}
                                        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                        placeholder="000.000.000-00"
                                        inputMode="numeric"
                                        required
                                    />
                                    {errors.aluno_cpf && (
                                        <p className="mt-1 text-xs text-red-600">{errors.aluno_cpf}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-stone-700">
                                        Data de nascimento
                                    </label>
                                    <input
                                        type="date"
                                        value={data.aluno_nascimento}
                                        onChange={(e) => setData('aluno_nascimento', e.target.value)}
                                        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                        required
                                    />
                                    {errors.aluno_nascimento && (
                                        <p className="mt-1 text-xs text-red-600">{errors.aluno_nascimento}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">
                                    Série desejada
                                </label>
                                <select
                                    value={data.serie_solicitada}
                                    onChange={(e) => setData('serie_solicitada', e.target.value)}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    required
                                >
                                    <option value="">Selecione a série...</option>
                                    {SERIES.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                {errors.serie_solicitada && (
                                    <p className="mt-1 text-xs text-red-600">{errors.serie_solicitada}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">
                                    Observações <span className="font-normal text-stone-400">(opcional)</span>
                                </label>
                                <textarea
                                    value={data.observacao}
                                    onChange={(e) => setData('observacao', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="Informações adicionais relevantes..."
                                />
                                {errors.observacao && (
                                    <p className="mt-1 text-xs text-red-600">{errors.observacao}</p>
                                )}
                            </div>

                            <div className="rounded-lg bg-stone-50 p-3 text-xs text-stone-500 ring-1 ring-stone-200">
                                Após o envio, você receberá um número de protocolo para acompanhar o
                                status da solicitação em <strong>Minhas matrículas</strong>.
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Link
                                    href="/educacao"
                                    className="flex-1 rounded-lg border border-stone-300 py-2.5 text-center text-sm font-medium text-stone-600 transition hover:bg-stone-50"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
                                >
                                    {processing ? 'Enviando…' : 'Solicitar matrícula'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}

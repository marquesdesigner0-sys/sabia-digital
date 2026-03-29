import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

const STATUS = {
    pendente:   { label: 'Pendente',    bg: 'bg-stone-100',  text: 'text-stone-600' },
    em_analise: { label: 'Em análise',  bg: 'bg-amber-100',  text: 'text-amber-700' },
    aprovada:   { label: 'Aprovada',    bg: 'bg-green-100',  text: 'text-green-700' },
    recusada:   { label: 'Recusada',    bg: 'bg-red-100',    text: 'text-red-700'   },
};

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

const TIPOS_DOCUMENTO = [
    { value: 'certidao',              label: 'Certidão de nascimento / RG' },
    { value: 'cpf',                   label: 'CPF do aluno' },
    { value: 'comprovante_residencia', label: 'Comprovante de residência' },
    { value: 'vacinacao',             label: 'Carteira de vacinação' },
    { value: 'historico',             label: 'Histórico escolar / Declaração de transferência' },
    { value: 'foto',                  label: 'Foto 3x4' },
    { value: 'outros',                label: 'Outros documentos' },
];

function labelTipo(value) {
    return TIPOS_DOCUMENTO.find((t) => t.value === value)?.label ?? value;
}

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

function RenovacaoForm({ matricula, onCancelar }) {
    const { data, setData, post, processing } = useForm({
        serie_solicitada: matricula.serie_solicitada,
    });

    function submit(e) {
        e.preventDefault();
        post(`/educacao/matricula/${matricula.id}/renovar`);
    }

    return (
        <form onSubmit={submit} className="mt-3 space-y-3 border-t border-stone-100 pt-3">
            <p className="text-xs font-semibold text-stone-700">Renovação de matrícula</p>
            <p className="text-xs text-stone-500">
                Os dados do aluno serão mantidos. Confirme ou altere a série para o próximo período.
            </p>
            <div>
                <label className="mb-1 block text-xs font-medium text-stone-600">
                    Série solicitada
                </label>
                <select
                    value={data.serie_solicitada}
                    onChange={(e) => setData('serie_solicitada', e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                    required
                >
                    {SERIES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={onCancelar}
                    className="flex-1 rounded-lg border border-stone-300 py-2 text-xs font-medium text-stone-600 transition hover:bg-stone-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 rounded-lg bg-amber-500 py-2 text-xs font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
                >
                    {processing ? 'Enviando…' : 'Confirmar renovação'}
                </button>
            </div>
        </form>
    );
}

function DocumentoItem({ documento }) {
    const { delete: destroy, processing } = useForm();

    function remover(e) {
        e.preventDefault();
        if (!confirm('Remover este documento?')) return;
        destroy(`/educacao/documento/${documento.id}`);
    }

    return (
        <div className="flex items-center justify-between gap-2 rounded-lg bg-stone-50 px-3 py-2 ring-1 ring-stone-200">
            <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-stone-700">{labelTipo(documento.tipo)}</p>
                <p className="truncate text-xs text-stone-400">{documento.nome_original}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
                <a
                    href={`/educacao/documento/${documento.id}/download`}
                    className="text-xs font-medium text-amber-600 hover:underline"
                >
                    Baixar
                </a>
                <button
                    onClick={remover}
                    disabled={processing}
                    className="text-xs text-red-500 hover:underline disabled:opacity-50"
                >
                    Remover
                </button>
            </div>
        </div>
    );
}

function AnexarDocumento({ matriculaId }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        tipo: '',
        arquivo: null,
    });

    function submit(e) {
        e.preventDefault();
        post(`/educacao/matricula/${matriculaId}/documentos`, {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <form onSubmit={submit} className="mt-3 space-y-2">
            <p className="text-xs font-medium text-stone-600">Anexar documento</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                    <select
                        value={data.tipo}
                        onChange={(e) => setData('tipo', e.target.value)}
                        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                        required
                    >
                        <option value="">Tipo de documento…</option>
                        {TIPOS_DOCUMENTO.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                    {errors.tipo && <p className="mt-0.5 text-xs text-red-600">{errors.tipo}</p>}
                </div>
                <div>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setData('arquivo', e.target.files[0])}
                        className="w-full rounded-lg border border-stone-300 px-2 py-1.5 text-xs text-stone-600 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 file:mr-2 file:rounded file:border-0 file:bg-stone-100 file:px-2 file:py-1 file:text-xs file:font-medium file:text-stone-600"
                        required
                    />
                    {errors.arquivo && <p className="mt-0.5 text-xs text-red-600">{errors.arquivo}</p>}
                </div>
            </div>
            <p className="text-xs text-stone-400">PDF, JPG ou PNG · máx. 5 MB</p>
            <button
                type="submit"
                disabled={processing}
                className="rounded-lg bg-stone-700 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-stone-800 disabled:opacity-60"
            >
                {processing ? 'Enviando…' : 'Enviar documento'}
            </button>
        </form>
    );
}

function DocumentosSection({ matricula }) {
    const [aberto, setAberto] = useState(false);
    const podeAnexar = matricula.status !== 'recusada';
    const total = matricula.documentos.length;

    return (
        <div className="mt-3 border-t border-stone-100 pt-3">
            <button
                onClick={() => setAberto((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-700"
            >
                <span className={`transition-transform ${aberto ? 'rotate-90' : ''}`}>▶</span>
                Documentos
                {total > 0 && (
                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-700">
                        {total}
                    </span>
                )}
                {total === 0 && podeAnexar && (
                    <span className="text-xs text-stone-400">— nenhum anexado</span>
                )}
            </button>

            {aberto && (
                <div className="mt-3 space-y-2">
                    {total > 0 && (
                        <div className="space-y-1.5">
                            {matricula.documentos.map((d) => (
                                <DocumentoItem key={d.id} documento={d} />
                            ))}
                        </div>
                    )}

                    {podeAnexar && <AnexarDocumento matriculaId={matricula.id} />}

                    {!podeAnexar && total === 0 && (
                        <p className="text-xs text-stone-400">Nenhum documento anexado.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default function MinhasMatriculas({ matriculas, sucesso }) {
    const [renovandoId, setRenovandoId] = useState(null);

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
                                const estaRenovando = renovandoId === m.id;
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
                                                    {m.renovacao_de && (
                                                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600 ring-1 ring-blue-100">
                                                            Renovação
                                                        </span>
                                                    )}
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

                                        {/* Seção de documentos — disponível para todos os status exceto recusada (pode ver, mas não anexar) */}
                                        <DocumentosSection matricula={m} />

                                        {m.status === 'aprovada' && (
                                            estaRenovando ? (
                                                <RenovacaoForm
                                                    matricula={m}
                                                    onCancelar={() => setRenovandoId(null)}
                                                />
                                            ) : (
                                                <div className="mt-3 border-t border-stone-100 pt-3">
                                                    <button
                                                        onClick={() => setRenovandoId(m.id)}
                                                        className="text-xs font-medium text-amber-600 hover:underline"
                                                    >
                                                        Renovar matrícula →
                                                    </button>
                                                </div>
                                            )
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

import { useState } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';

// ── Modal genérico ─────────────────────────────────────────────────────────────
function Modal({ titulo, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
            <div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-bold text-stone-800">{titulo}</h2>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600">✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}

// ── Campo de formulário ────────────────────────────────────────────────────────
function Campo({ label, error, children }) {
    return (
        <div>
            <label className="label">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

function Input({ error, ...props }) {
    return (
        <input
            className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${error ? 'border-red-400' : 'border-stone-300'}`}
            {...props}
        />
    );
}

// ── Modal Escola (criar / editar) ─────────────────────────────────────────────
function ModalEscola({ escola, onClose }) {
    const editando = !!escola;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nome:             escola?.nome             ?? '',
        endereco:         escola?.endereco         ?? '',
        telefone:         escola?.telefone         ?? '',
        diretor:          escola?.diretor          ?? '',
        series_atendidas: escola?.series_atendidas ?? '',
        total_vagas:      escola?.total_vagas      ?? 0,
    });

    function submit(e) {
        e.preventDefault();
        if (editando) {
            put(`/admin/escolas/${escola.id}`, { onSuccess: onClose });
        } else {
            post('/admin/escolas', { onSuccess: onClose });
        }
    }

    return (
        <Modal titulo={editando ? 'Editar escola' : 'Nova escola'} onClose={onClose}>
            <form onSubmit={submit} className="space-y-3">
                <Campo label="Nome" error={errors.nome}>
                    <Input value={data.nome} onChange={e => setData('nome', e.target.value)} placeholder="Nome da escola" error={errors.nome} />
                </Campo>

                <Campo label="Endereço" error={errors.endereco}>
                    <Input value={data.endereco} onChange={e => setData('endereco', e.target.value)} placeholder="Rua, número, bairro" error={errors.endereco} />
                </Campo>

                <div className="grid grid-cols-2 gap-3">
                    <Campo label="Telefone" error={errors.telefone}>
                        <Input value={data.telefone} onChange={e => setData('telefone', e.target.value)} placeholder="(87) 9 0000-0000" error={errors.telefone} />
                    </Campo>
                    <Campo label="Total de vagas" error={errors.total_vagas}>
                        <Input type="number" min="0" value={data.total_vagas} onChange={e => setData('total_vagas', e.target.value)} error={errors.total_vagas} />
                    </Campo>
                </div>

                <Campo label="Diretor(a)" error={errors.diretor}>
                    <Input value={data.diretor} onChange={e => setData('diretor', e.target.value)} placeholder="Nome do(a) diretor(a)" error={errors.diretor} />
                </Campo>

                <Campo label="Séries atendidas" error={errors.series_atendidas}>
                    <Input value={data.series_atendidas} onChange={e => setData('series_atendidas', e.target.value)} placeholder="Ex: 1º ao 5º ano" error={errors.series_atendidas} />
                </Campo>

                <div className="flex gap-2 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-stone-300 py-2 text-sm text-stone-600 hover:bg-stone-50">
                        Cancelar
                    </button>
                    <button type="submit" disabled={processing}
                        className="flex-1 rounded-xl bg-amber-500 py-2 text-sm font-bold text-stone-900 hover:bg-amber-400 disabled:opacity-60"
                    >
                        {processing ? 'Salvando…' : editando ? 'Salvar alterações' : 'Cadastrar escola'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// ── Modal Vagas ────────────────────────────────────────────────────────────────
function ModalVagas({ escola, onClose }) {
    const ocupadas = (escola.total_matriculas ?? 0);
    const { data, setData, put, processing, errors } = useForm({
        total_vagas: escola.total_vagas ?? 0,
    });

    function submit(e) {
        e.preventDefault();
        put(`/admin/escolas/${escola.id}/vagas`, { onSuccess: onClose });
    }

    return (
        <Modal titulo={`Vagas — ${escola.nome}`} onClose={onClose}>
            <div className="mb-4 rounded-xl bg-stone-50 px-4 py-3 text-sm ring-1 ring-stone-200">
                <div className="flex justify-between text-stone-600">
                    <span>Matrículas ativas</span>
                    <strong>{ocupadas}</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                    <span>Vagas atuais</span>
                    <strong>{escola.total_vagas}</strong>
                </div>
                <div className="mt-1 flex justify-between font-semibold">
                    <span className="text-stone-500">Disponíveis</span>
                    <span className={Math.max(0, escola.total_vagas - ocupadas) === 0 ? 'text-red-600' : 'text-green-600'}>
                        {Math.max(0, escola.total_vagas - ocupadas)}
                    </span>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-3">
                <Campo label="Novo total de vagas" error={errors.total_vagas}>
                    <Input
                        type="number"
                        min="0"
                        value={data.total_vagas}
                        onChange={e => setData('total_vagas', e.target.value)}
                        error={errors.total_vagas}
                    />
                </Campo>

                {Number(data.total_vagas) < ocupadas && (
                    <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700 ring-1 ring-amber-200">
                        ⚠️ O novo total é menor que as matrículas ativas ({ocupadas}). As matrículas existentes não serão afetadas.
                    </p>
                )}

                <div className="flex gap-2 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-stone-300 py-2 text-sm text-stone-600 hover:bg-stone-50">
                        Cancelar
                    </button>
                    <button type="submit" disabled={processing}
                        className="flex-1 rounded-xl bg-amber-500 py-2 text-sm font-bold text-stone-900 hover:bg-amber-400 disabled:opacity-60"
                    >
                        {processing ? 'Salvando…' : 'Atualizar vagas'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// ── Modal Gestor ───────────────────────────────────────────────────────────────
function ModalGestor({ escola, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        name:  escola.gestor?.name  ?? '',
        email: escola.gestor?.email ?? '',
        senha: '',
    });

    function submit(e) {
        e.preventDefault();
        post(`/admin/escolas/${escola.id}/gestor`, { onSuccess: onClose });
    }

    return (
        <Modal
            titulo={escola.gestor ? `Atualizar acesso — ${escola.nome}` : `Criar acesso — ${escola.nome}`}
            onClose={onClose}
        >
            {escola.gestor && (
                <div className="mb-4 rounded-xl bg-sky-50 px-3 py-2 text-xs text-sky-700 ring-1 ring-sky-200">
                    Acesso atual: <strong>{escola.gestor.name}</strong> ({escola.gestor.email})<br />
                    Preencher o formulário substituirá o acesso existente.
                </div>
            )}
            <form onSubmit={submit} className="space-y-3">
                <Campo label="Nome completo" error={errors.name}>
                    <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Nome do gestor" error={errors.name} />
                </Campo>
                <Campo label="E-mail de acesso" error={errors.email}>
                    <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="email@escola.gov.br" error={errors.email} />
                </Campo>
                <Campo label="Senha" error={errors.senha}>
                    <Input type="password" value={data.senha} onChange={e => setData('senha', e.target.value)} placeholder="Mínimo 8 caracteres" error={errors.senha} />
                </Campo>

                <div className="flex gap-2 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-stone-300 py-2 text-sm text-stone-600 hover:bg-stone-50">
                        Cancelar
                    </button>
                    <button type="submit" disabled={processing}
                        className="flex-1 rounded-xl bg-sky-600 py-2 text-sm font-bold text-white hover:bg-sky-500 disabled:opacity-60"
                    >
                        {processing ? 'Salvando…' : escola.gestor ? 'Substituir acesso' : 'Criar acesso'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// ── Card de escola ─────────────────────────────────────────────────────────────
function CardEscola({ escola, onEditar, onVagas, onGestor, adminRole }) {
    function removerGestor() {
        if (!confirm(`Remover o acesso de ${escola.gestor.name} para ${escola.nome}?`)) return;
        router.delete(`/admin/escolas/${escola.id}/gestor`);
    }

    function excluirEscola() {
        if (!confirm(`Excluir a escola "${escola.nome}"? Esta ação não pode ser desfeita.`)) return;
        router.delete(`/admin/escolas/${escola.id}`);
    }

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
            {/* Cabeçalho */}
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="font-bold leading-snug text-stone-800">{escola.nome}</p>
                    <p className="mt-0.5 text-xs text-stone-500">{escola.endereco}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                    <button onClick={onEditar}
                        className="rounded-lg border border-stone-200 px-2.5 py-1 text-xs text-stone-500 hover:border-stone-300 hover:text-stone-700"
                    >
                        Editar
                    </button>
                    {adminRole === 'geral' && (
                        <button onClick={excluirEscola}
                            className="rounded-lg border border-stone-200 px-2.5 py-1 text-xs text-red-400 hover:border-red-300 hover:text-red-600"
                        >
                            Excluir
                        </button>
                    )}
                </div>
            </div>

            {/* Detalhes */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-stone-500">
                {escola.diretor && (
                    <span>👤 {escola.diretor}</span>
                )}
                {escola.telefone && (
                    <span>📞 {escola.telefone}</span>
                )}
                {escola.series_atendidas && (
                    <span className="col-span-2">📚 {escola.series_atendidas}</span>
                )}
                <span>🎒 {escola.total_matriculas} matrícula{escola.total_matriculas !== 1 ? 's' : ''}</span>
                <span>🏫 {escola.total_vagas} vaga{escola.total_vagas !== 1 ? 's' : ''}</span>
            </div>

            {/* Barra de ocupação */}
            {escola.total_vagas > 0 && (() => {
                const pct = Math.min(100, Math.round((escola.total_matriculas / escola.total_vagas) * 100));
                const cor = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-400' : 'bg-green-500';
                return (
                    <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                            <span>{escola.total_matriculas} / {escola.total_vagas} vagas</span>
                            <span className={pct >= 90 ? 'font-bold text-red-600' : pct >= 70 ? 'text-amber-600' : 'text-green-600'}>{pct}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                            <div className={`h-full rounded-full transition-all ${cor}`} style={{ width: `${pct}%` }} />
                        </div>
                    </div>
                );
            })()}

            {/* Botão rápido de vagas */}
            <button
                onClick={onVagas}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-50 py-2.5 text-xs font-bold text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-100"
            >
                🏫 Gerenciar vagas
            </button>

            {/* Pendentes */}
            {escola.pendentes > 0 && (
                <a href="/admin/matriculas"
                    className="mt-3 flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-100"
                >
                    ⚠️ {escola.pendentes} matrícula{escola.pendentes > 1 ? 's' : ''} pendente{escola.pendentes > 1 ? 's' : ''}
                    <span className="ml-auto">→</span>
                </a>
            )}

            {/* Gestor / acesso */}
            <div className="mt-4 border-t border-stone-100 pt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400">Acesso da escola</p>
                {escola.gestor ? (
                    <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-stone-700">{escola.gestor.name}</p>
                            <p className="text-xs text-stone-400">{escola.gestor.email}</p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                            <button onClick={onGestor}
                                className="rounded-lg border border-sky-200 px-2.5 py-1 text-xs text-sky-600 hover:bg-sky-50"
                            >
                                Alterar
                            </button>
                            <button onClick={removerGestor}
                                className="rounded-lg border border-stone-200 px-2.5 py-1 text-xs text-red-400 hover:border-red-300"
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                ) : (
                    <button onClick={onGestor}
                        className="w-full rounded-xl border-2 border-dashed border-stone-200 py-2.5 text-xs font-semibold text-stone-400 transition hover:border-sky-300 hover:text-sky-600"
                    >
                        + Criar acesso para esta escola
                    </button>
                )}
            </div>
        </div>
    );
}

// ── Página principal ───────────────────────────────────────────────────────────
export default function Escolas({ adminName, adminRole, escolas }) {
    const { flash } = usePage().props;
    const [modalEscola,  setModalEscola]  = useState(null); // null | 'nova' | escola{}
    const [modalVagas,   setModalVagas]   = useState(null); // null | escola{}
    const [modalGestor,  setModalGestor]  = useState(null); // null | escola{}

    return (
        <AdminLayout adminName={adminName} adminRole={adminRole} currentPath="/admin/escolas">

            {/* Modais */}
            {modalEscola && (
                <ModalEscola
                    escola={modalEscola === 'nova' ? null : modalEscola}
                    onClose={() => setModalEscola(null)}
                />
            )}
            {modalVagas && (
                <ModalVagas
                    escola={modalVagas}
                    onClose={() => setModalVagas(null)}
                />
            )}
            {modalGestor && (
                <ModalGestor
                    escola={modalGestor}
                    onClose={() => setModalGestor(null)}
                />
            )}

            <div className="space-y-6">
                {/* Cabeçalho */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-stone-800">Escolas</h1>
                        <p className="mt-0.5 text-sm text-stone-500">
                            {escolas.length} escola{escolas.length !== 1 ? 's' : ''} cadastrada{escolas.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={() => setModalEscola('nova')}
                        className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-stone-900 hover:bg-amber-400"
                    >
                        + Nova escola
                    </button>
                </div>

                {/* Flash */}
                {flash?.sucesso && (
                    <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-800 ring-1 ring-green-200">
                        ✓ {flash.sucesso}
                    </div>
                )}

                {/* Lista */}
                {escolas.length === 0 ? (
                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
                        <p className="text-4xl">🏫</p>
                        <p className="mt-3 font-semibold text-stone-700">Nenhuma escola cadastrada</p>
                        <p className="mt-1 text-sm text-stone-400">Clique em "Nova escola" para começar.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {escolas.map(escola => (
                            <CardEscola
                                key={escola.id}
                                escola={escola}
                                adminRole={adminRole}
                                onEditar={() => setModalEscola(escola)}
                                onVagas={() => setModalVagas(escola)}
                                onGestor={() => setModalGestor(escola)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

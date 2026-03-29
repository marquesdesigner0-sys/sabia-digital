import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';

const TELEFONE_VAZIO = {
    secretaria: '', categoria: 'secretaria', responsavel: '',
    telefone: '', whatsapp: '', endereco: '', horario: '',
};

function ModalTelefone({ telefone, categorias, onFechar }) {
    const editando = !!telefone?.id;
    const [form, setForm] = useState(telefone ?? TELEFONE_VAZIO);
    const [enviando, setEnviando] = useState(false);

    function set(f, v) { setForm(prev => ({...prev, [f]: v})); }

    function submit(e) {
        e.preventDefault();
        setEnviando(true);
        const fn = editando
            ? router.put(`/admin/telefones/${telefone.id}`, form, { onFinish: () => { setEnviando(false); onFechar(); } })
            : router.post('/admin/telefones', form, { onFinish: () => { setEnviando(false); onFechar(); } });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-stone-800">{editando ? 'Editar Contato' : 'Novo Contato'}</h3>
                    <button onClick={onFechar} className="text-stone-400 hover:text-stone-600">✕</button>
                </div>
                <form onSubmit={submit} className="space-y-3">
                    <div><label className="label">Nome / Órgão *</label><input className="input" value={form.secretaria} onChange={e => set('secretaria', e.target.value)} required /></div>
                    <div>
                        <label className="label">Categoria *</label>
                        <select className="input" value={form.categoria} onChange={e => set('categoria', e.target.value)}>
                            {Object.entries(categorias).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                        </select>
                    </div>
                    <div><label className="label">Responsável</label><input className="input" value={form.responsavel} onChange={e => set('responsavel', e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="label">Telefone *</label><input className="input" value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="(87) 99999-9999" required /></div>
                        <div><label className="label">WhatsApp</label><input className="input" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="(87) 99999-9999" /></div>
                    </div>
                    <div><label className="label">Endereço</label><input className="input" value={form.endereco} onChange={e => set('endereco', e.target.value)} /></div>
                    <div><label className="label">Horário de atendimento</label><input className="input" value={form.horario} onChange={e => set('horario', e.target.value)} placeholder="Ex: Seg-Sex 8h-17h" /></div>
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onFechar} className="flex-1 rounded-xl border border-stone-300 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50">Cancelar</button>
                        <button type="submit" disabled={enviando} className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-stone-900 hover:bg-amber-400 disabled:opacity-60">
                            {enviando ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminTelefones({ adminName, adminRole, telefones, categorias }) {
    const [modal, setModal] = useState(null);
    const [confirmExcluir, setConfirmExcluir] = useState(null);

    return (
        <>
            <Head title="Admin — Telefones" />
            <AdminLayout adminName={adminName} adminRole={adminRole} currentPath="/admin/telefones">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-stone-800">Telefones Úteis</h1>
                        <button onClick={() => setModal({})} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-stone-900 hover:bg-amber-400">+ Novo Contato</button>
                    </div>

                    <div className="space-y-2">
                        {telefones.length === 0 && <div className="rounded-2xl bg-white py-12 text-center text-stone-400 ring-1 ring-stone-200">Nenhum contato cadastrado.</div>}
                        {telefones.map(t => (
                            <div key={t.id} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold text-stone-800">{t.secretaria}</p>
                                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-500">{categorias[t.categoria] ?? t.categoria}</span>
                                        {!t.ativo && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">Inativo</span>}
                                    </div>
                                    {t.responsavel && <p className="mt-0.5 text-xs text-stone-500">{t.responsavel}</p>}
                                    <p className="mt-0.5 text-xs text-stone-500">📞 {t.telefone}{t.whatsapp && ` · 💬 ${t.whatsapp}`}</p>
                                    {(t.endereco || t.horario) && (
                                        <p className="mt-0.5 text-xs text-stone-400">
                                            {t.endereco && `📍 ${t.endereco}`}{t.horario && ` · 🕐 ${t.horario}`}
                                        </p>
                                    )}
                                </div>
                                <div className="flex shrink-0 flex-col gap-1.5">
                                    <button onClick={() => router.post(`/admin/telefones/${t.id}/toggle`)}
                                        className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${t.ativo ? 'bg-stone-100 text-stone-600 hover:bg-stone-200' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                                        {t.ativo ? 'Desativar' : 'Ativar'}
                                    </button>
                                    <button onClick={() => setModal(t)} className="rounded-xl bg-stone-50 px-2.5 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-100">Editar</button>
                                    <button onClick={() => setConfirmExcluir(t)} className="rounded-xl bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100">Excluir</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AdminLayout>

            {modal !== null && (
                <ModalTelefone telefone={modal.id ? modal : null} categorias={categorias} onFechar={() => setModal(null)} />
            )}

            {confirmExcluir && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                        <p className="font-semibold text-stone-800">Excluir contato?</p>
                        <p className="mt-1 text-sm text-stone-500">"{confirmExcluir.secretaria}" será excluído permanentemente.</p>
                        <div className="mt-4 flex gap-2">
                            <button onClick={() => setConfirmExcluir(null)} className="flex-1 rounded-xl border border-stone-300 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50">Cancelar</button>
                            <button onClick={() => router.delete(`/admin/telefones/${confirmExcluir.id}`, {}, { onSuccess: () => setConfirmExcluir(null) })}
                                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600">Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

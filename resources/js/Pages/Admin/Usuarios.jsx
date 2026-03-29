import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout, { ROLE_LABEL } from '../../Components/AdminLayout';

const USUARIO_VAZIO = { name: '', email: '', senha: '', admin_role: 'educacao' };

const ROLE_COR = {
    geral:        'bg-amber-100 text-amber-700',
    educacao:     'bg-blue-100 text-blue-700',
    secon:        'bg-purple-100 text-purple-700',
    empreendedor: 'bg-emerald-100 text-emerald-700',
};

function ModalUsuario({ usuario, adminRoles, onFechar }) {
    const editando = !!usuario?.id;
    const [form, setForm] = useState(
        usuario ? { ...usuario, senha: '' } : USUARIO_VAZIO
    );
    const [enviando, setEnviando] = useState(false);

    function set(field, val) { setForm(f => ({ ...f, [field]: val })); }

    function submit(e) {
        e.preventDefault();
        setEnviando(true);
        const action = editando
            ? router.put(`/admin/usuarios/${usuario.id}`, form, { onFinish: () => { setEnviando(false); onFechar(); } })
            : router.post('/admin/usuarios', form, { onFinish: () => { setEnviando(false); onFechar(); } });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-stone-800">{editando ? 'Editar Usuário' : 'Novo Usuário Admin'}</h3>
                    <button onClick={onFechar} className="text-stone-400 hover:text-stone-600">✕</button>
                </div>

                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <label className="label">Nome completo *</label>
                        <input className="input" value={form.name} onChange={e => set('name', e.target.value)} required />
                    </div>
                    <div>
                        <label className="label">E-mail *</label>
                        <input type="email" className="input" value={form.email} onChange={e => set('email', e.target.value)} required />
                    </div>
                    <div>
                        <label className="label">Nível de acesso *</label>
                        <select className="input" value={form.admin_role} onChange={e => set('admin_role', e.target.value)}>
                            {Object.entries(adminRoles).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">{editando ? 'Nova senha (deixe em branco para manter)' : 'Senha *'}</label>
                        <input
                            type="password"
                            className="input"
                            value={form.senha}
                            onChange={e => set('senha', e.target.value)}
                            required={!editando}
                            placeholder="Mínimo 8 caracteres"
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onFechar} className="flex-1 rounded-xl border border-stone-300 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={enviando} className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-stone-900 hover:bg-amber-400 disabled:opacity-60">
                            {enviando ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminUsuarios({ adminName, adminRole, usuarios, admin_roles, meu_id }) {
    const [modal, setModal] = useState(null);
    const [confirmExcluir, setConfirmExcluir] = useState(null);

    return (
        <>
            <Head title="Admin — Usuários" />
            <AdminLayout adminName={adminName} adminRole={adminRole} currentPath="/admin/usuarios">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-stone-800">Usuários do Painel</h1>
                            <p className="mt-0.5 text-sm text-stone-500">Gerencie os servidores com acesso ao painel</p>
                        </div>
                        <button
                            onClick={() => setModal({})}
                            className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-stone-900 hover:bg-amber-400"
                        >
                            + Novo Usuário
                        </button>
                    </div>

                    {/* Legenda de roles */}
                    <div className="flex flex-wrap gap-2 rounded-xl bg-white p-3 ring-1 ring-stone-200">
                        {Object.entries(admin_roles).map(([key, label]) => (
                            <span key={key} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_COR[key]}`}>
                                {label}
                            </span>
                        ))}
                    </div>

                    {/* Lista de usuários */}
                    <div className="space-y-2">
                        {usuarios.length === 0 && (
                            <div className="rounded-2xl bg-white py-12 text-center text-stone-400 shadow-sm ring-1 ring-stone-200">
                                Nenhum usuário admin cadastrado.
                            </div>
                        )}
                        {usuarios.map(u => (
                            <div key={u.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-lg font-bold text-stone-600">
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold text-stone-800">{u.name}</p>
                                        {u.id === meu_id && (
                                            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-500">você</span>
                                        )}
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ROLE_COR[u.admin_role] ?? 'bg-stone-100 text-stone-500'}`}>
                                            {ROLE_LABEL[u.admin_role] ?? u.admin_role}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-stone-500">{u.email} · Cadastrado em {u.created_at}</p>
                                </div>
                                <div className="flex shrink-0 gap-1.5">
                                    <button onClick={() => setModal(u)} className="rounded-xl bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100">
                                        Editar
                                    </button>
                                    {u.id !== meu_id && (
                                        <button onClick={() => setConfirmExcluir(u)} className="rounded-xl bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100">
                                            Excluir
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Aviso de segurança */}
                    <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
                        ⚠️ Somente o <strong>Administrador Geral</strong> pode criar, editar e excluir usuários do painel.
                    </div>
                </div>
            </AdminLayout>

            {modal !== null && (
                <ModalUsuario
                    usuario={modal.id ? modal : null}
                    adminRoles={admin_roles}
                    onFechar={() => setModal(null)}
                />
            )}

            {confirmExcluir && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                        <p className="font-semibold text-stone-800">Excluir usuário?</p>
                        <p className="mt-1 text-sm text-stone-500">
                            <strong>{confirmExcluir.name}</strong> perderá acesso ao painel permanentemente.
                        </p>
                        <div className="mt-4 flex gap-2">
                            <button onClick={() => setConfirmExcluir(null)} className="flex-1 rounded-xl border border-stone-300 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50">
                                Cancelar
                            </button>
                            <button
                                onClick={() => router.delete(`/admin/usuarios/${confirmExcluir.id}`, {}, { onSuccess: () => setConfirmExcluir(null) })}
                                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

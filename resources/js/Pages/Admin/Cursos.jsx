import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';

const CURSO_VAZIO = {
    titulo: '', descricao: '', instrutor: '', carga_horaria: '',
    data_inicio: '', data_fim: '', local: '',
    vagas_total: '', vagas_disponiveis: '', status: 'ativo',
};

function ModalCurso({ curso, onFechar }) {
    const editando = !!curso?.id;
    const [form, setForm] = useState(curso ?? CURSO_VAZIO);
    const [enviando, setEnviando] = useState(false);

    function set(f, v) { setForm(prev => ({...prev, [f]: v})); }

    function submit(e) {
        e.preventDefault();
        setEnviando(true);
        const fn = editando
            ? router.put(`/admin/cursos/${curso.id}`, form, { onFinish: () => { setEnviando(false); onFechar(); } })
            : router.post('/admin/cursos', form, { onFinish: () => { setEnviando(false); onFechar(); } });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-stone-800">{editando ? 'Editar Curso' : 'Novo Curso'}</h3>
                    <button onClick={onFechar} className="text-stone-400 hover:text-stone-600">✕</button>
                </div>
                <form onSubmit={submit} className="space-y-3">
                    <div><label className="label">Título *</label><input className="input" value={form.titulo} onChange={e => set('titulo', e.target.value)} required /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="label">Instrutor</label><input className="input" value={form.instrutor} onChange={e => set('instrutor', e.target.value)} /></div>
                        <div><label className="label">Carga horária</label><input className="input" value={form.carga_horaria} onChange={e => set('carga_horaria', e.target.value)} placeholder="Ex: 40h" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="label">Data início</label><input type="date" className="input" value={form.data_inicio} onChange={e => set('data_inicio', e.target.value)} /></div>
                        <div><label className="label">Data fim</label><input type="date" className="input" value={form.data_fim} onChange={e => set('data_fim', e.target.value)} /></div>
                    </div>
                    <div><label className="label">Local</label><input className="input" value={form.local} onChange={e => set('local', e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="label">Vagas total *</label><input type="number" min="1" className="input" value={form.vagas_total} onChange={e => set('vagas_total', e.target.value)} required /></div>
                        <div><label className="label">Vagas disponíveis *</label><input type="number" min="0" className="input" value={form.vagas_disponiveis} onChange={e => set('vagas_disponiveis', e.target.value)} required /></div>
                    </div>
                    <div><label className="label">Descrição</label><textarea className="input h-20 resize-none" value={form.descricao} onChange={e => set('descricao', e.target.value)} /></div>
                    <div>
                        <label className="label">Status</label>
                        <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
                            <option value="ativo">Ativo</option>
                            <option value="encerrado">Encerrado</option>
                        </select>
                    </div>
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

export default function AdminCursos({ adminName, adminRole, cursos }) {
    const [modal, setModal] = useState(null);
    const [confirmExcluir, setConfirmExcluir] = useState(null);

    return (
        <>
            <Head title="Admin — Cursos" />
            <AdminLayout adminName={adminName} adminRole={adminRole} currentPath="/admin/cursos">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-stone-800">Cursos e Treinamentos</h1>
                        <button onClick={() => setModal({})} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-stone-900 hover:bg-amber-400">+ Novo Curso</button>
                    </div>

                    <div className="space-y-2">
                        {cursos.length === 0 && <div className="rounded-2xl bg-white py-12 text-center text-stone-400 ring-1 ring-stone-200">Nenhum curso cadastrado.</div>}
                        {cursos.map(c => (
                            <div key={c.id} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold text-stone-800">{c.titulo}</p>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                                            {c.status === 'ativo' ? 'Ativo' : 'Encerrado'}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-stone-500">
                                        {c.instrutor && `${c.instrutor} · `}{c.carga_horaria && `${c.carga_horaria} · `}
                                        {c.data_inicio} {c.data_fim && `→ ${c.data_fim}`}
                                    </p>
                                    <p className="mt-0.5 text-xs text-stone-400">
                                        {c.inscricoes_count} inscrito{c.inscricoes_count !== 1 ? 's' : ''} · {c.vagas_disponiveis}/{c.vagas_total} vagas disponíveis
                                    </p>
                                    {c.local && <p className="mt-0.5 text-xs text-stone-400">📍 {c.local}</p>}
                                </div>
                                <div className="flex shrink-0 flex-col gap-1.5">
                                    <button onClick={() => setModal(c)} className="rounded-xl bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100">Editar</button>
                                    <button onClick={() => setConfirmExcluir(c)} className="rounded-xl bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100">Excluir</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AdminLayout>

            {modal !== null && <ModalCurso curso={modal.id ? modal : null} onFechar={() => setModal(null)} />}

            {confirmExcluir && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                        <p className="font-semibold text-stone-800">Excluir curso?</p>
                        <p className="mt-1 text-sm text-stone-500">"{confirmExcluir.titulo}" será excluído permanentemente.</p>
                        <div className="mt-4 flex gap-2">
                            <button onClick={() => setConfirmExcluir(null)} className="flex-1 rounded-xl border border-stone-300 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50">Cancelar</button>
                            <button onClick={() => router.delete(`/admin/cursos/${confirmExcluir.id}`, {}, { onSuccess: () => setConfirmExcluir(null) })}
                                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600">Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

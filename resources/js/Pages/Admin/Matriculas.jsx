import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';

const STATUS_CONFIG = {
    pendente:   { label: 'Pendente',   cor: 'bg-amber-100 text-amber-700' },
    em_analise: { label: 'Em Análise', cor: 'bg-blue-100 text-blue-700' },
    aprovada:   { label: 'Aprovada',   cor: 'bg-green-100 text-green-700' },
    recusada:   { label: 'Recusada',   cor: 'bg-red-100 text-red-700' },
};

function ModalStatus({ matricula, onFechar }) {
    const [form, setForm] = useState({ status: matricula.status, observacao: matricula.observacao ?? '' });
    const [enviando, setEnviando] = useState(false);

    function submit(e) {
        e.preventDefault();
        setEnviando(true);
        router.post(`/admin/matriculas/${matricula.id}/status`, form, {
            onFinish: () => { setEnviando(false); onFechar(); },
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-stone-800">Atualizar Status</h3>
                    <button onClick={onFechar} className="text-stone-400 hover:text-stone-600">✕</button>
                </div>
                <p className="mb-4 text-sm text-stone-600">
                    <span className="font-semibold">{matricula.aluno_nome}</span> · {matricula.protocolo}
                </p>
                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <label className="label">Status</label>
                        <select className="input" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                            <option value="pendente">Pendente</option>
                            <option value="em_analise">Em Análise</option>
                            <option value="aprovada">Aprovada</option>
                            <option value="recusada">Recusada</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Observação (opcional)</label>
                        <textarea className="input h-20 resize-none" value={form.observacao} onChange={e => setForm(f => ({...f, observacao: e.target.value}))} />
                    </div>
                    <div className="flex gap-2 pt-1">
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

export default function AdminMatriculas({ adminName, adminRole, matriculas }) {
    const [modal, setModal] = useState(null);
    const [filtro, setFiltro] = useState('todos');

    const filtradas = filtro === 'todos' ? matriculas : matriculas.filter(m => m.status === filtro);

    return (
        <>
            <Head title="Admin — Matrículas" />
            <AdminLayout adminName={adminName} adminRole={adminRole} currentPath="/admin/matriculas">
                <div className="space-y-4">
                    <h1 className="text-xl font-bold text-stone-800">Matrículas Escolares</h1>

                    <div className="flex flex-wrap gap-1.5">
                        {[['todos', 'Todos'], ['pendente', 'Pendentes'], ['em_analise', 'Em Análise'], ['aprovada', 'Aprovadas'], ['recusada', 'Recusadas']].map(([val, label]) => (
                            <button key={val} onClick={() => setFiltro(val)}
                                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${filtro === val ? 'bg-stone-800 text-white' : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'}`}
                            >
                                {label} {val !== 'todos' && `(${matriculas.filter(m => m.status === val).length})`}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        {filtradas.length === 0 && <div className="rounded-2xl bg-white py-12 text-center text-stone-400 ring-1 ring-stone-200">Nenhuma matrícula encontrada.</div>}
                        {filtradas.map(m => {
                            const cfg = STATUS_CONFIG[m.status];
                            return (
                                <div key={m.id} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold text-stone-800">{m.aluno_nome}</p>
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.cor}`}>{cfg.label}</span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-stone-500">{m.protocolo} · {m.serie_solicitada} · {m.escola}</p>
                                        <p className="mt-0.5 text-xs text-stone-400">Responsável: {m.responsavel} · {m.created_at}</p>
                                        {m.observacao && <p className="mt-1 rounded-lg bg-stone-50 px-2 py-1 text-xs text-stone-500">{m.observacao}</p>}
                                    </div>
                                    <button onClick={() => setModal(m)} className="shrink-0 rounded-xl bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100">
                                        Atualizar
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </AdminLayout>

            {modal && <ModalStatus matricula={modal} onFechar={() => setModal(null)} />}
        </>
    );
}

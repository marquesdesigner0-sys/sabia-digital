import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';

const STATUS_COR = {
    pendente: 'bg-amber-100 text-amber-700',
    ativo:    'bg-green-100 text-green-700',
    inativo:  'bg-stone-100 text-stone-500',
};

export default function AdminEstabelecimentos({ adminName, adminRole, estabelecimentos }) {
    const [filtro, setFiltro] = useState('pendente');
    const [confirmacao, setConfirmacao] = useState(null);

    const filtrados = filtro === 'todos' ? estabelecimentos : estabelecimentos.filter(e => e.status === filtro);

    function waHref(num) { return `https://wa.me/55${num.replace(/\D/g, '')}`; }

    return (
        <>
            <Head title="Admin — Estabelecimentos" />
            <AdminLayout adminName={adminName} adminRole={adminRole} currentPath="/admin/estabelecimentos">
                <div className="space-y-4">
                    <h1 className="text-xl font-bold text-stone-800">Estabelecimentos</h1>

                    <div className="flex flex-wrap gap-1.5">
                        {[['pendente', 'Pendentes'], ['ativo', 'Ativos'], ['inativo', 'Inativos'], ['todos', 'Todos']].map(([val, label]) => (
                            <button key={val} onClick={() => setFiltro(val)}
                                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${filtro === val ? 'bg-stone-800 text-white' : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'}`}
                            >
                                {label} {val !== 'todos' && `(${estabelecimentos.filter(e => e.status === val).length})`}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        {filtrados.length === 0 && <div className="rounded-2xl bg-white py-12 text-center text-stone-400 ring-1 ring-stone-200">Nenhum estabelecimento encontrado.</div>}
                        {filtrados.map(e => (
                            <div key={e.id} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold text-stone-800">{e.nome}</p>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COR[e.status]}`}>
                                            {e.status === 'pendente' ? 'Pendente' : e.status === 'ativo' ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-stone-500">{e.categoria} · Cadastrado em {e.created_at}</p>
                                    <p className="mt-0.5 text-xs text-stone-400">Dono: {e.dono} · {e.dono_email}</p>
                                    {e.aprovado_em && <p className="mt-0.5 text-xs text-green-600">Aprovado em {e.aprovado_em}</p>}
                                </div>
                                <div className="flex shrink-0 flex-col gap-1.5">
                                    {e.whatsapp && (
                                        <a href={waHref(e.whatsapp)} target="_blank" rel="noopener noreferrer"
                                            className="rounded-xl bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 ring-1 ring-green-200 hover:bg-green-100 text-center"
                                        >WhatsApp</a>
                                    )}
                                    {e.status !== 'ativo' && (
                                        <button onClick={() => setConfirmacao({ acao: 'aprovar', item: e })}
                                            className="rounded-xl bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600">
                                            Aprovar
                                        </button>
                                    )}
                                    {e.status === 'ativo' && (
                                        <button onClick={() => setConfirmacao({ acao: 'inativar', item: e })}
                                            className="rounded-xl bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-200">
                                            Inativar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AdminLayout>

            {confirmacao && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                        <p className="font-semibold text-stone-800">
                            {confirmacao.acao === 'aprovar' ? 'Aprovar estabelecimento?' : 'Inativar estabelecimento?'}
                        </p>
                        <p className="mt-1 text-sm text-stone-500">{confirmacao.item.nome}</p>
                        <div className="mt-4 flex gap-2">
                            <button onClick={() => setConfirmacao(null)} className="flex-1 rounded-xl border border-stone-300 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50">Cancelar</button>
                            <button
                                onClick={() => {
                                    const url = `/admin/estabelecimentos/${confirmacao.item.id}/${confirmacao.acao === 'aprovar' ? 'aprovar' : 'inativar'}`;
                                    router.post(url, {}, { onSuccess: () => setConfirmacao(null) });
                                }}
                                className={`flex-1 rounded-xl py-2.5 text-sm font-bold text-white ${confirmacao.acao === 'aprovar' ? 'bg-green-500 hover:bg-green-600' : 'bg-stone-700 hover:bg-stone-800'}`}
                            >Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

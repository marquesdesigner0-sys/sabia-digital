import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';

const LABEL_CAT = {
    saude: 'Saúde', educacao: 'Educação', assistencia: 'Assistência Social',
    infraestrutura: 'Infraestrutura', meio_ambiente: 'Meio Ambiente',
    esporte_lazer: 'Esporte e Lazer', cultura_turismo: 'Cultura e Turismo',
    desenvolvimento: 'Desenvolvimento', mulheres: 'Pol. para Mulheres',
    coleta_urbana: 'Coleta Urbana',
};

const DIAS_SEMANA = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const NOTICIA_VAZIA = { titulo: '', resumo: '', conteudo: '', categoria: 'saude', publicado: false, destaque: false, publicado_em: '' };
const COLETA_VAZIA  = { bairro: '', ruas: '', dias_semana: [], horario: '', observacao: '' };

function Badge({ pub, dest }) {
    return (
        <div className="flex gap-1">
            {pub
                ? <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Publicado</span>
                : <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-500">Rascunho</span>
            }
            {dest && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">⭐ Destaque</span>}
        </div>
    );
}

function ModalNoticia({ noticia, categorias, onFechar }) {
    const editando = !!noticia?.id;
    const [form, setForm] = useState(noticia ?? NOTICIA_VAZIA);
    const [enviando, setEnviando] = useState(false);

    function submit(e) {
        e.preventDefault();
        setEnviando(true);
        const fn = editando
            ? router.put(`/admin/noticias/${noticia.id}`, form, { onFinish: () => { setEnviando(false); onFechar(); } })
            : router.post('/admin/noticias', form, { onFinish: () => { setEnviando(false); onFechar(); } });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-stone-800">{editando ? 'Editar Notícia' : 'Nova Notícia'}</h3>
                    <button onClick={onFechar} className="text-stone-400 hover:text-stone-600">✕</button>
                </div>
                <form onSubmit={submit} className="space-y-3">
                    <div><label className="label">Título *</label><input className="input" value={form.titulo} onChange={e => setForm(f => ({...f, titulo: e.target.value}))} required /></div>
                    <div>
                        <label className="label">Categoria *</label>
                        <select className="input" value={form.categoria} onChange={e => setForm(f => ({...f, categoria: e.target.value}))}>
                            {categorias.map(c => <option key={c} value={c}>{LABEL_CAT[c] ?? c}</option>)}
                        </select>
                    </div>
                    <div><label className="label">Resumo</label><textarea className="input h-16 resize-none" value={form.resumo} onChange={e => setForm(f => ({...f, resumo: e.target.value}))} /></div>
                    <div><label className="label">Conteúdo *</label><textarea className="input h-40 resize-y" value={form.conteudo} onChange={e => setForm(f => ({...f, conteudo: e.target.value}))} required /></div>
                    <div><label className="label">Data de publicação</label><input type="date" className="input" value={form.publicado_em} onChange={e => setForm(f => ({...f, publicado_em: e.target.value}))} /></div>
                    <div className="flex gap-6">
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
                            <input type="checkbox" checked={form.publicado} onChange={e => setForm(f => ({...f, publicado: e.target.checked}))} className="rounded" /> Publicado
                        </label>
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
                            <input type="checkbox" checked={form.destaque} onChange={e => setForm(f => ({...f, destaque: e.target.checked}))} className="rounded" /> Destaque
                        </label>
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

function ModalColeta({ item, onFechar }) {
    const editando = !!item?.id;
    const [form, setForm] = useState(item ?? COLETA_VAZIA);
    const [enviando, setEnviando] = useState(false);

    function toggleDia(dia) {
        setForm(f => ({
            ...f,
            dias_semana: f.dias_semana.includes(dia) ? f.dias_semana.filter(d => d !== dia) : [...f.dias_semana, dia],
        }));
    }

    function submit(e) {
        e.preventDefault();
        setEnviando(true);
        const fn = editando
            ? router.put(`/admin/coleta/${item.id}`, form, { onFinish: () => { setEnviando(false); onFechar(); } })
            : router.post('/admin/coleta', form, { onFinish: () => { setEnviando(false); onFechar(); } });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-stone-800">{editando ? 'Editar Bairro' : 'Novo Bairro'}</h3>
                    <button onClick={onFechar} className="text-stone-400 hover:text-stone-600">✕</button>
                </div>
                <form onSubmit={submit} className="space-y-3">
                    <div><label className="label">Bairro *</label><input className="input" value={form.bairro} onChange={e => setForm(f => ({...f, bairro: e.target.value}))} required /></div>
                    <div><label className="label">Ruas (opcional)</label><textarea className="input h-16 resize-none" value={form.ruas} onChange={e => setForm(f => ({...f, ruas: e.target.value}))} /></div>
                    <div>
                        <label className="label">Dias de coleta *</label>
                        <div className="flex flex-wrap gap-2">
                            {DIAS_SEMANA.map(dia => (
                                <button key={dia} type="button" onClick={() => toggleDia(dia)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${form.dias_semana.includes(dia) ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-500'}`}
                                >
                                    {dia.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div><label className="label">Horário</label><input className="input" value={form.horario} onChange={e => setForm(f => ({...f, horario: e.target.value}))} placeholder="Ex: 06h–10h" /></div>
                    <div><label className="label">Observação</label><textarea className="input h-16 resize-none" value={form.observacao} onChange={e => setForm(f => ({...f, observacao: e.target.value}))} /></div>
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

export default function AdminNoticias({ adminName, adminRole, noticias, coleta, categorias }) {
    const [aba, setAba] = useState('noticias');
    const [modalNoticia, setModalNoticia] = useState(null);
    const [modalColeta, setModalColeta] = useState(null);
    const [confirmExcluir, setConfirmExcluir] = useState(null);

    function excluir() {
        const { tipo, item } = confirmExcluir;
        const url = tipo === 'noticia' ? `/admin/noticias/${item.id}` : `/admin/coleta/${item.id}`;
        router.delete(url, {}, { onSuccess: () => setConfirmExcluir(null) });
    }

    return (
        <>
            <Head title="Admin — Notícias" />
            <AdminLayout adminName={adminName} adminRole={adminRole} currentPath="/admin/noticias">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-stone-800">Notícias e Coleta</h1>
                        <button
                            onClick={() => aba === 'noticias' ? setModalNoticia({}) : setModalColeta({})}
                            className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-stone-900 hover:bg-amber-400"
                        >
                            + {aba === 'noticias' ? 'Nova Notícia' : 'Novo Bairro'}
                        </button>
                    </div>

                    <div className="flex gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-stone-200">
                        {[['noticias', '📰 Notícias'], ['coleta', '🗑️ Coleta Urbana']].map(([key, label]) => (
                            <button key={key} onClick={() => setAba(key)}
                                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${aba === key ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-50'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {aba === 'noticias' && (
                        <div className="space-y-2">
                            {noticias.length === 0 && <div className="rounded-2xl bg-white py-12 text-center text-stone-400 ring-1 ring-stone-200">Nenhuma notícia cadastrada.</div>}
                            {noticias.map(n => (
                                <div key={n.id} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold leading-snug text-stone-800 line-clamp-1">{n.titulo}</p>
                                        <p className="mt-0.5 text-xs text-stone-400">{LABEL_CAT[n.categoria]} · {n.publicado_em ?? '—'}</p>
                                        <div className="mt-1.5"><Badge pub={n.publicado} dest={n.destaque} /></div>
                                    </div>
                                    <div className="flex shrink-0 flex-col gap-1.5">
                                        <button onClick={() => router.post(`/admin/noticias/${n.id}/toggle-publicado`)}
                                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${n.publicado ? 'bg-stone-100 text-stone-600 hover:bg-red-50 hover:text-red-600' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                                            {n.publicado ? 'Despublicar' : 'Publicar'}
                                        </button>
                                        <button onClick={() => router.post(`/admin/noticias/${n.id}/toggle-destaque`)}
                                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${n.destaque ? 'bg-amber-50 text-amber-700' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}>
                                            {n.destaque ? '⭐ Destaque' : 'Destaque'}
                                        </button>
                                        <button onClick={() => setModalNoticia(n)} className="rounded-lg bg-stone-50 px-2.5 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-100">Editar</button>
                                        <button onClick={() => setConfirmExcluir({ tipo: 'noticia', item: n })} className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100">Excluir</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {aba === 'coleta' && (
                        <div className="space-y-2">
                            {coleta.length === 0 && <div className="rounded-2xl bg-white py-12 text-center text-stone-400 ring-1 ring-stone-200">Nenhum bairro cadastrado.</div>}
                            {coleta.map(c => (
                                <div key={c.id} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-stone-800">{c.bairro}</p>
                                        {c.ruas && <p className="mt-0.5 text-xs text-stone-500 line-clamp-1">{c.ruas}</p>}
                                        <div className="mt-1.5 flex flex-wrap gap-1">
                                            {DIAS_SEMANA.map(d => (
                                                <span key={d} className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${c.dias_semana?.includes(d) ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-400'}`}>
                                                    {d.slice(0,3)}
                                                </span>
                                            ))}
                                            {c.horario && <span className="ml-1 text-xs text-stone-500">{c.horario}</span>}
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 flex-col gap-1.5">
                                        <button onClick={() => setModalColeta(c)} className="rounded-lg bg-stone-50 px-2.5 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-100">Editar</button>
                                        <button onClick={() => setConfirmExcluir({ tipo: 'coleta', item: c })} className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100">Excluir</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AdminLayout>

            {modalNoticia !== null && (
                <ModalNoticia noticia={modalNoticia.id ? modalNoticia : null} categorias={categorias} onFechar={() => setModalNoticia(null)} />
            )}
            {modalColeta !== null && (
                <ModalColeta item={modalColeta.id ? modalColeta : null} onFechar={() => setModalColeta(null)} />
            )}
            {confirmExcluir && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                        <p className="font-semibold text-stone-800">Confirmar exclusão</p>
                        <p className="mt-1 text-sm text-stone-500">"{confirmExcluir.item.titulo || confirmExcluir.item.bairro}" será excluído permanentemente.</p>
                        <div className="mt-4 flex gap-2">
                            <button onClick={() => setConfirmExcluir(null)} className="flex-1 rounded-xl border border-stone-300 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50">Cancelar</button>
                            <button onClick={excluir} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600">Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

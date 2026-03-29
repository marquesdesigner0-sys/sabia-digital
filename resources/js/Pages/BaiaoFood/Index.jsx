import { useState } from 'react';
import { Head } from '@inertiajs/react';

const DIAS_LABEL = { dom:'Dom', seg:'Seg', ter:'Ter', qua:'Qua', qui:'Qui', sex:'Sex', sab:'Sáb' };

function formatarHorario(raw) {
    if (!raw) return null;
    try {
        const h = JSON.parse(raw);
        return Object.entries(DIAS_LABEL)
            .filter(([id]) => h[id]?.aberto)
            .map(([id]) => `${DIAS_LABEL[id]}: ${h[id].de}–${h[id].ate}`)
            .join(' · ') || null;
    } catch {
        return raw; // fallback para texto livre antigo
    }
}

function badge(label, cor) {
    return (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cor}`}>
            {label}
        </span>
    );
}

export default function BaiaoFoodIndex({ estabelecimentos }) {
    const categorias = ['Todos', ...new Set(estabelecimentos.map((e) => e.categoria))];
    const [filtro, setFiltro] = useState('Todos');

    const lista = filtro === 'Todos'
        ? estabelecimentos
        : estabelecimentos.filter((e) => e.categoria === filtro);

    return (
        <>
            <Head title="Baião Food" />
            <div className="min-h-screen bg-stone-100">
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                            <a href="/" className="text-stone-400 hover:text-stone-600">← Início</a>
                            <span className="text-stone-300">/</span>
                            <span className="font-semibold text-stone-800">Baião Food</span>
                        </div>
                        <a href="/empreendedor/login"
                            className="text-xs font-medium text-amber-600 hover:underline">
                            Área do empreendedor
                        </a>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-4 py-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-stone-800">Baião Food</h1>
                        <p className="mt-1 text-sm text-stone-500">
                            Estabelecimentos locais de Carnaíba · peça pelo WhatsApp ou Pix
                        </p>
                    </div>

                    {/* Filtro por categoria */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {categorias.map((c) => (
                            <button
                                key={c}
                                onClick={() => setFiltro(c)}
                                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                                    filtro === c
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    {lista.length === 0 ? (
                        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-stone-200">
                            <p className="text-stone-400">Nenhum estabelecimento disponível no momento.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {lista.map((e) => (
                                <a
                                    key={e.id}
                                    href={`/baiao-food/${e.id}`}
                                    className="block rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200 transition hover:ring-amber-300"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Logo */}
                                        {e.logo ? (
                                            <img src={e.logo} alt={e.nome} className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-stone-200" />
                                        ) : (
                                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-100 text-2xl">🍽️</div>
                                        )}

                                        <div className="flex flex-1 items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h2 className="font-semibold text-stone-800">{e.nome}</h2>
                                                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-500">
                                                        {e.categoria}
                                                    </span>
                                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                        e.aberto ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                                                    }`}>
                                                        {e.aberto ? 'Aberto' : 'Fechado'}
                                                    </span>
                                                </div>

                                                {e.descricao && (
                                                    <p className="mt-1 text-sm text-stone-500 line-clamp-2">{e.descricao}</p>
                                                )}

                                                {formatarHorario(e.horario) && (
                                                    <p className="mt-1 text-xs text-stone-400">🕐 {formatarHorario(e.horario)}</p>
                                                )}

                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {e.aceita_delivery && badge(
                                                        e.taxa_entrega > 0
                                                            ? `Delivery · R$ ${e.taxa_entrega.toFixed(2).replace('.', ',')}`
                                                            : 'Delivery grátis',
                                                        'bg-green-100 text-green-700'
                                                    )}
                                                    {e.aceita_retirada && badge('Retirada no local', 'bg-blue-100 text-blue-700')}
                                                    {e.tem_whatsapp && badge('WhatsApp', 'bg-emerald-100 text-emerald-700')}
                                                    {e.tem_pix && badge('Pix', 'bg-purple-100 text-purple-700')}
                                                </div>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <p className="text-xs text-stone-400">{e.total_itens} itens</p>
                                                <p className="mt-1 text-sm font-medium text-amber-600">Ver cardápio →</p>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

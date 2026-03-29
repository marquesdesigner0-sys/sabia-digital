import { Head, router } from '@inertiajs/react';

const CATEGORIAS = [
    { key: 'saude',           label: 'Saúde',                    emoji: '🏥', cor: { pill: 'bg-red-500',     badge: 'bg-red-100 text-red-700'       } },
    { key: 'educacao',        label: 'Educação',                 emoji: '🎒', cor: { pill: 'bg-amber-500',   badge: 'bg-amber-100 text-amber-700'   } },
    { key: 'assistencia',     label: 'Assistência Social',       emoji: '🤝', cor: { pill: 'bg-pink-500',    badge: 'bg-pink-100 text-pink-700'     } },
    { key: 'infraestrutura',  label: 'Infraestrutura',           emoji: '🏗️', cor: { pill: 'bg-orange-500',  badge: 'bg-orange-100 text-orange-700' } },
    { key: 'meio_ambiente',   label: 'Meio Ambiente',            emoji: '🌿', cor: { pill: 'bg-green-600',   badge: 'bg-green-100 text-green-700'   } },
    { key: 'esporte_lazer',   label: 'Esporte e Lazer',         emoji: '⚽', cor: { pill: 'bg-sky-500',     badge: 'bg-sky-100 text-sky-700'       } },
    { key: 'cultura_turismo', label: 'Cultura e Turismo',       emoji: '🎭', cor: { pill: 'bg-purple-500',  badge: 'bg-purple-100 text-purple-700' } },
    { key: 'desenvolvimento', label: 'Desenvolvimento',          emoji: '💼', cor: { pill: 'bg-teal-500',    badge: 'bg-teal-100 text-teal-700'     } },
    { key: 'mulheres',        label: 'Políticas para Mulheres', emoji: '👩', cor: { pill: 'bg-fuchsia-500', badge: 'bg-fuchsia-100 text-fuchsia-700'} },
    { key: 'coleta_urbana',   label: 'Coleta Urbana',           emoji: '🗑️', cor: { pill: 'bg-stone-600',   badge: 'bg-stone-100 text-stone-700'   }, especial: true },
];

const DIAS_ORDEM = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DIAS_ABREV = { Segunda: 'Seg', Terça: 'Ter', Quarta: 'Qua', Quinta: 'Qui', Sexta: 'Sex', Sábado: 'Sáb' };

function getCat(key) {
    return CATEGORIAS.find((c) => c.key === key) ?? CATEGORIAS[0];
}

// ── Badge de categoria ────────────────────────────────────────────────────────
function BadgeCategoria({ categoria }) {
    const cat = getCat(categoria);
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${cat.cor.badge}`}>
            {cat.emoji} {cat.label}
        </span>
    );
}

// ── Card destaque (primeiro item) ─────────────────────────────────────────────
function CardDestaque({ noticia }) {
    return (
        <a
            href={`/informacoes/${noticia.id}`}
            className="group relative block overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-stone-200 transition hover:shadow-lg hover:ring-amber-300"
        >
            {noticia.imagem ? (
                <img src={noticia.imagem} alt={noticia.titulo} className="h-52 w-full object-cover" />
            ) : (
                <div className="flex h-52 w-full items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 text-6xl">
                    {getCat(noticia.categoria).emoji}
                </div>
            )}
            <div className="p-4">
                <BadgeCategoria categoria={noticia.categoria} />
                <p className="mt-2 text-base font-bold leading-snug text-stone-800 group-hover:text-amber-700 line-clamp-2">
                    {noticia.titulo}
                </p>
                {noticia.resumo && (
                    <p className="mt-1 line-clamp-2 text-sm text-stone-500">{noticia.resumo}</p>
                )}
                <p className="mt-3 text-xs text-stone-400">{noticia.publicado_em}</p>
            </div>
        </a>
    );
}

// ── Card compacto (lista) ─────────────────────────────────────────────────────
function CardNoticia({ noticia }) {
    return (
        <a
            href={`/informacoes/${noticia.id}`}
            className="group flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 transition hover:shadow-md hover:ring-amber-300"
        >
            {noticia.imagem ? (
                <img src={noticia.imagem} alt={noticia.titulo} className="h-20 w-20 flex-shrink-0 rounded-xl object-cover" />
            ) : (
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-stone-100 text-3xl">
                    {getCat(noticia.categoria).emoji}
                </div>
            )}
            <div className="flex min-w-0 flex-col justify-between">
                <div>
                    <p className="line-clamp-2 font-semibold leading-snug text-stone-800 group-hover:text-amber-700">
                        {noticia.titulo}
                    </p>
                    {noticia.resumo && (
                        <p className="mt-1 line-clamp-2 text-xs text-stone-500">{noticia.resumo}</p>
                    )}
                </div>
                <p className="mt-2 text-xs text-stone-400">{noticia.publicado_em}</p>
            </div>
        </a>
    );
}

// ── Cronograma de Coleta Urbana ───────────────────────────────────────────────
function CronogramaColeta({ cronograma }) {
    if (!cronograma || cronograma.length === 0) {
        return (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-stone-200">
                <span className="text-4xl">🗑️</span>
                <p className="mt-3 font-semibold text-stone-600">Cronograma ainda não cadastrado</p>
                <p className="mt-1 text-sm text-stone-400">
                    O cronograma de coleta será publicado em breve.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-xl bg-stone-700 px-4 py-3 text-white">
                <span className="text-xl">🗑️</span>
                <div>
                    <p className="font-bold text-sm">Cronograma de Coleta de Lixo</p>
                    <p className="text-xs text-stone-300">Verifique o dia de coleta no seu bairro</p>
                </div>
            </div>

            {cronograma.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-bold text-stone-800">{item.bairro}</p>
                            {item.ruas && (
                                <p className="mt-0.5 text-xs text-stone-500 leading-relaxed">{item.ruas}</p>
                            )}
                        </div>
                        {item.horario && (
                            <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                                {item.horario}
                            </span>
                        )}
                    </div>

                    {/* Dias da semana */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {DIAS_ORDEM.map((dia) => {
                            const ativo = item.dias_semana?.includes(dia);
                            return (
                                <span
                                    key={dia}
                                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                        ativo
                                            ? 'bg-stone-700 text-white'
                                            : 'bg-stone-100 text-stone-400'
                                    }`}
                                >
                                    {DIAS_ABREV[dia]}
                                </span>
                            );
                        })}
                    </div>

                    {item.observacao && (
                        <p className="mt-2.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 ring-1 ring-amber-200">
                            ℹ️ {item.observacao}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function NoticiasIndex({ noticias, categoria, contagens, cronograma }) {
    function mudarAba(key) {
        router.get('/informacoes', { categoria: key }, { preserveState: false });
    }

    const cat       = getCat(categoria);
    const destaque  = noticias[0] ?? null;
    const demais    = noticias.slice(1);
    const ehColeta  = categoria === 'coleta_urbana';

    return (
        <>
            <Head title="Informações" />
            <div className="min-h-screen bg-stone-100">

                {/* Header */}
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
                        <a href="/" className="text-stone-400 hover:text-stone-600">← Início</a>
                        <span className="text-stone-300">|</span>
                        <span className="text-lg font-bold text-amber-600">Informações</span>
                    </div>
                </header>

                {/* Abas horizontais scrolláveis */}
                <div className="sticky top-0 z-10 bg-white shadow-sm ring-1 ring-stone-100">
                    <div className="mx-auto max-w-3xl overflow-x-auto">
                        <div className="flex gap-1 px-3 py-2" style={{ minWidth: 'max-content' }}>
                            {CATEGORIAS.map((c) => {
                                const ativo   = categoria === c.key;
                                const total   = contagens[c.key] ?? 0;
                                return (
                                    <button
                                        key={c.key}
                                        onClick={() => mudarAba(c.key)}
                                        className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                            ativo
                                                ? `${c.cor.pill} text-white shadow-sm`
                                                : 'text-stone-600 hover:bg-stone-100'
                                        }`}
                                    >
                                        <span>{c.emoji}</span>
                                        <span>{c.label}</span>
                                        {total > 0 && (
                                            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${ativo ? 'bg-white/25 text-white' : 'bg-stone-200 text-stone-500'}`}>
                                                {total}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <main className="mx-auto max-w-3xl px-4 py-5">

                    {/* Coleta Urbana — exibe cronograma */}
                    {ehColeta ? (
                        <CronogramaColeta cronograma={cronograma} />
                    ) : noticias.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center shadow-sm ring-1 ring-stone-200">
                            <span className="text-5xl">{cat.emoji}</span>
                            <p className="mt-4 font-semibold text-stone-600">Nenhuma publicação disponível</p>
                            <p className="mt-1 text-sm text-stone-400">As publicações aparecerão aqui assim que forem divulgadas.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {destaque && <CardDestaque noticia={destaque} />}
                            {demais.map((n) => <CardNoticia key={n.id} noticia={n} />)}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

import { Head } from '@inertiajs/react';

const CATEGORIAS = [
    { key: 'saude',           label: 'Saúde',                    emoji: '🏥', badge: 'bg-red-100 text-red-700'          },
    { key: 'educacao',        label: 'Educação',                 emoji: '🎒', badge: 'bg-amber-100 text-amber-700'      },
    { key: 'assistencia',     label: 'Assistência Social',       emoji: '🤝', badge: 'bg-pink-100 text-pink-700'        },
    { key: 'infraestrutura',  label: 'Infraestrutura',           emoji: '🏗️', badge: 'bg-orange-100 text-orange-700'   },
    { key: 'meio_ambiente',   label: 'Meio Ambiente',            emoji: '🌿', badge: 'bg-green-100 text-green-700'     },
    { key: 'esporte_lazer',   label: 'Esporte e Lazer',         emoji: '⚽', badge: 'bg-sky-100 text-sky-700'          },
    { key: 'cultura_turismo', label: 'Cultura e Turismo',       emoji: '🎭', badge: 'bg-purple-100 text-purple-700'   },
    { key: 'desenvolvimento', label: 'Desenvolvimento',          emoji: '💼', badge: 'bg-teal-100 text-teal-700'       },
    { key: 'mulheres',        label: 'Políticas para Mulheres', emoji: '👩', badge: 'bg-fuchsia-100 text-fuchsia-700' },
    { key: 'coleta_urbana',   label: 'Coleta Urbana',           emoji: '🗑️', badge: 'bg-stone-100 text-stone-700'     },
];

function getCat(key) {
    return CATEGORIAS.find((c) => c.key === key) ?? CATEGORIAS[0];
}

function BadgeCategoria({ categoria }) {
    const cat = getCat(categoria);
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${cat.badge}`}>
            {cat.emoji} {cat.label}
        </span>
    );
}

function CardRelacionado({ noticia }) {
    return (
        <a
            href={`/informacoes/${noticia.id}`}
            className="group flex gap-3 rounded-xl bg-white p-3 ring-1 ring-stone-200 transition hover:ring-amber-300"
        >
            {noticia.imagem ? (
                <img src={noticia.imagem} alt={noticia.titulo} className="h-16 w-16 flex-shrink-0 rounded-lg object-cover" />
            ) : (
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-stone-100 text-2xl">
                    📰
                </div>
            )}
            <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-stone-800 group-hover:text-amber-700">
                    {noticia.titulo}
                </p>
                <p className="mt-1 text-xs text-stone-400">{noticia.publicado_em}</p>
            </div>
        </a>
    );
}

export default function NoticiaDetalhe({ noticia, relacionadas }) {
    const voltarHref  = `/informacoes?categoria=${noticia.categoria}`;
    const paragrafos  = (noticia.conteudo ?? '').split(/\n\n+/).filter(Boolean);

    return (
        <>
            <Head title={noticia.titulo} />
            <div className="min-h-screen bg-stone-100">

                {/* Header */}
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
                        <a href={voltarHref} className="text-stone-400 hover:text-stone-600">
                            ← Informações
                        </a>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-4 py-6">
                    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
                        {noticia.imagem && (
                            <img src={noticia.imagem} alt={noticia.titulo} className="max-h-72 w-full object-cover" />
                        )}

                        <div className="p-5 sm:p-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <BadgeCategoria categoria={noticia.categoria} />
                                <span className="text-xs text-stone-400">{noticia.publicado_em}</span>
                            </div>

                            <h1 className="mt-3 text-xl font-bold leading-snug text-stone-900 sm:text-2xl">
                                {noticia.titulo}
                            </h1>

                            {noticia.resumo && (
                                <p className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 ring-1 ring-amber-200">
                                    {noticia.resumo}
                                </p>
                            )}

                            <hr className="my-5 border-stone-100" />

                            <div className="space-y-4 text-sm leading-relaxed text-stone-700">
                                {paragrafos.map((p, i) => <p key={i}>{p}</p>)}
                            </div>
                        </div>
                    </article>

                    {relacionadas.length > 0 && (
                        <section className="mt-6">
                            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
                                Veja também
                            </h2>
                            <div className="space-y-2">
                                {relacionadas.map((r) => <CardRelacionado key={r.id} noticia={r} />)}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </>
    );
}

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

const CATEGORIAS = [
    { key: 'saude',           label: 'Saúde',                    emoji: '🏥', pill: 'bg-red-500'     },
    { key: 'educacao',        label: 'Educação',                 emoji: '🎒', pill: 'bg-amber-500'   },
    { key: 'assistencia',     label: 'Assistência Social',       emoji: '🤝', pill: 'bg-pink-500'    },
    { key: 'infraestrutura',  label: 'Infraestrutura',           emoji: '🏗️', pill: 'bg-orange-500'  },
    { key: 'meio_ambiente',   label: 'Meio Ambiente',            emoji: '🌿', pill: 'bg-green-600'   },
    { key: 'esporte_lazer',   label: 'Esporte e Lazer',         emoji: '⚽', pill: 'bg-sky-500'     },
    { key: 'cultura_turismo', label: 'Cultura e Turismo',       emoji: '🎭', pill: 'bg-purple-500'  },
    { key: 'desenvolvimento', label: 'Desenvolvimento',          emoji: '💼', pill: 'bg-teal-500'    },
    { key: 'mulheres',        label: 'Pol. para Mulheres',      emoji: '👩', pill: 'bg-fuchsia-500' },
    { key: 'coleta_urbana',   label: 'Coleta Urbana',           emoji: '🗑️', pill: 'bg-stone-600',  especial: true },
];

const DIAS_ORDEM = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DIAS_ABREV = { Segunda: 'Seg', Terça: 'Ter', Quarta: 'Qua', Quinta: 'Qui', Sexta: 'Sex', Sábado: 'Sáb' };

function getCat(key) {
    return CATEGORIAS.find((c) => c.key === key) ?? CATEGORIAS[0];
}

// ── Card com imagem de fundo + overlay ────────────────────────────────────────
function CardImagem({ noticia, grande = false }) {
    const cat = getCat(noticia.categoria);
    const placeholder = `https://placehold.co/800x${grande ? '600' : '400'}/1c1917/1c1917`;

    return (
        <a
            href={`/informacoes/${noticia.id}`}
            className={`group relative block overflow-hidden rounded-2xl ${grande ? 'row-span-2' : ''}`}
            style={{ minHeight: grande ? '360px' : '160px' }}
        >
            {/* Imagem de fundo */}
            <img
                src={noticia.imagem ?? placeholder}
                alt={noticia.titulo}
                className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />

            {/* Overlay gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Conteúdo */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                    {cat.label}
                </p>
                <p className={`mt-1 font-bold leading-snug text-white line-clamp-3 ${grande ? 'text-lg sm:text-xl' : 'text-sm'}`}>
                    {noticia.titulo}
                </p>
                <p className="mt-1.5 text-[11px] text-white/50">{noticia.publicado_em}</p>
            </div>
        </a>
    );
}

// ── Grid de notícias ──────────────────────────────────────────────────────────
function GridNoticias({ noticias }) {
    if (noticias.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center shadow-sm ring-1 ring-stone-200">
                <span className="text-5xl">{getCat('saude').emoji}</span>
                <p className="mt-4 font-semibold text-stone-600">Nenhuma publicação disponível</p>
                <p className="mt-1 text-sm text-stone-400">As publicações aparecerão aqui assim que forem divulgadas.</p>
            </div>
        );
    }

    const [destaque, ...resto] = noticias;

    // Layout: destaque grande à esquerda + grade 2×N à direita
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:grid-rows-2">
            {/* Destaque — ocupa 1 coluna e 2 linhas */}
            <div className="sm:col-span-1 sm:row-span-2" style={{ minHeight: '360px' }}>
                <CardImagem noticia={destaque} grande />
            </div>

            {/* Os próximos 4 em 2×2 */}
            {resto.slice(0, 4).map((n) => (
                <CardImagem key={n.id} noticia={n} />
            ))}
        </div>
    );
}

// ── Card extra (lista abaixo do grid) ─────────────────────────────────────────
function CardLista({ noticia }) {
    const cat = getCat(noticia.categoria);
    return (
        <a
            href={`/informacoes/${noticia.id}`}
            className="group flex gap-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-stone-200 transition hover:shadow-md hover:ring-amber-300"
        >
            {noticia.imagem ? (
                <img src={noticia.imagem} alt={noticia.titulo} className="h-20 w-20 flex-shrink-0 rounded-xl object-cover" />
            ) : (
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-stone-100 text-3xl">
                    {cat.emoji}
                </div>
            )}
            <div className="flex min-w-0 flex-col justify-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{cat.label}</p>
                <p className="mt-0.5 line-clamp-2 font-semibold leading-snug text-stone-800 group-hover:text-amber-700">
                    {noticia.titulo}
                </p>
                <p className="mt-1 text-xs text-stone-400">{noticia.publicado_em}</p>
            </div>
        </a>
    );
}

// ── Cronograma de Coleta Urbana ───────────────────────────────────────────────
function CronogramaColeta({ cronograma }) {
    if (!cronograma || cronograma.length === 0) {
        return (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-stone-200">
                <span className="text-4xl">🗑️</span>
                <p className="mt-3 font-semibold text-stone-600">Cronograma ainda não cadastrado</p>
                <p className="mt-1 text-sm text-stone-400">O cronograma de coleta será publicado em breve.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-stone-800 px-4 py-3 text-white">
                <span className="text-2xl">🗑️</span>
                <div>
                    <p className="font-bold">Cronograma de Coleta de Lixo</p>
                    <p className="text-xs text-stone-400">Verifique o dia de coleta no seu bairro</p>
                </div>
            </div>

            {cronograma.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-bold text-stone-800">{item.bairro}</p>
                            {item.ruas && (
                                <p className="mt-0.5 text-xs leading-relaxed text-stone-500">{item.ruas}</p>
                            )}
                        </div>
                        {item.horario && (
                            <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                                {item.horario}
                            </span>
                        )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {DIAS_ORDEM.map((dia) => {
                            const ativo = item.dias_semana?.includes(dia);
                            return (
                                <span key={dia} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${ativo ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-400'}`}>
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

// ── Seção de Destaques (tela inicial) ────────────────────────────────────────
function SecaoDestaques({ destaques, contagens }) {
    const [menuAberto, setMenuAberto] = useState(false);

    return (
        <div className="space-y-4">
            {/* Linha título + hambúrguer */}
            <div className="relative flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-800">⭐ Destaques</h2>
                <BotaoMenu
                    menuAberto={menuAberto}
                    onAbrir={() => setMenuAberto(true)}
                    onFechar={() => setMenuAberto(false)}
                    categoria={null}
                    contagens={contagens}
                />
            </div>

            {destaques.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center shadow-sm ring-1 ring-stone-200">
                    <span className="text-5xl">⭐</span>
                    <p className="mt-4 font-semibold text-stone-600">Nenhum destaque publicado</p>
                    <p className="mt-1 text-sm text-stone-400">Os destaques aparecerão aqui assim que forem publicados.</p>
                </div>
            ) : (
                <GridNoticias noticias={destaques} />
            )}
        </div>
    );
}

// ── Botão hambúrguer + dropdown (reutilizável) ────────────────────────────────
function BotaoMenu({ menuAberto, onAbrir, onFechar, categoria, contagens }) {
    function mudar(key) {
        onFechar();
        router.get('/informacoes', { categoria: key }, { preserveState: false });
    }

    return (
        <div className="relative">
            <button
                onClick={() => menuAberto ? onFechar() : onAbrir()}
                className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-stone-700 shadow-sm ring-1 ring-stone-200 transition hover:ring-stone-400"
            >
                <svg className="h-4 w-4 text-stone-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Categorias</span>
            </button>

            {menuAberto && (
                <>
                    <div className="fixed inset-0 z-10" onClick={onFechar} />
                    <div className="absolute right-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-stone-200">
                        <p className="border-b border-stone-100 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-400">
                            Selecionar categoria
                        </p>
                        {CATEGORIAS.map((c) => {
                            const ativo = categoria === c.key;
                            const total = contagens[c.key] ?? 0;
                            return (
                                <button
                                    key={c.key}
                                    onClick={() => mudar(c.key)}
                                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-stone-50 ${
                                        ativo ? 'bg-amber-50 font-bold text-amber-700' : 'text-stone-700'
                                    }`}
                                >
                                    <span className="text-base">{c.emoji}</span>
                                    <span className="flex-1">{c.label}</span>
                                    {total > 0 && (
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ativo ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-stone-500'}`}>
                                            {total}
                                        </span>
                                    )}
                                    {ativo && <span className="text-amber-500">✓</span>}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function NoticiasIndex({ noticias, destaques, categoria, contagens, cronograma }) {
    const [menuAberto, setMenuAberto] = useState(false);

    const cat      = categoria ? getCat(categoria) : null;
    const ehColeta = categoria === 'coleta_urbana';
    const extras   = noticias.slice(5);

    // Tela inicial — sem categoria selecionada
    const ehInicial = categoria === null || categoria === undefined;

    return (
        <>
            <Head title="Informações" />
            <div className="min-h-screen bg-stone-100">

                {/* Header */}
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
                        {!ehInicial ? (
                            <button
                                onClick={() => router.get('/informacoes')}
                                className="text-stone-400 hover:text-stone-600"
                            >
                                ← Destaques
                            </button>
                        ) : (
                            <a href="/" className="text-stone-400 hover:text-stone-600">← Início</a>
                        )}
                        <span className="text-stone-300">|</span>
                        <span className="text-lg font-bold text-amber-600">Informações</span>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-4 py-5 space-y-4">

                    {/* Tela inicial: destaques */}
                    {ehInicial ? (
                        <SecaoDestaques destaques={destaques} contagens={contagens} />
                    ) : (
                        <>
                            {/* Linha título + hambúrguer */}
                            <div className="relative flex items-center justify-between">
                                <h2 className="text-lg font-bold text-stone-800">
                                    {cat.emoji} {cat.label}
                                </h2>
                                <BotaoMenu
                                    menuAberto={menuAberto}
                                    onAbrir={() => setMenuAberto(true)}
                                    onFechar={() => setMenuAberto(false)}
                                    categoria={categoria}
                                    contagens={contagens}
                                />
                            </div>

                            {/* Conteúdo da categoria */}
                            {ehColeta ? (
                                <CronogramaColeta cronograma={cronograma} />
                            ) : (
                                <>
                                    <GridNoticias noticias={noticias} />
                                    {extras.length > 0 && (
                                        <div className="space-y-3 pt-2">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Mais notícias</p>
                                            {extras.map((n) => <CardLista key={n.id} noticia={n} />)}
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </main>
            </div>
        </>
    );
}

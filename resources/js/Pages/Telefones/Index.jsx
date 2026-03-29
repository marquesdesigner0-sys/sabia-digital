import { Head, router } from '@inertiajs/react';

// ── Formata número para exibição limpa ────────────────────────────────────────
function formatarTelefone(num) {
    const d = num.replace(/\D/g, '');
    if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
    return num;
}

// ── Gera href para ligar ──────────────────────────────────────────────────────
function telHref(num) {
    return `tel:+55${num.replace(/\D/g, '')}`;
}

// ── Gera href para WhatsApp ───────────────────────────────────────────────────
function waHref(num) {
    return `https://wa.me/55${num.replace(/\D/g, '')}`;
}

// ── Card de um contato ────────────────────────────────────────────────────────
function CardContato({ item }) {
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="font-bold leading-snug text-stone-800">{item.secretaria}</p>
                    {item.responsavel && (
                        <p className="mt-0.5 text-xs text-stone-500">{item.responsavel}</p>
                    )}
                </div>
            </div>

            {/* Telefone principal */}
            <div className="mt-3 flex flex-wrap gap-2">
                <a
                    href={telHref(item.telefone)}
                    className="flex items-center gap-1.5 rounded-xl bg-stone-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-stone-700 active:scale-95"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                    {formatarTelefone(item.telefone)}
                </a>

                {item.whatsapp && (
                    <a
                        href={waHref(item.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-95"
                    >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                        </svg>
                        WhatsApp
                    </a>
                )}
            </div>

            {/* Rodapé: endereço + horário */}
            {(item.endereco || item.horario) && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-stone-100 pt-3">
                    {item.endereco && (
                        <p className="flex items-center gap-1 text-xs text-stone-500">
                            <span>📍</span> {item.endereco}
                        </p>
                    )}
                    {item.horario && (
                        <p className="flex items-center gap-1 text-xs text-stone-500">
                            <span>🕐</span> {item.horario}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Grupo de categoria ────────────────────────────────────────────────────────
function GrupoCategoria({ grupo }) {
    return (
        <section className="space-y-3">
            <div className="flex items-center gap-2 rounded-xl bg-stone-800 px-4 py-2.5 text-white">
                <span className="text-xl">{grupo.emoji}</span>
                <h2 className="font-bold">{grupo.label}</h2>
                <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                    {grupo.itens.length}
                </span>
            </div>
            <div className="space-y-2">
                {grupo.itens.map((item) => (
                    <CardContato key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function TelefonesIndex({ grupos }) {
    return (
        <>
            <Head title="Telefones Úteis" />
            <div className="min-h-screen bg-stone-100">

                {/* Header */}
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
                        <a href="/" className="text-stone-400 hover:text-stone-600">← Início</a>
                        <span className="text-stone-300">|</span>
                        <span className="text-lg font-bold text-amber-600">Telefones Úteis</span>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-4 py-5 space-y-6">

                    {grupos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center shadow-sm ring-1 ring-stone-200">
                            <span className="text-5xl">📞</span>
                            <p className="mt-4 font-semibold text-stone-600">Nenhum contato cadastrado</p>
                            <p className="mt-1 text-sm text-stone-400">Os telefones úteis serão publicados em breve.</p>
                        </div>
                    ) : (
                        grupos.map((grupo) => (
                            <GrupoCategoria key={grupo.key} grupo={grupo} />
                        ))
                    )}
                </main>
            </div>
        </>
    );
}

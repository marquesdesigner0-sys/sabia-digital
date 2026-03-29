import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

const modulosInternos = [
    {
        href: '/educacao',
        emoji: '🎒',
        titulo: 'Educação',
        descricao: 'Escolas, matrículas e acompanhamento',
        cor: 'border-amber-400 hover:bg-amber-50',
    },
    {
        href: '/baiao-food',
        emoji: '🍽️',
        titulo: 'Baião Food',
        descricao: 'Restaurantes e comércio local',
        cor: 'border-red-400 hover:bg-red-50',
    },
    {
        href: '/empreendedor',
        emoji: '🏪',
        titulo: 'Empreendedor',
        descricao: 'Cursos, treinamentos e marketplace',
        cor: 'border-emerald-400 hover:bg-emerald-50',
    },
    {
        href: '/informacoes',
        emoji: '📰',
        titulo: 'Informações',
        descricao: 'Notícias, eventos e editais',
        cor: 'border-blue-400 hover:bg-blue-50',
    },
    {
        href: '/telefones',
        emoji: '📞',
        titulo: 'Telefones Úteis',
        descricao: 'Secretarias, UBS e serviços municipais',
        cor: 'border-teal-400 hover:bg-teal-50',
    },
];

const modulosExternos = [
    {
        url: 'http://infraestruturacarnaiba.com.br:5001/',
        emoji: '🏗️',
        titulo: 'Urbanismo',
        descricao: 'Serviços de infraestrutura e obras',
        cor: 'border-orange-400 hover:bg-orange-50',
    },
];

function ModalRedirecionamento({ modulo, onConfirmar, onCancelar }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl ring-1 ring-stone-200">
                <div className="mb-4 flex items-center gap-3">
                    <span className="text-3xl">{modulo.emoji}</span>
                    <div>
                        <p className="font-semibold text-stone-800">{modulo.titulo}</p>
                        <p className="text-xs text-stone-500">Site externo</p>
                    </div>
                </div>

                <p className="text-sm text-stone-600">
                    Você será direcionado para um site fora do Sabiá Digital:
                </p>
                <p className="mt-1 break-all rounded-lg bg-stone-50 px-3 py-2 text-xs font-mono text-stone-500 ring-1 ring-stone-200">
                    {modulo.url}
                </p>
                <p className="mt-3 text-xs text-stone-400">
                    O conteúdo deste site é de responsabilidade do órgão municipal correspondente.
                </p>

                <div className="mt-5 flex gap-2">
                    <button
                        onClick={onCancelar}
                        className="flex-1 rounded-lg border border-stone-300 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirmar}
                        className="flex-1 rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Home({ user }) {
    const [moduloPendente, setModuloPendente] = useState(null);

    function logout() {
        router.post('/logout');
    }

    function abrirExterno(modulo) {
        setModuloPendente(modulo);
    }

    function confirmarRedirecionamento() {
        window.open(moduloPendente.url, '_blank', 'noopener,noreferrer');
        setModuloPendente(null);
    }

    return (
        <>
            <Head title="Início" />
            <div className="min-h-screen bg-stone-100">
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
                        <span className="text-lg font-bold text-amber-600">Sabiá Digital</span>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-stone-600">
                                Olá, <span className="font-medium text-stone-800">{user.name.split(' ')[0]}</span>
                            </span>
                            <button
                                onClick={logout}
                                className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-4 py-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-stone-800">Serviços municipais</h1>
                        <p className="mt-1 text-sm text-stone-500">Carnaíba - PE · Plataforma municipal digital</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {modulosInternos.map((m) => (
                            <a
                                key={m.href}
                                href={m.href}
                                className={`flex cursor-pointer flex-col rounded-2xl border-2 bg-white p-5 shadow-sm transition ${m.cor}`}
                            >
                                <span className="text-3xl">{m.emoji}</span>
                                <span className="mt-3 font-semibold text-stone-800">{m.titulo}</span>
                                <span className="mt-1 text-xs text-stone-500">{m.descricao}</span>
                            </a>
                        ))}

                        {modulosExternos.map((m) => (
                            <button
                                key={m.url}
                                onClick={() => abrirExterno(m)}
                                className={`flex cursor-pointer flex-col rounded-2xl border-2 bg-white p-5 shadow-sm transition text-left ${m.cor}`}
                            >
                                <span className="text-3xl">{m.emoji}</span>
                                <span className="mt-3 font-semibold text-stone-800">{m.titulo}</span>
                                <span className="mt-1 text-xs text-stone-500">{m.descricao}</span>
                                <span className="mt-2 text-xs text-orange-500">↗ Site externo</span>
                            </button>
                        ))}
                    </div>
                </main>
            </div>

            {moduloPendente && (
                <ModalRedirecionamento
                    modulo={moduloPendente}
                    onConfirmar={confirmarRedirecionamento}
                    onCancelar={() => setModuloPendente(null)}
                />
            )}
        </>
    );
}

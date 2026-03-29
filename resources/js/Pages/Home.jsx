import { Head, router } from '@inertiajs/react';

const modulos = [
    {
        href: '/educacao',
        emoji: '🎒',
        titulo: 'Educação',
        descricao: 'Escolas, matrículas e acompanhamento',
        cor: 'border-amber-400 hover:bg-amber-50',
    },
];

export default function Home({ user }) {
    function logout() {
        router.post('/logout');
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
                        {modulos.map((m) => (
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
                    </div>
                </main>
            </div>
        </>
    );
}

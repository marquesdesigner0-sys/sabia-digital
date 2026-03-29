import { Head, Link } from '@inertiajs/react';

const subModulos = [
    {
        href: '/empreendedor/cursos',
        emoji: '📚',
        titulo: 'Cursos e Treinamentos',
        descricao: 'Qualificação para empreendedores e funcionários',
        cor: 'border-blue-400 hover:bg-blue-50',
        badge: null,
    },
    {
        href: '/empreendedor/login',
        emoji: '🍽️',
        titulo: 'Meu Estabelecimento',
        descricao: 'Gerencie seu negócio no Baião Food',
        cor: 'border-red-400 hover:bg-red-50',
        badge: 'Requer login',
    },
];

export default function EmpreendedorIndex({ user }) {
    return (
        <>
            <Head title="Empreendedor" />
            <div className="min-h-screen bg-stone-100">
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
                        <Link href="/" className="text-stone-400 hover:text-stone-600">
                            ← Início
                        </Link>
                        <span className="text-stone-300">/</span>
                        <span className="font-semibold text-stone-800">Empreendedor</span>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-4 py-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-stone-800">Área do Empreendedor</h1>
                        <p className="mt-1 text-sm text-stone-500">
                            Olá, <span className="font-medium text-stone-700">{user.name.split(' ')[0]}</span>. Escolha o que deseja acessar.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {subModulos.map((m) => (
                            <Link
                                key={m.href}
                                href={m.href}
                                className={`relative flex flex-col rounded-2xl border-2 bg-white p-6 shadow-sm transition ${m.cor}`}
                            >
                                {m.badge && (
                                    <span className="absolute right-3 top-3 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-500">
                                        {m.badge}
                                    </span>
                                )}
                                <span className="text-4xl">{m.emoji}</span>
                                <span className="mt-4 text-lg font-semibold text-stone-800">{m.titulo}</span>
                                <span className="mt-1 text-sm text-stone-500">{m.descricao}</span>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}

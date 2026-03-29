import { router } from '@inertiajs/react';

export const ROLE_LABEL = {
    geral:        'Administrador Geral',
    educacao:     'Secretaria de Educação',
    secon:        'SECON',
    empreendedor: 'Sala do Empreendedor',
    escola:       'Gestão Escolar',
};

const ROLE_COR = {
    geral:        'bg-amber-500/20 text-amber-300',
    educacao:     'bg-blue-500/20 text-blue-300',
    secon:        'bg-purple-500/20 text-purple-300',
    empreendedor: 'bg-emerald-500/20 text-emerald-300',
    escola:       'bg-sky-500/20 text-sky-300',
};

const MENU_COMPLETO = [
    { href: '/admin',                   emoji: '📊', label: 'Dashboard',        roles: ['geral', 'educacao', 'secon', 'empreendedor', 'escola'] },
    { href: '/admin/noticias',          emoji: '📰', label: 'Notícias',         roles: ['geral', 'secon'] },
    { href: '/admin/escolas',           emoji: '🏫', label: 'Escolas',          roles: ['geral', 'educacao'] },
    { href: '/admin/matriculas',        emoji: '🎒', label: 'Matrículas',       roles: ['geral', 'educacao', 'escola'] },
    { href: '/admin/estabelecimentos',  emoji: '🍽️', label: 'Estabelecimentos', roles: ['geral', 'empreendedor'] },
    { href: '/admin/cursos',            emoji: '💼', label: 'Cursos',           roles: ['geral', 'empreendedor'] },
    { href: '/admin/telefones',         emoji: '📞', label: 'Telefones',        roles: ['geral'] },
    { href: '/admin/usuarios',          emoji: '👥', label: 'Usuários',         roles: ['geral'] },
    { href: '/admin/relatorios',        emoji: '📈', label: 'Relatórios',       roles: ['geral', 'educacao', 'secon', 'empreendedor'] },
];

export default function AdminLayout({ adminName, adminRole, currentPath, children }) {
    const menu = MENU_COMPLETO.filter(item => item.roles.includes(adminRole));

    function logout() {
        router.post('/admin/logout');
    }

    return (
        <div className="min-h-screen bg-stone-100">

            {/* Header */}
            <header className="bg-stone-900 shadow-lg">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🏛️</span>
                        <div>
                            <span className="font-bold text-amber-400">Painel da Prefeitura</span>
                            <span className={`ml-2 hidden rounded-full px-2 py-0.5 text-[10px] font-bold sm:inline ${ROLE_COR[adminRole] ?? 'bg-stone-700 text-stone-300'}`}>
                                {ROLE_LABEL[adminRole] ?? adminRole}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden text-sm text-stone-400 sm:inline">
                            Olá, <span className="font-medium text-white">{adminName}</span>
                        </span>
                        <button
                            onClick={logout}
                            className="rounded-lg border border-stone-600 px-3 py-1.5 text-xs font-medium text-stone-400 transition hover:border-red-500 hover:text-red-400"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto flex max-w-5xl gap-6 px-4 py-6">

                {/* Sidebar — desktop */}
                <aside className="hidden w-48 shrink-0 sm:block">
                    <nav className="space-y-1 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-stone-200">
                        {menu.map(item => (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-stone-50 ${
                                    currentPath === item.href
                                        ? 'bg-amber-50 text-amber-700'
                                        : 'text-stone-700'
                                }`}
                            >
                                <span>{item.emoji}</span>
                                <span>{item.label}</span>
                            </a>
                        ))}
                    </nav>

                    {/* Badge de role */}
                    <div className={`mt-3 rounded-xl px-3 py-2.5 text-center ${ROLE_COR[adminRole] ? 'bg-stone-800' : 'bg-stone-800'}`}>
                        <p className={`text-xs font-semibold ${ROLE_COR[adminRole] ?? 'text-amber-400'}`}>
                            {ROLE_LABEL[adminRole] ?? adminRole}
                        </p>
                    </div>
                </aside>

                {/* Conteúdo principal */}
                <main className="min-w-0 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}

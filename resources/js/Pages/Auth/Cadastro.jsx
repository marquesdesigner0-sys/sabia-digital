import { Head, Link, useForm } from '@inertiajs/react';

export default function Cadastro() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        cpf: '',
        password: '',
        password_confirmation: '',
        consentimento: false,
    });

    function formatCpf(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            .slice(0, 14);
    }

    function submit(e) {
        e.preventDefault();
        post('/cadastro');
    }

    return (
        <>
            <Head title="Criar conta" />
            <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-10">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-amber-600">Sabiá Digital</h1>
                        <p className="mt-1 text-sm text-stone-500">Carnaíba - PE · Plataforma municipal digital</p>
                    </div>

                    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
                        <h2 className="mb-6 text-xl font-semibold text-stone-800">Criar conta</h2>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">
                                    Nome completo
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="Seu nome"
                                    autoComplete="name"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="seu@email.com"
                                    autoComplete="email"
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">
                                    CPF
                                </label>
                                <input
                                    type="text"
                                    value={data.cpf}
                                    onChange={(e) => setData('cpf', formatCpf(e.target.value))}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="000.000.000-00"
                                    inputMode="numeric"
                                    required
                                />
                                {errors.cpf && (
                                    <p className="mt-1 text-xs text-red-600">{errors.cpf}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="Mínimo 6 caracteres"
                                    autoComplete="new-password"
                                    required
                                />
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">
                                    Confirmar senha
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="Repita a senha"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <div className="rounded-lg bg-stone-50 p-4 ring-1 ring-stone-200">
                                <label className="flex cursor-pointer items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.consentimento}
                                        onChange={(e) => setData('consentimento', e.target.checked)}
                                        className="mt-0.5 h-4 w-4 shrink-0 accent-amber-500"
                                    />
                                    <span className="text-sm text-stone-700">
                                        Autorizo o uso do meu CPF e e-mail para acesso aos serviços municipais
                                        de Carnaíba.{' '}
                                        <Link
                                            href="/privacidade"
                                            className="font-medium text-amber-600 hover:underline"
                                        >
                                            Ver política de privacidade
                                        </Link>
                                        .
                                    </span>
                                </label>
                                {errors.consentimento && (
                                    <p className="mt-2 text-xs text-red-600">{errors.consentimento}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
                            >
                                {processing ? 'Criando conta…' : 'Criar conta'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-stone-500">
                            Já tem conta?{' '}
                            <Link href="/login" className="font-medium text-amber-600 hover:underline">
                                Entrar
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

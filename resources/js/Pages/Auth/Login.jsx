import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <>
            <Head title="Entrar" />
            <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-amber-600">Sabiá Digital</h1>
                        <p className="mt-1 text-sm text-stone-500">Carnaíba - PE · Plataforma municipal digital</p>
                    </div>

                    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
                        <h2 className="mb-6 text-xl font-semibold text-stone-800">Entrar na conta</h2>

                        <form onSubmit={submit} className="space-y-5">
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
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="••••••"
                                    autoComplete="current-password"
                                    required
                                />
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
                            >
                                {processing ? 'Entrando…' : 'Entrar'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-stone-500">
                            Não tem conta?{' '}
                            <Link href="/cadastro" className="font-medium text-amber-600 hover:underline">
                                Criar conta
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

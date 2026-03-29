import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

export default function AdminLogin({ errors }) {
    const [form, setForm] = useState({ email: '', senha: '' });
    const [enviando, setEnviando] = useState(false);

    function submit(e) {
        e.preventDefault();
        setEnviando(true);
        router.post('/admin/login', form, {
            onFinish: () => setEnviando(false),
        });
    }

    return (
        <>
            <Head title="Painel Admin — Login" />
            <div className="flex min-h-screen items-center justify-center bg-stone-900 px-4">
                <div className="w-full max-w-sm">

                    {/* Logo / Identidade */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-3xl shadow-lg">
                            🏛️
                        </div>
                        <h1 className="mt-4 text-xl font-bold text-white">Painel da Prefeitura</h1>
                        <p className="mt-1 text-sm text-stone-400">Acesso restrito a servidores municipais</p>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl bg-stone-800 p-6 shadow-xl ring-1 ring-stone-700">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-400">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="servidor@carnaiba.pe.gov.br"
                                    className="w-full rounded-xl bg-stone-700 px-4 py-3 text-sm text-white placeholder-stone-500 outline-none ring-1 ring-stone-600 focus:ring-amber-500"
                                    autoComplete="username"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-400">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    value={form.senha}
                                    onChange={e => setForm({ ...form, senha: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl bg-stone-700 px-4 py-3 text-sm text-white placeholder-stone-500 outline-none ring-1 ring-stone-600 focus:ring-amber-500"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>

                            {errors?.email && (
                                <p className="rounded-lg bg-red-900/40 px-3 py-2 text-xs text-red-400 ring-1 ring-red-800">
                                    {errors.email}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={enviando}
                                className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-stone-900 transition hover:bg-amber-400 disabled:opacity-60"
                            >
                                {enviando ? 'Entrando...' : 'Entrar'}
                            </button>
                        </form>
                    </div>

                    <p className="mt-6 text-center text-xs text-stone-600">
                        Sabiá Digital · Prefeitura Municipal de Carnaíba - PE
                    </p>
                </div>
            </div>
        </>
    );
}

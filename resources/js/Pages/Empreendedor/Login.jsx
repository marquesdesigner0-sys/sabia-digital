import { Head, useForm, Link } from '@inertiajs/react';

function formatCnpj(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
        .slice(0, 18);
}

export default function EmpreendedorLogin() {
    const { data, setData, post, processing, errors } = useForm({
        cnpj: '',
        password: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/empreendedor/login');
    }

    return (
        <>
            <Head title="Acesso do empreendedor" />
            <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-10">
                <div className="w-full max-w-sm">
                    <div className="mb-8 text-center">
                        <p className="text-3xl">🍽️</p>
                        <h1 className="mt-2 text-2xl font-bold text-stone-800">Área do empreendedor</h1>
                        <p className="mt-1 text-sm text-stone-500">Baião Food · Carnaíba - PE</p>
                    </div>

                    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
                        <h2 className="mb-6 text-lg font-semibold text-stone-800">Entrar com seu estabelecimento</h2>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">CNPJ</label>
                                <input
                                    type="text"
                                    value={data.cnpj}
                                    onChange={(e) => setData('cnpj', formatCnpj(e.target.value))}
                                    className="input"
                                    placeholder="00.000.000/0000-00"
                                    inputMode="numeric"
                                    required
                                />
                                {errors.cnpj && <p className="mt-1 text-xs text-red-600">{errors.cnpj}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">Senha</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="input"
                                    placeholder="Sua senha"
                                    required
                                />
                                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-60"
                            >
                                {processing ? 'Entrando…' : 'Entrar'}
                            </button>
                        </form>

                        <div className="mt-6 border-t border-stone-100 pt-5 text-center">
                            <p className="text-sm text-stone-500">Ainda não tem cadastro?</p>
                            <Link
                                href="/empreendedor/cadastro"
                                className="mt-1 inline-block text-sm font-medium text-amber-600 hover:underline"
                            >
                                Cadastrar meu estabelecimento
                            </Link>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-xs text-stone-400">
                        <a href="/" className="hover:underline">← Voltar ao início</a>
                    </p>
                </div>
            </div>
        </>
    );
}

import { Head, useForm, Link } from '@inertiajs/react';

const CATEGORIAS = [
    'Restaurante', 'Lanches', 'Pizzaria', 'Açaí e Sorvetes',
    'Salgados e Petiscos', 'Doces e Bolos', 'Bebidas', 'Marmita',
    'Churrasco', 'Comida Nordestina', 'Outros',
];

function formatCnpj(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
        .slice(0, 18);
}

export default function EmpreendedorCadastro() {
    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        cnpj: '',
        nome_responsavel: '',
        email_contato: '',
        password: '',
        password_confirmation: '',
        categoria: '',
        descricao: '',
        whatsapp: '',
        chave_pix: '',
        aceita_delivery: false,
        aceita_retirada: true,
        taxa_entrega: '',
        horario: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/empreendedor/cadastro');
    }

    return (
        <>
            <Head title="Cadastrar estabelecimento" />
            <div className="min-h-screen bg-stone-100 px-4 py-10">
                <div className="mx-auto w-full max-w-2xl">
                    <div className="mb-8 text-center">
                        <p className="text-3xl">🍽️</p>
                        <h1 className="mt-2 text-2xl font-bold text-stone-800">Cadastrar estabelecimento</h1>
                        <p className="mt-1 text-sm text-stone-500">Baião Food · Carnaíba - PE</p>
                    </div>

                    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
                        <form onSubmit={submit} className="space-y-6">

                            {/* Dados do estabelecimento */}
                            <div>
                                <h2 className="mb-4 text-base font-semibold text-stone-800 border-b border-stone-100 pb-2">
                                    Dados do estabelecimento
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-stone-700">Nome do estabelecimento</label>
                                            <input type="text" value={data.nome} onChange={(e) => setData('nome', e.target.value)}
                                                className="input" placeholder="Ex: Pobre Food" required />
                                            {errors.nome && <p className="mt-1 text-xs text-red-600">{errors.nome}</p>}
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-stone-700">CNPJ</label>
                                            <input type="text" value={data.cnpj} onChange={(e) => setData('cnpj', formatCnpj(e.target.value))}
                                                className="input" placeholder="00.000.000/0000-00" inputMode="numeric" required />
                                            {errors.cnpj && <p className="mt-1 text-xs text-red-600">{errors.cnpj}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-stone-700">Categoria</label>
                                        <select value={data.categoria} onChange={(e) => setData('categoria', e.target.value)}
                                            className="input" required>
                                            <option value="">Selecione o tipo de estabelecimento…</option>
                                            {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        {errors.categoria && <p className="mt-1 text-xs text-red-600">{errors.categoria}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-stone-700">
                                            Descrição <span className="font-normal text-stone-400">(opcional)</span>
                                        </label>
                                        <textarea value={data.descricao} onChange={(e) => setData('descricao', e.target.value)}
                                            rows={2} className="input" placeholder="Breve descrição do seu negócio" />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-stone-700">
                                            Horário de funcionamento <span className="font-normal text-stone-400">(opcional)</span>
                                        </label>
                                        <input type="text" value={data.horario} onChange={(e) => setData('horario', e.target.value)}
                                            className="input" placeholder="Ex: Seg a Sex: 10h–22h | Sáb e Dom: 11h–23h" />
                                    </div>
                                </div>
                            </div>

                            {/* Contato e pagamento */}
                            <div>
                                <h2 className="mb-4 text-base font-semibold text-stone-800 border-b border-stone-100 pb-2">
                                    Contato e pagamento
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-stone-700">
                                                WhatsApp <span className="font-normal text-stone-400">(opcional)</span>
                                            </label>
                                            <input type="text" value={data.whatsapp} onChange={(e) => setData('whatsapp', e.target.value)}
                                                className="input" placeholder="87999999999" inputMode="numeric" />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-stone-700">
                                                Chave Pix <span className="font-normal text-stone-400">(opcional)</span>
                                            </label>
                                            <input type="text" value={data.chave_pix} onChange={(e) => setData('chave_pix', e.target.value)}
                                                className="input" placeholder="CPF, e-mail, telefone ou aleatória" />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-6">
                                        <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                                            <input type="checkbox" checked={data.aceita_delivery}
                                                onChange={(e) => setData('aceita_delivery', e.target.checked)}
                                                className="h-4 w-4 rounded border-stone-300 accent-amber-500" />
                                            Aceita delivery
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                                            <input type="checkbox" checked={data.aceita_retirada}
                                                onChange={(e) => setData('aceita_retirada', e.target.checked)}
                                                className="h-4 w-4 rounded border-stone-300 accent-amber-500" />
                                            Aceita retirada no local
                                        </label>
                                    </div>

                                    {data.aceita_delivery && (
                                        <div className="max-w-xs">
                                            <label className="mb-1 block text-sm font-medium text-stone-700">Taxa de entrega (R$)</label>
                                            <input type="number" min="0" step="0.50" value={data.taxa_entrega}
                                                onChange={(e) => setData('taxa_entrega', e.target.value)}
                                                className="input" placeholder="0,00 para grátis" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Dados do responsável e acesso */}
                            <div>
                                <h2 className="mb-4 text-base font-semibold text-stone-800 border-b border-stone-100 pb-2">
                                    Responsável e acesso
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-stone-700">Nome do responsável</label>
                                            <input type="text" value={data.nome_responsavel} onChange={(e) => setData('nome_responsavel', e.target.value)}
                                                className="input" placeholder="Nome completo" required />
                                            {errors.nome_responsavel && <p className="mt-1 text-xs text-red-600">{errors.nome_responsavel}</p>}
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-stone-700">E-mail de contato</label>
                                            <input type="email" value={data.email_contato} onChange={(e) => setData('email_contato', e.target.value)}
                                                className="input" placeholder="contato@seurestaurante.com" required />
                                            {errors.email_contato && <p className="mt-1 text-xs text-red-600">{errors.email_contato}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-stone-700">Criar senha</label>
                                            <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)}
                                                className="input" placeholder="Mínimo 6 caracteres" required />
                                            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-stone-700">Confirmar senha</label>
                                            <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className="input" placeholder="Repita a senha" required />
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200">
                                        Seu acesso ao painel será feito com o <strong>CNPJ</strong> e a senha criada acima.
                                        Após o cadastro, a prefeitura analisará as informações antes de publicar seu estabelecimento.
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={processing}
                                className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-60">
                                {processing ? 'Enviando…' : 'Cadastrar estabelecimento'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-stone-500">
                            Já tem cadastro?{' '}
                            <Link href="/empreendedor/login" className="font-medium text-amber-600 hover:underline">
                                Entrar
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

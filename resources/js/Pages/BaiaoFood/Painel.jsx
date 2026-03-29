import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

const CATEGORIAS_ESTABELECIMENTO = [
    'Lanches', 'Restaurante', 'Pizzaria', 'Açaí', 'Salgados',
    'Doces e Bolos', 'Bebidas', 'Mercadinho', 'Outros',
];

function formatReal(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function FormCadastro({ onSalvo }) {
    const { data, setData, post, processing, errors } = useForm({
        nome: '', categoria: '', descricao: '', whatsapp: '',
        chave_pix: '', aceita_delivery: false, aceita_retirada: false,
        taxa_entrega: '', horario: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/baiao-food/painel/cadastrar');
    }

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h2 className="mb-5 text-lg font-bold text-stone-800">Cadastrar meu estabelecimento</h2>
            <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-stone-700">Nome</label>
                        <input type="text" value={data.nome} onChange={(e) => setData('nome', e.target.value)}
                            className="input" placeholder="Nome do estabelecimento" required />
                        {errors.nome && <p className="mt-1 text-xs text-red-600">{errors.nome}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-stone-700">Categoria</label>
                        <select value={data.categoria} onChange={(e) => setData('categoria', e.target.value)}
                            className="input" required>
                            <option value="">Selecione...</option>
                            {CATEGORIAS_ESTABELECIMENTO.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {errors.categoria && <p className="mt-1 text-xs text-red-600">{errors.categoria}</p>}
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Descrição <span className="font-normal text-stone-400">(opcional)</span></label>
                    <textarea value={data.descricao} onChange={(e) => setData('descricao', e.target.value)}
                        rows={2} className="input" placeholder="Breve descrição do seu negócio" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-stone-700">WhatsApp <span className="font-normal text-stone-400">(opcional)</span></label>
                        <input type="text" value={data.whatsapp} onChange={(e) => setData('whatsapp', e.target.value)}
                            className="input" placeholder="87999999999" inputMode="numeric" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-stone-700">Chave Pix <span className="font-normal text-stone-400">(opcional)</span></label>
                        <input type="text" value={data.chave_pix} onChange={(e) => setData('chave_pix', e.target.value)}
                            className="input" placeholder="CPF, e-mail, telefone ou chave aleatória" />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Horário de funcionamento <span className="font-normal text-stone-400">(opcional)</span></label>
                    <input type="text" value={data.horario} onChange={(e) => setData('horario', e.target.value)}
                        className="input" placeholder="Ex: Seg a Sex: 10h–22h | Sáb e Dom: 11h–23h" />
                </div>

                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 text-sm text-stone-700">
                        <input type="checkbox" checked={data.aceita_delivery}
                            onChange={(e) => setData('aceita_delivery', e.target.checked)}
                            className="h-4 w-4 rounded border-stone-300 text-amber-500" />
                        Aceita delivery
                    </label>
                    <label className="flex items-center gap-2 text-sm text-stone-700">
                        <input type="checkbox" checked={data.aceita_retirada}
                            onChange={(e) => setData('aceita_retirada', e.target.checked)}
                            className="h-4 w-4 rounded border-stone-300 text-amber-500" />
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

                <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200">
                    Após o envio, seu cadastro será analisado pela prefeitura antes de aparecer no Baião Food.
                </div>

                <button type="submit" disabled={processing}
                    className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-60">
                    {processing ? 'Enviando...' : 'Enviar cadastro'}
                </button>
            </form>
        </div>
    );
}

function FormEdicao({ estabelecimento }) {
    const { data, setData, put, processing, errors } = useForm({
        nome:             estabelecimento.nome,
        categoria:        estabelecimento.categoria,
        descricao:        estabelecimento.descricao ?? '',
        whatsapp:         estabelecimento.whatsapp ?? '',
        chave_pix:        estabelecimento.chave_pix ?? '',
        aceita_delivery:  estabelecimento.aceita_delivery,
        aceita_retirada:  estabelecimento.aceita_retirada,
        taxa_entrega:     estabelecimento.taxa_entrega,
        horario:          estabelecimento.horario ?? '',
    });

    function submit(e) {
        e.preventDefault();
        put(`/baiao-food/painel/${estabelecimento.id}`);
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Nome</label>
                    <input type="text" value={data.nome} onChange={(e) => setData('nome', e.target.value)} className="input" required />
                    {errors.nome && <p className="mt-1 text-xs text-red-600">{errors.nome}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Categoria</label>
                    <select value={data.categoria} onChange={(e) => setData('categoria', e.target.value)} className="input" required>
                        {CATEGORIAS_ESTABELECIMENTO.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Descrição</label>
                <textarea value={data.descricao} onChange={(e) => setData('descricao', e.target.value)} rows={2} className="input" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">WhatsApp</label>
                    <input type="text" value={data.whatsapp} onChange={(e) => setData('whatsapp', e.target.value)} className="input" />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Chave Pix</label>
                    <input type="text" value={data.chave_pix} onChange={(e) => setData('chave_pix', e.target.value)} className="input" />
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Horário de funcionamento</label>
                <input type="text" value={data.horario} onChange={(e) => setData('horario', e.target.value)}
                    className="input" placeholder="Ex: Seg a Sex: 10h–22h | Sáb e Dom: 11h–23h" />
            </div>

            <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm text-stone-700">
                    <input type="checkbox" checked={data.aceita_delivery}
                        onChange={(e) => setData('aceita_delivery', e.target.checked)}
                        className="h-4 w-4 rounded border-stone-300 text-amber-500" />
                    Aceita delivery
                </label>
                <label className="flex items-center gap-2 text-sm text-stone-700">
                    <input type="checkbox" checked={data.aceita_retirada}
                        onChange={(e) => setData('aceita_retirada', e.target.checked)}
                        className="h-4 w-4 rounded border-stone-300 text-amber-500" />
                    Aceita retirada no local
                </label>
            </div>

            {data.aceita_delivery && (
                <div className="max-w-xs">
                    <label className="mb-1 block text-sm font-medium text-stone-700">Taxa de entrega (R$)</label>
                    <input type="number" min="0" step="0.50" value={data.taxa_entrega}
                        onChange={(e) => setData('taxa_entrega', e.target.value)} className="input" />
                </div>
            )}

            <button type="submit" disabled={processing}
                className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-60">
                {processing ? 'Salvando...' : 'Salvar alterações'}
            </button>
        </form>
    );
}

function CardapioManager({ estabelecimento }) {
    const [abaAtiva, setAbaAtiva] = useState('lista');
    const { data, setData, post, processing, errors, reset } = useForm({
        categoria: '', nome: '', descricao: '', preco: '',
    });

    function adicionarItem(e) {
        e.preventDefault();
        post(`/baiao-food/painel/${estabelecimento.id}/itens`, {
            onSuccess: () => reset(),
        });
    }

    function toggleItem(item) {
        router.post(`/baiao-food/painel/itens/${item.id}/toggle`);
    }

    function removerItem(item) {
        if (!confirm(`Remover "${item.nome}" do cardápio?`)) return;
        router.delete(`/baiao-food/painel/itens/${item.id}`);
    }

    const porCategoria = estabelecimento.itens.reduce((acc, i) => {
        (acc[i.categoria] = acc[i.categoria] || []).push(i);
        return acc;
    }, {});

    return (
        <div>
            <div className="mb-4 flex gap-2">
                <button onClick={() => setAbaAtiva('lista')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${abaAtiva === 'lista' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                    Itens ({estabelecimento.itens.length})
                </button>
                <button onClick={() => setAbaAtiva('novo')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${abaAtiva === 'novo' ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                    + Novo item
                </button>
            </div>

            {abaAtiva === 'lista' && (
                <div>
                    {estabelecimento.itens.length === 0 ? (
                        <p className="py-6 text-center text-sm text-stone-400">
                            Nenhum item no cardápio. Adicione o primeiro item.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(porCategoria).map(([cat, itens]) => (
                                <div key={cat}>
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">{cat}</p>
                                    <div className="space-y-2">
                                        {itens.map((item) => (
                                            <div key={item.id}
                                                className={`flex items-center justify-between gap-4 rounded-xl p-3 ring-1 ${
                                                    item.disponivel ? 'bg-white ring-stone-200' : 'bg-stone-50 ring-stone-100 opacity-60'
                                                }`}>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-stone-800">{item.nome}</p>
                                                    {item.descricao && <p className="text-xs text-stone-400">{item.descricao}</p>}
                                                    <p className="text-sm font-semibold text-amber-600">{formatReal(item.preco)}</p>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-3">
                                                    <button onClick={() => toggleItem(item)}
                                                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                                                            item.disponivel
                                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                                                        }`}>
                                                        {item.disponivel ? 'Disponível' : 'Indisponível'}
                                                    </button>
                                                    <button onClick={() => removerItem(item)}
                                                        className="text-xs text-red-500 hover:underline">
                                                        Remover
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {abaAtiva === 'novo' && (
                <form onSubmit={adicionarItem} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-stone-700">Categoria</label>
                            <input type="text" value={data.categoria} onChange={(e) => setData('categoria', e.target.value)}
                                className="input" placeholder="Ex: Lanches, Bebidas, Sobremesas" required />
                            {errors.categoria && <p className="mt-1 text-xs text-red-600">{errors.categoria}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-stone-700">Nome do item</label>
                            <input type="text" value={data.nome} onChange={(e) => setData('nome', e.target.value)}
                                className="input" placeholder="Nome do produto" required />
                            {errors.nome && <p className="mt-1 text-xs text-red-600">{errors.nome}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-stone-700">Descrição <span className="font-normal text-stone-400">(opcional)</span></label>
                            <input type="text" value={data.descricao} onChange={(e) => setData('descricao', e.target.value)}
                                className="input" placeholder="Ingredientes ou observações" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-stone-700">Preço (R$)</label>
                            <input type="number" min="0" step="0.50" value={data.preco}
                                onChange={(e) => setData('preco', e.target.value)}
                                className="input" placeholder="0,00" required />
                            {errors.preco && <p className="mt-1 text-xs text-red-600">{errors.preco}</p>}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button type="button" onClick={() => setAbaAtiva('lista')}
                            className="flex-1 rounded-xl border border-stone-300 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={processing}
                            className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-60">
                            {processing ? 'Adicionando...' : 'Adicionar item'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default function Painel({ estabelecimento, sucesso }) {
    const [secao, setSecao] = useState('dados');

    function toggleAberto() {
        router.post(`/baiao-food/painel/${estabelecimento.id}/toggle-aberto`);
    }

    const statusCor = {
        pendente: 'bg-amber-100 text-amber-700',
        ativo:    'bg-green-100 text-green-700',
        inativo:  'bg-stone-100 text-stone-500',
    };

    return (
        <>
            <Head title="Meu estabelecimento — Baião Food" />
            <div className="min-h-screen bg-stone-100">
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
                        <a href="/baiao-food" className="text-stone-400 hover:text-stone-600">← Baião Food</a>
                        <span className="text-stone-300">/</span>
                        <span className="font-semibold text-stone-800">Meu estabelecimento</span>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-4 py-8">
                    {sucesso && (
                        <div className="mb-6 rounded-2xl bg-green-50 p-4 ring-1 ring-green-200">
                            <p className="text-sm font-medium text-green-800">✓ {sucesso}</p>
                        </div>
                    )}

                    {!estabelecimento ? (
                        <FormCadastro />
                    ) : (
                        <div className="space-y-6">
                            {/* Cabeçalho com status e toggle aberto/fechado */}
                            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h1 className="text-xl font-bold text-stone-800">{estabelecimento.nome}</h1>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusCor[estabelecimento.status]}`}>
                                                {estabelecimento.status === 'pendente' ? 'Aguardando aprovação'
                                                    : estabelecimento.status === 'ativo' ? 'Aprovado'
                                                    : 'Inativo'}
                                            </span>
                                        </div>
                                    </div>

                                    {estabelecimento.status === 'ativo' && (
                                        <button
                                            onClick={toggleAberto}
                                            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                                                estabelecimento.aberto
                                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                                            }`}
                                        >
                                            <span className={`h-2.5 w-2.5 rounded-full ${estabelecimento.aberto ? 'bg-white' : 'bg-stone-400'}`} />
                                            {estabelecimento.aberto ? 'Aberto agora' : 'Fechado'}
                                        </button>
                                    )}
                                </div>

                                {estabelecimento.status === 'pendente' && (
                                    <p className="mt-3 text-xs text-amber-700">
                                        Seu cadastro está em análise. Você poderá gerenciar o cardápio e abrir o estabelecimento após a aprovação.
                                    </p>
                                )}
                            </div>

                            {/* Abas */}
                            <div className="flex gap-2 border-b border-stone-200">
                                {[
                                    { id: 'dados',   label: 'Dados do estabelecimento' },
                                    { id: 'cardapio', label: 'Cardápio' },
                                ].map((aba) => (
                                    <button key={aba.id} onClick={() => setSecao(aba.id)}
                                        className={`border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                                            secao === aba.id
                                                ? 'border-amber-500 text-amber-600'
                                                : 'border-transparent text-stone-500 hover:text-stone-800'
                                        }`}>
                                        {aba.label}
                                    </button>
                                ))}
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
                                {secao === 'dados' && <FormEdicao estabelecimento={estabelecimento} />}
                                {secao === 'cardapio' && <CardapioManager estabelecimento={estabelecimento} />}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

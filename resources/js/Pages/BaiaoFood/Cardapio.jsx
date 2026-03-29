import { useState } from 'react';
import { Head } from '@inertiajs/react';

const DIAS_LABEL = { dom:'Dom', seg:'Seg', ter:'Ter', qua:'Qua', qui:'Qui', sex:'Sex', sab:'Sáb' };

function formatarHorario(raw) {
    if (!raw) return null;
    try {
        const h = JSON.parse(raw);
        return Object.entries(DIAS_LABEL)
            .filter(([id]) => h[id]?.aberto)
            .map(([id]) => `${DIAS_LABEL[id]}: ${h[id].de}–${h[id].ate}`)
            .join(' · ') || null;
    } catch {
        return raw;
    }
}

function formatReal(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function montarMensagemWhatsApp(estabelecimento, itens, tipo, endereco) {
    const linhas = itens.map(
        (i) => `• ${i.qtd}x ${i.nome} — ${formatReal(i.preco * i.qtd)}`
    );
    const subtotal = itens.reduce((s, i) => s + i.preco * i.qtd, 0);
    const taxa = tipo === 'delivery' ? estabelecimento.taxa_entrega : 0;
    const total = subtotal + taxa;

    const enderecoFormatado = endereco
        ? [
            `${endereco.rua}, ${endereco.numero}`,
            endereco.bairro,
            endereco.complemento || null,
            endereco.referencia ? `Ref: ${endereco.referencia}` : null,
          ].filter(Boolean).join(' — ')
        : null;

    const msg = [
        `Olá! Gostaria de fazer um pedido — *${estabelecimento.nome}*`,
        '',
        ...linhas,
        '',
        `Subtotal: ${formatReal(subtotal)}`,
        taxa > 0 ? `Taxa de entrega: ${formatReal(taxa)}` : null,
        `*Total: ${formatReal(total)}*`,
        '',
        tipo === 'delivery' ? '🛵 Modalidade: Delivery' : '🏪 Modalidade: Retirada no local',
        enderecoFormatado ? `📍 Endereço: ${enderecoFormatado}` : null,
    ].filter((l) => l !== null).join('\n');

    return msg;
}

function ModalEndereco({ onConfirmar, onFechar }) {
    const [form, setForm] = useState({ rua: '', numero: '', bairro: '', complemento: '', referencia: '' });
    const [erro, setErro] = useState('');

    function set(campo, valor) {
        setForm((f) => ({ ...f, [campo]: valor }));
    }

    function confirmar(e) {
        e.preventDefault();
        if (!form.rua.trim() || !form.numero.trim() || !form.bairro.trim()) {
            setErro('Preencha rua, número e bairro.');
            return;
        }
        onConfirmar(form);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center px-0 sm:px-4">
            <div className="w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-white shadow-xl ring-1 ring-stone-200 overflow-y-auto max-h-[90vh]">
                <div className="sticky top-0 bg-white px-6 pt-5 pb-3 border-b border-stone-100 flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-stone-800">Endereço de entrega</h2>
                        <p className="text-xs text-stone-500 mt-0.5">Onde deseja receber seu pedido?</p>
                    </div>
                    <button onClick={onFechar} className="text-stone-400 hover:text-stone-600 text-xl leading-none">✕</button>
                </div>

                <form onSubmit={confirmar} className="px-6 py-5 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                            <label className="mb-1 block text-xs font-medium text-stone-700">Rua / Avenida *</label>
                            <input
                                type="text"
                                value={form.rua}
                                onChange={(e) => set('rua', e.target.value)}
                                className="input"
                                placeholder="Ex: Rua das Flores"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-stone-700">Número *</label>
                            <input
                                type="text"
                                value={form.numero}
                                onChange={(e) => set('numero', e.target.value)}
                                className="input"
                                placeholder="123"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-stone-700">Bairro *</label>
                        <input
                            type="text"
                            value={form.bairro}
                            onChange={(e) => set('bairro', e.target.value)}
                            className="input"
                            placeholder="Ex: Centro"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-stone-700">
                            Complemento <span className="font-normal text-stone-400">(opcional)</span>
                        </label>
                        <input
                            type="text"
                            value={form.complemento}
                            onChange={(e) => set('complemento', e.target.value)}
                            className="input"
                            placeholder="Apto, bloco, casa..."
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-stone-700">
                            Ponto de referência <span className="font-normal text-stone-400">(opcional)</span>
                        </label>
                        <input
                            type="text"
                            value={form.referencia}
                            onChange={(e) => set('referencia', e.target.value)}
                            className="input"
                            placeholder="Ex: Próximo à farmácia"
                        />
                    </div>

                    {erro && <p className="text-sm text-red-600">{erro}</p>}

                    <div className="flex gap-2 pt-1">
                        <button type="button" onClick={onFechar}
                            className="flex-1 rounded-xl border border-stone-300 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50">
                            Voltar
                        </button>
                        <button type="submit"
                            className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-bold text-white transition hover:bg-amber-600">
                            Confirmar endereço
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ModalCarrinho({ itens, estabelecimento, onAdicionar, onRemover, onFechar, onFazerPedido }) {
    const subtotal = itens.reduce((s, i) => s + i.preco * i.qtd, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center px-0 sm:px-4">
            <div className="w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-white shadow-xl ring-1 ring-stone-200 flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-stone-100 shrink-0">
                    <h2 className="font-bold text-stone-800">Meu carrinho</h2>
                    <button onClick={onFechar} className="text-stone-400 hover:text-stone-600 text-xl leading-none">✕</button>
                </div>

                {/* Lista de itens */}
                <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
                    {itens.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 rounded-xl bg-stone-50 p-3 ring-1 ring-stone-100">
                            {item.foto ? (
                                <img src={item.foto} alt={item.nome} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                            ) : (
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-xl">🍽️</div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-stone-800 truncate">{item.nome}</p>
                                <p className="text-xs text-stone-500">{formatReal(item.preco)} cada</p>
                                <p className="text-sm font-semibold text-amber-600">{formatReal(item.preco * item.qtd)}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                                <button
                                    onClick={() => onRemover(item)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-stone-600 transition hover:bg-red-100 hover:text-red-600 text-lg font-bold"
                                >
                                    −
                                </button>
                                <span className="w-6 text-center text-sm font-bold text-stone-800">{item.qtd}</span>
                                <button
                                    onClick={() => onAdicionar(item)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white transition hover:bg-amber-600 text-lg font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Rodapé com total e botões */}
                <div className="px-6 pb-6 pt-3 border-t border-stone-100 shrink-0 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-600">Subtotal</span>
                        <span className="text-base font-bold text-stone-800">{formatReal(subtotal)}</span>
                    </div>
                    {estabelecimento.taxa_entrega > 0 && (
                        <p className="text-xs text-stone-400">
                            + taxa de entrega de {formatReal(estabelecimento.taxa_entrega)} para delivery
                        </p>
                    )}
                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={onFechar}
                            className="flex-1 rounded-xl border border-stone-300 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
                        >
                            Continuar
                        </button>
                        <button
                            onClick={onFazerPedido}
                            className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
                        >
                            Fazer pedido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ModalPix({ estabelecimento, itens, tipo, endereco, onFechar }) {
    const [copiado, setCopiado] = useState(false);
    const subtotal = itens.reduce((s, i) => s + i.preco * i.qtd, 0);
    const taxa = tipo === 'delivery' ? estabelecimento.taxa_entrega : 0;
    const total = subtotal + taxa;

    function copiar() {
        navigator.clipboard.writeText(estabelecimento.chave_pix);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl ring-1 ring-stone-200">
                <h2 className="text-lg font-bold text-stone-800">Pagamento via Pix</h2>
                <p className="mt-1 text-sm text-stone-500">
                    Copie a chave e realize o pagamento antes de confirmar o pedido.
                </p>

                <div className="mt-4 rounded-xl bg-purple-50 p-4 ring-1 ring-purple-200">
                    <p className="text-xs font-medium text-purple-700">Chave Pix</p>
                    <p className="mt-1 break-all font-mono text-sm text-purple-900">
                        {estabelecimento.chave_pix}
                    </p>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3 ring-1 ring-stone-200">
                    <span className="text-sm text-stone-600">Total a pagar</span>
                    <span className="text-base font-bold text-stone-800">{formatReal(total)}</span>
                </div>

                {endereco && (
                    <div className="mt-3 rounded-xl bg-stone-50 px-4 py-3 ring-1 ring-stone-200">
                        <p className="text-xs text-stone-400">📍 Endereço de entrega</p>
                        <p className="mt-0.5 text-sm text-stone-700">
                            {endereco.rua}, {endereco.numero} — {endereco.bairro}
                            {endereco.complemento ? ` · ${endereco.complemento}` : ''}
                            {endereco.referencia ? ` · Ref: ${endereco.referencia}` : ''}
                        </p>
                    </div>
                )}

                <p className="mt-3 text-xs text-stone-400">
                    Após o pagamento, entre em contato com o estabelecimento para confirmar o pedido.
                </p>

                <div className="mt-5 flex gap-2">
                    <button
                        onClick={onFechar}
                        className="flex-1 rounded-lg border border-stone-300 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
                    >
                        Fechar
                    </button>
                    <button
                        onClick={copiar}
                        className={`flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition ${
                            copiado ? 'bg-green-500' : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                    >
                        {copiado ? '✓ Copiado!' : 'Copiar chave'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ModalTipoEntrega({ estabelecimento, onEscolher, onFechar }) {
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl ring-1 ring-stone-200">
                <h2 className="text-lg font-bold text-stone-800">Como prefere receber?</h2>
                <div className="mt-4 space-y-3">
                    {estabelecimento.aceita_delivery && (
                        <button
                            onClick={() => onEscolher('delivery')}
                            className="w-full rounded-xl border-2 border-green-200 bg-green-50 p-4 text-left transition hover:border-green-400"
                        >
                            <p className="font-semibold text-green-800">Delivery</p>
                            <p className="text-xs text-green-600">
                                {estabelecimento.taxa_entrega > 0
                                    ? `Taxa de entrega: ${formatReal(estabelecimento.taxa_entrega)}`
                                    : 'Entrega grátis'}
                            </p>
                        </button>
                    )}
                    {estabelecimento.aceita_retirada && (
                        <button
                            onClick={() => onEscolher('retirada')}
                            className="w-full rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-left transition hover:border-blue-400"
                        >
                            <p className="font-semibold text-blue-800">Retirada no local</p>
                            <p className="text-xs text-blue-600">Retire diretamente no estabelecimento</p>
                        </button>
                    )}
                </div>
                <button
                    onClick={onFechar}
                    className="mt-4 w-full rounded-lg border border-stone-300 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}

export default function Cardapio({ estabelecimento, cardapio }) {
    const [carrinho, setCarrinho] = useState({});
    const [modal, setModal] = useState(null); // null | 'tipo' | 'endereco' | 'pix'
    const [tipoEntrega, setTipoEntrega] = useState(null);
    const [endereco, setEndereco] = useState(null);
    const temPromocao = (estabelecimento.promocoes ?? []).length > 0;
    const [aba, setAba] = useState('cardapio');

    const categorias = Object.keys(cardapio);

    function adicionar(item) {
        setCarrinho((c) => ({ ...c, [item.id]: { ...item, qtd: (c[item.id]?.qtd ?? 0) + 1 } }));
    }

    function remover(item) {
        setCarrinho((c) => {
            const qtd = (c[item.id]?.qtd ?? 0) - 1;
            if (qtd <= 0) {
                const { [item.id]: _, ...resto } = c;
                return resto;
            }
            return { ...c, [item.id]: { ...c[item.id], qtd } };
        });
    }

    const itensCarrinho = Object.values(carrinho).filter((i) => i.qtd > 0);
    const subtotal = itensCarrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
    const taxa = tipoEntrega === 'delivery' ? estabelecimento.taxa_entrega : 0;
    const total = subtotal + taxa;
    const totalItens = itensCarrinho.reduce((s, i) => s + i.qtd, 0);

    function pedirWhatsApp(tipo, end) {
        const tel = estabelecimento.whatsapp.replace(/\D/g, '');
        const msg = montarMensagemWhatsApp(estabelecimento, itensCarrinho, tipo, end);
        window.open(`https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
        setModal(null);
    }

    function iniciarPedido() {
        const precisaTipo = estabelecimento.aceita_delivery && estabelecimento.aceita_retirada;
        if (precisaTipo && !tipoEntrega) {
            setModal('tipo');
        } else {
            const tipo = tipoEntrega ?? (estabelecimento.aceita_delivery ? 'delivery' : 'retirada');
            avancarParaEntrega(tipo);
        }
    }

    function avancarParaEntrega(tipo) {
        setTipoEntrega(tipo);
        setModal(null);
        if (tipo === 'delivery') {
            setModal('endereco');
        } else {
            concluirPedido(tipo, null);
        }
    }

    function concluirComEndereco(end) {
        setEndereco(end);
        setModal(null);
        concluirPedido(tipoEntrega, end);
    }

    function concluirPedido(tipo, end) {
        if (estabelecimento.whatsapp) {
            pedirWhatsApp(tipo, end);
        } else {
            setModal('pix');
        }
    }

    return (
        <>
            <Head title={estabelecimento.nome} />
            <div className="min-h-screen bg-stone-100 pb-32">
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
                        <a href="/baiao-food" className="text-stone-400 hover:text-stone-600">← Baião Food</a>
                        <span className="text-stone-300">/</span>
                        <span className="font-semibold text-stone-800">{estabelecimento.nome}</span>
                    </div>
                </header>

                {/* Info do estabelecimento */}
                <div className="bg-white border-b border-stone-200">
                    <div className="mx-auto max-w-3xl px-4 py-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-xl font-bold text-stone-800">{estabelecimento.nome}</h1>
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        estabelecimento.aberto ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                                    }`}>
                                        {estabelecimento.aberto ? 'Aberto' : 'Fechado'}
                                    </span>
                                </div>
                                <p className="text-sm text-stone-500">{estabelecimento.categoria}</p>
                                {estabelecimento.descricao && (
                                    <p className="mt-1 text-sm text-stone-500">{estabelecimento.descricao}</p>
                                )}
                                {formatarHorario(estabelecimento.horario) && (
                                    <p className="mt-1 text-xs text-stone-400">🕐 {formatarHorario(estabelecimento.horario)}</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {estabelecimento.aceita_delivery && (
                                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                    {estabelecimento.taxa_entrega > 0
                                        ? `Delivery · ${formatReal(estabelecimento.taxa_entrega)}`
                                        : 'Delivery grátis'}
                                </span>
                            )}
                            {estabelecimento.aceita_retirada && (
                                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                    Retirada no local
                                </span>
                            )}
                            {estabelecimento.whatsapp && (
                                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                                    Pedido via WhatsApp
                                </span>
                            )}
                            {estabelecimento.chave_pix && (
                                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                                    Aceita Pix
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Abas */}
                <div className="bg-white border-b border-stone-200">
                    <div className="mx-auto max-w-3xl px-4 flex gap-1">
                        <button
                            onClick={() => setAba('cardapio')}
                            className={`border-b-2 px-5 py-3 text-sm font-medium transition ${
                                aba === 'cardapio'
                                    ? 'border-amber-500 text-amber-600'
                                    : 'border-transparent text-stone-500 hover:text-stone-800'
                            }`}>
                            Cardápio
                        </button>
                        <button
                            onClick={() => setAba('promocoes')}
                            className={`relative border-b-2 px-5 py-3 text-sm font-medium transition ${
                                aba === 'promocoes'
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-stone-500 hover:text-stone-800'
                            }`}>
                            🏷️ Promoções
                            {temPromocao && aba !== 'promocoes' && (
                                <span className="absolute top-2 right-1 h-2 w-2 rounded-full bg-orange-500" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Conteúdo da aba Promoções */}
                {aba === 'promocoes' && (
                    <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
                        {!temPromocao ? (
                            <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-stone-200">
                                <p className="text-2xl mb-2">🏷️</p>
                                <p className="text-sm text-stone-400">Nenhuma promoção ativa no momento.</p>
                            </div>
                        ) : (estabelecimento.promocoes ?? []).map((p) => (
                            p.tipo === 'imagem' ? (
                                <div key={p.id} className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-stone-200">
                                    <img src={p.imagem} alt="Promoção" className="w-full object-cover" />
                                </div>
                            ) : (
                                <div key={p.id} className="flex items-start gap-4 rounded-2xl bg-amber-400 px-6 py-5 shadow-sm">
                                    <span className="text-3xl shrink-0">🏷️</span>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-amber-900 mb-1">Promoção</p>
                                        <p className="text-sm font-medium text-amber-950 whitespace-pre-wrap leading-relaxed">{p.texto}</p>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}

                {/* Conteúdo da aba Cardápio */}
                <main className={`mx-auto max-w-3xl px-4 py-6 ${aba !== 'cardapio' ? 'hidden' : ''}`}>
                    {categorias.length === 0 ? (
                        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-stone-200">
                            <p className="text-stone-400">Nenhum item disponível no momento.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {categorias.map((cat) => (
                                <div key={cat}>
                                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
                                        {cat}
                                    </h2>
                                    <div className="space-y-2">
                                        {cardapio[cat].map((item) => {
                                            const qtd = carrinho[item.id]?.qtd ?? 0;
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200"
                                                >
                                                    {item.foto ? (
                                                        <img src={item.foto} alt={item.nome}
                                                            className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                                                    ) : (
                                                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-3xl">🍽️</div>
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="font-medium text-stone-800">{item.nome}</p>
                                                        {item.descricao && (
                                                            <p className="mt-0.5 text-xs text-stone-500">{item.descricao}</p>
                                                        )}
                                                        <p className="mt-1 text-sm font-semibold text-amber-600">
                                                            {formatReal(item.preco)}
                                                        </p>
                                                    </div>

                                                    <div className="flex shrink-0 items-center gap-2">
                                                        {qtd > 0 && (
                                                            <>
                                                                <button
                                                                    onClick={() => remover(item)}
                                                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition hover:bg-stone-200"
                                                                >
                                                                    −
                                                                </button>
                                                                <span className="w-5 text-center text-sm font-semibold text-stone-800">
                                                                    {qtd}
                                                                </span>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => adicionar(item)}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white transition hover:bg-amber-600"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Carrinho fixo no rodapé */}
            {totalItens > 0 && (
                <div className="fixed bottom-0 inset-x-0 z-40 border-t border-stone-200 bg-white px-4 py-3 shadow-lg">
                    <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
                        <button
                            onClick={() => setModal('carrinho')}
                            className="flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                                {totalItens}
                            </span>
                            Ver carrinho
                        </button>
                        <button
                            onClick={iniciarPedido}
                            className="flex-1 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600"
                        >
                            Fazer pedido · {formatReal(total)}
                        </button>
                    </div>
                </div>
            )}

            {/* Modal: carrinho */}
            {modal === 'carrinho' && (
                <ModalCarrinho
                    itens={itensCarrinho}
                    estabelecimento={estabelecimento}
                    onAdicionar={adicionar}
                    onRemover={remover}
                    onFechar={() => setModal(null)}
                    onFazerPedido={() => { setModal(null); iniciarPedido(); }}
                />
            )}

            {/* Modal: escolha tipo de entrega */}
            {modal === 'tipo' && (
                <ModalTipoEntrega
                    estabelecimento={estabelecimento}
                    onEscolher={avancarParaEntrega}
                    onFechar={() => setModal(null)}
                />
            )}

            {/* Modal: endereço de entrega */}
            {modal === 'endereco' && (
                <ModalEndereco
                    onConfirmar={concluirComEndereco}
                    onFechar={() => setModal(null)}
                />
            )}

            {/* Modal: Pix */}
            {modal === 'pix' && (
                <ModalPix
                    estabelecimento={estabelecimento}
                    itens={itensCarrinho}
                    tipo={tipoEntrega ?? 'retirada'}
                    endereco={endereco}
                    onFechar={() => setModal(null)}
                />
            )}
        </>
    );
}

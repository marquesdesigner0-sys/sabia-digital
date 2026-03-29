import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

const DIAS_SEMANA = [
    { id: 'dom', label: 'Domingo' },
    { id: 'seg', label: 'Segunda' },
    { id: 'ter', label: 'Terça' },
    { id: 'qua', label: 'Quarta' },
    { id: 'qui', label: 'Quinta' },
    { id: 'sex', label: 'Sexta' },
    { id: 'sab', label: 'Sábado' },
];

function parseHorario(raw) {
    try { return JSON.parse(raw) || {}; } catch { return {}; }
}

function HorarioEditor({ value, onChange }) {
    const [dias, setDias] = useState(() => {
        const parsed = parseHorario(value);
        return DIAS_SEMANA.reduce((acc, d) => {
            acc[d.id] = parsed[d.id] ?? { aberto: false, de: '08:00', ate: '18:00' };
            return acc;
        }, {});
    });

    function atualizar(id, campo, val) {
        const novo = { ...dias, [id]: { ...dias[id], [campo]: val } };
        setDias(novo);
        onChange(JSON.stringify(novo));
    }

    function toggleDia(id, aberto) {
        const novo = { ...dias, [id]: { ...dias[id], aberto } };
        setDias(novo);
        onChange(JSON.stringify(novo));
    }

    function copiarUteis() {
        const seg = dias['seg'];
        const novo = { ...dias };
        ['seg','ter','qua','qui','sex'].forEach(d => {
            novo[d] = { ...seg, aberto: true };
        });
        setDias(novo);
        onChange(JSON.stringify(novo));
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-stone-700">Horário de funcionamento</label>
                <button type="button" onClick={copiarUteis}
                    className="text-xs text-amber-600 hover:underline">
                    Copiar seg. para dias úteis
                </button>
            </div>
            <div className="rounded-xl ring-1 ring-stone-200 overflow-hidden divide-y divide-stone-100">
                {DIAS_SEMANA.map((d) => (
                    <div key={d.id} className={`flex items-center gap-3 px-3 py-2.5 ${dias[d.id].aberto ? 'bg-white' : 'bg-stone-50'}`}>
                        <label className="flex items-center gap-2 w-24 shrink-0 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={dias[d.id].aberto}
                                onChange={(e) => toggleDia(d.id, e.target.checked)}
                                className="h-4 w-4 rounded border-stone-300 accent-amber-500"
                            />
                            <span className={`text-sm font-medium ${dias[d.id].aberto ? 'text-stone-800' : 'text-stone-400'}`}>
                                {d.label}
                            </span>
                        </label>

                        {dias[d.id].aberto ? (
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    type="time"
                                    value={dias[d.id].de}
                                    onChange={(e) => atualizar(d.id, 'de', e.target.value)}
                                    className="input w-auto flex-1 min-w-0 text-center text-sm"
                                />
                                <span className="text-xs text-stone-400 shrink-0">às</span>
                                <input
                                    type="time"
                                    value={dias[d.id].ate}
                                    onChange={(e) => atualizar(d.id, 'ate', e.target.value)}
                                    className="input w-auto flex-1 min-w-0 text-center text-sm"
                                />
                            </div>
                        ) : (
                            <span className="text-xs text-stone-400 italic">Fechado</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const CATEGORIAS_ESTABELECIMENTO = [
    'Restaurante', 'Lanches', 'Pizzaria', 'Açaí e Sorvetes',
    'Salgados e Petiscos', 'Doces e Bolos', 'Bebidas', 'Marmita',
    'Churrasco', 'Comida Nordestina', 'Outros',
];

const CATEGORIAS_CARDAPIO = [
    'Entradas',
    'Pratos Principais',
    'Grelhados',
    'Frango',
    'Carnes',
    'Frutos do Mar',
    'Massas',
    'Pizzas',
    'Lanches',
    'Marmitas',
    'Sopas e Caldos',
    'Saladas',
    'Acompanhamentos',
    'Porções',
    'Combos',
    'Sobremesas',
    'Sucos e Vitaminas',
    'Bebidas',
    'Açaí',
    'Doces e Bolos',
];

function formatReal(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function InfoLinha({ label, valor }) {
    if (!valor) return null;
    return (
        <div>
            <p className="text-xs text-stone-400">{label}</p>
            <p className="mt-0.5 text-sm text-stone-800">{valor}</p>
        </div>
    );
}

function formatarHorarioLeitura(raw) {
    if (!raw) return null;
    try {
        const h = JSON.parse(raw);
        const LABEL = { dom:'Dom', seg:'Seg', ter:'Ter', qua:'Qua', qui:'Qui', sex:'Sex', sab:'Sáb' };
        const abertos = Object.entries(LABEL).filter(([id]) => h[id]?.aberto);
        if (!abertos.length) return 'Nenhum dia configurado';
        return abertos.map(([id]) => `${LABEL[id]}: ${h[id].de}–${h[id].ate}`).join(' · ');
    } catch { return raw; }
}

function FormEdicao({ estabelecimento }) {
    const [editando, setEditando] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        _method:          'PUT',
        nome:             estabelecimento.nome,
        nome_responsavel: estabelecimento.nome_responsavel ?? '',
        email_contato:    estabelecimento.email_contato ?? '',
        categoria:        estabelecimento.categoria,
        descricao:        estabelecimento.descricao ?? '',
        whatsapp:         estabelecimento.whatsapp ?? '',
        chave_pix:        estabelecimento.chave_pix ?? '',
        aceita_delivery:  estabelecimento.aceita_delivery,
        aceita_retirada:  estabelecimento.aceita_retirada,
        taxa_entrega:     estabelecimento.taxa_entrega,
        horario:          estabelecimento.horario ?? '',
        logo:             null,
    });

    const [previewLogo, setPreviewLogo] = useState(estabelecimento.logo);

    function onLogoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setData('logo', file);
        setPreviewLogo(URL.createObjectURL(file));
    }

    function submit(e) {
        e.preventDefault();
        post(`/empreendedor/painel/${estabelecimento.id}`, {
            forceFormData: true,
            onSuccess: () => setEditando(false),
        });
    }

    function cancelar() {
        reset();
        setPreviewLogo(estabelecimento.logo);
        setEditando(false);
    }

    /* ── MODO LEITURA ─────────────────────────────────── */
    if (!editando) {
        return (
            <div className="space-y-5">
                {/* Logo + nome */}
                <div className="flex items-center gap-4">
                    {estabelecimento.logo ? (
                        <img src={estabelecimento.logo} alt="Logo" className="h-20 w-20 rounded-xl object-cover ring-1 ring-stone-200" />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-stone-100 ring-1 ring-stone-200 text-3xl">🍽️</div>
                    )}
                    <div>
                        <p className="text-lg font-bold text-stone-800">{estabelecimento.nome}</p>
                        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-500">{estabelecimento.categoria}</span>
                    </div>
                </div>

                {estabelecimento.descricao && (
                    <p className="text-sm text-stone-600 leading-relaxed">{estabelecimento.descricao}</p>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoLinha label="Responsável" valor={estabelecimento.nome_responsavel} />
                    <InfoLinha label="E-mail de contato" valor={estabelecimento.email_contato} />
                    <InfoLinha label="WhatsApp" valor={estabelecimento.whatsapp} />
                    <InfoLinha label="Chave Pix" valor={estabelecimento.chave_pix} />
                </div>

                <div>
                    <p className="text-xs text-stone-400">Horário de funcionamento</p>
                    <p className="mt-0.5 text-sm text-stone-800">
                        {formatarHorarioLeitura(estabelecimento.horario) ?? <span className="italic text-stone-400">Não configurado</span>}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {estabelecimento.aceita_delivery && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                            Delivery
                            {estabelecimento.taxa_entrega > 0
                                ? ` · R$ ${Number(estabelecimento.taxa_entrega).toFixed(2).replace('.', ',')}`
                                : ' · grátis'}
                        </span>
                    )}
                    {estabelecimento.aceita_retirada && (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200">
                            Retirada no local
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setEditando(true)}
                    className="rounded-xl border border-amber-400 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100">
                    ✏️ Editar perfil
                </button>
            </div>
        );
    }

    /* ── MODO EDIÇÃO ──────────────────────────────────── */
    return (
        <form onSubmit={submit} className="space-y-5">
            {/* Logo */}
            <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                    Logo <span className="font-normal text-stone-400">(JPG/PNG · máx. 2 MB)</span>
                </label>
                <div className="flex items-center gap-4">
                    {previewLogo ? (
                        <img src={previewLogo} alt="Logo" className="h-20 w-20 rounded-xl object-cover ring-1 ring-stone-200" />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-stone-100 ring-1 ring-stone-200 text-2xl">🍽️</div>
                    )}
                    <input type="file" accept="image/*" onChange={onLogoChange}
                        className="block text-xs text-stone-600 file:mr-2 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-amber-700 hover:file:bg-amber-100" />
                    {errors.logo && <p className="mt-1 text-xs text-red-600">{errors.logo}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Nome do estabelecimento</label>
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

            <HorarioEditor
                value={data.horario}
                onChange={(val) => setData('horario', val)}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Nome do responsável</label>
                    <input type="text" value={data.nome_responsavel} onChange={(e) => setData('nome_responsavel', e.target.value)} className="input" required />
                    {errors.nome_responsavel && <p className="mt-1 text-xs text-red-600">{errors.nome_responsavel}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">E-mail de contato</label>
                    <input type="email" value={data.email_contato} onChange={(e) => setData('email_contato', e.target.value)} className="input" required />
                    {errors.email_contato && <p className="mt-1 text-xs text-red-600">{errors.email_contato}</p>}
                </div>
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
                        onChange={(e) => setData('taxa_entrega', e.target.value)} className="input" />
                </div>
            )}

            <div className="flex gap-3">
                <button type="button" onClick={cancelar}
                    className="rounded-xl border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50">
                    Cancelar
                </button>
                <button type="submit" disabled={processing}
                    className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-60">
                    {processing ? 'Salvando…' : 'Salvar alterações'}
                </button>
            </div>
        </form>
    );
}

function FormEditarItem({ item, onCancelar }) {
    const { data, setData, post, processing, errors } = useForm({
        categoria:    item.categoria,
        nome:         item.nome,
        descricao:    item.descricao ?? '',
        preco:        item.preco,
        foto:         null,
        remover_foto: false,
    });

    const [previewFoto, setPreviewFoto] = useState(item.foto);

    function onFotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setData((prev) => ({ ...prev, foto: file, remover_foto: false }));
        setPreviewFoto(URL.createObjectURL(file));
    }

    function removerFoto() {
        setData((prev) => ({ ...prev, foto: null, remover_foto: true }));
        setPreviewFoto(null);
    }

    function submit(e) {
        e.preventDefault();
        post(`/empreendedor/itens/${item.id}`, {
            forceFormData: true,
            onSuccess: onCancelar,
        });
    }

    return (
        <form onSubmit={submit} className="mt-3 space-y-3 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Editando: {item.nome}</p>

            {/* Foto */}
            <div>
                <label className="mb-1 block text-xs font-medium text-stone-700">
                    Foto <span className="font-normal text-stone-400">(JPG/PNG · máx. 2 MB)</span>
                </label>
                <div className="flex items-center gap-3">
                    {previewFoto ? (
                        <img src={previewFoto} alt="Preview" className="h-16 w-16 rounded-lg object-cover ring-1 ring-stone-200" />
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-stone-100 ring-1 ring-stone-200 text-lg">🍽️</div>
                    )}
                    <div className="flex flex-col gap-1">
                        <input type="file" accept="image/*" onChange={onFotoChange}
                            className="block text-xs text-stone-600 file:mr-2 file:rounded-lg file:border-0 file:bg-amber-50 file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-amber-700 hover:file:bg-amber-100" />
                        {previewFoto && (
                            <button type="button" onClick={removerFoto}
                                className="text-left text-xs text-red-500 hover:underline">
                                Remover foto
                            </button>
                        )}
                    </div>
                </div>
                {errors.foto && <p className="mt-1 text-xs text-red-600">{errors.foto}</p>}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-xs font-medium text-stone-700">Categoria</label>
                    <select value={data.categoria} onChange={(e) => setData('categoria', e.target.value)} className="input" required>
                        {CATEGORIAS_CARDAPIO.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.categoria && <p className="mt-1 text-xs text-red-600">{errors.categoria}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-stone-700">Nome</label>
                    <input type="text" value={data.nome} onChange={(e) => setData('nome', e.target.value)} className="input" required />
                    {errors.nome && <p className="mt-1 text-xs text-red-600">{errors.nome}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-xs font-medium text-stone-700">Descrição <span className="font-normal text-stone-400">(opcional)</span></label>
                    <input type="text" value={data.descricao} onChange={(e) => setData('descricao', e.target.value)}
                        className="input" placeholder="Ingredientes ou observações" />
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-stone-700">Preço (R$)</label>
                    <input type="number" min="0" step="0.50" value={data.preco}
                        onChange={(e) => setData('preco', e.target.value)} className="input" required />
                    {errors.preco && <p className="mt-1 text-xs text-red-600">{errors.preco}</p>}
                </div>
            </div>

            <div className="flex gap-2 pt-1">
                <button type="button" onClick={onCancelar}
                    className="flex-1 rounded-lg border border-stone-300 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50">
                    Cancelar
                </button>
                <button type="submit" disabled={processing}
                    className="flex-1 rounded-lg bg-amber-500 py-2 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-60">
                    {processing ? 'Salvando…' : 'Salvar alterações'}
                </button>
            </div>
        </form>
    );
}

function FormPromocao({ estabelecimento }) {
    const temAtiva = !!(estabelecimento.promocao || estabelecimento.promocao_imagem);
    const [modo, setModo] = useState(estabelecimento.promocao_imagem ? 'imagem' : 'texto');
    const [previewImg, setPreviewImg] = useState(estabelecimento.promocao_imagem ?? null);

    const { data, setData, post, processing, errors, reset } = useForm({
        tipo:             modo,
        promocao:         estabelecimento.promocao ?? '',
        promocao_imagem:  null,
    });

    function escolherModo(m) {
        setModo(m);
        setData('tipo', m);
    }

    function onImagemChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setData((d) => ({ ...d, promocao_imagem: file }));
        setPreviewImg(URL.createObjectURL(file));
    }

    function salvar(e) {
        e.preventDefault();
        post(`/empreendedor/painel/${estabelecimento.id}/promocao`, { forceFormData: true });
    }

    function remover() {
        if (!confirm('Remover a promoção ativa?')) return;
        post(`/empreendedor/painel/${estabelecimento.id}/promocao`, {
            data: { tipo: 'remover' },
        });
    }

    return (
        <div className="space-y-5">
            {/* Preview da promoção ativa */}
            {temAtiva && (
                <div className="rounded-xl ring-1 ring-amber-300 overflow-hidden">
                    <div className="flex items-center justify-between bg-amber-50 px-4 py-2.5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Promoção ativa agora</p>
                        <button type="button" onClick={remover}
                            className="text-xs text-red-500 hover:underline font-medium">
                            Remover promoção
                        </button>
                    </div>
                    {estabelecimento.promocao_imagem ? (
                        <img src={estabelecimento.promocao_imagem} alt="Promoção" className="w-full object-cover max-h-64" />
                    ) : (
                        <div className="flex items-start gap-3 bg-amber-400 px-4 py-3">
                            <span className="text-xl shrink-0">🏷️</span>
                            <p className="text-sm font-medium text-amber-950 whitespace-pre-wrap leading-relaxed">
                                {estabelecimento.promocao}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Toggle tipo */}
            <div>
                <p className="mb-2 text-sm font-medium text-stone-700">
                    {temAtiva ? 'Alterar promoção' : 'Nova promoção'} — escolha o formato:
                </p>
                <div className="flex gap-2">
                    <button type="button" onClick={() => escolherModo('texto')}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            modo === 'texto' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}>
                        ✏️ Texto
                    </button>
                    <button type="button" onClick={() => escolherModo('imagem')}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            modo === 'imagem' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}>
                        🖼️ Imagem
                    </button>
                </div>
            </div>

            <form onSubmit={salvar} className="space-y-4">
                {modo === 'texto' && (
                    <div>
                        <label className="mb-1 block text-sm font-medium text-stone-700">
                            Texto da promoção
                            <span className="ml-1 font-normal text-stone-400">(máx. 500 caracteres)</span>
                        </label>
                        <textarea
                            value={data.promocao}
                            onChange={(e) => setData('promocao', e.target.value)}
                            rows={4}
                            maxLength={500}
                            className="input"
                            placeholder={'Ex: 🍕 Pizza grande por R$ 29,90 toda sexta!\nEx: Compre 2 X-burguer e ganhe 1 refri grátis.\nEx: Marmita do dia: arroz, feijão, frango e salada — R$ 12,00'}
                        />
                        <p className="mt-1 text-right text-xs text-stone-400">{data.promocao.length}/500</p>
                        <p className="mt-1 text-xs text-stone-500">Aparece como card amarelo no topo do cardápio.</p>
                    </div>
                )}

                {modo === 'imagem' && (
                    <div>
                        <label className="mb-1 block text-sm font-medium text-stone-700">
                            Card de promoção
                            <span className="ml-1 font-normal text-stone-400">(PNG ou JPG · 1350×1080 recomendado · máx. 4 MB)</span>
                        </label>

                        {previewImg && (
                            <div className="mb-3 overflow-hidden rounded-xl ring-1 ring-stone-200">
                                <img src={previewImg} alt="Preview" className="w-full object-cover max-h-56" />
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/png,image/jpeg"
                            onChange={onImagemChange}
                            className="block text-xs text-stone-600 file:mr-2 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-amber-700 hover:file:bg-amber-100"
                        />
                        {errors.promocao_imagem && (
                            <p className="mt-1 text-xs text-red-600">{errors.promocao_imagem}</p>
                        )}
                        <p className="mt-2 text-xs text-stone-500">
                            Crie o card no Canva no formato <strong>1350×1080 px</strong> e exporte como PNG ou JPG.
                            Ele será exibido em largura total no topo do cardápio.
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={processing || (modo === 'texto' && !data.promocao.trim()) || (modo === 'imagem' && !data.promocao_imagem)}
                    className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50 transition">
                    {processing ? 'Salvando…' : temAtiva ? 'Atualizar promoção' : 'Publicar promoção'}
                </button>
            </form>
        </div>
    );
}

function CardapioManager({ estabelecimento }) {
    const [aba, setAba] = useState('lista');
    const [itemEditando, setItemEditando] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        categoria: '', nome: '', descricao: '', preco: '', foto: null,
    });

    const [previewFoto, setPreviewFoto] = useState(null);

    function onFotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setData('foto', file);
        setPreviewFoto(URL.createObjectURL(file));
    }

    function adicionarItem(e) {
        e.preventDefault();
        post(`/empreendedor/painel/${estabelecimento.id}/itens`, {
            forceFormData: true,
            onSuccess: () => { reset(); setPreviewFoto(null); setAba('lista'); },
        });
    }

    function toggleItem(item) {
        router.post(`/empreendedor/itens/${item.id}/toggle`);
    }

    function removerItem(item) {
        if (!confirm(`Remover "${item.nome}"?`)) return;
        router.delete(`/empreendedor/itens/${item.id}`);
    }

    const porCategoria = estabelecimento.itens.reduce((acc, i) => {
        (acc[i.categoria] = acc[i.categoria] || []).push(i);
        return acc;
    }, {});

    return (
        <div>
            <div className="mb-4 flex flex-wrap gap-2">
                <button onClick={() => { setAba('lista'); setItemEditando(null); }}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${aba === 'lista' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                    Itens ({estabelecimento.itens.length})
                </button>
                <button onClick={() => { setAba('novo'); setItemEditando(null); }}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${aba === 'novo' ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                    + Novo item
                </button>
                <button onClick={() => { setAba('promocao'); setItemEditando(null); }}
                    className={`relative rounded-lg px-4 py-2 text-sm font-medium transition ${aba === 'promocao' ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                    🏷️ Promoção
                    {estabelecimento.promocao && aba !== 'promocao' && (
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
                    )}
                </button>
            </div>

            {aba === 'lista' && (
                estabelecimento.itens.length === 0 ? (
                    <p className="py-6 text-center text-sm text-stone-400">Nenhum item no cardápio ainda.</p>
                ) : (
                    <div className="space-y-4">
                        {Object.entries(porCategoria).map(([cat, itens]) => (
                            <div key={cat}>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">{cat}</p>
                                <div className="space-y-2">
                                    {itens.map((item) => (
                                        <div key={item.id}>
                                            <div
                                                className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${
                                                    item.disponivel ? 'bg-white ring-stone-200' : 'bg-stone-50 ring-stone-100 opacity-60'
                                                }`}>
                                                {item.foto ? (
                                                    <img src={item.foto} alt={item.nome} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-xl">🍽️</div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-stone-800">{item.nome}</p>
                                                    {item.descricao && <p className="text-xs text-stone-400 truncate">{item.descricao}</p>}
                                                    <p className="text-sm font-semibold text-amber-600">{formatReal(item.preco)}</p>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-2">
                                                    <button onClick={() => toggleItem(item)}
                                                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                                                            item.disponivel
                                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                                                        }`}>
                                                        {item.disponivel ? 'Disponível' : 'Indisponível'}
                                                    </button>
                                                    <button
                                                        onClick={() => setItemEditando(itemEditando?.id === item.id ? null : item)}
                                                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                                                            itemEditando?.id === item.id
                                                                ? 'bg-amber-200 text-amber-800'
                                                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                        }`}>
                                                        Editar
                                                    </button>
                                                    <button onClick={() => removerItem(item)} className="text-xs text-red-500 hover:underline">
                                                        Remover
                                                    </button>
                                                </div>
                                            </div>

                                            {itemEditando?.id === item.id && (
                                                <FormEditarItem
                                                    item={item}
                                                    onCancelar={() => setItemEditando(null)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {aba === 'promocao' && (
                <FormPromocao estabelecimento={estabelecimento} />
            )}

            {aba === 'novo' && (
                <form onSubmit={adicionarItem} className="space-y-4">
                    {/* Foto do item */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-stone-700">
                            Foto do item <span className="font-normal text-stone-400">(opcional · JPG/PNG · máx. 2 MB)</span>
                        </label>
                        <div className="flex items-center gap-4">
                            {previewFoto ? (
                                <img src={previewFoto} alt="Preview" className="h-20 w-20 rounded-xl object-cover ring-1 ring-stone-200" />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-stone-100 ring-1 ring-stone-200 text-2xl">🍽️</div>
                            )}
                            <input type="file" accept="image/*" onChange={onFotoChange}
                                className="block text-xs text-stone-600 file:mr-2 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-amber-700 hover:file:bg-amber-100" />
                        </div>
                        {errors.foto && <p className="mt-1 text-xs text-red-600">{errors.foto}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-stone-700">Categoria</label>
                            <select value={data.categoria} onChange={(e) => setData('categoria', e.target.value)}
                                className="input" required>
                                <option value="">Selecione a categoria…</option>
                                {CATEGORIAS_CARDAPIO.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
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
                            <label className="mb-1 block text-sm font-medium text-stone-700">
                                Descrição <span className="font-normal text-stone-400">(opcional)</span>
                            </label>
                            <input type="text" value={data.descricao} onChange={(e) => setData('descricao', e.target.value)}
                                className="input" placeholder="Ingredientes ou observações" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-stone-700">Preço (R$)</label>
                            <input type="number" min="0" step="0.50" value={data.preco}
                                onChange={(e) => setData('preco', e.target.value)} className="input" placeholder="0,00" required />
                            {errors.preco && <p className="mt-1 text-xs text-red-600">{errors.preco}</p>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setAba('lista')}
                            className="flex-1 rounded-xl border border-stone-300 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={processing}
                            className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-60">
                            {processing ? 'Adicionando…' : 'Adicionar item'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default function EmpreendedorPainel({ estabelecimento, sucesso }) {
    const [secao, setSecao] = useState('dados');

    function toggleAberto() {
        router.post(`/empreendedor/painel/${estabelecimento.id}/toggle-aberto`);
    }

    function logout() {
        router.post('/empreendedor/logout');
    }

    const statusCor = {
        pendente: 'bg-amber-100 text-amber-700',
        ativo:    'bg-green-100 text-green-700',
        inativo:  'bg-stone-100 text-stone-500',
    };

    const statusLabel = {
        pendente: 'Aguardando aprovação',
        ativo:    'Aprovado — publicado no Baião Food',
        inativo:  'Inativo',
    };

    return (
        <>
            <Head title="Painel do empreendedor" />
            <div className="min-h-screen bg-stone-100">
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                            <a href="/baiao-food" className="text-stone-400 hover:text-stone-600">🍽️ Baião Food</a>
                            <span className="text-stone-300">/</span>
                            <span className="font-semibold text-stone-800">Painel</span>
                        </div>
                        <button onClick={logout}
                            className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600">
                            Sair do painel
                        </button>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
                    {sucesso && (
                        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-200">
                            <p className="text-sm font-medium text-green-800">✓ {sucesso}</p>
                        </div>
                    )}

                    {/* Status e toggle aberto/fechado */}
                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h1 className="text-xl font-bold text-stone-800">{estabelecimento.nome}</h1>
                                <div className="mt-1 flex items-center gap-2 flex-wrap">
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusCor[estabelecimento.status]}`}>
                                        {statusLabel[estabelecimento.status]}
                                    </span>
                                    <span className="text-xs text-stone-400">{estabelecimento.cnpj}</span>
                                </div>
                            </div>

                            {estabelecimento.status === 'ativo' && (
                                <button onClick={toggleAberto}
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                                        estabelecimento.aberto
                                            ? 'bg-green-500 text-white hover:bg-green-600'
                                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                                    }`}>
                                    <span className={`h-2.5 w-2.5 rounded-full ${estabelecimento.aberto ? 'bg-white' : 'bg-stone-400'}`} />
                                    {estabelecimento.aberto ? 'Aberto agora' : 'Fechado'}
                                </button>
                            )}
                        </div>

                        {estabelecimento.status === 'pendente' && (
                            <p className="mt-3 text-xs text-amber-700">
                                Seu cadastro está em análise pela prefeitura. Você já pode montar seu cardápio enquanto aguarda a aprovação.
                            </p>
                        )}
                    </div>

                    {/* Abas */}
                    <div className="flex gap-2 border-b border-stone-200">
                        {[
                            { id: 'dados',    label: 'Dados' },
                            { id: 'cardapio', label: `Cardápio (${estabelecimento.itens.length})` },
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
                        {secao === 'dados'    && <FormEdicao estabelecimento={estabelecimento} />}
                        {secao === 'cardapio' && <CardapioManager estabelecimento={estabelecimento} />}
                    </div>
                </main>
            </div>
        </>
    );
}

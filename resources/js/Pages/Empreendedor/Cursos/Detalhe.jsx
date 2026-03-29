import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';

function formatCpf(v) {
    return v.replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .slice(0, 14);
}

function ModalInscricao({ curso, user, onFechar }) {
    const [modalidade, setModalidade] = useState('simples');

    // Inscrição simples
    const simples = useForm({
        modalidade: 'simples',
        participantes: [{ nome: user.name ?? '', cpf: '', tipo: 'dono' }],
    });

    // Inscrição empreendedor
    const [participantes, setParticipantes] = useState([
        { nome: user.name ?? '', cpf: '', tipo: 'dono' },
    ]);
    const emp = useForm({ modalidade: 'empreendedor', participantes: [] });

    function adicionarFuncionario() {
        setParticipantes((prev) => [...prev, { nome: '', cpf: '', tipo: 'funcionario' }]);
    }

    function removerParticipante(idx) {
        setParticipantes((prev) => prev.filter((_, i) => i !== idx));
    }

    function atualizarParticipante(idx, campo, valor) {
        setParticipantes((prev) =>
            prev.map((p, i) => (i === idx ? { ...p, [campo]: valor } : p))
        );
    }

    function submitSimples(e) {
        e.preventDefault();
        simples.post(`/empreendedor/cursos/${curso.id}/inscrever`, {
            onSuccess: onFechar,
        });
    }

    function submitEmpreendedor(e) {
        e.preventDefault();
        emp.setData({ modalidade: 'empreendedor', participantes });
        // post via router para garantir dados atualizados
        router.post(`/empreendedor/cursos/${curso.id}/inscrever`, {
            modalidade: 'empreendedor',
            participantes,
        }, { onSuccess: onFechar });
    }

    const totalParticipantes = modalidade === 'simples' ? 1 : participantes.length;
    const vagasOk = curso.vagas_disponiveis >= totalParticipantes;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center px-0 sm:px-4">
            <div className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white shadow-xl ring-1 ring-stone-200 max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white px-6 pt-5 pb-3 border-b border-stone-100">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-stone-800">Inscrição no curso</h2>
                        <button onClick={onFechar} className="text-stone-400 hover:text-stone-600 text-xl leading-none">✕</button>
                    </div>
                    <p className="mt-0.5 text-sm text-stone-500 line-clamp-1">{curso.titulo}</p>
                </div>

                <div className="px-6 py-4 space-y-5">
                    {/* Seletor de modalidade */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setModalidade('simples')}
                            className={`rounded-xl border-2 p-3 text-left transition ${
                                modalidade === 'simples'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-stone-200 hover:border-stone-300'
                            }`}>
                            <p className="text-sm font-semibold text-stone-800">Inscrição simples</p>
                            <p className="mt-0.5 text-xs text-stone-500">Somente para mim</p>
                        </button>
                        <button
                            onClick={() => setModalidade('empreendedor')}
                            className={`rounded-xl border-2 p-3 text-left transition ${
                                modalidade === 'empreendedor'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-stone-200 hover:border-stone-300'
                            }`}>
                            <p className="text-sm font-semibold text-stone-800">Empreendedor</p>
                            <p className="mt-0.5 text-xs text-stone-500">Para mim e minha equipe</p>
                        </button>
                    </div>

                    {/* Aviso de vagas */}
                    {!vagasOk && (
                        <div className="rounded-xl bg-red-50 p-3 ring-1 ring-red-200">
                            <p className="text-sm text-red-700">
                                Vagas insuficientes. Disponíveis: <strong>{curso.vagas_disponiveis}</strong>, solicitadas: <strong>{totalParticipantes}</strong>.
                            </p>
                        </div>
                    )}

                    {/* SIMPLES */}
                    {modalidade === 'simples' && (
                        <form onSubmit={submitSimples} className="space-y-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">Seu nome completo</label>
                                <input type="text"
                                    value={simples.data.participantes[0].nome}
                                    onChange={(e) => simples.setData('participantes', [
                                        { ...simples.data.participantes[0], nome: e.target.value }
                                    ])}
                                    className="input" required />
                                {simples.errors['participantes.0.nome'] && (
                                    <p className="mt-1 text-xs text-red-600">{simples.errors['participantes.0.nome']}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">Seu CPF</label>
                                <input type="text"
                                    value={simples.data.participantes[0].cpf}
                                    onChange={(e) => simples.setData('participantes', [
                                        { ...simples.data.participantes[0], cpf: formatCpf(e.target.value) }
                                    ])}
                                    className="input" placeholder="000.000.000-00" required />
                                {simples.errors['participantes.0.cpf'] && (
                                    <p className="mt-1 text-xs text-red-600">{simples.errors['participantes.0.cpf']}</p>
                                )}
                            </div>
                            {simples.errors.vagas && (
                                <p className="text-sm text-red-600">{simples.errors.vagas}</p>
                            )}
                            <button type="submit" disabled={simples.processing || !vagasOk}
                                className="w-full rounded-xl bg-blue-500 py-3 text-sm font-bold text-white transition hover:bg-blue-600 disabled:opacity-60">
                                {simples.processing ? 'Enviando…' : 'Confirmar inscrição'}
                            </button>
                        </form>
                    )}

                    {/* EMPREENDEDOR */}
                    {modalidade === 'empreendedor' && (
                        <form onSubmit={submitEmpreendedor} className="space-y-4">
                            <p className="text-xs text-stone-500">
                                Adicione você e/ou seus funcionários. Cada participante ocupa uma vaga.
                                <strong className="text-stone-700"> Disponíveis: {curso.vagas_disponiveis}</strong>.
                            </p>

                            <div className="space-y-3">
                                {participantes.map((p, idx) => (
                                    <div key={idx} className="rounded-xl bg-stone-50 p-3 ring-1 ring-stone-200">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-stone-600">
                                                {idx === 0 ? '👤 Titular' : `👥 Funcionário ${idx}`}
                                            </span>
                                            {idx > 0 && (
                                                <button type="button" onClick={() => removerParticipante(idx)}
                                                    className="text-xs text-red-500 hover:underline">
                                                    Remover
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-0.5 block text-xs font-medium text-stone-600">Nome completo</label>
                                                <input type="text" value={p.nome}
                                                    onChange={(e) => atualizarParticipante(idx, 'nome', e.target.value)}
                                                    className="input" placeholder="Nome" required />
                                            </div>
                                            <div>
                                                <label className="mb-0.5 block text-xs font-medium text-stone-600">CPF</label>
                                                <input type="text" value={p.cpf}
                                                    onChange={(e) => atualizarParticipante(idx, 'cpf', formatCpf(e.target.value))}
                                                    className="input" placeholder="000.000.000-00" required />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {participantes.length < curso.vagas_disponiveis && participantes.length < 20 && (
                                <button type="button" onClick={adicionarFuncionario}
                                    className="w-full rounded-xl border-2 border-dashed border-stone-300 py-2.5 text-sm font-medium text-stone-500 transition hover:border-blue-300 hover:text-blue-500">
                                    + Adicionar funcionário
                                </button>
                            )}

                            {emp.errors && emp.errors.vagas && (
                                <p className="text-sm text-red-600">{emp.errors.vagas}</p>
                            )}

                            <button type="submit" disabled={!vagasOk}
                                className="w-full rounded-xl bg-blue-500 py-3 text-sm font-bold text-white transition hover:bg-blue-600 disabled:opacity-60">
                                Confirmar {participantes.length} inscrição{participantes.length > 1 ? 'ões' : ''}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CursoDetalhe({ curso, jaInscrito, inscricoesDoUsuario, user, sucesso }) {
    const [modalAberto, setModalAberto] = useState(false);

    function cancelarInscricao(id) {
        if (!confirm('Cancelar esta inscrição?')) return;
        router.post(`/empreendedor/inscricoes/${id}/cancelar`);
    }

    const statusCor = {
        pendente:   'bg-amber-100 text-amber-700',
        confirmada: 'bg-green-100 text-green-700',
        cancelada:  'bg-stone-100 text-stone-500',
    };

    const tipoLabel = { dono: 'Titular', funcionario: 'Funcionário' };

    return (
        <>
            <Head title={curso.titulo} />
            <div className="min-h-screen bg-stone-100">
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
                        <Link href="/empreendedor/cursos" className="text-stone-400 hover:text-stone-600">← Cursos</Link>
                        <span className="text-stone-300">/</span>
                        <span className="font-semibold text-stone-800 truncate">{curso.titulo}</span>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
                    {sucesso && (
                        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-200">
                            <p className="text-sm font-medium text-green-800">✓ {sucesso}</p>
                        </div>
                    )}

                    {/* Card do curso */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                            <h1 className="text-xl font-bold text-stone-800">{curso.titulo}</h1>
                            {curso.vagas_disponiveis === 0 ? (
                                <span className="shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                                    Lista de espera
                                </span>
                            ) : (
                                <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    {curso.vagas_disponiveis}/{curso.vagas_total} vagas
                                </span>
                            )}
                        </div>

                        {curso.descricao && (
                            <p className="text-sm text-stone-600 leading-relaxed">{curso.descricao}</p>
                        )}

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {[
                                { label: 'Início', valor: curso.data_inicio, icone: '📅' },
                                { label: 'Término', valor: curso.data_fim, icone: '📅' },
                                { label: 'Carga horária', valor: `${curso.carga_horaria}h`, icone: '⏱' },
                                { label: 'Instrutor', valor: curso.instrutor ?? '—', icone: '👨‍🏫' },
                            ].map((item) => (
                                <div key={item.label} className="rounded-xl bg-stone-50 p-3 ring-1 ring-stone-100">
                                    <p className="text-xs text-stone-400">{item.icone} {item.label}</p>
                                    <p className="mt-0.5 text-sm font-medium text-stone-700">{item.valor}</p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-xl bg-stone-50 p-3 ring-1 ring-stone-100">
                            <p className="text-xs text-stone-400">📍 Local</p>
                            <p className="mt-0.5 text-sm font-medium text-stone-700">{curso.local}</p>
                        </div>

                        {/* Botão de inscrição */}
                        {!jaInscrito ? (
                            <button
                                onClick={() => setModalAberto(true)}
                                disabled={curso.vagas_disponiveis === 0}
                                className="w-full rounded-xl bg-blue-500 py-3 text-sm font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60">
                                {curso.vagas_disponiveis === 0 ? 'Entrar na lista de espera (em breve)' : 'Inscrever-se neste curso'}
                            </button>
                        ) : (
                            <div className="rounded-xl bg-green-50 p-3 ring-1 ring-green-200 text-center">
                                <p className="text-sm font-medium text-green-800">✓ Você possui inscrição(ões) neste curso</p>
                            </div>
                        )}
                    </div>

                    {/* Inscrições do usuário neste curso */}
                    {inscricoesDoUsuario.length > 0 && (
                        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200 space-y-3">
                            <h2 className="font-semibold text-stone-800">Suas inscrições neste curso</h2>
                            {inscricoesDoUsuario.map((i) => (
                                <div key={i.id}
                                    className="flex items-center justify-between gap-3 rounded-xl bg-stone-50 p-3 ring-1 ring-stone-100">
                                    <div>
                                        <p className="text-sm font-medium text-stone-800">{i.nome_participante}</p>
                                        <span className="text-xs text-stone-400">{tipoLabel[i.tipo]}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCor[i.status]}`}>
                                            {i.status.charAt(0).toUpperCase() + i.status.slice(1)}
                                        </span>
                                        {i.status !== 'cancelada' && (
                                            <button onClick={() => cancelarInscricao(i.id)}
                                                className="text-xs text-red-500 hover:underline">
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Adicionar mais participantes mesmo já inscrito */}
                            <button onClick={() => setModalAberto(true)}
                                className="w-full rounded-xl border border-blue-300 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50">
                                + Inscrever mais participantes
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {modalAberto && (
                <ModalInscricao
                    curso={curso}
                    user={user}
                    onFechar={() => setModalAberto(false)}
                />
            )}
        </>
    );
}

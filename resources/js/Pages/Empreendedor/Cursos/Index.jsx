import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

const statusInscricao = {
    pendente:   { label: 'Pendente',   cor: 'bg-amber-100 text-amber-700' },
    confirmada: { label: 'Confirmada', cor: 'bg-green-100 text-green-700' },
    cancelada:  { label: 'Cancelada',  cor: 'bg-stone-100 text-stone-500 line-through' },
};

const tipoLabel = { dono: 'Titular', funcionario: 'Funcionário' };

export default function CursosIndex({ cursos, minhasInscricoes }) {
    const [aba, setAba] = useState('cursos');

    return (
        <>
            <Head title="Cursos e Treinamentos" />
            <div className="min-h-screen bg-stone-100">
                <header className="bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
                        <Link href="/empreendedor" className="text-stone-400 hover:text-stone-600">← Empreendedor</Link>
                        <span className="text-stone-300">/</span>
                        <span className="font-semibold text-stone-800">Cursos e Treinamentos</span>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800">Cursos e Treinamentos</h1>
                        <p className="mt-1 text-sm text-stone-500">Qualificação para empreendedores e seus funcionários</p>
                    </div>

                    {/* Abas */}
                    <div className="flex gap-2 border-b border-stone-200">
                        {[
                            { id: 'cursos',    label: `Disponíveis (${cursos.length})` },
                            { id: 'inscricoes', label: `Minhas inscrições (${minhasInscricoes.length})` },
                        ].map((a) => (
                            <button key={a.id} onClick={() => setAba(a.id)}
                                className={`border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                                    aba === a.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-stone-500 hover:text-stone-800'
                                }`}>
                                {a.label}
                            </button>
                        ))}
                    </div>

                    {/* Cursos disponíveis */}
                    {aba === 'cursos' && (
                        cursos.length === 0 ? (
                            <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
                                <p className="text-stone-400">Nenhum curso disponível no momento.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cursos.map((curso) => (
                                    <Link key={curso.id} href={`/empreendedor/cursos/${curso.id}`}
                                        className="block rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200 transition hover:ring-blue-300 hover:shadow-md">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h2 className="font-semibold text-stone-800">{curso.titulo}</h2>
                                                <p className="mt-1 text-sm text-stone-500 line-clamp-2">{curso.descricao}</p>
                                            </div>
                                            {curso.vagas_disponiveis === 0 ? (
                                                <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                                                    Lista de espera
                                                </span>
                                            ) : (
                                                <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                                                    {curso.vagas_disponiveis} vagas
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-500">
                                            <span>📅 {curso.data_inicio} → {curso.data_fim}</span>
                                            <span>⏱ {curso.carga_horaria}h</span>
                                            <span>📍 {curso.local}</span>
                                        </div>
                                        {curso.instrutor && (
                                            <p className="mt-2 text-xs text-stone-400">Instrutor: {curso.instrutor}</p>
                                        )}
                                        <div className="mt-4">
                                            <span className="inline-block rounded-lg bg-blue-500 px-4 py-2 text-xs font-bold text-white">
                                                Ver detalhes e inscrever-se →
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )
                    )}

                    {/* Minhas inscrições */}
                    {aba === 'inscricoes' && (
                        minhasInscricoes.length === 0 ? (
                            <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
                                <p className="text-stone-400">Você ainda não possui inscrições.</p>
                                <button onClick={() => setAba('cursos')}
                                    className="mt-3 text-sm font-medium text-blue-500 hover:underline">
                                    Ver cursos disponíveis
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {minhasInscricoes.map((i) => (
                                    <div key={i.id}
                                        className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-stone-800 truncate">{i.curso_titulo}</p>
                                            <p className="text-sm text-stone-500">
                                                {i.nome_participante}
                                                <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
                                                    {tipoLabel[i.tipo]}
                                                </span>
                                            </p>
                                            <p className="text-xs text-stone-400">Início: {i.curso_data_inicio} · Inscrito em {i.created_at}</p>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInscricao[i.status].cor}`}>
                                            {statusInscricao[i.status].label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </main>
            </div>
        </>
    );
}

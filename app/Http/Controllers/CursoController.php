<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use App\Models\InscricaoCurso;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CursoController extends Controller
{
    public function index(): Response
    {
        $cursos = Curso::where('status', 'ativo')
            ->orderBy('data_inicio')
            ->get()
            ->map(fn($c) => [
                'id'                 => $c->id,
                'titulo'             => $c->titulo,
                'descricao'          => $c->descricao,
                'instrutor'          => $c->instrutor,
                'carga_horaria'      => $c->carga_horaria,
                'data_inicio'        => $c->data_inicio->format('d/m/Y'),
                'data_fim'           => $c->data_fim->format('d/m/Y'),
                'local'              => $c->local,
                'vagas_total'        => $c->vagas_total,
                'vagas_disponiveis'  => $c->vagas_disponiveis,
                'status'             => $c->status,
            ]);

        $minhasInscricoes = InscricaoCurso::with('curso')
            ->where('user_id', auth()->id())
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($i) => [
                'id'                => $i->id,
                'curso_titulo'      => $i->curso->titulo,
                'curso_data_inicio' => $i->curso->data_inicio->format('d/m/Y'),
                'nome_participante' => $i->nome_participante,
                'cpf_participante'  => $i->cpf_participante,
                'tipo'              => $i->tipo,
                'status'            => $i->status,
                'created_at'        => $i->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('Empreendedor/Cursos/Index', [
            'cursos'           => $cursos,
            'minhasInscricoes' => $minhasInscricoes,
        ]);
    }

    public function show(Curso $curso): Response
    {
        $jaInscrito = InscricaoCurso::where('user_id', auth()->id())
            ->where('curso_id', $curso->id)
            ->where('status', '!=', 'cancelada')
            ->exists();

        $inscricoesDoUsuario = InscricaoCurso::where('user_id', auth()->id())
            ->where('curso_id', $curso->id)
            ->where('status', '!=', 'cancelada')
            ->get()
            ->map(fn($i) => [
                'id'                => $i->id,
                'nome_participante' => $i->nome_participante,
                'tipo'              => $i->tipo,
                'status'            => $i->status,
            ]);

        return Inertia::render('Empreendedor/Cursos/Detalhe', [
            'curso' => [
                'id'                => $curso->id,
                'titulo'            => $curso->titulo,
                'descricao'         => $curso->descricao,
                'instrutor'         => $curso->instrutor,
                'carga_horaria'     => $curso->carga_horaria,
                'data_inicio'       => $curso->data_inicio->format('d/m/Y'),
                'data_fim'          => $curso->data_fim->format('d/m/Y'),
                'local'             => $curso->local,
                'vagas_total'       => $curso->vagas_total,
                'vagas_disponiveis' => $curso->vagas_disponiveis,
                'status'            => $curso->status,
            ],
            'jaInscrito'          => $jaInscrito,
            'inscricoesDoUsuario' => $inscricoesDoUsuario,
            'user'                => auth()->user()->only('name', 'cpf'),
        ]);
    }

    public function inscrever(Request $request, Curso $curso): RedirectResponse
    {
        $request->validate([
            'modalidade'                  => ['required', 'in:simples,empreendedor'],
            'participantes'               => ['required', 'array', 'min:1', 'max:20'],
            'participantes.*.nome'        => ['required', 'string', 'max:255'],
            'participantes.*.cpf'         => ['required', 'string', 'min:11', 'max:14'],
            'participantes.*.tipo'        => ['required', 'in:dono,funcionario'],
        ], [
            'participantes.*.nome.required' => 'Informe o nome do participante.',
            'participantes.*.cpf.required'  => 'Informe o CPF do participante.',
            'participantes.max'             => 'Máximo de 20 participantes por inscrição.',
        ]);

        $qtd = count($request->participantes);

        if ($curso->vagas_disponiveis < $qtd) {
            return back()->withErrors([
                'vagas' => $qtd === 1
                    ? 'Não há mais vagas disponíveis para este curso.'
                    : "Vagas insuficientes. Disponíveis: {$curso->vagas_disponiveis}, solicitadas: {$qtd}.",
            ]);
        }

        foreach ($request->participantes as $p) {
            InscricaoCurso::create([
                'user_id'           => auth()->id(),
                'curso_id'          => $curso->id,
                'nome_participante' => $p['nome'],
                'cpf_participante'  => preg_replace('/\D/', '', $p['cpf']),
                'tipo'              => $p['tipo'],
                'status'            => 'pendente',
            ]);
        }

        $curso->decrement('vagas_disponiveis', $qtd);

        $msg = $qtd === 1
            ? 'Inscrição realizada com sucesso!'
            : "Inscrição de {$qtd} participantes realizada com sucesso!";

        return redirect()->route('cursos.show', $curso->id)->with('sucesso', $msg);
    }

    public function cancelar(InscricaoCurso $inscricao): RedirectResponse
    {
        abort_if($inscricao->user_id !== auth()->id(), 403);
        abort_if($inscricao->status === 'cancelada', 422);

        $inscricao->update(['status' => 'cancelada']);
        $inscricao->curso->increment('vagas_disponiveis');

        return back()->with('sucesso', 'Inscrição cancelada.');
    }
}

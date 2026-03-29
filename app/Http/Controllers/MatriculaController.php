<?php

namespace App\Http\Controllers;

use App\Models\Escola;
use App\Models\Matricula;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MatriculaController extends Controller
{
    public function create(Escola $escola): Response
    {
        return Inertia::render('Educacao/Matricula', [
            'escola' => $escola->only('id', 'nome', 'series_atendidas', 'total_vagas'),
        ]);
    }

    public function store(Request $request, Escola $escola): RedirectResponse
    {
        $request->validate([
            'aluno_nome'       => ['required', 'string', 'max:255'],
            'aluno_cpf'        => ['required', 'string', 'size:14'],
            'aluno_nascimento' => ['required', 'date', 'before:today'],
            'serie_solicitada' => ['required', 'string'],
            'observacao'       => ['nullable', 'string', 'max:1000'],
        ], [
            'aluno_nome.required'       => 'Informe o nome do aluno.',
            'aluno_cpf.required'        => 'Informe o CPF do aluno.',
            'aluno_cpf.size'            => 'CPF inválido. Use o formato 000.000.000-00.',
            'aluno_nascimento.required' => 'Informe a data de nascimento.',
            'aluno_nascimento.before'   => 'A data de nascimento deve ser no passado.',
            'serie_solicitada.required' => 'Selecione a série desejada.',
        ]);

        $protocolo = $this->gerarProtocolo();

        Matricula::create([
            'user_id'          => auth()->id(),
            'escola_id'        => $escola->id,
            'aluno_nome'       => $request->aluno_nome,
            'aluno_cpf'        => $request->aluno_cpf,
            'aluno_nascimento' => $request->aluno_nascimento,
            'serie_solicitada' => $request->serie_solicitada,
            'status'           => 'pendente',
            'protocolo'        => $protocolo,
            'observacao'       => $request->observacao,
        ]);

        return redirect()->route('educacao.minhas-matriculas')
            ->with('sucesso', "Matrícula solicitada! Protocolo: {$protocolo}");
    }

    public function minhasMatriculas(): Response
    {
        $matriculas = Matricula::with('escola')
            ->where('user_id', auth()->id())
            ->latest()
            ->get()
            ->map(fn($m) => [
                'id'               => $m->id,
                'protocolo'        => $m->protocolo,
                'aluno_nome'       => $m->aluno_nome,
                'serie_solicitada' => $m->serie_solicitada,
                'status'           => $m->status,
                'escola'           => $m->escola->nome,
                'created_at'       => $m->created_at->format('d/m/Y'),
                'observacao'       => $m->observacao,
            ]);

        return Inertia::render('Educacao/MinhasMatriculas', [
            'matriculas' => $matriculas,
            'sucesso'    => session('sucesso'),
        ]);
    }

    private function gerarProtocolo(): string
    {
        $ano = now()->year;
        $ultimo = Matricula::whereYear('created_at', $ano)->count() + 1;
        return sprintf('MAT-%d-%04d', $ano, $ultimo);
    }
}

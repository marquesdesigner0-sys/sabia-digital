<?php

namespace App\Http\Controllers\Admin;

use App\Models\Matricula;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MatriculasController extends BaseAdminController
{
    public function index(): Response
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_EDUCACAO, self::ROLE_ESCOLA);

        $query = Matricula::with(['user', 'escola'])
            ->orderByRaw("CASE status WHEN 'pendente' THEN 1 WHEN 'em_analise' THEN 2 ELSE 3 END")
            ->orderByDesc('created_at');

        // Escola só vê as matrículas da sua própria escola
        if ($this->adminRole() === self::ROLE_ESCOLA && $this->adminEscolaId()) {
            $query->where('escola_id', $this->adminEscolaId());
        }

        $matriculas = $query->get()
            ->map(fn($m) => [
                'id'               => $m->id,
                'protocolo'        => $m->protocolo,
                'aluno_nome'       => $m->aluno_nome,
                'serie_solicitada' => $m->serie_solicitada,
                'status'           => $m->status,
                'observacao'       => $m->observacao,
                'created_at'       => $m->created_at->format('d/m/Y'),
                'escola'           => $m->escola?->nome,
                'responsavel'      => $m->user?->name,
                'responsavel_email'=> $m->user?->email,
            ]);

        return Inertia::render('Admin/Matriculas', [
            ...$this->baseProps(),
            'matriculas' => $matriculas,
        ]);
    }

    public function updateStatus(Request $request, Matricula $matricula)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_EDUCACAO, self::ROLE_ESCOLA);

        // Escola só pode atualizar matrículas da sua escola
        if ($this->adminRole() === self::ROLE_ESCOLA && $matricula->escola_id !== $this->adminEscolaId()) {
            abort(403);
        }

        $data = $request->validate([
            'status'     => 'required|in:pendente,em_analise,aprovada,recusada',
            'observacao' => 'nullable|string|max:500',
        ]);

        $matricula->update($data);
        return back()->with('sucesso', 'Status atualizado.');
    }
}

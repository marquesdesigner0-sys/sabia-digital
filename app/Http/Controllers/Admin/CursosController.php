<?php

namespace App\Http\Controllers\Admin;

use App\Models\Curso;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CursosController extends BaseAdminController
{
    public function index(): Response
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_EMPREENDEDOR);

        $cursos = Curso::withCount('inscricoes')
            ->orderByRaw("CASE status WHEN 'ativo' THEN 1 ELSE 2 END")
            ->orderByDesc('data_inicio')
            ->get()
            ->map(fn($c) => [
                'id'                => $c->id,
                'titulo'            => $c->titulo,
                'instrutor'         => $c->instrutor,
                'carga_horaria'     => $c->carga_horaria,
                'data_inicio'       => $c->data_inicio?->format('d/m/Y'),
                'data_fim'          => $c->data_fim?->format('d/m/Y'),
                'local'             => $c->local,
                'vagas_total'       => $c->vagas_total,
                'vagas_disponiveis' => $c->vagas_disponiveis,
                'status'            => $c->status,
                'inscricoes_count'  => $c->inscricoes_count,
            ]);

        return Inertia::render('Admin/Cursos', [
            ...$this->baseProps(),
            'cursos' => $cursos,
        ]);
    }

    public function store(Request $request)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_EMPREENDEDOR);

        $data = $request->validate([
            'titulo'            => 'required|string|max:255',
            'descricao'         => 'nullable|string',
            'instrutor'         => 'nullable|string|max:100',
            'carga_horaria'     => 'nullable|string|max:50',
            'data_inicio'       => 'nullable|date',
            'data_fim'          => 'nullable|date|after_or_equal:data_inicio',
            'local'             => 'nullable|string|max:255',
            'vagas_total'       => 'required|integer|min:1',
            'vagas_disponiveis' => 'required|integer|min:0',
            'status'            => 'required|in:ativo,encerrado',
        ]);

        Curso::create($data);
        return redirect()->route('admin.cursos.index')->with('sucesso', 'Curso criado.');
    }

    public function update(Request $request, Curso $curso)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_EMPREENDEDOR);

        $data = $request->validate([
            'titulo'            => 'required|string|max:255',
            'descricao'         => 'nullable|string',
            'instrutor'         => 'nullable|string|max:100',
            'carga_horaria'     => 'nullable|string|max:50',
            'data_inicio'       => 'nullable|date',
            'data_fim'          => 'nullable|date|after_or_equal:data_inicio',
            'local'             => 'nullable|string|max:255',
            'vagas_total'       => 'required|integer|min:1',
            'vagas_disponiveis' => 'required|integer|min:0',
            'status'            => 'required|in:ativo,encerrado',
        ]);

        $curso->update($data);
        return redirect()->route('admin.cursos.index')->with('sucesso', 'Curso atualizado.');
    }

    public function destroy(Curso $curso)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_EMPREENDEDOR);

        $curso->delete();
        return redirect()->route('admin.cursos.index')->with('sucesso', 'Curso excluído.');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Models\Telefone;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TelefonesController extends BaseAdminController
{
    const CATEGORIAS = [
        'emergencia' => 'Emergências',
        'saude'      => 'Saúde (UBS / CRAS)',
        'secretaria' => 'Secretarias Municipais',
        'educacao'   => 'Educação',
        'seguranca'  => 'Segurança Pública',
        'outros'     => 'Outros Serviços',
    ];

    public function index(): Response
    {
        $this->guardRole(self::ROLE_GERAL);

        $telefones = Telefone::orderBy('categoria')->orderBy('secretaria')->get()->map(fn($t) => [
            'id'          => $t->id,
            'secretaria'  => $t->secretaria,
            'categoria'   => $t->categoria,
            'responsavel' => $t->responsavel,
            'telefone'    => $t->telefone,
            'whatsapp'    => $t->whatsapp,
            'endereco'    => $t->endereco,
            'horario'     => $t->horario,
            'ativo'       => $t->ativo,
        ]);

        return Inertia::render('Admin/Telefones', [
            ...$this->baseProps(),
            'telefones'  => $telefones,
            'categorias' => self::CATEGORIAS,
        ]);
    }

    public function store(Request $request)
    {
        $this->guardRole(self::ROLE_GERAL);

        $data = $request->validate([
            'secretaria'  => 'required|string|max:150',
            'categoria'   => 'required|in:' . implode(',', array_keys(self::CATEGORIAS)),
            'responsavel' => 'nullable|string|max:100',
            'telefone'    => 'required|string|max:20',
            'whatsapp'    => 'nullable|string|max:20',
            'endereco'    => 'nullable|string|max:255',
            'horario'     => 'nullable|string|max:100',
        ]);

        Telefone::create($data + ['ativo' => true]);
        return redirect()->route('admin.telefones.index')->with('sucesso', 'Contato adicionado.');
    }

    public function update(Request $request, Telefone $telefone)
    {
        $this->guardRole(self::ROLE_GERAL);

        $data = $request->validate([
            'secretaria'  => 'required|string|max:150',
            'categoria'   => 'required|in:' . implode(',', array_keys(self::CATEGORIAS)),
            'responsavel' => 'nullable|string|max:100',
            'telefone'    => 'required|string|max:20',
            'whatsapp'    => 'nullable|string|max:20',
            'endereco'    => 'nullable|string|max:255',
            'horario'     => 'nullable|string|max:100',
            'ativo'       => 'boolean',
        ]);

        $telefone->update($data);
        return redirect()->route('admin.telefones.index')->with('sucesso', 'Contato atualizado.');
    }

    public function destroy(Telefone $telefone)
    {
        $this->guardRole(self::ROLE_GERAL);

        $telefone->delete();
        return redirect()->route('admin.telefones.index')->with('sucesso', 'Contato excluído.');
    }

    public function toggle(Telefone $telefone)
    {
        $this->guardRole(self::ROLE_GERAL);

        $telefone->update(['ativo' => ! $telefone->ativo]);
        return back();
    }
}

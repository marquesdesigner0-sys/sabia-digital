<?php

namespace App\Http\Controllers\Admin;

use App\Models\Escola;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EscolasController extends BaseAdminController
{
    public function index(): Response
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_EDUCACAO);

        $escolas = Escola::orderBy('nome')->get()->map(fn($e) => [
            'id'               => $e->id,
            'nome'             => $e->nome,
            'endereco'         => $e->endereco,
            'telefone'         => $e->telefone,
            'diretor'          => $e->diretor,
            'series_atendidas' => $e->series_atendidas,
            'total_vagas'      => $e->total_vagas,
            'pendentes'        => $e->matriculas()->where('status', 'pendente')->count(),
            'total_matriculas' => $e->matriculas()->count(),
            // Usuário gestor desta escola (se existir)
            'gestor'           => User::where('escola_id', $e->id)
                ->where('admin_role', 'escola')
                ->first()?->only('id', 'name', 'email'),
        ]);

        return Inertia::render('Admin/Escolas', [
            ...$this->baseProps(),
            'escolas' => $escolas,
        ]);
    }

    public function store(Request $request)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_EDUCACAO);

        $data = $request->validate([
            'nome'             => 'required|string|max:255',
            'endereco'         => 'required|string|max:255',
            'telefone'         => 'nullable|string|max:20',
            'diretor'          => 'nullable|string|max:150',
            'series_atendidas' => 'nullable|string|max:255',
            'total_vagas'      => 'required|integer|min:0',
        ]);

        Escola::create($data);
        return redirect()->route('admin.escolas.index')->with('sucesso', 'Escola cadastrada.');
    }

    public function update(Request $request, Escola $escola)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_EDUCACAO);

        $data = $request->validate([
            'nome'             => 'required|string|max:255',
            'endereco'         => 'required|string|max:255',
            'telefone'         => 'nullable|string|max:20',
            'diretor'          => 'nullable|string|max:150',
            'series_atendidas' => 'nullable|string|max:255',
            'total_vagas'      => 'required|integer|min:0',
        ]);

        $escola->update($data);
        return redirect()->route('admin.escolas.index')->with('sucesso', 'Escola atualizada.');
    }

    public function destroy(Escola $escola)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_EDUCACAO);

        $escola->delete();
        return redirect()->route('admin.escolas.index')->with('sucesso', 'Escola excluída.');
    }

    /** Atualiza apenas o total de vagas da escola. */
    public function atualizarVagas(Request $request, Escola $escola)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_EDUCACAO);

        $data = $request->validate([
            'total_vagas' => 'required|integer|min:0',
        ]);

        $escola->update($data);
        return redirect()->route('admin.escolas.index')->with('sucesso', "Vagas de {$escola->nome} atualizadas.");
    }

    /** Cria ou atualiza o gestor (login) da escola. */
    public function criarGestor(Request $request, Escola $escola)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_EDUCACAO);

        $data = $request->validate([
            'name'  => 'required|string|max:150',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore(
                User::where('escola_id', $escola->id)->where('admin_role', 'escola')->first()?->id
            )],
            'senha' => 'required|string|min:8',
        ], [
            'email.unique' => 'Este e-mail já está em uso.',
            'senha.min'    => 'A senha deve ter pelo menos 8 caracteres.',
        ]);

        // Remove gestor anterior desta escola se existir
        User::where('escola_id', $escola->id)
            ->where('admin_role', 'escola')
            ->delete();

        User::create([
            'name'       => $data['name'],
            'email'      => $data['email'],
            'password'   => Hash::make($data['senha']),
            'role'       => 'admin',
            'admin_role' => 'escola',
            'escola_id'  => $escola->id,
        ]);

        return redirect()->route('admin.escolas.index')->with('sucesso', "Acesso criado para {$escola->nome}.");
    }

    /** Remove o gestor (login) da escola. */
    public function removerGestor(Escola $escola)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_EDUCACAO);

        User::where('escola_id', $escola->id)
            ->where('admin_role', 'escola')
            ->delete();

        return redirect()->route('admin.escolas.index')->with('sucesso', 'Acesso da escola removido.');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UsuariosController extends BaseAdminController
{
    const ADMIN_ROLES = [
        'geral'        => 'Administrador Geral',
        'educacao'     => 'Secretaria de Educação',
        'secon'        => 'SECON',
        'empreendedor' => 'Sala do Empreendedor',
    ];

    public function index(): Response
    {
        $this->guardRole(self::ROLE_GERAL);

        $usuarios = User::where('role', 'admin')
            ->orderBy('name')
            ->get()
            ->map(fn($u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'email'      => $u->email,
                'admin_role' => $u->admin_role ?? 'geral',
                'created_at' => $u->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('Admin/Usuarios', [
            ...$this->baseProps(),
            'usuarios'    => $usuarios,
            'admin_roles' => self::ADMIN_ROLES,
            'meu_id'      => session('admin_id'),
        ]);
    }

    public function store(Request $request)
    {
        $this->guardRole(self::ROLE_GERAL);

        $data = $request->validate([
            'name'       => 'required|string|max:150',
            'email'      => 'required|email|unique:users,email',
            'senha'      => 'required|string|min:8',
            'admin_role' => 'required|in:' . implode(',', array_keys(self::ADMIN_ROLES)),
        ], [
            'email.unique' => 'Este e-mail já está cadastrado.',
            'senha.min'    => 'A senha deve ter pelo menos 8 caracteres.',
        ]);

        User::create([
            'name'       => $data['name'],
            'email'      => $data['email'],
            'password'   => Hash::make($data['senha']),
            'role'       => 'admin',
            'admin_role' => $data['admin_role'],
        ]);

        return redirect()->route('admin.usuarios.index')->with('sucesso', 'Usuário criado com sucesso.');
    }

    public function update(Request $request, User $usuario)
    {
        $this->guardRole(self::ROLE_GERAL);

        $data = $request->validate([
            'name'       => 'required|string|max:150',
            'email'      => ['required', 'email', Rule::unique('users', 'email')->ignore($usuario->id)],
            'admin_role' => 'required|in:' . implode(',', array_keys(self::ADMIN_ROLES)),
            'senha'      => 'nullable|string|min:8',
        ], [
            'email.unique' => 'Este e-mail já está em uso.',
            'senha.min'    => 'A senha deve ter pelo menos 8 caracteres.',
        ]);

        $update = [
            'name'       => $data['name'],
            'email'      => $data['email'],
            'admin_role' => $data['admin_role'],
        ];

        if (! empty($data['senha'])) {
            $update['password'] = Hash::make($data['senha']);
        }

        $usuario->update($update);

        // Atualiza nome na sessão se for o próprio usuário logado
        if ($usuario->id === session('admin_id')) {
            session(['admin_name' => $data['name'], 'admin_role' => $data['admin_role']]);
        }

        return redirect()->route('admin.usuarios.index')->with('sucesso', 'Usuário atualizado.');
    }

    public function destroy(User $usuario)
    {
        $this->guardRole(self::ROLE_GERAL);

        if ($usuario->id === session('admin_id')) {
            return back()->withErrors(['geral' => 'Você não pode excluir sua própria conta.']);
        }

        $usuario->delete();
        return redirect()->route('admin.usuarios.index')->with('sucesso', 'Usuário excluído.');
    }
}

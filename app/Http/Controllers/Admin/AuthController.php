<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Admin/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'senha' => 'required|string',
        ], [
            'email.required' => 'Informe o e-mail.',
            'email.email'    => 'E-mail inválido.',
            'senha.required' => 'Informe a senha.',
        ]);

        $user = User::where('email', $request->email)
            ->where('role', 'admin')
            ->first();

        if (! $user || ! Hash::check($request->senha, $user->password)) {
            return back()->withErrors(['email' => 'Credenciais inválidas ou acesso não autorizado.']);
        }

        $request->session()->put('admin_id',       $user->id);
        $request->session()->put('admin_name',     $user->name);
        $request->session()->put('admin_role',     $user->admin_role ?? 'geral');
        $request->session()->put('admin_escola_id', $user->escola_id);
        $request->session()->regenerate();

        return redirect()->route('admin.dashboard');
    }

    public function logout(Request $request)
    {
        $request->session()->forget(['admin_id', 'admin_name', 'admin_role', 'admin_escola_id']);
        return redirect()->route('admin.login');
    }
}

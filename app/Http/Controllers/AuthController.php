<?php

namespace App\Http\Controllers;

use App\Models\Consentimento;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email' => 'E-mail ou senha incorretos.',
        ])->onlyInput('email');
    }

    public function showCadastro(): Response
    {
        return Inertia::render('Auth/Cadastro');
    }

    public function cadastro(Request $request): RedirectResponse
    {
        $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'email'         => ['required', 'email', 'unique:users,email'],
            'cpf'           => ['required', 'string', 'size:14', 'unique:users,cpf'],
            'password'      => ['required', 'string', 'min:6', 'confirmed'],
            'consentimento' => ['accepted'],
        ], [
            'name.required'          => 'Informe seu nome completo.',
            'email.required'         => 'Informe seu e-mail.',
            'email.email'            => 'Informe um e-mail válido.',
            'email.unique'           => 'Este e-mail já está cadastrado.',
            'cpf.required'           => 'Informe seu CPF.',
            'cpf.size'               => 'CPF inválido. Use o formato 000.000.000-00.',
            'cpf.unique'             => 'Este CPF já possui uma conta cadastrada.',
            'password.required'      => 'Informe uma senha.',
            'password.min'           => 'A senha deve ter pelo menos 6 caracteres.',
            'password.confirmed'     => 'As senhas não conferem.',
            'consentimento.accepted' => 'Você precisa aceitar o termo para continuar.',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'cpf'      => $request->cpf,
            'password' => $request->password,
            'role'     => 'cidadao',
        ]);

        Consentimento::create([
            'user_id'   => $user->id,
            'tipo'      => 'identificacao',
            'aceito'    => true,
            'aceito_em' => now(),
            'ip_address' => $request->ip(),
        ]);

        Consentimento::create([
            'user_id'    => $user->id,
            'tipo'       => 'notificacoes',
            'aceito'     => false,
            'aceito_em'  => null,
            'ip_address' => $request->ip(),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect('/');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}

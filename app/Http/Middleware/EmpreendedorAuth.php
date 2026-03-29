<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EmpreendedorAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->session()->has('estabelecimento_id')) {
            return redirect()->route('empreendedor.login');
        }

        return $next($request);
    }
}

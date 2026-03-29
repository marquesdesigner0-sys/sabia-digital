<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

abstract class BaseAdminController extends Controller
{
    // Roles com acesso total
    const ROLE_GERAL        = 'geral';
    const ROLE_EDUCACAO     = 'educacao';
    const ROLE_SECON        = 'secon';
    const ROLE_EMPREENDEDOR = 'empreendedor';
    const ROLE_ESCOLA       = 'escola';

    protected function adminRole(): string
    {
        return session('admin_role', 'geral');
    }

    protected function adminName(): string
    {
        return session('admin_name', '');
    }

    protected function adminEscolaId(): ?int
    {
        return session('admin_escola_id');
    }

    /** Aborta com 403 se o role atual não estiver na lista permitida. */
    protected function guardRole(string ...$roles): void
    {
        if (! in_array($this->adminRole(), $roles)) {
            abort(403, 'Acesso não autorizado para seu nível de permissão.');
        }
    }

    /** Dados base compartilhados por todas as páginas admin. */
    protected function baseProps(): array
    {
        return [
            'adminName' => $this->adminName(),
            'adminRole' => $this->adminRole(),
        ];
    }
}

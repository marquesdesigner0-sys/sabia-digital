<?php

namespace App\Http\Controllers\Admin;

use App\Models\Estabelecimento;
use Inertia\Inertia;
use Inertia\Response;

class EstabelecimentosController extends BaseAdminController
{
    public function index(): Response
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_EMPREENDEDOR);

        $estabelecimentos = Estabelecimento::with('user')
            ->orderByRaw("CASE status WHEN 'pendente' THEN 1 WHEN 'ativo' THEN 2 ELSE 3 END")
            ->orderBy('nome')
            ->get()
            ->map(fn($e) => [
                'id'          => $e->id,
                'nome'        => $e->nome,
                'categoria'   => $e->categoria,
                'status'      => $e->status,
                'whatsapp'    => $e->whatsapp,
                'aprovado_em' => $e->aprovado_em?->format('d/m/Y'),
                'created_at'  => $e->created_at->format('d/m/Y'),
                'dono'        => $e->user?->name,
                'dono_email'  => $e->user?->email,
            ]);

        return Inertia::render('Admin/Estabelecimentos', [
            ...$this->baseProps(),
            'estabelecimentos' => $estabelecimentos,
        ]);
    }

    public function aprovar(Estabelecimento $estabelecimento)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_EMPREENDEDOR);

        $estabelecimento->update(['status' => 'ativo', 'aprovado_em' => now()]);
        return back()->with('sucesso', 'Estabelecimento aprovado.');
    }

    public function inativar(Estabelecimento $estabelecimento)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_EMPREENDEDOR);

        $estabelecimento->update(['status' => 'inativo']);
        return back()->with('sucesso', 'Estabelecimento inativado.');
    }
}

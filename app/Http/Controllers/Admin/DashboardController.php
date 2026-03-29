<?php

namespace App\Http\Controllers\Admin;

use App\Models\Curso;
use App\Models\Escola;
use App\Models\Estabelecimento;
use App\Models\Matricula;
use App\Models\Noticia;
use App\Models\Telefone;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends BaseAdminController
{
    public function index(): Response
    {
        $role = $this->adminRole();

        $indicadores = [];
        $dados       = [];

        // ── Escola individual ─────────────────────────────────────────────────
        if ($role === self::ROLE_ESCOLA) {
            $escolaId = $this->adminEscolaId();
            $escola   = $escolaId ? \App\Models\Escola::find($escolaId) : null;

            if ($escola) {
                $porStatus = Matricula::where('escola_id', $escolaId)
                    ->selectRaw('status, count(*) as total')
                    ->groupBy('status')
                    ->pluck('total', 'status')
                    ->toArray();

                $dados['escola'] = [
                    'escola_nome'         => $escola->nome,
                    'escola_id'           => $escola->id,
                    'total_vagas'         => $escola->total_vagas,
                    'por_status'          => $porStatus,
                    'total'               => array_sum($porStatus),
                    'aprovadas_mes'       => Matricula::where('escola_id', $escolaId)
                        ->where('status', 'aprovada')
                        ->whereMonth('updated_at', now()->month)
                        ->whereYear('updated_at', now()->year)
                        ->count(),
                    'pendentes_antigos'   => Matricula::where('escola_id', $escolaId)
                        ->where('status', 'pendente')
                        ->where('created_at', '<', now()->subDays(3))
                        ->count(),
                    'por_serie'           => Matricula::where('escola_id', $escolaId)
                        ->selectRaw('serie_solicitada, count(*) as total')
                        ->groupBy('serie_solicitada')
                        ->orderBy('serie_solicitada')
                        ->pluck('total', 'serie_solicitada')
                        ->toArray(),
                ];

                $indicadores['matriculas_pendentes']  = $porStatus['pendente']   ?? 0;
                $indicadores['matriculas_em_analise'] = $porStatus['em_analise'] ?? 0;
            }
        }

        // ── Educação ─────────────────────────────────────────────────────────
        if (in_array($role, [self::ROLE_GERAL, self::ROLE_EDUCACAO])) {
            $porStatus = Matricula::selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status')
                ->toArray();

            $indicadores['matriculas_pendentes']  = $porStatus['pendente']   ?? 0;
            $indicadores['matriculas_em_analise'] = $porStatus['em_analise'] ?? 0;

            $escolas = Escola::orderBy('nome')->get()->map(fn($e) => [
                'id'          => $e->id,
                'nome'        => $e->nome,
                'total_vagas' => $e->total_vagas,
                'series'      => $e->series_atendidas,
                'pendentes'   => $e->matriculas()->where('status', 'pendente')->count(),
                'em_analise'  => $e->matriculas()->where('status', 'em_analise')->count(),
                'aprovadas'   => $e->matriculas()->where('status', 'aprovada')->count(),
                'recusadas'   => $e->matriculas()->where('status', 'recusada')->count(),
            ]);

            $dados['educacao'] = [
                'por_status'          => $porStatus,
                'total'               => array_sum($porStatus),
                'aprovadas_mes'       => Matricula::where('status', 'aprovada')
                    ->whereMonth('updated_at', now()->month)
                    ->whereYear('updated_at',  now()->year)
                    ->count(),
                'pendentes_antigos'   => Matricula::where('status', 'pendente')
                    ->where('created_at', '<', now()->subDays(3))
                    ->count(),
                'renovacoes_pendentes'=> Matricula::whereNotNull('renovacao_de')
                    ->where('status', 'pendente')
                    ->count(),
                'escolas'             => $escolas->toArray(),
                'por_serie'           => Matricula::selectRaw('serie_solicitada, count(*) as total')
                    ->groupBy('serie_solicitada')
                    ->orderBy('serie_solicitada')
                    ->pluck('total', 'serie_solicitada')
                    ->toArray(),
            ];
        }

        // ── SECON ─────────────────────────────────────────────────────────────
        if (in_array($role, [self::ROLE_GERAL, self::ROLE_SECON])) {
            $indicadores['noticias_publicadas'] = Noticia::where('publicado', true)->count();
            $indicadores['noticias_rascunho']   = Noticia::where('publicado', false)->count();
            $indicadores['noticias_destaque']   = Noticia::where('destaque', true)->count();
        }

        // ── Empreendedor ──────────────────────────────────────────────────────
        if (in_array($role, [self::ROLE_GERAL, self::ROLE_EMPREENDEDOR])) {
            $indicadores['estabelecimentos_pendentes'] = Estabelecimento::where('status', 'pendente')->count();
            $indicadores['cursos_ativos']              = Curso::where('status', 'ativo')->count();
        }

        // ── Geral ─────────────────────────────────────────────────────────────
        if ($role === self::ROLE_GERAL) {
            $indicadores['telefones_ativos'] = Telefone::where('ativo', true)->count();
        }

        return Inertia::render('Admin/Dashboard', [
            ...$this->baseProps(),
            'indicadores' => $indicadores,
            'dados'       => $dados,
        ]);
    }
}

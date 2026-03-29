<?php

namespace App\Http\Controllers\Admin;

use App\Models\Curso;
use App\Models\Estabelecimento;
use App\Models\InscricaoCurso;
use App\Models\Matricula;
use App\Models\Noticia;
use Inertia\Inertia;
use Inertia\Response;

class RelatoriosController extends BaseAdminController
{
    public function index(): Response
    {
        $role = $this->adminRole();
        $dados = [];

        // Educação e Geral
        if (in_array($role, [self::ROLE_GERAL, self::ROLE_EDUCACAO])) {
            $dados['matriculas'] = [
                'total'      => Matricula::count(),
                'por_status' => Matricula::selectRaw('status, count(*) as total')
                    ->groupBy('status')
                    ->pluck('total', 'status')
                    ->toArray(),
                'por_escola' => Matricula::with('escola')
                    ->selectRaw('escola_id, count(*) as total')
                    ->groupBy('escola_id')
                    ->get()
                    ->map(fn($m) => [
                        'escola' => $m->escola?->nome ?? 'Não informado',
                        'total'  => $m->total,
                    ])
                    ->sortByDesc('total')
                    ->values()
                    ->toArray(),
                'aprovadas_mes' => Matricula::where('status', 'aprovada')
                    ->whereMonth('updated_at', now()->month)
                    ->whereYear('updated_at', now()->year)
                    ->count(),
            ];
        }

        // SECON e Geral
        if (in_array($role, [self::ROLE_GERAL, self::ROLE_SECON])) {
            $dados['noticias'] = [
                'total'          => Noticia::count(),
                'publicadas'     => Noticia::where('publicado', true)->count(),
                'rascunhos'      => Noticia::where('publicado', false)->count(),
                'destaques'      => Noticia::where('destaque', true)->count(),
                'por_categoria'  => Noticia::where('publicado', true)
                    ->selectRaw('categoria, count(*) as total')
                    ->groupBy('categoria')
                    ->orderByDesc('total')
                    ->pluck('total', 'categoria')
                    ->toArray(),
                'publicadas_mes' => Noticia::where('publicado', true)
                    ->whereMonth('publicado_em', now()->month)
                    ->whereYear('publicado_em', now()->year)
                    ->count(),
            ];
        }

        // Empreendedor e Geral
        if (in_array($role, [self::ROLE_GERAL, self::ROLE_EMPREENDEDOR])) {
            $dados['estabelecimentos'] = [
                'total'      => Estabelecimento::count(),
                'por_status' => Estabelecimento::selectRaw('status, count(*) as total')
                    ->groupBy('status')
                    ->pluck('total', 'status')
                    ->toArray(),
                'por_categoria' => Estabelecimento::where('status', 'ativo')
                    ->selectRaw('categoria, count(*) as total')
                    ->groupBy('categoria')
                    ->orderByDesc('total')
                    ->pluck('total', 'categoria')
                    ->toArray(),
            ];

            $dados['cursos'] = [
                'total'            => Curso::count(),
                'ativos'           => Curso::where('status', 'ativo')->count(),
                'encerrados'       => Curso::where('status', 'encerrado')->count(),
                'total_inscricoes' => InscricaoCurso::count(),
                'por_curso'        => Curso::withCount('inscricoes')
                    ->orderByDesc('inscricoes_count')
                    ->limit(10)
                    ->get()
                    ->map(fn($c) => [
                        'titulo'    => $c->titulo,
                        'inscritos' => $c->inscricoes_count,
                        'vagas'     => $c->vagas_total,
                    ])
                    ->toArray(),
            ];
        }

        return Inertia::render('Admin/Relatorios', [
            ...$this->baseProps(),
            'dados'    => $dados,
            'mes_ano'  => now()->translatedFormat('F \d\e Y'),
        ]);
    }
}

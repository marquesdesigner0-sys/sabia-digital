<?php

namespace App\Http\Controllers;

use App\Models\Escola;
use App\Models\VagaPorSerie;
use Inertia\Inertia;
use Inertia\Response;

class EscolaController extends Controller
{
    public function index(): Response
    {
        $escolas = Escola::orderBy('nome')
            ->get()
            ->map(fn($e) => [
                'id'               => $e->id,
                'nome'             => $e->nome,
                'endereco'         => $e->endereco,
                'telefone'         => $e->telefone,
                'diretor'          => $e->diretor,
                'series_atendidas' => $e->series_atendidas,
                'total_vagas'      => $e->total_vagas,
                'vagas_ocupadas'   => $e->matriculas()->whereIn('status', ['aprovada', 'em_analise'])->count(),
                'latitude'         => $e->latitude ? (float) $e->latitude : null,
                'longitude'        => $e->longitude ? (float) $e->longitude : null,
            ]);

        return Inertia::render('Educacao/Index', [
            'escolas' => $escolas,
        ]);
    }

    public function vagas(Escola $escola): Response
    {
        $vagasPorSerie = VagaPorSerie::where('escola_id', $escola->id)
            ->orderBy('serie')
            ->get()
            ->map(fn($v) => [
                'serie'     => $v->serie,
                'total'     => $v->total,
                'ocupadas'  => $escola->matriculas()
                    ->whereIn('status', ['aprovada', 'em_analise'])
                    ->where('serie_solicitada', $v->serie)
                    ->count(),
            ])
            ->map(fn($v) => array_merge($v, ['disponiveis' => max(0, $v['total'] - $v['ocupadas'])]));

        return Inertia::render('Educacao/Vagas', [
            'escola' => $escola->only('id', 'nome', 'endereco', 'telefone', 'diretor', 'total_vagas'),
            'vagas'  => $vagasPorSerie,
        ]);
    }
}

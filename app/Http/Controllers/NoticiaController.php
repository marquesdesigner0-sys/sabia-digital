<?php

namespace App\Http\Controllers;

use App\Models\ColetaUrbana;
use App\Models\Noticia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class NoticiaController extends Controller
{
    // Categorias com impacto direto no cidadão
    const CATEGORIAS = [
        'saude'          => 'Saúde',
        'educacao'       => 'Educação',
        'assistencia'    => 'Assistência Social',
        'infraestrutura' => 'Infraestrutura',
        'meio_ambiente'  => 'Meio Ambiente',
        'esporte_lazer'  => 'Esporte e Lazer',
        'cultura_turismo'=> 'Cultura e Turismo',
        'desenvolvimento'=> 'Desenvolvimento Econômico',
        'mulheres'       => 'Políticas para Mulheres',
        'coleta_urbana'  => 'Coleta Urbana',
    ];

    public function index(Request $request): Response
    {
        $categoria = $request->query('categoria', 'saude');

        // Garantir que a categoria é válida
        if (! array_key_exists($categoria, self::CATEGORIAS)) {
            $categoria = 'saude';
        }

        $noticias = Noticia::where('publicado', true)
            ->where('categoria', $categoria)
            ->orderByDesc('publicado_em')
            ->get()
            ->map(fn($n) => [
                'id'           => $n->id,
                'titulo'       => $n->titulo,
                'resumo'       => $n->resumo,
                'categoria'    => $n->categoria,
                'imagem'       => $n->imagem ? Storage::url($n->imagem) : null,
                'publicado_em' => $n->publicado_em?->format('d/m/Y'),
            ]);

        // Contagem por categoria para badges
        $contagens = Noticia::where('publicado', true)
            ->selectRaw('categoria, count(*) as total')
            ->groupBy('categoria')
            ->pluck('total', 'categoria')
            ->toArray();

        // Dados extras para Coleta Urbana
        $cronograma = null;
        if ($categoria === 'coleta_urbana') {
            $cronograma = ColetaUrbana::where('ativo', true)
                ->orderBy('bairro')
                ->get()
                ->map(fn($c) => [
                    'id'          => $c->id,
                    'bairro'      => $c->bairro,
                    'ruas'        => $c->ruas,
                    'dias_semana' => $c->dias_semana,
                    'horario'     => $c->horario,
                    'observacao'  => $c->observacao,
                ])->values();
        }

        return Inertia::render('Noticias/Index', [
            'noticias'   => $noticias,
            'categoria'  => $categoria,
            'contagens'  => $contagens,
            'cronograma' => $cronograma,
        ]);
    }

    public function show(Noticia $noticia): Response
    {
        abort_if(! $noticia->publicado, 404);

        $relacionadas = Noticia::where('publicado', true)
            ->where('categoria', $noticia->categoria)
            ->where('id', '!=', $noticia->id)
            ->orderByDesc('publicado_em')
            ->limit(3)
            ->get()
            ->map(fn($n) => [
                'id'           => $n->id,
                'titulo'       => $n->titulo,
                'resumo'       => $n->resumo,
                'imagem'       => $n->imagem ? Storage::url($n->imagem) : null,
                'publicado_em' => $n->publicado_em?->format('d/m/Y'),
            ]);

        return Inertia::render('Noticias/Detalhe', [
            'noticia' => [
                'id'           => $noticia->id,
                'titulo'       => $noticia->titulo,
                'conteudo'     => $noticia->conteudo,
                'resumo'       => $noticia->resumo,
                'categoria'    => $noticia->categoria,
                'imagem'       => $noticia->imagem ? Storage::url($noticia->imagem) : null,
                'publicado_em' => $noticia->publicado_em?->format('d/m/Y \à\s H:i'),
            ],
            'relacionadas' => $relacionadas,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Telefone;
use Inertia\Inertia;
use Inertia\Response;

class TelefoneController extends Controller
{
    const CATEGORIAS = [
        'emergencia'  => ['label' => 'Emergências',              'emoji' => '🚨'],
        'saude'       => ['label' => 'Saúde (UBS / CRAS)',       'emoji' => '🏥'],
        'secretaria'  => ['label' => 'Secretarias Municipais',   'emoji' => '🏛️'],
        'educacao'    => ['label' => 'Educação',                 'emoji' => '🎒'],
        'seguranca'   => ['label' => 'Segurança Pública',        'emoji' => '🚔'],
        'outros'      => ['label' => 'Outros Serviços',          'emoji' => '📋'],
    ];

    public function index(): Response
    {
        $telefones = Telefone::where('ativo', true)
            ->orderByRaw("CASE categoria
                WHEN 'emergencia' THEN 1
                WHEN 'saude'      THEN 2
                WHEN 'secretaria' THEN 3
                WHEN 'educacao'   THEN 4
                WHEN 'seguranca'  THEN 5
                ELSE 6 END")
            ->orderBy('secretaria')
            ->get()
            ->map(fn($t) => [
                'id'          => $t->id,
                'secretaria'  => $t->secretaria,
                'categoria'   => $t->categoria,
                'responsavel' => $t->responsavel,
                'telefone'    => $t->telefone,
                'whatsapp'    => $t->whatsapp,
                'endereco'    => $t->endereco,
                'horario'     => $t->horario,
            ]);

        // Agrupa por categoria mantendo a ordem definida acima
        $grupos = [];
        foreach ($telefones as $t) {
            $grupos[$t['categoria']][] = $t;
        }

        $categoriasOrdenadas = array_map(
            fn($key) => [
                'key'      => $key,
                'label'    => self::CATEGORIAS[$key]['label'] ?? ucfirst($key),
                'emoji'    => self::CATEGORIAS[$key]['emoji'] ?? '📞',
                'itens'    => $grupos[$key],
            ],
            array_keys($grupos)
        );

        return Inertia::render('Telefones/Index', [
            'grupos' => $categoriasOrdenadas,
        ]);
    }
}

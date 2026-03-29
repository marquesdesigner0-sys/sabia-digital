<?php

namespace App\Http\Controllers;

use App\Models\EventoEscolar;
use Inertia\Inertia;
use Inertia\Response;

class CalendarioEscolarController extends Controller
{
    public function index(): Response
    {
        $eventos = EventoEscolar::orderBy('data_inicio')
            ->get()
            ->map(fn($e) => [
                'id'          => $e->id,
                'titulo'      => $e->titulo,
                'data_inicio' => $e->data_inicio->format('Y-m-d'),
                'data_fim'    => $e->data_fim?->format('Y-m-d'),
                'tipo'        => $e->tipo,
                'descricao'   => $e->descricao,
            ])
            ->groupBy(fn($e) => substr($e['data_inicio'], 0, 7)); // agrupa por "YYYY-MM"

        return Inertia::render('Educacao/Calendario', [
            'eventos' => $eventos,
        ]);
    }
}

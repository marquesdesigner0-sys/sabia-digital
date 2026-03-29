<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventoEscolar extends Model
{
    protected $table = 'eventos_escolares';

    protected $fillable = [
        'titulo',
        'data_inicio',
        'data_fim',
        'tipo',
        'descricao',
    ];

    protected function casts(): array
    {
        return [
            'data_inicio' => 'date',
            'data_fim'    => 'date',
        ];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ColetaUrbana extends Model
{
    protected $table = 'cronograma_coleta';

    protected $fillable = [
        'bairro',
        'ruas',
        'dias_semana',
        'horario',
        'observacao',
        'ativo',
    ];

    protected function casts(): array
    {
        return [
            'dias_semana' => 'array',
            'ativo'       => 'boolean',
        ];
    }
}

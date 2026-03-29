<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Telefone extends Model
{
    protected $fillable = [
        'secretaria',
        'categoria',
        'responsavel',
        'telefone',
        'whatsapp',
        'endereco',
        'horario',
        'ativo',
    ];

    protected function casts(): array
    {
        return [
            'ativo' => 'boolean',
        ];
    }
}

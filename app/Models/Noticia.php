<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Noticia extends Model
{
    protected $table = 'noticias';

    protected $fillable = [
        'titulo',
        'conteudo',
        'resumo',
        'categoria',
        'imagem',
        'publicado',
        'destaque',
        'publicado_em',
    ];

    protected function casts(): array
    {
        return [
            'publicado'    => 'boolean',
            'destaque'     => 'boolean',
            'publicado_em' => 'datetime',
        ];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemCardapio extends Model
{
    protected $table = 'itens_cardapio';

    protected $fillable = [
        'estabelecimento_id',
        'categoria',
        'nome',
        'descricao',
        'foto',
        'preco',
        'disponivel',
    ];

    protected function casts(): array
    {
        return [
            'preco' => 'decimal:2',
            'disponivel' => 'boolean',
        ];
    }

    public function estabelecimento(): BelongsTo
    {
        return $this->belongsTo(Estabelecimento::class);
    }
}

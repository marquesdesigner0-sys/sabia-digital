<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Estabelecimento extends Model
{
    protected $fillable = [
        'user_id',
        'nome',
        'categoria',
        'descricao',
        'whatsapp',
        'chave_pix',
        'aceita_delivery',
        'aceita_retirada',
        'taxa_entrega',
        'status',
        'aprovado_em',
    ];

    protected function casts(): array
    {
        return [
            'aceita_delivery' => 'boolean',
            'aceita_retirada' => 'boolean',
            'taxa_entrega' => 'decimal:2',
            'aprovado_em' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function itensCardapio(): HasMany
    {
        return $this->hasMany(ItemCardapio::class);
    }
}

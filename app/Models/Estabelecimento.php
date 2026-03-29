<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Estabelecimento extends Model
{
    protected $hidden = ['password'];

    protected $fillable = [
        'user_id',
        'nome',
        'cnpj',
        'nome_responsavel',
        'email_contato',
        'password',
        'categoria',
        'descricao',
        'logo',
        'whatsapp',
        'chave_pix',
        'aceita_delivery',
        'aceita_retirada',
        'taxa_entrega',
        'horario',
        'promocao',
        'promocao_imagem',
        'aberto',
        'status',
        'aprovado_em',
    ];

    protected function casts(): array
    {
        return [
            'aceita_delivery' => 'boolean',
            'aceita_retirada' => 'boolean',
            'taxa_entrega'    => 'decimal:2',
            'aberto'          => 'boolean',
            'aprovado_em'     => 'datetime',
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

    public function promocoes(): HasMany
    {
        return $this->hasMany(Promocao::class);
    }
}

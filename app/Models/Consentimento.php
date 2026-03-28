<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consentimento extends Model
{
    protected $fillable = [
        'user_id',
        'tipo',
        'aceito',
        'aceito_em',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'aceito' => 'boolean',
            'aceito_em' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

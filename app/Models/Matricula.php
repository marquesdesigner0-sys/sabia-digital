<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Matricula extends Model
{
    protected $fillable = [
        'user_id',
        'escola_id',
        'aluno_nome',
        'aluno_cpf',
        'aluno_nascimento',
        'serie_solicitada',
        'status',
        'protocolo',
        'observacao',
    ];

    protected function casts(): array
    {
        return [
            'aluno_nascimento' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function escola(): BelongsTo
    {
        return $this->belongsTo(Escola::class);
    }
}

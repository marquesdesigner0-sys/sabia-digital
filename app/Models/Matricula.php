<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'renovacao_de',
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

    public function documentos(): HasMany
    {
        return $this->hasMany(DocumentoMatricula::class);
    }
}

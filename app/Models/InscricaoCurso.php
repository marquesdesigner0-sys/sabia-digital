<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InscricaoCurso extends Model
{
    protected $table = 'inscricoes_cursos';

    protected $fillable = [
        'user_id',
        'curso_id',
        'nome_participante',
        'cpf_participante',
        'tipo',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function curso(): BelongsTo
    {
        return $this->belongsTo(Curso::class);
    }
}

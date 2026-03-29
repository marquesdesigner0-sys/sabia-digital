<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentoMatricula extends Model
{
    protected $table = 'documentos_matricula';

    protected $fillable = [
        'matricula_id',
        'user_id',
        'tipo',
        'nome_original',
        'caminho',
    ];

    public function matricula(): BelongsTo
    {
        return $this->belongsTo(Matricula::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Curso extends Model
{
    protected $fillable = [
        'titulo',
        'descricao',
        'instrutor',
        'carga_horaria',
        'data_inicio',
        'data_fim',
        'local',
        'vagas_total',
        'vagas_disponiveis',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'data_inicio' => 'date',
            'data_fim' => 'date',
        ];
    }

    public function inscricoes(): HasMany
    {
        return $this->hasMany(InscricaoCurso::class);
    }
}

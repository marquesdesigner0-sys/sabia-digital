<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Escola extends Model
{
    protected $fillable = [
        'nome',
        'endereco',
        'telefone',
        'diretor',
        'series_atendidas',
        'total_vagas',
    ];

    public function matriculas(): HasMany
    {
        return $this->hasMany(Matricula::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VagaPorSerie extends Model
{
    protected $table = 'vagas_por_serie';

    protected $fillable = [
        'escola_id',
        'serie',
        'total',
    ];

    public function escola(): BelongsTo
    {
        return $this->belongsTo(Escola::class);
    }
}

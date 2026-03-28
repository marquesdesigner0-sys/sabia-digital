<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Telefone extends Model
{
    protected $fillable = [
        'secretaria',
        'responsavel',
        'telefone',
        'whatsapp',
        'endereco',
        'horario',
    ];
}

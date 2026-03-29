<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'cpf',
        'password',
        'role',
        'admin_role',
        'escola_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function consentimentos(): HasMany
    {
        return $this->hasMany(Consentimento::class);
    }

    public function matriculas(): HasMany
    {
        return $this->hasMany(Matricula::class);
    }

    public function estabelecimentos(): HasMany
    {
        return $this->hasMany(Estabelecimento::class);
    }

    public function inscricoesCursos(): HasMany
    {
        return $this->hasMany(InscricaoCurso::class);
    }
}

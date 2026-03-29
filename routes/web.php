<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CalendarioEscolarController;
use App\Http\Controllers\EscolaController;
use App\Http\Controllers\MatriculaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Autenticação
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/cadastro', [AuthController::class, 'showCadastro']);
Route::post('/cadastro', [AuthController::class, 'cadastro']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Área autenticada
Route::middleware('auth')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Home', [
            'user' => auth()->user()->only('name', 'email', 'role'),
        ]);
    });

    // Educação
    Route::get('/educacao', [EscolaController::class, 'index'])->name('educacao.index');
    Route::get('/educacao/mapa', fn () => Inertia::render('Educacao/Mapa', [
        'escolas' => App\Models\Escola::orderBy('nome')->get()->map(fn($e) => [
            'id'           => $e->id,
            'nome'         => $e->nome,
            'endereco'     => $e->endereco,
            'total_vagas'  => $e->total_vagas,
            'vagas_ocupadas' => $e->matriculas()->whereIn('status', ['aprovada', 'em_analise'])->count(),
            'latitude'     => $e->latitude  ? (float) $e->latitude  : null,
            'longitude'    => $e->longitude ? (float) $e->longitude : null,
        ]),
    ]))->name('educacao.mapa');
    Route::get('/educacao/calendario', [CalendarioEscolarController::class, 'index'])->name('educacao.calendario');
    Route::get('/educacao/vagas/{escola}', [EscolaController::class, 'vagas'])->name('educacao.vagas');
    Route::get('/educacao/matricula/{escola}', [MatriculaController::class, 'create'])->name('educacao.matricula');
    Route::post('/educacao/matricula/{escola}', [MatriculaController::class, 'store']);
    Route::get('/educacao/minhas-matriculas', [MatriculaController::class, 'minhasMatriculas'])->name('educacao.minhas-matriculas');
});

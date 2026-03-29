<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BaiaoFoodController;
use App\Http\Controllers\CalendarioEscolarController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\DocumentoMatriculaController;
use App\Http\Controllers\EmpreendedorController;
use App\Http\Controllers\EscolaController;
use App\Http\Controllers\MatriculaController;
use App\Http\Controllers\NoticiaController;
use App\Http\Controllers\TelefoneController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\NoticiasController as AdminNoticiasController;
use App\Http\Controllers\Admin\MatriculasController as AdminMatriculasController;
use App\Http\Controllers\Admin\EstabelecimentosController as AdminEstabelecimentosController;
use App\Http\Controllers\Admin\CursosController as AdminCursosController;
use App\Http\Controllers\Admin\TelefonesController as AdminTelefonesController;
use App\Http\Controllers\Admin\UsuariosController as AdminUsuariosController;
use App\Http\Controllers\Admin\EscolasController as AdminEscolasController;
use App\Http\Controllers\Admin\RelatoriosController as AdminRelatoriosController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Autenticação cidadão
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/cadastro', [AuthController::class, 'showCadastro']);
Route::post('/cadastro', [AuthController::class, 'cadastro']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Área autenticada (cidadão)
Route::middleware('auth')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Home', [
            'user' => auth()->user()->only('name', 'email', 'role'),
        ]);
    });

    // Baião Food — vitrine pública
    Route::get('/baiao-food', [BaiaoFoodController::class, 'index'])->name('baiao-food.index');
    Route::get('/baiao-food/{estabelecimento}', [BaiaoFoodController::class, 'show'])->name('baiao-food.show');

    // Cursos e Treinamentos
    Route::get('/empreendedor/cursos', [CursoController::class, 'index'])->name('cursos.index');
    Route::get('/empreendedor/cursos/{curso}', [CursoController::class, 'show'])->name('cursos.show');
    Route::post('/empreendedor/cursos/{curso}/inscrever', [CursoController::class, 'inscrever'])->name('cursos.inscrever');
    Route::post('/empreendedor/inscricoes/{inscricao}/cancelar', [CursoController::class, 'cancelar'])->name('cursos.cancelar');

    // Empreendedor — hub (sem auth extra)
    Route::get('/empreendedor', function () {
        return Inertia::render('Empreendedor/Index', [
            'user' => auth()->user()->only('name', 'email'),
        ]);
    })->name('empreendedor.index');

    // Empreendedor — auth do estabelecimento
    Route::get('/empreendedor/login', [EmpreendedorController::class, 'showLogin'])->name('empreendedor.login');
    Route::post('/empreendedor/login', [EmpreendedorController::class, 'login'])->name('empreendedor.login.post');
    Route::post('/empreendedor/logout', [EmpreendedorController::class, 'logout'])->name('empreendedor.logout');
    Route::get('/empreendedor/cadastro', [EmpreendedorController::class, 'showCadastro'])->name('empreendedor.cadastro');
    Route::post('/empreendedor/cadastro', [EmpreendedorController::class, 'cadastrar'])->name('empreendedor.cadastrar');

    // Empreendedor — painel (requer sessão do estabelecimento)
    Route::middleware('empreendedor')->group(function () {
        Route::get('/empreendedor/painel', [EmpreendedorController::class, 'painel'])->name('empreendedor.painel');
        Route::put('/empreendedor/painel/{estabelecimento}', [EmpreendedorController::class, 'atualizar'])->name('empreendedor.atualizar');
        Route::post('/empreendedor/painel/{estabelecimento}/toggle-aberto', [EmpreendedorController::class, 'toggleAberto'])->name('empreendedor.toggle-aberto');
        Route::post('/empreendedor/painel/{estabelecimento}/itens', [EmpreendedorController::class, 'adicionarItem'])->name('empreendedor.itens.store');
        Route::post('/empreendedor/painel/{estabelecimento}/promocoes', [EmpreendedorController::class, 'adicionarPromocao'])->name('empreendedor.promocoes.store');
        Route::post('/empreendedor/promocoes/{promocao}/toggle', [EmpreendedorController::class, 'togglePromocao'])->name('empreendedor.promocoes.toggle');
        Route::delete('/empreendedor/promocoes/{promocao}', [EmpreendedorController::class, 'removerPromocao'])->name('empreendedor.promocoes.destroy');
        Route::post('/empreendedor/itens/{item}/toggle', [EmpreendedorController::class, 'toggleItem'])->name('empreendedor.itens.toggle');
        Route::post('/empreendedor/itens/{item}', [EmpreendedorController::class, 'editarItem'])->name('empreendedor.itens.update');
        Route::delete('/empreendedor/itens/{item}', [EmpreendedorController::class, 'removerItem'])->name('empreendedor.itens.destroy');
    });

    // Informações públicas — notícias, eventos, editais
    Route::get('/informacoes', [NoticiaController::class, 'index'])->name('noticias.index');
    Route::get('/informacoes/{noticia}', [NoticiaController::class, 'show'])->name('noticias.show');

    // Telefones úteis
    Route::get('/telefones', [TelefoneController::class, 'index'])->name('telefones.index');

    // Educação
    Route::get('/educacao', [EscolaController::class, 'index'])->name('educacao.index');
    Route::get('/educacao/mapa', fn () => Inertia::render('Educacao/Mapa', [
        'escolas' => App\Models\Escola::orderBy('nome')->get()->map(fn($e) => [
            'id'             => $e->id,
            'nome'           => $e->nome,
            'endereco'       => $e->endereco,
            'total_vagas'    => $e->total_vagas,
            'vagas_ocupadas' => $e->matriculas()->whereIn('status', ['aprovada', 'em_analise'])->count(),
            'latitude'       => $e->latitude  ? (float) $e->latitude  : null,
            'longitude'      => $e->longitude ? (float) $e->longitude : null,
        ]),
    ]))->name('educacao.mapa');
    Route::get('/educacao/calendario', [CalendarioEscolarController::class, 'index'])->name('educacao.calendario');
    Route::get('/educacao/vagas/{escola}', [EscolaController::class, 'vagas'])->name('educacao.vagas');
    Route::get('/educacao/matricula/{escola}', [MatriculaController::class, 'create'])->name('educacao.matricula');
    Route::post('/educacao/matricula/{escola}', [MatriculaController::class, 'store']);
    Route::get('/educacao/minhas-matriculas', [MatriculaController::class, 'minhasMatriculas'])->name('educacao.minhas-matriculas');
    Route::post('/educacao/matricula/{matricula}/renovar', [MatriculaController::class, 'renovar'])->name('educacao.matricula.renovar');
    Route::post('/educacao/matricula/{matricula}/documentos', [DocumentoMatriculaController::class, 'store'])->name('educacao.documentos.store');
    Route::delete('/educacao/documento/{documento}', [DocumentoMatriculaController::class, 'destroy'])->name('educacao.documentos.destroy');
    Route::get('/educacao/documento/{documento}/download', [DocumentoMatriculaController::class, 'download'])->name('educacao.documentos.download');
});

// ── Painel Admin — acesso isolado ─────────────────────────────────────────────
Route::prefix('admin')->name('admin.')->group(function () {

    // Login (público)
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.post');
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

    // Área protegida
    Route::middleware('admin')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // Notícias e Coleta Urbana
        Route::get('/noticias', [AdminNoticiasController::class, 'index'])->name('noticias.index');
        Route::post('/noticias', [AdminNoticiasController::class, 'store'])->name('noticias.store');
        Route::put('/noticias/{noticia}', [AdminNoticiasController::class, 'update'])->name('noticias.update');
        Route::delete('/noticias/{noticia}', [AdminNoticiasController::class, 'destroy'])->name('noticias.destroy');
        Route::post('/noticias/{noticia}/toggle-publicado', [AdminNoticiasController::class, 'togglePublicado'])->name('noticias.toggle-publicado');
        Route::post('/noticias/{noticia}/toggle-destaque', [AdminNoticiasController::class, 'toggleDestaque'])->name('noticias.toggle-destaque');

        // Coleta Urbana
        Route::post('/coleta', [AdminNoticiasController::class, 'storeColeta'])->name('coleta.store');
        Route::put('/coleta/{coleta}', [AdminNoticiasController::class, 'updateColeta'])->name('coleta.update');
        Route::delete('/coleta/{coleta}', [AdminNoticiasController::class, 'destroyColeta'])->name('coleta.destroy');

        // Matrículas
        Route::get('/matriculas', [AdminMatriculasController::class, 'index'])->name('matriculas.index');
        Route::post('/matriculas/{matricula}/status', [AdminMatriculasController::class, 'updateStatus'])->name('matriculas.status');

        // Estabelecimentos
        Route::get('/estabelecimentos', [AdminEstabelecimentosController::class, 'index'])->name('estabelecimentos.index');
        Route::post('/estabelecimentos/{estabelecimento}/aprovar', [AdminEstabelecimentosController::class, 'aprovar'])->name('estabelecimentos.aprovar');
        Route::post('/estabelecimentos/{estabelecimento}/inativar', [AdminEstabelecimentosController::class, 'inativar'])->name('estabelecimentos.inativar');

        // Cursos
        Route::get('/cursos', [AdminCursosController::class, 'index'])->name('cursos.index');
        Route::post('/cursos', [AdminCursosController::class, 'store'])->name('cursos.store');
        Route::put('/cursos/{curso}', [AdminCursosController::class, 'update'])->name('cursos.update');
        Route::delete('/cursos/{curso}', [AdminCursosController::class, 'destroy'])->name('cursos.destroy');

        // Telefones úteis
        Route::get('/telefones', [AdminTelefonesController::class, 'index'])->name('telefones.index');
        Route::post('/telefones', [AdminTelefonesController::class, 'store'])->name('telefones.store');
        Route::put('/telefones/{telefone}', [AdminTelefonesController::class, 'update'])->name('telefones.update');
        Route::delete('/telefones/{telefone}', [AdminTelefonesController::class, 'destroy'])->name('telefones.destroy');
        Route::post('/telefones/{telefone}/toggle', [AdminTelefonesController::class, 'toggle'])->name('telefones.toggle');

        // Usuários do painel
        Route::get('/usuarios', [AdminUsuariosController::class, 'index'])->name('usuarios.index');
        Route::post('/usuarios', [AdminUsuariosController::class, 'store'])->name('usuarios.store');
        Route::put('/usuarios/{usuario}', [AdminUsuariosController::class, 'update'])->name('usuarios.update');
        Route::delete('/usuarios/{usuario}', [AdminUsuariosController::class, 'destroy'])->name('usuarios.destroy');

        // Escolas
        Route::get('/escolas', [AdminEscolasController::class, 'index'])->name('escolas.index');
        Route::post('/escolas', [AdminEscolasController::class, 'store'])->name('escolas.store');
        Route::put('/escolas/{escola}', [AdminEscolasController::class, 'update'])->name('escolas.update');
        Route::delete('/escolas/{escola}', [AdminEscolasController::class, 'destroy'])->name('escolas.destroy');
        Route::put('/escolas/{escola}/vagas', [AdminEscolasController::class, 'atualizarVagas'])->name('escolas.vagas');
        Route::post('/escolas/{escola}/gestor', [AdminEscolasController::class, 'criarGestor'])->name('escolas.gestor.store');
        Route::delete('/escolas/{escola}/gestor', [AdminEscolasController::class, 'removerGestor'])->name('escolas.gestor.destroy');

        // Relatórios
        Route::get('/relatorios', [AdminRelatoriosController::class, 'index'])->name('relatorios.index');
    });
});

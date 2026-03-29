<?php

namespace App\Http\Controllers\Admin;

use App\Models\ColetaUrbana;
use App\Models\Noticia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class NoticiasController extends BaseAdminController
{
    const CATEGORIAS = [
        'saude', 'educacao', 'assistencia', 'infraestrutura',
        'meio_ambiente', 'esporte_lazer', 'cultura_turismo',
        'desenvolvimento', 'mulheres', 'coleta_urbana',
    ];

    const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    public function index(): Response
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_SECON);

        $noticias = Noticia::orderByDesc('created_at')->get()->map(fn($n) => [
            'id'           => $n->id,
            'titulo'       => $n->titulo,
            'categoria'    => $n->categoria,
            'publicado'    => $n->publicado,
            'destaque'     => $n->destaque,
            'publicado_em' => $n->publicado_em?->format('d/m/Y'),
            'imagem'       => $n->imagem ? Storage::url($n->imagem) : null,
        ]);

        $coleta = ColetaUrbana::orderBy('bairro')->get()->map(fn($c) => [
            'id'          => $c->id,
            'bairro'      => $c->bairro,
            'ruas'        => $c->ruas,
            'dias_semana' => $c->dias_semana,
            'horario'     => $c->horario,
            'observacao'  => $c->observacao,
            'ativo'       => $c->ativo,
        ]);

        return Inertia::render('Admin/Noticias', [
            ...$this->baseProps(),
            'noticias'   => $noticias,
            'coleta'     => $coleta,
            'categorias' => self::CATEGORIAS,
            'dias'       => self::DIAS,
        ]);
    }

    public function store(Request $request)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_SECON);

        $data = $request->validate([
            'titulo'       => 'required|string|max:255',
            'resumo'       => 'nullable|string|max:500',
            'conteudo'     => 'required|string',
            'categoria'    => 'required|in:' . implode(',', self::CATEGORIAS),
            'publicado'    => 'boolean',
            'destaque'     => 'boolean',
            'publicado_em' => 'nullable|date',
            'imagem'       => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('imagem')) {
            $data['imagem'] = $request->file('imagem')->store('noticias', 'public');
        }

        if (empty($data['publicado_em']) && ($data['publicado'] ?? false)) {
            $data['publicado_em'] = now();
        }

        Noticia::create($data);
        return redirect()->route('admin.noticias.index')->with('sucesso', 'Notícia criada.');
    }

    public function update(Request $request, Noticia $noticia)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_SECON);

        $data = $request->validate([
            'titulo'       => 'required|string|max:255',
            'resumo'       => 'nullable|string|max:500',
            'conteudo'     => 'required|string',
            'categoria'    => 'required|in:' . implode(',', self::CATEGORIAS),
            'publicado'    => 'boolean',
            'destaque'     => 'boolean',
            'publicado_em' => 'nullable|date',
            'imagem'       => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('imagem')) {
            if ($noticia->imagem) Storage::disk('public')->delete($noticia->imagem);
            $data['imagem'] = $request->file('imagem')->store('noticias', 'public');
        }

        $noticia->update($data);
        return redirect()->route('admin.noticias.index')->with('sucesso', 'Notícia atualizada.');
    }

    public function destroy(Noticia $noticia)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_SECON);

        if ($noticia->imagem) Storage::disk('public')->delete($noticia->imagem);
        $noticia->delete();
        return redirect()->route('admin.noticias.index')->with('sucesso', 'Notícia excluída.');
    }

    public function togglePublicado(Noticia $noticia)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_SECON);

        $noticia->publicado = ! $noticia->publicado;
        if ($noticia->publicado && ! $noticia->publicado_em) {
            $noticia->publicado_em = now();
        }
        $noticia->save();
        return back();
    }

    public function toggleDestaque(Noticia $noticia)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_SECON);

        $noticia->destaque = ! $noticia->destaque;
        $noticia->save();
        return back();
    }

    // ── Coleta Urbana ────────────────────────────────────────────────────────

    public function storeColeta(Request $request)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_SECON);

        $data = $request->validate([
            'bairro'        => 'required|string|max:100',
            'ruas'          => 'nullable|string',
            'dias_semana'   => 'required|array|min:1',
            'dias_semana.*' => 'in:' . implode(',', self::DIAS),
            'horario'       => 'nullable|string|max:50',
            'observacao'    => 'nullable|string',
        ]);

        ColetaUrbana::create($data + ['ativo' => true]);
        return redirect()->route('admin.noticias.index')->with('sucesso', 'Bairro adicionado ao cronograma.');
    }

    public function updateColeta(Request $request, ColetaUrbana $coleta)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_SECON);

        $data = $request->validate([
            'bairro'        => 'required|string|max:100',
            'ruas'          => 'nullable|string',
            'dias_semana'   => 'required|array|min:1',
            'dias_semana.*' => 'in:' . implode(',', self::DIAS),
            'horario'       => 'nullable|string|max:50',
            'observacao'    => 'nullable|string',
            'ativo'         => 'boolean',
        ]);

        $coleta->update($data);
        return redirect()->route('admin.noticias.index')->with('sucesso', 'Cronograma atualizado.');
    }

    public function destroyColeta(ColetaUrbana $coleta)
    {
        $this->guardRole(self::ROLE_GERAL, self::ROLE_SECON);

        $coleta->delete();
        return redirect()->route('admin.noticias.index')->with('sucesso', 'Registro removido.');
    }
}

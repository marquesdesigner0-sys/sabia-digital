<?php

namespace App\Http\Controllers;

use App\Models\Estabelecimento;
use App\Models\ItemCardapio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BaiaoFoodController extends Controller
{
    // ─── Área pública ────────────────────────────────────────────────────────

    public function index(): Response
    {
        $estabelecimentos = Estabelecimento::with(['itensCardapio', 'promocoes'])
            ->where('status', 'ativo')
            ->orderBy('nome')
            ->get()
            ->map(fn($e) => [
                'id'              => $e->id,
                'nome'            => $e->nome,
                'categoria'       => $e->categoria,
                'descricao'       => $e->descricao,
                'horario'         => $e->horario,
                'aberto'          => $e->aberto,
                'aceita_delivery' => $e->aceita_delivery,
                'aceita_retirada' => $e->aceita_retirada,
                'taxa_entrega'    => (float) $e->taxa_entrega,
                'logo'            => $e->logo ? Storage::url($e->logo) : null,
                'tem_whatsapp'    => ! empty($e->whatsapp),
                'tem_pix'         => ! empty($e->chave_pix),
                'total_itens'     => $e->itensCardapio->where('disponivel', true)->count(),
                'tem_promocao'    => $e->promocoes->where('ativa', true)->count() > 0,
            ]);

        return Inertia::render('BaiaoFood/Index', [
            'estabelecimentos' => $estabelecimentos,
        ]);
    }

    public function show(Estabelecimento $estabelecimento): Response
    {
        abort_if($estabelecimento->status !== 'ativo', 404);

        $estabelecimento->load('promocoes');

        $itens = $estabelecimento->itensCardapio()
            ->where('disponivel', true)
            ->orderBy('categoria')
            ->orderBy('nome')
            ->get()
            ->map(fn($i) => [
                'id'        => $i->id,
                'categoria' => $i->categoria,
                'nome'      => $i->nome,
                'descricao' => $i->descricao,
                'foto'      => $i->foto ? Storage::url($i->foto) : null,
                'preco'     => (float) $i->preco,
            ]);

        $cardapio = $itens->groupBy('categoria')->map->values()->toArray();

        return Inertia::render('BaiaoFood/Cardapio', [
            'estabelecimento' => [
                'id'              => $estabelecimento->id,
                'nome'            => $estabelecimento->nome,
                'categoria'       => $estabelecimento->categoria,
                'descricao'       => $estabelecimento->descricao,
                'logo'            => $estabelecimento->logo ? Storage::url($estabelecimento->logo) : null,
                'horario'         => $estabelecimento->horario,
                'aberto'          => $estabelecimento->aberto,
                'whatsapp'        => $estabelecimento->whatsapp,
                'chave_pix'       => $estabelecimento->chave_pix,
                'aceita_delivery' => $estabelecimento->aceita_delivery,
                'aceita_retirada' => $estabelecimento->aceita_retirada,
                'taxa_entrega'    => (float) $estabelecimento->taxa_entrega,
                'promocoes'       => $estabelecimento->promocoes
                    ->where('ativa', true)
                    ->map(fn($p) => [
                        'id'     => $p->id,
                        'tipo'   => $p->tipo,
                        'texto'  => $p->texto,
                        'imagem' => $p->imagem ? Storage::url($p->imagem) : null,
                    ])->values(),
            ],
            'cardapio' => $cardapio,
        ]);
    }

    // ─── Painel do dono ───────────────────────────────────────────────────────

    public function painel(): Response
    {
        $estabelecimento = Estabelecimento::with('itensCardapio')
            ->where('user_id', auth()->id())
            ->first();

        return Inertia::render('BaiaoFood/Painel', [
            'estabelecimento' => $estabelecimento ? [
                'id'              => $estabelecimento->id,
                'nome'            => $estabelecimento->nome,
                'categoria'       => $estabelecimento->categoria,
                'descricao'       => $estabelecimento->descricao,
                'whatsapp'        => $estabelecimento->whatsapp,
                'chave_pix'       => $estabelecimento->chave_pix,
                'aceita_delivery' => $estabelecimento->aceita_delivery,
                'aceita_retirada' => $estabelecimento->aceita_retirada,
                'taxa_entrega'    => (float) $estabelecimento->taxa_entrega,
                'horario'         => $estabelecimento->horario,
                'aberto'          => $estabelecimento->aberto,
                'status'          => $estabelecimento->status,
                'itens'           => $estabelecimento->itensCardapio->map(fn($i) => [
                    'id'         => $i->id,
                    'categoria'  => $i->categoria,
                    'nome'       => $i->nome,
                    'descricao'  => $i->descricao,
                    'preco'      => (float) $i->preco,
                    'disponivel' => $i->disponivel,
                ])->values(),
            ] : null,
            'sucesso' => session('sucesso'),
        ]);
    }

    public function cadastrar(Request $request): RedirectResponse
    {
        $request->validate([
            'nome'            => ['required', 'string', 'max:255'],
            'categoria'       => ['required', 'string', 'max:100'],
            'descricao'       => ['nullable', 'string', 'max:500'],
            'whatsapp'        => ['nullable', 'string', 'max:20'],
            'chave_pix'       => ['nullable', 'string', 'max:255'],
            'aceita_delivery' => ['boolean'],
            'aceita_retirada' => ['boolean'],
            'taxa_entrega'    => ['nullable', 'numeric', 'min:0'],
            'horario'         => ['nullable', 'string', 'max:255'],
        ], [
            'nome.required'      => 'Informe o nome do estabelecimento.',
            'categoria.required' => 'Informe a categoria.',
        ]);

        Estabelecimento::create([
            'user_id'         => auth()->id(),
            'nome'            => $request->nome,
            'categoria'       => $request->categoria,
            'descricao'       => $request->descricao,
            'whatsapp'        => $request->whatsapp,
            'chave_pix'       => $request->chave_pix,
            'aceita_delivery' => $request->boolean('aceita_delivery'),
            'aceita_retirada' => $request->boolean('aceita_retirada'),
            'taxa_entrega'    => $request->taxa_entrega ?? 0,
            'horario'         => $request->horario,
            'aberto'          => false,
            'status'          => 'pendente',
        ]);

        return redirect()->route('baiao-food.painel')
            ->with('sucesso', 'Cadastro enviado! Aguarde a aprovação da prefeitura.');
    }

    public function atualizar(Request $request, Estabelecimento $estabelecimento): RedirectResponse
    {
        abort_if($estabelecimento->user_id !== auth()->id(), 403);

        $request->validate([
            'nome'            => ['required', 'string', 'max:255'],
            'categoria'       => ['required', 'string', 'max:100'],
            'descricao'       => ['nullable', 'string', 'max:500'],
            'whatsapp'        => ['nullable', 'string', 'max:20'],
            'chave_pix'       => ['nullable', 'string', 'max:255'],
            'aceita_delivery' => ['boolean'],
            'aceita_retirada' => ['boolean'],
            'taxa_entrega'    => ['nullable', 'numeric', 'min:0'],
            'horario'         => ['nullable', 'string', 'max:255'],
        ]);

        $estabelecimento->update($request->only([
            'nome', 'categoria', 'descricao', 'whatsapp', 'chave_pix',
            'aceita_delivery', 'aceita_retirada', 'taxa_entrega', 'horario',
        ]));

        return redirect()->route('baiao-food.painel')
            ->with('sucesso', 'Dados atualizados com sucesso.');
    }

    public function toggleAberto(Estabelecimento $estabelecimento): RedirectResponse
    {
        abort_if($estabelecimento->user_id !== auth()->id(), 403);
        abort_if($estabelecimento->status !== 'ativo', 422);

        $estabelecimento->update(['aberto' => ! $estabelecimento->aberto]);

        return back()->with('sucesso', $estabelecimento->aberto ? 'Estabelecimento aberto!' : 'Estabelecimento fechado.');
    }

    public function adicionarItem(Request $request, Estabelecimento $estabelecimento): RedirectResponse
    {
        abort_if($estabelecimento->user_id !== auth()->id(), 403);

        $request->validate([
            'categoria'  => ['required', 'string', 'max:100'],
            'nome'       => ['required', 'string', 'max:255'],
            'descricao'  => ['nullable', 'string', 'max:500'],
            'preco'      => ['required', 'numeric', 'min:0'],
        ], [
            'categoria.required' => 'Informe a categoria do item.',
            'nome.required'      => 'Informe o nome do item.',
            'preco.required'     => 'Informe o preço.',
        ]);

        $estabelecimento->itensCardapio()->create([
            'categoria'  => $request->categoria,
            'nome'       => $request->nome,
            'descricao'  => $request->descricao,
            'preco'      => $request->preco,
            'disponivel' => true,
        ]);

        return back()->with('sucesso', 'Item adicionado ao cardápio.');
    }

    public function toggleItem(ItemCardapio $item): RedirectResponse
    {
        abort_if($item->estabelecimento->user_id !== auth()->id(), 403);

        $item->update(['disponivel' => ! $item->disponivel]);

        return back()->with('sucesso', $item->disponivel ? 'Item disponível.' : 'Item indisponível.');
    }

    public function removerItem(ItemCardapio $item): RedirectResponse
    {
        abort_if($item->estabelecimento->user_id !== auth()->id(), 403);

        $item->delete();

        return back()->with('sucesso', 'Item removido do cardápio.');
    }
}

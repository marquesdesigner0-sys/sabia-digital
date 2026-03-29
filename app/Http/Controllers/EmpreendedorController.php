<?php

namespace App\Http\Controllers;

use App\Models\Estabelecimento;
use App\Models\ItemCardapio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EmpreendedorController extends Controller
{
    // ─── Auth do estabelecimento ──────────────────────────────────────────────

    public function showLogin(): Response
    {
        return Inertia::render('Empreendedor/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $request->validate([
            'cnpj'     => ['required', 'string'],
            'password' => ['required', 'string'],
        ], [
            'cnpj.required'     => 'Informe o CNPJ.',
            'password.required' => 'Informe a senha.',
        ]);

        $cnpj = preg_replace('/\D/', '', $request->cnpj);

        $estabelecimento = Estabelecimento::whereRaw("regexp_replace(cnpj, '[^0-9]', '', 'g') = ?", [$cnpj])->first();

        if (! $estabelecimento || ! Hash::check($request->password, $estabelecimento->password)) {
            return back()->withErrors(['cnpj' => 'CNPJ ou senha incorretos.'])->onlyInput('cnpj');
        }

        $request->session()->put('estabelecimento_id', $estabelecimento->id);

        return redirect()->route('empreendedor.painel');
    }

    public function logout(Request $request): RedirectResponse
    {
        $request->session()->forget('estabelecimento_id');

        return redirect()->route('empreendedor.login');
    }

    public function showCadastro(): Response
    {
        return Inertia::render('Empreendedor/Cadastro');
    }

    public function cadastrar(Request $request): RedirectResponse
    {
        $request->validate([
            'nome'             => ['required', 'string', 'max:255'],
            'cnpj'             => ['required', 'string'],
            'nome_responsavel' => ['required', 'string', 'max:255'],
            'email_contato'    => ['required', 'email', 'max:255'],
            'password'         => ['required', 'string', 'min:6', 'confirmed'],
            'categoria'        => ['required', 'string'],
            'whatsapp'         => ['nullable', 'string', 'max:20'],
            'chave_pix'        => ['nullable', 'string', 'max:255'],
            'aceita_delivery'  => ['boolean'],
            'aceita_retirada'  => ['boolean'],
            'taxa_entrega'     => ['nullable', 'numeric', 'min:0'],
            'horario'          => ['nullable', 'string', 'max:255'],
        ], [
            'nome.required'             => 'Informe o nome do estabelecimento.',
            'cnpj.required'             => 'Informe o CNPJ.',
            'nome_responsavel.required' => 'Informe o nome do responsável.',
            'email_contato.required'    => 'Informe o e-mail de contato.',
            'email_contato.email'       => 'Informe um e-mail válido.',
            'password.required'         => 'Crie uma senha.',
            'password.min'              => 'A senha deve ter pelo menos 6 caracteres.',
            'password.confirmed'        => 'As senhas não conferem.',
            'categoria.required'        => 'Selecione a categoria.',
        ]);

        $cnpjLimpo = preg_replace('/\D/', '', $request->cnpj);
        $cnpjFormatado = preg_replace('/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/', '$1.$2.$3/$4-$5', $cnpjLimpo);

        if (Estabelecimento::whereRaw("regexp_replace(cnpj, '[^0-9]', '', 'g') = ?", [$cnpjLimpo])->exists()) {
            return back()->withErrors(['cnpj' => 'Este CNPJ já possui um estabelecimento cadastrado.'])->onlyInput('cnpj', 'nome', 'nome_responsavel', 'email_contato', 'categoria');
        }

        $estabelecimento = Estabelecimento::create([
            'user_id'          => auth()->id(),
            'nome'             => $request->nome,
            'cnpj'             => $cnpjFormatado,
            'nome_responsavel' => $request->nome_responsavel,
            'email_contato'    => $request->email_contato,
            'password'         => Hash::make($request->password),
            'categoria'        => $request->categoria,
            'whatsapp'         => $request->whatsapp,
            'chave_pix'        => $request->chave_pix,
            'aceita_delivery'  => $request->boolean('aceita_delivery'),
            'aceita_retirada'  => $request->boolean('aceita_retirada'),
            'taxa_entrega'     => $request->taxa_entrega ?? 0,
            'horario'          => $request->horario,
            'aberto'           => false,
            'status'           => 'pendente',
        ]);

        $request->session()->put('estabelecimento_id', $estabelecimento->id);

        return redirect()->route('empreendedor.painel')
            ->with('sucesso', 'Cadastro enviado! Aguarde a aprovação da prefeitura.');
    }

    // ─── Painel ───────────────────────────────────────────────────────────────

    public function painel(Request $request): Response
    {
        $estabelecimento = Estabelecimento::with('itensCardapio')
            ->findOrFail($request->session()->get('estabelecimento_id'));

        return Inertia::render('Empreendedor/Painel', [
            'estabelecimento' => [
                'id'              => $estabelecimento->id,
                'nome'            => $estabelecimento->nome,
                'cnpj'            => $estabelecimento->cnpj,
                'nome_responsavel' => $estabelecimento->nome_responsavel,
                'email_contato'   => $estabelecimento->email_contato,
                'categoria'       => $estabelecimento->categoria,
                'descricao'       => $estabelecimento->descricao,
                'logo'            => $estabelecimento->logo ? Storage::url($estabelecimento->logo) : null,
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
                    'foto'       => $i->foto ? Storage::url($i->foto) : null,
                    'preco'      => (float) $i->preco,
                    'disponivel' => $i->disponivel,
                ])->values(),
            ],
            'sucesso' => session('sucesso'),
        ]);
    }

    public function atualizar(Request $request, Estabelecimento $estabelecimento): RedirectResponse
    {
        abort_if($estabelecimento->id !== session('estabelecimento_id'), 403);

        $request->validate([
            'nome'             => ['required', 'string', 'max:255'],
            'nome_responsavel' => ['required', 'string', 'max:255'],
            'email_contato'    => ['required', 'email'],
            'descricao'        => ['nullable', 'string', 'max:500'],
            'whatsapp'         => ['nullable', 'string', 'max:20'],
            'chave_pix'        => ['nullable', 'string', 'max:255'],
            'aceita_delivery'  => ['boolean'],
            'aceita_retirada'  => ['boolean'],
            'taxa_entrega'     => ['nullable', 'numeric', 'min:0'],
            'horario'          => ['nullable', 'string', 'max:255'],
            'logo'             => ['nullable', 'image', 'max:2048'],
        ], [
            'logo.image' => 'O arquivo deve ser uma imagem.',
            'logo.max'   => 'A logo deve ter no máximo 2 MB.',
        ]);

        $dados = $request->only([
            'nome', 'nome_responsavel', 'email_contato', 'descricao',
            'whatsapp', 'chave_pix', 'aceita_delivery', 'aceita_retirada',
            'taxa_entrega', 'horario',
        ]);

        if ($request->hasFile('logo')) {
            if ($estabelecimento->logo) {
                Storage::disk('public')->delete($estabelecimento->logo);
            }
            $dados['logo'] = $request->file('logo')->store('logos', 'public');
        }

        $estabelecimento->update($dados);

        return back()->with('sucesso', 'Dados atualizados com sucesso.');
    }

    public function toggleAberto(Estabelecimento $estabelecimento): RedirectResponse
    {
        abort_if($estabelecimento->id !== session('estabelecimento_id'), 403);
        abort_if($estabelecimento->status !== 'ativo', 422);

        $estabelecimento->update(['aberto' => ! $estabelecimento->aberto]);

        return back();
    }

    public function adicionarItem(Request $request, Estabelecimento $estabelecimento): RedirectResponse
    {
        abort_if($estabelecimento->id !== session('estabelecimento_id'), 403);

        $request->validate([
            'categoria' => ['required', 'string', 'max:100'],
            'nome'      => ['required', 'string', 'max:255'],
            'descricao' => ['nullable', 'string', 'max:500'],
            'preco'     => ['required', 'numeric', 'min:0'],
            'foto'      => ['nullable', 'image', 'max:2048'],
        ], [
            'categoria.required' => 'Selecione a categoria do item.',
            'nome.required'      => 'Informe o nome do item.',
            'preco.required'     => 'Informe o preço.',
            'foto.image'         => 'O arquivo deve ser uma imagem.',
            'foto.max'           => 'A foto deve ter no máximo 2 MB.',
        ]);

        $foto = $request->hasFile('foto')
            ? $request->file('foto')->store('cardapio', 'public')
            : null;

        $estabelecimento->itensCardapio()->create([
            'categoria'  => $request->categoria,
            'nome'       => $request->nome,
            'descricao'  => $request->descricao,
            'foto'       => $foto,
            'preco'      => $request->preco,
            'disponivel' => true,
        ]);

        return back()->with('sucesso', 'Item adicionado ao cardápio.');
    }

    public function editarItem(Request $request, ItemCardapio $item): RedirectResponse
    {
        abort_if($item->estabelecimento->id !== session('estabelecimento_id'), 403);

        $request->validate([
            'categoria' => ['required', 'string', 'max:100'],
            'nome'      => ['required', 'string', 'max:255'],
            'descricao' => ['nullable', 'string', 'max:500'],
            'preco'     => ['required', 'numeric', 'min:0'],
            'foto'      => ['nullable', 'image', 'max:2048'],
            'remover_foto' => ['nullable', 'boolean'],
        ], [
            'categoria.required' => 'Selecione a categoria do item.',
            'nome.required'      => 'Informe o nome do item.',
            'preco.required'     => 'Informe o preço.',
            'foto.image'         => 'O arquivo deve ser uma imagem.',
            'foto.max'           => 'A foto deve ter no máximo 2 MB.',
        ]);

        $dados = [
            'categoria' => $request->categoria,
            'nome'      => $request->nome,
            'descricao' => $request->descricao,
            'preco'     => $request->preco,
        ];

        if ($request->hasFile('foto')) {
            if ($item->foto) {
                Storage::disk('public')->delete($item->foto);
            }
            $dados['foto'] = $request->file('foto')->store('cardapio', 'public');
        } elseif ($request->boolean('remover_foto') && $item->foto) {
            Storage::disk('public')->delete($item->foto);
            $dados['foto'] = null;
        }

        $item->update($dados);

        return back()->with('sucesso', 'Item atualizado com sucesso.');
    }

    public function toggleItem(ItemCardapio $item): RedirectResponse
    {
        abort_if($item->estabelecimento->id !== session('estabelecimento_id'), 403);

        $item->update(['disponivel' => ! $item->disponivel]);

        return back();
    }

    public function removerItem(ItemCardapio $item): RedirectResponse
    {
        abort_if($item->estabelecimento->id !== session('estabelecimento_id'), 403);

        if ($item->foto) {
            Storage::disk('public')->delete($item->foto);
        }
        $item->delete();

        return back()->with('sucesso', 'Item removido.');
    }
}

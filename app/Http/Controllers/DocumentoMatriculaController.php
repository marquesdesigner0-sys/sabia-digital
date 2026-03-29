<?php

namespace App\Http\Controllers;

use App\Models\DocumentoMatricula;
use App\Models\Matricula;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentoMatriculaController extends Controller
{
    public function store(Request $request, Matricula $matricula): RedirectResponse
    {
        abort_if($matricula->user_id !== auth()->id(), 403);
        abort_if($matricula->status === 'recusada', 422);

        $request->validate([
            'tipo'    => ['required', 'string'],
            'arquivo' => ['required', 'file', 'max:5120', 'mimes:pdf,jpg,jpeg,png'],
        ], [
            'tipo.required'    => 'Selecione o tipo de documento.',
            'arquivo.required' => 'Selecione um arquivo.',
            'arquivo.max'      => 'O arquivo deve ter no máximo 5 MB.',
            'arquivo.mimes'    => 'Apenas PDF, JPG e PNG são aceitos.',
        ]);

        $path = $request->file('arquivo')->store("documentos-matricula/{$matricula->id}");

        DocumentoMatricula::create([
            'matricula_id'  => $matricula->id,
            'user_id'       => auth()->id(),
            'tipo'          => $request->tipo,
            'nome_original' => $request->file('arquivo')->getClientOriginalName(),
            'caminho'       => $path,
        ]);

        return back()->with('sucesso', 'Documento anexado com sucesso.');
    }

    public function destroy(DocumentoMatricula $documento): RedirectResponse
    {
        abort_if($documento->user_id !== auth()->id(), 403);

        Storage::delete($documento->caminho);
        $documento->delete();

        return back()->with('sucesso', 'Documento removido.');
    }

    public function download(DocumentoMatricula $documento): StreamedResponse
    {
        abort_if($documento->user_id !== auth()->id(), 403);

        return Storage::download($documento->caminho, $documento->nome_original);
    }
}

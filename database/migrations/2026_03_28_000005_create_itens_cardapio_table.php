<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itens_cardapio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estabelecimento_id')->constrained()->onDelete('cascade');
            $table->string('categoria');
            $table->string('nome');
            $table->text('descricao')->nullable();
            $table->decimal('preco', 8, 2);
            $table->boolean('disponivel')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('itens_cardapio');
    }
};

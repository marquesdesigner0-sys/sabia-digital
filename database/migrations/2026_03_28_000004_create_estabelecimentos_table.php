<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('estabelecimentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nome');
            $table->string('categoria');
            $table->text('descricao')->nullable();
            $table->string('whatsapp', 20)->nullable();
            $table->string('chave_pix')->nullable();
            $table->boolean('aceita_delivery')->default(false);
            $table->boolean('aceita_retirada')->default(false);
            $table->decimal('taxa_entrega', 8, 2)->default(0);
            $table->enum('status', ['pendente', 'ativo', 'inativo'])->default('pendente');
            $table->timestamp('aprovado_em')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('estabelecimentos');
    }
};

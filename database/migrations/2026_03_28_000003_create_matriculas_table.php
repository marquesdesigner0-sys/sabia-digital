<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matriculas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('escola_id')->constrained()->onDelete('cascade');
            $table->string('aluno_nome');
            $table->string('aluno_cpf', 14);
            $table->date('aluno_nascimento');
            $table->string('serie_solicitada');
            $table->enum('status', ['pendente', 'em_analise', 'aprovada', 'recusada'])->default('pendente');
            $table->string('protocolo')->unique();
            $table->text('observacao')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matriculas');
    }
};

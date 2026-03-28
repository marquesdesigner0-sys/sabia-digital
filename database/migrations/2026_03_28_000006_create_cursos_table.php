<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cursos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('descricao')->nullable();
            $table->string('instrutor')->nullable();
            $table->integer('carga_horaria');
            $table->date('data_inicio');
            $table->date('data_fim');
            $table->string('local');
            $table->integer('vagas_total');
            $table->integer('vagas_disponiveis');
            $table->enum('status', ['ativo', 'encerrado'])->default('ativo');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cursos');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cronograma_coleta', function (Blueprint $table) {
            $table->id();
            $table->string('bairro');
            $table->text('ruas')->nullable();         // lista de ruas do bairro (texto livre)
            $table->json('dias_semana');              // ex: ["Segunda","Quarta","Sexta"]
            $table->string('horario', 50)->nullable(); // ex: "a partir das 7h"
            $table->text('observacao')->nullable();
            $table->boolean('ativo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cronograma_coleta');
    }
};

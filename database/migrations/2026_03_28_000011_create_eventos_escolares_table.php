<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('eventos_escolares', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->date('data_inicio');
            $table->date('data_fim')->nullable();
            $table->enum('tipo', ['aula', 'feriado', 'recesso', 'evento', 'reuniao'])->default('evento');
            $table->text('descricao')->nullable();
            $table->timestamps();
        });

        Schema::create('vagas_por_serie', function (Blueprint $table) {
            $table->id();
            $table->foreignId('escola_id')->constrained()->onDelete('cascade');
            $table->string('serie');
            $table->integer('total')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vagas_por_serie');
        Schema::dropIfExists('eventos_escolares');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('telefones', function (Blueprint $table) {
            $table->id();
            $table->string('secretaria');
            $table->string('responsavel')->nullable();
            $table->string('telefone', 20);
            $table->string('whatsapp', 20)->nullable();
            $table->string('endereco')->nullable();
            $table->string('horario')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('telefones');
    }
};

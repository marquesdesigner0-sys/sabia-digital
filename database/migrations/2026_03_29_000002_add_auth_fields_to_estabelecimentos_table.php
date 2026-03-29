<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('estabelecimentos', function (Blueprint $table) {
            $table->string('cnpj', 18)->nullable()->unique()->after('nome');
            $table->string('nome_responsavel')->nullable()->after('cnpj');
            $table->string('email_contato')->nullable()->after('nome_responsavel');
            $table->string('password')->nullable()->after('email_contato');
        });
    }

    public function down(): void
    {
        Schema::table('estabelecimentos', function (Blueprint $table) {
            $table->dropColumn(['cnpj', 'nome_responsavel', 'email_contato', 'password']);
        });
    }
};

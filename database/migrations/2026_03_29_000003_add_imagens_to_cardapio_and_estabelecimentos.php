<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('estabelecimentos', function (Blueprint $table) {
            $table->string('logo')->nullable()->after('descricao');
        });

        Schema::table('itens_cardapio', function (Blueprint $table) {
            $table->string('foto')->nullable()->after('descricao');
        });
    }

    public function down(): void
    {
        Schema::table('estabelecimentos', function (Blueprint $table) {
            $table->dropColumn('logo');
        });
        Schema::table('itens_cardapio', function (Blueprint $table) {
            $table->dropColumn('foto');
        });
    }
};

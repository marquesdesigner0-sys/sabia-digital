<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('telefones', function (Blueprint $table) {
            $table->string('categoria')->default('secretaria')->after('secretaria');
            $table->boolean('ativo')->default(true)->after('horario');
        });
    }

    public function down(): void
    {
        Schema::table('telefones', function (Blueprint $table) {
            $table->dropColumn(['categoria', 'ativo']);
        });
    }
};

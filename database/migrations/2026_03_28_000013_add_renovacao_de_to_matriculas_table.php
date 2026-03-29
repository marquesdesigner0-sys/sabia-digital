<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('matriculas', function (Blueprint $table) {
            $table->foreignId('renovacao_de')
                  ->nullable()
                  ->after('observacao')
                  ->constrained('matriculas')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('matriculas', function (Blueprint $table) {
            $table->dropForeign(['renovacao_de']);
            $table->dropColumn('renovacao_de');
        });
    }
};

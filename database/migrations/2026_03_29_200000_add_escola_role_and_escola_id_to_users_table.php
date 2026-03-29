<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // PostgreSQL não permite adicionar valor a enum existente com ALTER COLUMN direto.
        // A coluna foi criada como varchar com CHECK constraint pelo Laravel.
        // Precisamos recriar a constraint com o novo valor 'escola'.
        DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_admin_role_check");
        DB::statement("ALTER TABLE users ADD CONSTRAINT users_admin_role_check
            CHECK (admin_role IN ('geral','educacao','secon','empreendedor','escola'))");

        // Vínculo da conta escola com a escola específica
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('escola_id')
                  ->nullable()
                  ->after('admin_role')
                  ->constrained('escolas')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['escola_id']);
            $table->dropColumn('escola_id');
        });

        DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_admin_role_check");
        DB::statement("ALTER TABLE users ADD CONSTRAINT users_admin_role_check
            CHECK (admin_role IN ('geral','educacao','secon','empreendedor'))");
    }
};

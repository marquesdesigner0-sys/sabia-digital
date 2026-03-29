<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('estabelecimentos', function (Blueprint $table) {
            $table->text('promocao_imagem')->nullable()->after('promocao');
        });
    }

    public function down(): void
    {
        Schema::table('estabelecimentos', function (Blueprint $table) {
            $table->dropColumn('promocao_imagem');
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('estabelecimentos', function (Blueprint $table) {
            $table->text('horario')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('estabelecimentos', function (Blueprint $table) {
            $table->string('horario')->nullable()->change();
        });
    }
};

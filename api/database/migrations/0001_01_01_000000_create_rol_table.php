<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rols', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description');
            $table->timestamps();
        });
//pano_a@gmail.com
//motsakki2026
//joaquin@gmail.com
//motsakki2026

        DB::table('rols')->insert([
            'name' => 'Super Administrador',
            'description' => 'Todos los permisos',

        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('rols');
    }
};

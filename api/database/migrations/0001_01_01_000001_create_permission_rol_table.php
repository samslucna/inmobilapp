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
        Schema::create('permissions_rols', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('rol_id')->nullable();
            $table->foreign('rol_id')
                ->references('id')->on('rols')->onDelete('set null')->onUpdate('cascade');
            $table->unsignedBigInteger('permission_id')->nullable();
            $table->foreign('permission_id')
                ->references('id')->on('permissions')->onDelete('set null')->onUpdate('cascade');
            $table->timestamps();
        });

   
    }

    public function down(): void
    {
        Schema::dropIfExists('permissions_rols');
      
    }
};

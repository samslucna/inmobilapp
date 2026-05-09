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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('m2');
            $table->string('address');
            $table->unsignedBigInteger('block_id')->nullable();
            $table->foreign('block_id')
                ->references('id')->on('blocks')->onDelete('set null')->onUpdate('cascade');
            $table->double('amount_init',14,5)->nullable();;
            $table->double('amount_end',14,5)->nullable();;
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};

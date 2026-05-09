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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->unsignedBigInteger('buyer_id')->nullable();
            $table->foreign('buyer_id')
                ->references('id')->on('buyers')->onDelete('set null')->onUpdate('cascade');
            $table->unsignedBigInteger('seller_id')->nullable();
            $table->foreign('seller_id')
                ->references('id')->on('sellers')->onDelete('set null')->onUpdate('cascade');
            $table->unsignedBigInteger('agent_id')->nullable();
            $table->foreign('agent_id')
                ->references('id')->on('agents')->onDelete('set null')->onUpdate('cascade');
            $table->unsignedBigInteger('property_id')->nullable();
            $table->foreign('property_id')
                ->references('id')->on('properties')->onDelete('set null')->onUpdate('cascade');
            $table->integer('plazo');
            $table->double('advance', 13, 5);
            $table->string('ref');
            $table->string('paytype',100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};

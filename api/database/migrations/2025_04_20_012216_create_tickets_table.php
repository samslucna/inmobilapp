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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('concept');
            $table->double('amount',14,5);
            $table->date('date');
            $table->string('paytype');
            $table->unsignedBigInteger('contract_id')->nullable();
            $table->foreign('contract_id')
                ->references('id')->on('contracts')->onDelete('set null')->onUpdate('cascade');
            $table->timestamps();
        });
    }   

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};

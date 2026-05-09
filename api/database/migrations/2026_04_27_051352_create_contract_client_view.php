<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
        SELECT 
            c.id AS contract_id, 
            e.id AS id,
            CONCAT(e.name,' ',e.lastnames) AS cliente,
            e.email AS email, 
            c.date AS date, c.advance AS advance
        FROM (buyers e
        JOIN contracts c
        ON (e.id = c.buyer_id))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS contract_client");
    }
};

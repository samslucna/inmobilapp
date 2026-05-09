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
        DB::unprepared('
        CREATE TRIGGER create_trigger_propertyavaible
        AFTER DELETE ON contracts
        FOR EACH ROW
        BEGIN   
            UPDATE properties
            SET status = "disponible"
            WHERE id = OLD.property_id;
        ENd   
     ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('create_trigger_propertyavaible');
    }
};

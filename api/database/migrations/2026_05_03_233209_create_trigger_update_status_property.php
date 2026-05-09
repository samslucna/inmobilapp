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
        CREATE TRIGGER trigger_update_status_property
        AFTER UPDATE ON contracts
        FOR EACH ROW
        BEGIN   
            UPDATE properties
            SET status = "apartado"
            WHERE id = NEW.property_id;
        END
     ');
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trigger_update_status_property');
    }
};

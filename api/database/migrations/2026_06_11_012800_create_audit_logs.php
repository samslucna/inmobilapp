// database/migrations/2024_01_01_000001_create_audit_logs_table.php
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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            
            // Información del usuario
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('user_name')->nullable();
            $table->string('user_email')->nullable();
            $table->string('user_ip')->nullable();
            $table->string('user_agent')->nullable();
            
            // Información de la acción
            $table->string('action'); // create, update, delete, login, logout, view, export, import
            $table->string('module'); // users, roles, products, etc.
            $table->string('description')->nullable();
            
            // Información del registro afectado
            $table->string('table_name')->nullable();
            $table->unsignedBigInteger('record_id')->nullable();
            $table->string('record_identifier')->nullable(); // Nombre o identificador del registro
            
            // Datos antes y después (para acciones update)
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            
            // Información adicional
            $table->json('metadata')->nullable();
            
            // Nivel de severidad (info, warning, error, critical)
            $table->string('severity')->default('info');
            
            // Timestamps
            $table->timestamps();
            
            // Índices para búsquedas rápidas
            $table->index(['user_id', 'created_at']);
            $table->index(['module', 'action']);
            $table->index(['table_name', 'record_id']);
            $table->index('created_at');
            $table->index('action');
            $table->index('severity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
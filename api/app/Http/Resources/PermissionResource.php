<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PermissionResource extends JsonResource
{
    /**
     * Transforma el recurso de Permiso en un arreglo estructurado para el JSON.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'   => $this->id,
            'name' => $this->name,
            // 'guard_name' => $this->guard_name, // Descomenta esta línea si tu frontend valida múltiples guards
        ];
    }
}

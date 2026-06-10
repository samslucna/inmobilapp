<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    /**
     * Transforma el recurso de Rol en un arreglo estructurado para el JSON.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'guard_name' => $this->guard_name,
       
            'permissions' => PermissionResource::collection($this->whenLoaded('permissions')),
            
            // O si prefieres solo una lista simple con los nombres de los permisos en lugar de objetos:
            // 'permissions_names' => $this->whenLoaded('permissions', function() {
            //     return $this->permissions->pluck('name');
            // }),
        ];
    }
}
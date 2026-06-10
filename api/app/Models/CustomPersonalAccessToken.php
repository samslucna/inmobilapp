<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class CustomPersonalAccessToken extends SanctumPersonalAccessToken
{
    /**
     * Este método SOBREESCRIBE la lógica de permisos del token.
     * En lugar de buscar en la columna 'abilities' del token,
     * le pregunta al modelo User (Spatie) si tiene el permiso.
     */
    public function can($ability)
    {
        // tokenable es el User (o el modelo que tengas autenticable)
        // Esto delega la verificación a Spatie en tiempo real
        return $this->tokenable->can($ability);
    }
}
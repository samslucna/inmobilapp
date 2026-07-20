<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuditAccessMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Solo registrar accesos GET de usuarios autenticados
        if ($request->isMethod('get') && Auth::check()) {
            $this->logAccess($request);
        }

        return $response;
    }

    /**
     * Log the access.
     */
    protected function logAccess(Request $request): void
    {
        $routesToLog = ['users', 'roles', 'audit-logs', 'permissions'];
        $path = $request->path();

        foreach ($routesToLog as $route) {
            if (str_contains($path, $route)) {
                activity()
                    ->causedBy(Auth::user())
                    ->withProperties([
                        'url' => $request->fullUrl(),
                        'method' => $request->method(),
                        'ip' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                    ])
                    ->event('view')
                    ->useLogName('access')
                    ->log("Visualizó: {$path}");
                break;
            }
        }
    }
}
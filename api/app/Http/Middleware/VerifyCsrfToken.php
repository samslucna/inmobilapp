<?php

namespace App\Http\Middleware;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
//use Closure;
//use Illuminate\Http\Request;
//use Symfony\Component\HttpFoundation\Response;

class VerifyCsrfToken extends Middleware
{

     protected $except = [
     
     ];


}

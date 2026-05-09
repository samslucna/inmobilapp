<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

use \stdClass;


class AuthController extends Controller
{
    public function register(Request $request)
    {


        Validator::make($request->all(), [
            "name" => "required|string|max:255",
            "email" => "required|string|max:255|unique:users",
            "password" => 'required|string|min:8'
        ]);



        $user = User::create([
            "name" => $request->name,
            "email" => $request->email,
            'password' => Hash::make($request->password)
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;


        return response()->json([
            "data" => $user,
            "access_token" => $token,
            "token_type" => "Bearer"
        ]);
    }




    public function login(Request $request)
    {

   
        $this->validateLogin($request);
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }


        return response()->json([
            "user"=> $request->user(),
            'token' => $request->user()->createToken("auth_token")->plainTextToken,
            'message' => 'Success'
        ]);
    }


    

    public function validateLogin(Request $request)
    {
        return $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
    }
    
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();;
        return [
            'message' => 'success'
        ];

    }




}

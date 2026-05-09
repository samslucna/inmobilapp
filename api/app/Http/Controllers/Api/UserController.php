<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\UserResource;
use App\Http\Controllers\Controller;
use App\Models\User;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 5);
        $users = User::with('rol')->paginate($perPage);
        //dd($users);
        return response()->json($users);
    }



    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {


        $active = $request->active ? 1 : 0;

        $validator = Validator::make($request->all(), [
            "name" => "required|string|max:255",
            "email" => "required|string|max:255|unique:users",
            "password" => 'required|string|min:8',
            "rol" => "required|string|max:255",
            "active" => "required|boolean",
        ]);
        //dd($validator);
        //dd($request->active);
        $user = User::create([
            "name" => $request->name,
            "email" => $request->email,
            "rol_id" => $request->rol,
            "status" => $active,
            'password' => Hash::make($request->password)
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;


        return response()->json([
            "data" => $user,
            "access_token" => $token,
            "token_type" => "Bearer"
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $seller)
    {
        //

        return new UserResource($seller);
    }



    public function search(Request $request)
    {


        $query = $request->q;
        //dd($query);
        $items = User::where('name', 'LIKE', "%$query%")
            ->get();
        return response()->json($items);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {

        Validator::make($request->all(), [
            "name" => "required|string|max:255",
            "email" => "required|string|max:255|unique:users",
            "password" => 'required|string|min:8',
            "rol" => "required|string|max:255",
            "active" => "required|boolean",
        ]);
        $active = $request->active ? 1 : 0;

        $upd = User::where('id', $request->id)->update([
            "name" => $request->name,
            "email" => $request->email,
            "rol_id" => $request->rol,
            "status" => $active,
            'password' => Hash::make($request->password)
        ]);

        // respesta de JSON

        $response['message'] = "Actualizo exitosamente";
        $response['success'] = true;

        return $response;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Eliminar

        $deleted = User::where('id', $id)->delete();

        // respesta de JSON
        $response['eliminado'] = $deleted;
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }
}

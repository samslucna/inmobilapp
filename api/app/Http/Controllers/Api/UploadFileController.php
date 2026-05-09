<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadFileRequest;
use App\Models\uploadFile;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class UploadFileController extends Controller
{
    //

    public function index()
    {
        $file = uploadFile::paginate(15);

        return new JsonResponse($file);
    }

    public function create() {}


    public function uploadFile(UploadFileRequest $request)
    {
        //dd($request->datas);
        $fileName = $request->name.'-'.time().'.'.$request->file('fileurl')->extension();
       $file= $request->file('fileurl')->move(public_path('reports'), $fileName);
        $uplodaderFile = new uploadFile;
        $uplodaderFile->name = $request->name;
        $uplodaderFile->datas = $request->datas;
        $uplodaderFile->fileurl = $fileName;

        $uplodaderFile->save();
        return response()->json(['url' => url('public/reports').'/'.$fileName]) ;
    }



      public function destroy(Request $request)
    {
        // Eliminar
        uploadFile::where('id', $request->id)->delete();
        // respesta de JSON
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }
}

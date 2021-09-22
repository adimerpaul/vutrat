<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TramiteController extends Controller
{
    public function store(Request $request){
        DB::insert("INSERT INTO  v_tramites SET
n_tramite='$request->n_tramite',
tipo_tram='$request->tipo_tram',
fecha_ini='".date('Y-m-d H:i.s')."',
operador='".$request->user()->name."',
estado='F',
unid_dest='1',
fech_dest='".date('Y-m-d H:i.s')."',
tramitador='$request->tramitador',
");
    }
}

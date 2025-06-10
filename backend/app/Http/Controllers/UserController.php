<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{

public function index()
{
    $usuarios = \App\Models\User::all();
    return view('admin.usuarios.index', compact('usuarios'));
}
}
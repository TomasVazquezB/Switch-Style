<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log; 

class PedidoController extends Controller
{
    public function crear(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        // 🧱 Crear pedido real
        $pedido = Pedido::create([
            'user_id'        => $user->ID_Usuario,  // ✅ usa user_id (de la tabla pedidos)
            'subtotal'       => $request->input('subtotal', 0),
            'total'          => $request->input('total', 0),
            'metodo_pago'    => $request->input('metodo_pago', 'desconocido'),
            'external_id'    => $request->input('external_id'),
            'estado'         => 'pagado',
            'direccion_envio'=> $request->input('envio.direccion.calle') ?? 'Sin dirección',
            'extra'          => $request->input('extra') ?? null,
        ]);

        return response()->json([
            'message' => 'Pedido creado correctamente',
            'pedido'  => $pedido
        ], 201);
    }


    public function misPedidos(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        // ✅ filtra usando user_id
        $pedidos = Pedido::where('user_id', $user->ID_Usuario)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($pedidos);
    }

}

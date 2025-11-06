<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;

class PedidoController extends Controller
{
    // 🧩 Crear pedido (desde el pago simulado o PayPal)
    public function crear(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $pedido = Pedido::create([
            'user_id' => $user->id,
            'subtotal' => $request->input('subtotal', 0),
            'total' => $request->input('total', 0),
            'metodo_pago' => $request->input('metodo_pago', 'desconocido'),
            'external_id' => $request->input('external_id'),
            'estado' => 'pagado',
            'direccion_envio' => $request->input('envio.direccion.calle') ?? 'Sin dirección',
            'detalles' => $request->input('carrito', []),
        ]);

        return response()->json([
            'message' => 'Pedido creado correctamente',
            'pedido' => $pedido
        ], 201);
    }

    // 🧾 Obtener los pedidos del usuario autenticado
    public function misPedidos(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $pedidos = Pedido::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($pedidos);
    }
}

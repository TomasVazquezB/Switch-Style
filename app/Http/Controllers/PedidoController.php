<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;
use Illuminate\Support\Str;

class PedidoController extends Controller
{
    // 🧩 Crear pedido (desde el pago simulado o PayPal)
    public function crear(Request $request)
    {
        $user = $request->user();

        // ✅ Si no hay usuario autenticado, creamos un pedido "simulado"
        if (!$user) {
            $fakeId = 'FAKE-' . strtoupper(Str::random(8));
            return response()->json([
                'message' => 'Pedido simulado creado correctamente',
                'pedido' => [
                    'id' => $fakeId,
                    'total' => $request->input('total'),
                    'metodo' => $request->input('metodo_pago', 'simulado'),
                    'direccion_envio' => $request->input('envio.direccion.calle') ?? 'Sin dirección',
                ],
            ], 201);
        }

        // ✅ Si el usuario está autenticado, guardamos el pedido real en DB
        $pedido = Pedido::create([
            'ID_Usuario'     => $user->ID_Usuario, // ⚠️ tu tabla usa ID_Usuario, no user_id
            'subtotal'       => $request->input('subtotal', 0),
            'total'          => $request->input('total', 0),
            'metodo_pago'    => $request->input('metodo_pago', 'desconocido'),
            'external_id'    => $request->input('external_id'),
            'estado'         => 'pagado',
            'direccion_envio'=> $request->input('envio.direccion.calle') ?? 'Sin dirección',
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

        $pedidos = Pedido::where('ID_Usuario', $user->ID_Usuario)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($pedidos);
    }
}

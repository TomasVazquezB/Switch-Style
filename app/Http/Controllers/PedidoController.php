<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;
use Illuminate\Support\Str;

class PedidoController extends Controller
{
    public function crear(Request $request)
    {
        $user = $request->user();

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

        $pedido = Pedido::create([
            'ID_Usuario'     => $user->id, // 👈 cambiado
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

    public function misPedidos(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $pedidos = Pedido::where('ID_Usuario', $user->id) // 👈 cambiado
            ->orderByDesc('created_at')
            ->get();

        return response()->json($pedidos);
    }
}

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
        try {
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

            // 🔍 Log para ver qué datos llegan
            Log::info('Creando pedido con datos:', [
                'usuario' => $user->ID_Usuario,
                'subtotal' => $request->input('subtotal'),
                'total' => $request->input('total'),
                'metodo_pago' => $request->input('metodo_pago'),
            ]);

            Log::info('Usuario autenticado:', ['user' => auth()->user()]);

            $pedido = Pedido::create([
                'user_id' => $user->id,
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

        } catch (\Throwable $e) {
            Log::error('❌ Error al crear pedido: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Error interno al crear el pedido', 'detalle' => $e->getMessage()], 500);
        }
    }
}

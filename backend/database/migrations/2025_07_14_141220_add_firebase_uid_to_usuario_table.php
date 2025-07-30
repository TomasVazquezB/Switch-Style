<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFirebaseUidToUsuarioTable extends Migration
{
    public function up()
    {
        if (Schema::hasTable('usuarios')) {
            Schema::table('usuarios', function (Blueprint $table) {
                $table->string('firebase_uid')->nullable()->unique()->after('ID_Usuario');
            });
        }
    }

    public function down()
    {
        if (Schema::hasTable('usuarios')) {
            Schema::table('usuarios', function (Blueprint $table) {
                $table->dropColumn('firebase_uid');
            });
        }
    }
}

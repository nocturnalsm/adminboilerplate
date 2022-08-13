<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        $admin = new User;
        $admin->fill([
            'name' => env("SUPERADMIN_DEFAULT_NAME", "Super Admin"),
            'email' => env("SUPERADMIN_DEFAULT_EMAIL", "admin@admin.com"),
            'password' => Hash::make(env("SUPERADMIN_DEFAULT_PASSWORD", "password")),
          ])->save();
        
        $admin->assignRole(env("SUPERADMIN_DEFAULT_ROLE", "Super Admin"));

    }
}

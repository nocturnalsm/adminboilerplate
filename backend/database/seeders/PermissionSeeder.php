<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table("permissions")->insert([
            [
                "name" => "users.list",
                "guard_name" => "web"
            ],
            [
                "name" => "users.add",
                "guard_name" => "web"
            ],
            [
                "name" => "users.edit",
                "guard_name" => "web"
            ],
            [
                "name" => "users.delete",
                "guard_name" => "web"
            ],
            [
                "name" => "users.view",
                "guard_name" => "web"
            ],
            [
                "name" => "permissions.list",
                "guard_name" => "web"
            ],
            [
                "name" => "permissions.add",
                "guard_name" => "web"
            ],
            [
                "name" => "permissions.edit",
                "guard_name" => "web"
            ],
            [
                "name" => "permissions.delete",
                "guard_name" => "web"
            ],
            [
                "name" => "permissions.view",
                "guard_name" => "web"
            ],
            [
                "name" => "roles.list",
                "guard_name" => "web"
            ],
            [
                "name" => "roles.add",
                "guard_name" => "web"
            ],
            [
                "name" => "roles.edit",
                "guard_name" => "web"
            ],
            [
                "name" => "roles.delete",
                "guard_name" => "web"
            ],
            [
                "name" => "roles.view",
                "guard_name" => "web"
            ],
            [
                "name" => "role_permissions.list",
                "guard_name" => "web"
            ],
            [
                "name" => "role_permissions.view",
                "guard_name" => "web"
            ],
            [
                "name" => "role_permissions.update",
                "guard_name" => "web"
            ],
        ]);
    }
}

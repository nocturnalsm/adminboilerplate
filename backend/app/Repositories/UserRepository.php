<?php

namespace App\Repositories;

use App\Repositories\BaseRepository;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use DB;

class UserRepository extends BaseRepository
{

    public function __construct(User $user)
    {
        $this->data = $user;
    }
    
    public function getCurrent()
    {
        $user = auth()->user();        
        return $user;
    }

    public function create($request)
    {
        DB::transaction(function() use ($request){
            $request["password"] = Hash::make($request["password"]);
            $user = parent::create($request);
            if (count($request["roles"]) > 0){
                foreach ($request["roles"] as $role){
                    $user->assignRole($role["name"]);
                }
            }
            return $user;
        });
    }

    public function update($id, $request)
    {
        DB::transaction(function() use ($request, $id){ 
            unset($request["password"]);           
            $user = parent::update($id, $request);
            if (count($request["roles"]) > 0){
                array_map(function($value){
                    return $value["name"];
                }, $request["roles"]);
                $user->syncRoles($request["roles"]);
            }
            return $user;
        });
    }

}

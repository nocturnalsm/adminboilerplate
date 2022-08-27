<?php

namespace App\Repositories;

use App\Repositories\BaseRepository;
use Spatie\Permission\Models\Role;
use DB;

class RoleRepository extends BaseRepository
{    

    public function __construct(Role $role)
    {
        $this->data = $role;        
    }

    public function create(Array $params)
    {
        DB::transaction(function() use ($params){
            $params["guard_name"] = "web";
            $role = parent::create($params);
            if (count($params["permissions"]) > 0){
                $role->syncPermissions($params["permissions"]);
            }
            return $role;
        });                
    }

    public function getById(String $id)
    {
        $data = parent::getById($id);
        $data->permissions = $data->permissions()->get();
        return $data;
    }

    public function update(String $id, Array $params)
    {
        DB::transaction(function() use($id, $params){
            $role = parent::update($id, $params);
            $role->syncPermissions($params["permissions"]);
            return $role;
        });
    }
    
}

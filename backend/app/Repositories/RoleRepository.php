<?php

namespace App\Repositories;

use App\Repositories\BaseRepository;
use Spatie\Permission\Models\Role;

class RoleRepository extends BaseRepository
{    

    public function __construct(Role $role)
    {
        $this->data = $role;        
    }

    public function create(Array $params)
    {
        $params["guard_name"] = "web";
        return parent::create($params);
    }

}

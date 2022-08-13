<?php

namespace App\Repositories;

use App\Repositories\BaseRepository;
use Spatie\Permission\Models\Permission;

class PermissionRepository extends BaseRepository
{    

    public function __construct(Permission $permission)
    {
        $this->data = $permission;
    }

    public function create(Array $params)
    {
        $params["guard_name"] = "web";
        return parent::create($params);
    }

}

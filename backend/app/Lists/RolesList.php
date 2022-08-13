<?php

namespace App\Lists;

use App\PaginatedList;
use App\Repositories\RoleRepository;
use DB;

class RolesList extends PaginatedList
{
    public function listQuery($data)
    {         
        return $data->with(["permissions"]);
    }

}
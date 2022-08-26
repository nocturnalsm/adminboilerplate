<?php

namespace App\Lists;

use App\PaginatedList;
use App\Repositories\RoleRepository;
use DB;

class RolesList extends PaginatedList
{
    public function useQuery($query)
    {         
        return $query->with(["permissions"]);
    }

}
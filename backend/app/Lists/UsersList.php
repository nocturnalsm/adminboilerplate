<?php

namespace App\Lists;

use App\PaginatedList;
use App\Repositories\UserRepository;
use DB;

class UsersList extends PaginatedList
{

    public function __construct()
    {        
        $this->listFilters = [
            "name" => ["operator" => "like"],
            "email" => ["operator" => "like"]
        ];
        $this->filterOperator = "OR";
    }

    public function useQuery($query)
    {         
        return $query->with(["roles"]);
    }

}
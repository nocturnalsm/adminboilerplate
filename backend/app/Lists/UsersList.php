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
            "email" => ["operator" => "like"],
            "department" => function($query, $key, $value){
                $dept_id = DB::table("departments")->where("name", "LIKE", $value)->value("id");
                if ($dept_id){
                    return $query->whereDepartmentId($dept_id);
                }
                else {
                    return $query;
                }
            }
        ];
        $this->filterOperator = "OR";
    }

    public function listQuery($data)
    {         
        return $data->with(["roles"]);
    }

}
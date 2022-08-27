<?php

namespace App\Services;

use App\Services\BaseService;
use App\Repositories\RoleRepository;
use App\Lists\RolesList;
use Illuminate\Http\Request;

class RoleService extends BaseService
{    

    public function __construct(RoleRepository $role, RolesList $list)
    {
        $this->repository = $role;
        $this->list = $list;
    }

    public function getList(Request $request)
    {        
        return parent::getList($request);
    }

    public function validateUsing($params, $id)
    {
        return [
            "name" => 'required', 'unique:roles,name' .(!empty($id) ? ",{$id}" : ""),            
        ];
    }
    
}
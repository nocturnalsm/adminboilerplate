<?php

namespace App\Services;

use App\Services\BaseService;
use App\Repositories\PermissionRepository;
use App\Lists\PermissionsList;
use Illuminate\Http\Request;

class PermissionService extends BaseService
{    

    public function __construct(PermissionRepository $permission, PermissionsList $list)
    {
        $this->repository = $permission;
        $this->list = $list;
    }

    public function getList(Request $request)
    {        
        return parent::getList($request);
    }

    public function validateUsing($params, $id)
    {
        return [
            "name" => 'required', 'unique:permissions,name' .(!empty($id) ? ",{$id}" : "")
        ];
    }
    
}
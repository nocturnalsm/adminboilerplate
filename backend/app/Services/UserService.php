<?php

namespace App\Services;

use App\Services\BaseService;
use App\Repositories\UserRepository;
use App\Lists\UsersList;

class UserService extends BaseService
{    

    public function __construct(UserRepository $user, UsersList $list)
    {
        $this->repository = $user;
        $this->list = $list;
    }

    public function getList($request)
    {        
        return parent::getList($request);
    }

    public function validateUsing($request, $id = "")
    {
        $rules = [
            "name" => 'required',
            "email" => [
                'email',
                'required',
                'unique:users,email' .(!empty($id) ? ",{$id}" : "")
            ],
        ];
        if (empty($id)){
            $rules["password"] = 'required';
        }
        return $rules;
    }
}
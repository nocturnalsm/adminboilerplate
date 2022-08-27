<?php

namespace App\Services;

use App\Interfaces\ServiceInterface;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\PaginatedList;

class BaseService implements ServiceInterface
{
    
    protected $repository;
    protected $list;
    
    public function getList(Request $request)
    {
        
        $params = $request->all();
        Validator::make($params, [
            'page' => 'nullable|numeric',
            'limit' => 'nullable|numeric',
            'sort' => 'nullable|string',
            'order' => 'nullable|in:asc,desc'
        ])->validate();

        $data = $this->repository->getData();
 
        $limit = isset($params['limit']) ? intval($params['limit']) : 10;
        $sortBy = isset($params['sort']) ? $params['sort'] : (!empty($this->defaultSort) ? $this->defaultSort : null);
        $order = isset($params['order']) ? $params['order'] : (!empty($this->defaultOrder) ? $this->defaultOrder : 'asc');
        $filter = isset($params['filter']) ? json_decode($params['filter'], true) : '';
        
        
        $list = new $this->list;
        $list->setData($data);
        $result = $list->make($sortBy, $order, $filter);
                
        if (trim($limit) != ''){
            $appends["limit"] = trim($limit) != "10" ? $limit : null;
            $appends["sort"] = trim($sortBy) != "" ? $sortBy : null;
            $appends["order"] = $order != "" ? $order : null;
            if ($limit){
                $result = $result->paginate($limit);
            }
            $result = $result->appends($appends);
        }
        return $result;
    }    

    public function getById($id)
    {
        $data = $this->repository->getById($id);
        return $data;
    }

    public function create(Request $request)
    {
        $params = $request->all();
        $validator = $this->validate($params);
        $data = $this->repository->create($params);
        return $data;
    }

    public function update(String $id, Request $request)
    {
        $params = $request->all();
        $this->validate($params, $id);
        $data = $this->repository->update($id, $params);
        return $data;
    }

    public function delete(String $id)
    {
        if (method_exists($this, 'validateDelete')){
            $this->validateDelete($id);
        }        
        $this->repository->delete($id);
        return true;
    }

    public function search(Request $request) : Array
    {        
        $rules = [];
        if (method_exists($this->repository, 'getSearchRules')){
            $rules = $this->repository->getSearchRules();
        }
        else if (method_exists($this, 'getSearchRules')){
            $rules = $this->getSearchRules();
        }                
        return $this->repository->search($request->all(), $rules);
    }

    public function validate($params, $id = "")
    {
        $defs = $this->validateUsing($params, $id);
        $rules = Array();
        $messages = Array();
        $attributes = Array();
        $isApiUpdate = request()->is("api/*") && trim($id) != "";

        if (count($defs) > 0){
            foreach($defs as $key => $def){
                if (isset($def["rule"])){
                    $rule = $def["rule"];
                }
                else {
                    $rule = $def;
                }
                if ($isApiUpdate){
                    if (is_string($rule)){
                        $rule = "sometimes|" .$rule;
                    }
                    else if (is_array($rule)){
                        array_unshift($rule, "sometimes");
                    }
                }
                $rules[$key] = $rule;
                if (isset($def["message"])){
                    $message = $def["message"];
                    if (is_string($message)){
                        $messages[$key .".*"] = $message;
                    }
                    else if (is_array($message)){
                        foreach($message as $messageKey => $msg){
                            $messages[$key ."." .$messageKey] = $msg;
                        }
                    }
                }
                if (isset($def["attribute"])){
                    $attributes[$key] = $def["attribute"];
                }
            }
            Validator::make($params, $rules, $messages, $attributes)->validate();
        }
    }
}
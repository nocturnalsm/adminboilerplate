<?php

namespace App;

use App\Interfaces\RepositoryInterface;
use Illuminate\Http\Request;
use App\PaginatedList;
use App\SearchList;

class BaseRepository implements RepositoryInterface
{

    protected $listFilters;
    protected $defaultSort;
    protected $defaultOrder;
    protected $data;

    public function getData()
    {
        return $this->data;
    }

    public function getById(String $id)
    {
        $data = $this->data->whereId($id)->firstOrFail();
        return $data;
    }

    public function create(Array $params)
    {        
        $data = new $this->data;                
        $data->fill($params)->save();
        return $data;
    }

    public function update(String $id, Array $params)
    {
        $data = $this->data->findOrFail($id);
        $data->fill($params)->save();
        return $data;
    }

    public function delete(String $id)
    {        
        $data = $this->data->find($id)->deleteOrFail();
    }

    public function query()
    {
        return $this->data->query();
    }
    
    public function setData($data)
    {
        $this->data = $data;
    }
    
    public function search(Array $params, $rules = [])
    {             
        $query = $params["q"];
        $limit = isset($params['limit']) ? intval($params['limit']) : 10;
        $sortBy = isset($params['sort']) ? $params['sort'] : '';
        $order = isset($params['order']) ? $params['order'] : 'ASC';

        $data = $this->data;
        if (method_exists($this, 'listQuery')){
            $data = $this->listQuery($data);
        }

        $list = new SearchList($data);
        $qFilter = [];
        if (is_array($rules)){
            foreach ($rules as $key => $rule){
                if (is_array($rule)){
                    $value = isset($rule["value"]) ? trim($rule["value"]) : trim($query);
                }
                else {
                    $value = trim($query);
                }
                $qFilter[$key] = $value;
            }
        }

        if (method_exists($this, 'listSort')){
            $list->useSort(function($data, $sortBy, $order){
                return $this->listSort($data, $sortBy, $order);
            });
        }

        $result = $list->makeList($qFilter, $rules, $sortBy, $order);
        
        if (trim($limit) != ''){
            $appends["limit"] = trim($limit) != "10" ? $limit : null;
            $appends["sort"] = trim($sortBy) != "" ? $sortBy : null;
            $appends["order"] = $order != "" ? $order : null;
            $appends["q"] = trim($query) != "" ? $query : null;
            
            if ($limit){
                $result = $result->paginate($limit);
            }
            $result = $result->appends($appends);
        }
        return $result;

    }
    
}

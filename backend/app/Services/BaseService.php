<?php

namespace App\Services;

use App\Interfaces\ServiceInterface;
use App\PaginatedList;

class BaseService implements ServiceInterface
{
    
    protected $repository;

    public function getList(Request $request) : Array
    {
        $params = $request->all();
        $data = $this->repository->getData($params);
 
        if (method_exists($this, 'listQuery')){
            $data = $this->listQuery($data);
        }
        $limit = isset($params['limit']) ? intval($params['limit']) : 10;
        $sortBy = isset($params['sort']) ? $params['sort'] : (!empty($this->defaultSort) ? $this->defaultSort : null);
        $order = isset($params['order']) ? $params['order'] : (!empty($this->defaultOrder) ? $this->defaultOrder : '');
        $filter = isset($params['filter']) ? json_decode($params['filter'], true) : '';
        
        
        $list = new PaginatedList($data);

        if ($this->listFilters && count($this->listFilters) > 0){
            $list->setFilterRules($this->listFilters);
        }

        if (isset($this->filterOperator)){
            $list->setFilterOperator($this->filterOperator);
        }

        if (method_exists($this, 'listFilter')){
            $list->useFilter(function($data, $filter) {
                return $this->listFilter($data, $filter);
            });
        }

        if (method_exists($this, 'listSort')){
            $list->useSort(function($data, $sortBy, $order){
                return $this->listSort($data, $sortBy, $order);
            });
        }
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

    public function setDefaultSort($sort)
    {
        $this->defaultSort = $sort;
    }
    
    public function setDefaultOrder($order)
    {
        $this->defaultOrder = $order;
    }
    
}
<?php

namespace App;

class PaginatedList
{    
    protected $filterOperator = "AND";
    protected $filterRules = [];
    protected $data;

    public function setData($data)
    {
        $this->data = $data;
    }

    public function make($sortBy = '', $order = 'asc', $filter = '')
    {
        $data = $this->data;

        if (method_exists($this, 'useQuery')){
            $data = $this->useQuery($data);
        }

        if (isset($this->listFilters) && count($this->listFilters) > 0){
            $this->setFilterRules($this->listFilters);
        }

        if (isset($this->filterOperator)){
            $this->setFilterOperator($this->filterOperator);
        }
                
        if (is_array($filter)){
            if (method_exists($this, 'useFilter')){
                $data = $this->useFilter($data, $filter);
            }
            else {
                $data = $this->defaultFilter($data, $filter);
            }
        }

        if (method_exists($this, 'useSort')){
            $data = $this->useSort($data, $sortBy, $order);
        }        
        else {
            if ($sortBy != ''){
                $data = $data->orderBy($sortBy, $order);
            }
        }

        return $data;
    }    
    protected function defaultFilter($data, $filter){

        $data = $data->where(function($query) use ($filter){
            foreach ($filter as $key=>$value){

                if (is_bool($value)){
                    $checkNotEmpty = is_bool($value);
                }
                else {
                    $checkNotEmpty = !empty($value);
                }
                if ($checkNotEmpty){
                    if (isset($this->filterRules[$key])){
                        $itemFilter = $this->filterRules[$key];
                        if ($itemFilter !== false){
                            if (is_callable($itemFilter)){
                                $query = $itemFilter($query, $key, $value);
                            }
                            else if (is_array($itemFilter)){
                                $key = isset($itemFilter["key"]) ? $itemFilter["key"] : $key;

                                if (isset($itemFilter["operator"])){
                                    $value = strtolower(trim($itemFilter["operator"])) == "like" ? "%{$value}%" : $value;
                                    $query = $this->setWhere($query, $key, $itemFilter["operator"], $value);
                                }
                                else {

                                    $query = $this->setWhereEqual($query, $key, $value);
                                }
                            }
                        }
                    }
                    else {
                        $query = $this->setWhereLike($query, $key, $value);
                    }
                }
            }
        });

        return $data;
        
    }
    public function setFilterRules($rules)
    {
        if (is_array($rules)){
            $this->filterRules = array_merge($this->filterRules, $rules);
        }
    }
    public function setFilterOperator($operator)
    {
        $this->filterOperator = $operator;
    }
    private function setWhereLike($query, $key, $value)
    {
        return $this->setWhere($query, $key, "LIKE", "%{$value}%");
    }
    private function setWhereEqual($query, $key, $value)
    {
        return $this->setWhere($query, $key, "=", $value);
    }
    private function setWhere($query, $key, $operator, $value)
    {
        if ($this->filterOperator == "AND" ){            
            return $query->where($key, $operator, $value);
        }
        else if ($this->filterOperator == "OR" ){
            return $query->orWhere($key, $operator, $value);
        }
    }
    
}

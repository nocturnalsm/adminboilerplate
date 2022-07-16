<?php

namespace App;

use App\PaginatedList;

class SearchList extends PaginatedList
{

    public function makeList($qFilter, $qRules, $sortBy = '', $order = 'asc')
    {
        $data = $this->data;
        
        if (is_callable($this->queryFunction)){
            $data = ($this->queryFunction)($data);
        }

        $filterFunction = $this->defaultFilter();
        $this->setFilterOperator("OR");
        $this->setFilterRules($qRules);
        
        $data = ($filterFunction)($data, $qFilter);

        if (is_callable($this->sortFunction)){
            $data = ($this->sortFunction)($data, $sortBy, $order);
        }
        else {
            if ($sortBy != ''){
                $data = $data->orderBy($sortBy, $order);
            }
        }

        return [
            "count" => $data->count(),
            "data" => $data->get()
        ];
    }

}

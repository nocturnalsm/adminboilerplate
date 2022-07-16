<?php

namespace App\Interfaces\Repositories;

use Illuminate\Http\Request;

/**
 *
 */
interface RepositoryInterface
{

    public function getData() : Array;
    public function getById(String $id);
    public function create(Array $params);
    public function update(String $id, Array $params);
    public function delete(String $id);

}


 ?>

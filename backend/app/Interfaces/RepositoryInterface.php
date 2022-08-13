<?php

namespace App\Interfaces;

use Illuminate\Http\Request;

/**
 *
 */
interface RepositoryInterface
{

    public function getData();
    public function getById(String $id);
    public function create(Array $params);
    public function update(String $id, Array $params);
    public function delete(String $id);

}


 ?>

<?php

namespace App\Interfaces\Services;

use Illuminate\Http\Request;

/**
 *
 */
interface ServiceInterface
{

    public function getList(Request $request) : Array;    
    public function getById(String $id);
    public function create(Request $request);
    public function update(String $id, Request $request);
    public function delete(String $id);
    public function search(Request $request) : Array;

}


 ?>

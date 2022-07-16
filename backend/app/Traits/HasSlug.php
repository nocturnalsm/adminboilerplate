<?php

use Illuminate\Support\Str;

trait HasSlug {

    public function slug($value, $id = "")
    {
        $iterate = 0;
        $data = $this->data;
        while ($iterate == 0 || $found){
            $slug = $iterate == 0 ? Str::slug($value) : $slug ."-" .strval($iterate + 1);
            if (!empty($id)){
                $data = $data->where("id", "<>", $id);
            }
            $found = $data->whereSlug($slug)->exists();            
            $iterate += 1;
        }
        return $slug;
    }

}
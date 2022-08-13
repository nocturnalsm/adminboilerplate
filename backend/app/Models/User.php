<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Permission;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $appends = [
        "avatar",
        "permissions"
    ];

    public function getAvatarAttribute()
    {
        $sentences = explode(" ", $this->name);
        $initial = "";
        $length = count($sentences) > 2 ? 2 : count($sentences);
        for($i=0;$i < $length;$i++){
            $initial .= substr($sentences[$i], 0, 1);
        }
        return $initial;
    }

    public function getPermissionsAttribute()
    {
        if ($this->hasRole('Super Admin')){
            $permissions = Permission::all();
        }
        else {
            $permissions = $this->getPermissionsViaRoles(); 
        }
        return $permissions->map(function($item){
            return $item->name;
        });
    }
}

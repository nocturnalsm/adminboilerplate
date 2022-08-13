<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Actions\Fortify\UpdateUserPassword;
use App\Repositories\UserRepository;

class ProfileController extends Controller
{

    protected $user;

    public function __construct(UserRepository $user)
    {
        $this->user = $user;
    }

    public function profile()
    {
        $user = $this->user->getCurrent();        
        return response()->json($user);
    }

    public function updateProfile(Request $request, UpdateUserProfileInformation $action)
    {                        
        $action->update(auth()->user(), $request->all());
    }

    public function changePassword(Request $request, UpdateUserPassword $action)
    {
        $action->update(auth()->user(), $request->all());
    }

}

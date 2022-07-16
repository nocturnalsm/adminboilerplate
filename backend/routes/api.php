<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(["auth:sanctum"])->group(function(){

    Route::prefix("user")->group(function(){
        Route::get("/profile", '\App\Http\Controllers\ProfileController@profile');
        Route::post("/profile", '\App\Http\Controllers\ProfileController@updateProfile');
        Route::post("/change-password", '\App\Http\Controllers\ProfileController@changePassword');
    });

    Route::apiResource("users", \App\Http\Controllers\UserController::class);
    Route::apiResource("roles", \App\Http\Controllers\RoleController::class);

});

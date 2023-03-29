<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\GradesController;
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
Route::post('register/', [UserController::class, 'register']);  
Route::post('login/', [UserController::class, 'login']);
Route::post('forgot-password/', [UserController::class, 'forgotPassword']);

Route::middleware('auth:sanctum')->group(function() {
  Route::post('logout/', [UserController::class, 'logout']);
  Route::get('users/{role}', [UserController::class, 'showUsersbyRole']);
  Route::resource('subjects', SubjectController::class);
  Route::resource('grades', GradesController::class);
  Route::get('user-tor/{id}', [GradesController::class, 'showTor']);
  Route::get('show-graph', [SubjectController::class, 'showGraph']);
});

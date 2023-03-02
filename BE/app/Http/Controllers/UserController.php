<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function register(Request $request) {
      $fields = $request->validate([
        'name' => 'required|string',
        'email' => 'required|string|unique:users,email',
        'role' => 'required'
      ]);

      $pass = $fields['role'] === 'admin' ? $request->input('password') : '1234';

      $user = User::create([
        'name' => $fields['name'],
        'email' => $fields['email'],
        'role' => $fields['role'],
        'fb' => $request->input('fb'),
        'instagram' => $request->input('instagram'),
        'twitter' => $request->input('twitter'),
        'other_social_link' => $request->input('other_social_link'),
        'course' => $request->input('course'),
        'password' => bcrypt($pass),
      ]);

      $token = $user->createToken('uniquetoken')->plainTextToken;

      $response = [
        'user' => $user,
        'token' => $token
      ];

      return response($response, 201);
    }

    public function login(Request $request) {
      $fields = $request->validate([
        'email' => 'required',
        'password' => 'required'
      ]);

      $user = User::where('email', $fields['email'])->first();

      if(!$user || !Hash::check($fields['password'], $user->password)) {
        return response([
          'message' => 'Email or password do not match'
        ], 400);
      } else {
        $token = $user->createToken('uniquetoken')->plainTextToken;

        return response([
          'user' => $user,
          'token' => $token
        ], 200);

      }
    }

    public function forgotPassword(Request $request) {
      $fields = $request->validate([
        'email' => 'required',
        'password' => 'required',
        'new_password' => 'required',
      ]);

      $user = User::where('email', $fields['email'])->first();

      if(!$user || !Hash::check($fields['password'], $user->password)) {
        return response([
          'message' => 'Email or password do not match'
        ], 400);
      } else {
        $user->password = bcrypt($fields['new_password']);
        $user->save();
        
        $token = $user->createToken('uniquetoken')->plainTextToken;
          return response([
            'user' => $user,
            'token' => $token
          ], 200);

      }
    }

    public function showUsersbyRole($role) {
      return User::where('role', $role)->get();
    }

    public function logout(Request $request) {
      auth()->user()->tokens()->delete();
      return [
        'message' => 'Logged out'
      ];
    }
}

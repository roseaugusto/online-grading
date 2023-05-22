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
        'contact' => $request->input('contact'),
        'address' => $request->input('address'),
        'birthdate' => $request->input('birthdate'),
        'id_number' => $request->input('id_number'),
        'gender' => $request->input('gender'),
        'civil_status' => $request->input('civil_status'),
        'religion' => $request->input('religion'),
        'nationality' => $request->input('nationality'),
        'father_occupation' => $request->input('father_occupation'),
        'mother_occupation' => $request->input('mother_occupation'),
        'guardian' => $request->input('guardian'),
        'guardian_contact' => $request->input('guardian_contact'),
      ]);

      $token = $user->createToken('uniquetoken')->plainTextToken;

      $response = [
        'user' => $user,
        'token' => $token
      ];

      return response($response, 201);
    }

    public function bulkStudentRegistration(Request $request) {

      // Retrieve the data from the HTTP POST request
      $usersData = $request->input('users');

      // Hash the passwords in the users data
      foreach ($usersData as &$userData) {
          $userData['password'] = bcrypt('1234');
      }

      // Perform bulk registration using the User model and the insert() method
      User::insert($usersData);

      // Return a response indicating success or perform any other necessary actions
      return response()->json(['message' => 'Bulk registration successful']);

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

    public function updateUser(Request $request) {
      $fields = $request->validate([
        'name' => 'required',
      ]);

      $user = User::where('email', auth()->user()->email)->first();

      if(!$user) {
        return response([
          'message' => 'Not found'
        ], 400);
      } else {

        $user->name = $fields['name'];
        $user->fb = $request->input('fb');
        $user->instagram = $request->input('instagram');
        $user->twitter = $request->input('twitter');
        $user->other_social_link = $request->input('other_social_link');
        $user->contact = $request->input('contact');
        $user->address = $request->input('address');
        $user->birthdate = $request->input('birthdate');
        $user->id_number = $request->input('id_number');
        $user->gender = $request->input('gender');
        $user->civil_status = $request->input('civil_status');
        $user->religion = $request->input('religion');
        $user->nationality = $request->input('nationality');
        $user->father_occupation = $request->input('father_occupation');
        $user->mother_occupation = $request->input('mother_occupation');
        $user->guardian = $request->input('guardian');
        $user->guardian_contact = $request->input('guardian_contact');
        $user->save();
        
          return response([
            'message' => 'success',
          ], 200);

      }
    }

    public function showUsersbyRole($role) {
      $keyword = request()->query('keyword', '');
      $v = User::where('role', $role);
      
      if($keyword) {
        $v = $v->where('name', 'like', '%'.$keyword.'%')->get();
      } else {
        $v = $v->get();
      }

      return response($v);
    }

    public function showUser() {
      return response(User::find(auth()->user()->id));
    }

    public function logout(Request $request) {
      auth()->user()->tokens()->delete();
      return [
        'message' => 'Logged out'
      ];
    }
}

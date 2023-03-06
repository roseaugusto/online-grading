<?php

namespace App\Http\Controllers;

use App\Models\Grades;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GradesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $user_grades = Grades::with('student')->where('user', auth()->user()->id)->get();
      response([$user_grades], 201);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
          'user_id' => 'required',
          'subject_id' => 'required',
          'year' => 'required',
          'school_year' => 'required',
        ]);

        $grade = Grades::create([
          'user_id' => $fields['user_id'],
          'subject_id' => $fields['subject_id'],
          'year' => $fields['year'],
          'school_year' => $fields['school_year'],
        ]);

        response($grade, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      $user_grades = Grades::with('student')->find($id);
      response([$user_grades], 201);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}

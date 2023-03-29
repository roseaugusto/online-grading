<?php

namespace App\Http\Controllers;

use App\Models\Grades;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GradesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
      $yearQuery = request()->query('year', '');
      $keyword = request()->query('keyword');
      $user_grades = Grades::with('subject.instructor')->where('user_id', auth()->user()->id);
      if($yearQuery!== 'null') {
        $user_grades = $user_grades->where('year', $yearQuery);
      }

      if($keyword !== 'null') {
        $user_grades = $user_grades->wherehas('subject', function($query) use ($keyword) {
          $query->where('name', 'like', '%'.$keyword.'%');
        })->orWhereHas('subject.instructor', function($query) use ($keyword) {
          $query->where('name', 'like', '%'.$keyword.'%')->where('user_id', auth()->user()->id);
        })->orWhere('school_year', 'like', '%'.$keyword.'%');
        
      }
      return response($user_grades->get());
    }

    public function showTor($id)
    {
      $user_grades = Grades::with('subject')->with('user')->where('user_id', $id)->get()->groupBy('year');
      return response($user_grades);
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
      $fields = $request->validate([
        'grade' => 'required',
        'type' => 'required',
      ]);

      $grade = Grades::find($id);
      $fields['type'] === 'midterm' ? ($grade->midterm = $fields['grade']) : ($grade->finals = $fields['grade']);
      $grade->save();
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

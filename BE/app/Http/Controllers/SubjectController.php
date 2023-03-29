<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\User;
use App\Models\Grades;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      if(auth()->user()->role === 'admin') {
        $v = Subject::with('instructor')->with('students.user');
      } else if(auth()->user()->role === 'instructor') {
        $v = Subject::with('students.user')->with('instructor')->where('instructor_id', auth()->user()->id);
      } else if(auth()->user()->role === 'student') {
        $v = Subject::with('instructor')->with('students.user')->whereHas('students', function($query) {
          $query->where('user_id', auth()->user()->id);
        });
      } 

      $keyword = request()->query('keyword', '');

        if($keyword) {
          $v = $v->where('name', 'like', '%'.$keyword.'%')->get();
        } else {
          $v = $v->get();
        }
      
     return response($v);
    }

    public function showGraph() {
      $year = request()->query('year', '2023');
      if(auth()->user()->role === 'admin') {
      $grades = Subject::with('students.user')->withSum('students', 'midterm')->withSum('students', 'finals')->get();
    } else if(auth()->user()->role === 'student') {
      // $grades = Subject::with(['students' => function($query) {
      //   $query->selectRaw('YEAR(created_at) as year, 
      //   MONTH(created_at) as month, 
      //   SUM(midterm) as midterm_total, 
      //   SUM(finals) as finals_total');
      // }])->whereHas('students', function($query) {
      //   $query->where('user_id', auth()->user()->id);
      // })->get();
      //$grades = Grades::with('subject')->where('user_id', auth()->user()->id)->get()->groupBy('subject_id');
      $year = $year === 'null' ? '2023': $year;
      $grades = Subject::with('students.user')->whereHas('students', function($query) use ($year){
        $query->where('user_id', auth()->user()->id)->whereYear('created_at', $year);
      })->get();
    }
      return response($grades);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
        'name' => 'required|string',
        'schedule' => 'required',
        'instructor_id' => 'required'
      ]);

      $sub = Subject::create([
        'name' => $fields['name'],
        'code' => $request->input('code'),
        'schedule' => $fields['schedule'],
        'instructor_id' => $fields['instructor_id'],
      ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      $user_grades = Subject::with('students.user')->where('id', $id)->get();
      return response($user_grades, 201);
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

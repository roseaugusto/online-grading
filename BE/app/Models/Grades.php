<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grades extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'subject_id', 'midterm', 'finals', 'year', 'school_year'];

    public function user(){
      return $this->belongsTo(User::class, 'user_id');
    }

    public function subject(){
      return $this->belongsTo(Subject::class, 'subject_id');
    }
}

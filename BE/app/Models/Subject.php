<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
      'name',
      'code',
      'schedule',
      'instructor_id',
  ];

  public function instructor() {
    return $this->belongsTo(User::class, 'instructor_id');
  }

  public function students() {
    return $this->hasMany(Grades::class, 'subject_id');
  }
}

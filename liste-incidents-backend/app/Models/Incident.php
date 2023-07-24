<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';

    use HasFactory;

    protected $fillable = ['titre', 'texte', 'visible', 'date_creation', 'date_modification'];
}

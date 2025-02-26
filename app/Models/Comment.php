<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['text'];
    protected $table = 'comments';

    public function replies(): HasMany
    {
        return $this->hasMany(Reply::class);
    }

    public function hasReachedReplyLimit(): bool
    {
        return $this->replies()->count() == 5;
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResoucre;
use App\Models\Comment;

class CommentController extends Controller
{
    public function index()
    {
        $comments = Comment::with('replies')->orderBy('created_at', 'desc')->get();
        
        return $this->apiResponse(CommentResoucre::collection($comments));
    }


    public function show($id)
    {
        $comment = Comment::find($id);

        if(!$comment){
            return response()->json([
                'error' => 'Comment Not Found',
                'code' => 404,
            ]);
        }

        $comment->load('replies');

        return $this->apiResponse(new CommentResoucre($comment));
    }

    public function store(StoreCommentRequest $request)
    {
        $validated = $request->validated();
        $comment = Comment::create($validated);
    
        return $this->apiResponse(new CommentResoucre($comment));
    }
}

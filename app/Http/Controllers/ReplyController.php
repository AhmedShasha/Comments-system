<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReplyRequest;
use App\Http\Resources\CommentResoucre;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ReplyController extends Controller
{
    /**
     * Store a new reply for a comment.
     *
     * @param StoreReplyRequest $request
     * @return JsonResponse
     */
    public function store(StoreReplyRequest $request)
    {
        DB::beginTransaction();

        try {
            $comment = Comment::findOrFail($request->comment_id);

            if ($comment->hasReachedReplyLimit()) {
                return response()->json([
                    'error' => 'Reply limit reached',
                    'code' => 422,
                ], 422);
            }

            $comment->replies()->create($request->validated());
            $comment->load('replies');

            DB::commit();

            return $this->apiResponse(new CommentResoucre($comment), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to store reply',
                'code' => 500,
            ], 500);
        }
    }
}

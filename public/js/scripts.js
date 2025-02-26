$(document).ready(function() {
    const API_BASE_URL = '/api/comments';

    // Fetch and display comments
    const loadComments = async () => {
        try {
            const response = await $.get(`${API_BASE_URL}`);
            $('#comments').empty();

            // Create a document fragment
            const fragment = document.createDocumentFragment();

            response.data.forEach(comment => {
                const replyCount = comment.replies ? comment.replies.length : 0;
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment-card';
                commentDiv.setAttribute('data-comment-id', comment.id);
                commentDiv.innerHTML = `
                    <p class="mb-2">${comment.text}</p>
                    <button class="btn btn-sm btn-outline-primary reply-btn" data-comment-id="${comment.id}" ${replyCount >= 5 ? 'disabled' : ''}>
                        Reply
                    </button>
                    <span class="reply-count">${replyCount}/5 replies</span>
                    ${replyCount > 0 ? `
                        <button class="btn btn-sm btn-outline-secondary toggle-replies-btn" data-comment-id="${comment.id}">
                            Show Replies
                        </button>
                    ` : ''}
                    <div class="replies mt-3 hidden" data-comment-id="${comment.id}">
                        ${comment.replies ? comment.replies.map(reply => `
                            <div class="reply-card">
                                <p class="mb-0">${reply.text}</p>
                            </div>
                        `).join('') : ''}
                    </div>
                    <form class="reply-form hidden" data-comment-id="${comment.id}">
                        <div class="mb-2">
                            <textarea name="text" class="form-control" rows="2" placeholder="Write a reply..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-sm btn-success">Submit Reply</button>
                    </form>
                `;
                fragment.appendChild(commentDiv);
            });

            $('#comments').append(fragment);
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    // Load comments on page load
    loadComments();

    // Add a new main comment
    $('#add-comment-form').on('submit', async function(e) {
        e.preventDefault();
        const content = $('#new-comment').val().trim();

        if (content) {
            try {
                await $.post(API_BASE_URL, {
                    text: content
                });
                $('#new-comment').val('');
                loadComments();
            } catch (error) {
                alert('Error adding comment: ' + error.responseJSON.error);
            }
        }
    });

    // Handle reply button click
    $(document).on('click', '.reply-btn', function() {
        const commentId = $(this).data('comment-id');
        const replyForm = $(`.reply-form[data-comment-id="${commentId}"]`);
        replyForm.toggleClass('hidden');
    });

    // Handle reply form submission
    $(document).on('submit', '.reply-form', async function(e) {
        e.preventDefault();
        const commentId = $(this).data('comment-id');
        const content = $(this).find('textarea').val().trim();

        if (content) {
            try {
                await $.post(`${API_BASE_URL}/replies`, {
                    text: content,
                    comment_id: commentId
                });
                loadComments();
            } catch (error) {
                alert('Error adding reply: ' + error.responseJSON.error);
            }
        }
    });

    // Handle toggle replies button click
    $(document).on('click', '.toggle-replies-btn', function() {
        const commentId = $(this).data('comment-id');
        const repliesContainer = $(`.replies[data-comment-id="${commentId}"]`);
        const button = $(this);

        // Toggle visibility of replies
        repliesContainer.toggleClass('hidden');

        // Update button text
        if (repliesContainer.hasClass('hidden')) {
            button.text('Show Replies');
        } else {
            button.text('Hide Replies');
        }
    });
});
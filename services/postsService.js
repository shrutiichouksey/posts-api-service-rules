const postsRepo = require('../repositories/postsRepo');
const AppError = require('../utils/AppError');

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

async function editPost(postId, userId, changes) {
    const post = await postsRepo.findById(postId);

    // 1. Post must exist
    if (!post) {
        throw new AppError('Post not found', 404);
    }

    // 2. Only the author can edit
    if (post.authorId !== userId) {
        throw new AppError('You can only edit your own post', 403);
    }

    // 3. Post must be edited within 24 hours
    if (Date.now() - new Date(post.createdAt).getTime() > EDIT_WINDOW_MS) {
        throw new AppError('Post can no longer be edited', 403);
    }

    return postsRepo.update(postId, changes);
}

module.exports = {
    editPost
};
//postId, userId, changes
//postsService.js
const postsRepo = require('../repositories/postsRepo');
const commentsRepo = require('../repositories/commentsRepo');
const AppError = require('../utils/AppError');

async function addComment(postId, userId, body) {
    // =========================
    // GUARDS — NO WRITES YET
    // =========================

    // 1. Post must exist
    const post = await postsRepo.findById(postId);

    if (!post) {
        throw new AppError('Post not found', 404);
    }

    // 2. Post must not be locked
    if (post.locked) {
        throw new AppError('Post is locked for new comments', 409);
    }

    // =========================
    // WRITES — AFTER ALL GUARDS
    // =========================

    // 3. Insert comment
    const comment = await commentsRepo.insert({
        postId,
        authorId: userId,
        body
    });

    // 4. Increment comment count
    await postsRepo.incrementCommentCount(postId);

    // 5. Return created comment
    return comment;
}

module.exports = {
    addComment
};
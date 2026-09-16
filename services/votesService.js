const postsRepo = require('../repositories/postsRepo');
const votesRepo = require('../repositories/votesRepo');
const AppError = require('../utils/AppError');

async function castVote(postId, userId) {
    // 1. Post must exist
    const post = await postsRepo.findById(postId);

    if (!post) {
        throw new AppError('Post not found', 404);
    }

    // 2. User can vote only once
    const existingVote = await votesRepo.findByUserAndPost(postId, userId);

    if (existingVote) {
        throw new AppError('You have already voted on this post', 409);
    }

    return votesRepo.insert(postId, userId);
}

module.exports = {
    castVote
};
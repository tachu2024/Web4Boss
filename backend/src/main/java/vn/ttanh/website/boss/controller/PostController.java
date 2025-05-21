package vn.ttanh.website.boss.controller;

import vn.ttanh.website.boss.model.Post;
import vn.ttanh.website.boss.repository.PostRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping
    public List<Post> getPosts(
            @RequestParam(required = false) String topicId,
            Authentication authentication) {
        String userId = authentication.getName();
        log.info("Fetching posts for user: {} and topic: {}", userId, topicId);
        
        if (topicId != null && !topicId.isEmpty()) {
            return postRepository.findByUserIdAndTopicId(userId, topicId);
        }
        return postRepository.findByUserId(userId);
    }

    @PostMapping
    public Post createPost(@RequestBody Post post, Authentication authentication) {
        log.info("Creating new post: {} for user: {}", post.getTitle(), authentication.getName());
        post.setUserId(authentication.getName());
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

    @PutMapping("/{id}")
    public Post updatePost(@PathVariable String id, @RequestBody Post updatedPost, Authentication authentication) {
        log.info("Updating post: {} for user: {}", id, authentication.getName());
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Kiểm tra quyền sở hữu
        if (!existingPost.getUserId().equals(authentication.getName())) {
            throw new RuntimeException("Unauthorized to update this post");
        }

        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setFields(updatedPost.getFields());
        existingPost.setUpdatedAt(new Date());

        return postRepository.save(existingPost);
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable String id, Authentication authentication) {
        log.info("Deleting post: {} for user: {}", id, authentication.getName());
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Kiểm tra quyền sở hữu
        if (!post.getUserId().equals(authentication.getName())) {
            throw new RuntimeException("Unauthorized to delete this post");
        }

        postRepository.deleteById(id);
    }
}
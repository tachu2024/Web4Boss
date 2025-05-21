package vn.ttanh.website.boss.controller;

import vn.ttanh.website.boss.model.Post;
import vn.ttanh.website.boss.repository.PostRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // Lấy bài viết của user đang đăng nhập theo chủ đề
    @GetMapping
    public List<Post> getPosts(
            @RequestParam(required = false) String topicId,
            Authentication authentication) {
        String username = authentication.getName();
        log.info("Retrieving posts for user {} and topic {}", username, topicId);
        
        if (topicId != null && !topicId.isEmpty()) {
            return postRepository.findByUserIdAndTopicId(username, topicId);
        }
        return postRepository.findByUserId(username);
    }

    // Tạo bài viết
    @PostMapping
    public Post createPost(@RequestBody Post post, Authentication authentication) {
        String username = authentication.getName();
        log.info("Creating post for user {} in topic {}", username, post.getTopicId());
        post.setUserId(username);
        return postRepository.save(post);
    }

    // Cập nhật bài viết
    @PutMapping("/{id}")
    public Post updatePost(@PathVariable String id, @RequestBody Post updatedPost, Authentication authentication) {
        log.info("Updating post {}", id);
        Optional<Post> optPost = postRepository.findById(id);
        if (optPost.isEmpty()) {
            throw new RuntimeException("Post not found");
        }
        Post post = optPost.get();
        if (!post.getUserId().equals(authentication.getName())) {
            throw new RuntimeException("Not authorized");
        }
        post.setContent(updatedPost.getContent());
        return postRepository.save(post);
    }

    // Xoá bài viết
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable String id, Authentication authentication) {
        Optional<Post> optPost = postRepository.findById(id);
        if (optPost.isEmpty()) {
            throw new RuntimeException("Post not found");
        }
        Post post = optPost.get();
        if (!post.getUserId().equals(authentication.getName())) {
            throw new RuntimeException("Not authorized");
        }
        postRepository.delete(post);
    }
}
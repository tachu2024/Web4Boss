package vn.ttanh.website.boss.repository;

import vn.ttanh.website.boss.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserId(String userId);
    List<Post> findByUserIdAndTopicId(String userId, String topicId);
}

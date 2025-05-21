package vn.ttanh.website.boss.repository;

import vn.ttanh.website.boss.model.Topic;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface TopicRepository extends MongoRepository<Topic, String> {
    List<Topic> findByUserId(String userId);
    List<Topic> findByUserIdAndParentIdIsNull(String userId);
    List<Topic> findByParentId(String parentId);
    Optional<Topic> findByName(String name);
    List<Topic> findByParentIdIsNull();
} 
package vn.ttanh.website.boss.repository;

import vn.ttanh.website.boss.model.TopicField;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TopicFieldRepository extends MongoRepository<TopicField, String> {
    List<TopicField> findByTopicIdOrderByOrderAsc(String topicId);
    void deleteByTopicId(String topicId);
} 
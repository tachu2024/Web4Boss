package vn.ttanh.website.boss.controller;

import vn.ttanh.website.boss.model.Topic;
import vn.ttanh.website.boss.repository.TopicRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicRepository topicRepository;

    public TopicController(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    // Lấy tất cả topic của user
    @GetMapping
    public List<Topic> getTopics(Authentication authentication) {
        String username = authentication.getName();
        log.info("Retrieving topics for user: " + username);
        return topicRepository.findByUserId(username);
    }

    // Lấy các topic chính (không có parent)
    @GetMapping("/main")
    public List<Topic> getMainTopics(Authentication authentication) {
        String username = authentication.getName();
        log.info("Retrieving main topics for user: " + username);
        return topicRepository.findByUserIdAndParentIdIsNull(username);
    }

    // Lấy các topic con của một topic
    @GetMapping("/{parentId}/children")
    public List<Topic> getChildTopics(@PathVariable String parentId) {
        log.info("Retrieving child topics for parent: " + parentId);
        return topicRepository.findByParentId(parentId);
    }

    // Tạo topic mới
    @PostMapping
    public Topic createTopic(@RequestBody Topic topic, Authentication authentication) {
        String username = authentication.getName();
        log.info("Creating new topic for user: " + username);
        topic.setUserId(username);
        topic.setActive(true);
        return topicRepository.save(topic);
    }

    // Cập nhật topic
    @PutMapping("/{id}")
    public Topic updateTopic(@PathVariable String id, @RequestBody Topic updatedTopic, Authentication authentication) {
        log.info("Updating topic: " + id);
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        
        if (!topic.getUserId().equals(authentication.getName())) {
            throw new RuntimeException("Not authorized");
        }

        topic.setName(updatedTopic.getName());
        topic.setDescription(updatedTopic.getDescription());
        topic.setIcon(updatedTopic.getIcon());
        return topicRepository.save(topic);
    }

    // Xóa topic
    @DeleteMapping("/{id}")
    public void deleteTopic(@PathVariable String id, Authentication authentication) {
        log.info("Deleting topic: " + id);
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        
        if (!topic.getUserId().equals(authentication.getName())) {
            throw new RuntimeException("Not authorized");
        }

        // Xóa tất cả topic con trước
        List<Topic> childTopics = topicRepository.findByParentId(id);
        topicRepository.deleteAll(childTopics);
        
        // Sau đó xóa topic chính
        topicRepository.delete(topic);
    }
} 
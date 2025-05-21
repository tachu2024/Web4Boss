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

    @GetMapping("/{id}")
    public Topic getTopic(@PathVariable String id, Authentication authentication) {
        log.info("Fetching topic with id: {} for user: {}", id, authentication.getName());
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        
        // Kiểm tra quyền truy cập
        if (!topic.getUserId().equals(authentication.getName())) {
            throw new RuntimeException("Unauthorized to access this topic");
        }
        
        return topic;
    }

    @GetMapping("/main")
    public List<Topic> getMainTopics(Authentication authentication) {
        log.info("Fetching main topics for user: {}", authentication.getName());
        return topicRepository.findByUserIdAndParentIdIsNull(authentication.getName());
    }

    @GetMapping("/{id}/children")
    public List<Topic> getChildTopics(@PathVariable String id, Authentication authentication) {
        log.info("Fetching children for topic: {} and user: {}", id, authentication.getName());
        // Kiểm tra quyền truy cập topic cha
        Topic parentTopic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parent topic not found"));
        
        if (!parentTopic.getUserId().equals(authentication.getName())) {
            throw new RuntimeException("Unauthorized to access this topic's children");
        }
        
        return topicRepository.findByParentId(id);
    }

    @PostMapping
    public Topic createTopic(@RequestBody Topic topic, Authentication authentication) {
        log.info("Creating new topic: {} for user: {}", topic.getName(), authentication.getName());
        topic.setUserId(authentication.getName());
        return topicRepository.save(topic);
    }

    @PutMapping("/{id}")
    public Topic updateTopic(@PathVariable String id, @RequestBody Topic updatedTopic, Authentication authentication) {
        log.info("Updating topic: {} for user: {}", id, authentication.getName());
        Topic existingTopic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        // Kiểm tra quyền sở hữu
        if (!existingTopic.getUserId().equals(authentication.getName())) {
            throw new RuntimeException("Unauthorized to update this topic");
        }

        existingTopic.setName(updatedTopic.getName());
        existingTopic.setDescription(updatedTopic.getDescription());
        existingTopic.setIcon(updatedTopic.getIcon());
        existingTopic.setParentId(updatedTopic.getParentId());

        return topicRepository.save(existingTopic);
    }

    @DeleteMapping("/{id}")
    public void deleteTopic(@PathVariable String id, Authentication authentication) {
        log.info("Deleting topic: {} for user: {}", id, authentication.getName());
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        // Kiểm tra quyền sở hữu
        if (!topic.getUserId().equals(authentication.getName())) {
            throw new RuntimeException("Unauthorized to delete this topic");
        }

        // Xóa tất cả topic con trước
        List<Topic> childTopics = topicRepository.findByParentId(id);
        topicRepository.deleteAll(childTopics);

        // Sau đó xóa topic chính
        topicRepository.deleteById(id);
    }
} 
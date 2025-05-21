package vn.ttanh.website.boss.controller;

import vn.ttanh.website.boss.model.TopicField;
import vn.ttanh.website.boss.repository.TopicFieldRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/topic-fields")
public class TopicFieldController {

    private final TopicFieldRepository topicFieldRepository;

    public TopicFieldController(TopicFieldRepository topicFieldRepository) {
        this.topicFieldRepository = topicFieldRepository;
    }

    @GetMapping("/topic/{topicId}")
    public List<TopicField> getFieldsByTopic(@PathVariable String topicId) {
        log.info("Fetching fields for topic: {}", topicId);
        List<TopicField> fields = topicFieldRepository.findByTopicIdOrderByOrderAsc(topicId);
        log.info("Found {} fields", fields.size());
        return fields;
    }

    @PostMapping
    public TopicField createField(@RequestBody TopicField field, Authentication authentication) {
        log.info("Creating field for topic {}: {}", field.getTopicId(), field.getName());
        return topicFieldRepository.save(field);
    }

    @PutMapping("/{id}")
    public TopicField updateField(@PathVariable String id, @RequestBody TopicField field) {
        TopicField existingField = topicFieldRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Field not found"));
        
        existingField.setName(field.getName());
        existingField.setKey(field.getKey());
        existingField.setType(field.getType());
        existingField.setRequired(field.isRequired());
        existingField.setDescription(field.getDescription());
        existingField.setOrder(field.getOrder());
        
        return topicFieldRepository.save(existingField);
    }

    @DeleteMapping("/{id}")
    public void deleteField(@PathVariable String id) {
        topicFieldRepository.deleteById(id);
    }

    @DeleteMapping("/topic/{topicId}")
    public void deleteAllFieldsByTopic(@PathVariable String topicId) {
        topicFieldRepository.deleteByTopicId(topicId);
    }
} 
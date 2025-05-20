package vn.ttanh.website.boss.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "topics")
public class Topic {
    @Id
    private String id;
    private String name;
    private String parentId;  // null nếu là topic chính
    private String userId;    // người tạo topic
    private String description;
    private String icon;      // icon cho topic (có thể là emoji hoặc tên icon)
    private boolean isActive;
} 
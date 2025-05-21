package vn.ttanh.website.boss.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Map;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String userId;
    private String topicId;
    private String title;           // Tiêu đề bài viết
    private Map<String, Object> fields; // Lưu các trường động theo key-value
    private Date createdAt;
    private Date updatedAt;
}

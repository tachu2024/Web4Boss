package vn.ttanh.website.boss.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String content;
    private String userId;
}

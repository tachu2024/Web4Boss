package vn.ttanh.website.boss.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "topic_fields")
public class TopicField {
    @Id
    private String id;
    private String topicId;
    private String name;        // Tên trường (ví dụ: "tên xe", "hãng", "năm sản xuất")
    private String key;         // Key để lưu trong database (ví dụ: "carName", "brand", "year")
    private String type;        // Loại dữ liệu: text, number, date, image, video, array
    private boolean required;   // Bắt buộc hay không
    private String description; // Mô tả trường
    private int order;         // Thứ tự hiển thị
} 
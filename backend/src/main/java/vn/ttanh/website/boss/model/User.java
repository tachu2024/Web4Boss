package vn.ttanh.website.boss.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private String email;
    private String phone;
    private String fullname;
    private String sex;
    private String birthday;
    private String address;
    private String occupation;
    private String hobby;
}

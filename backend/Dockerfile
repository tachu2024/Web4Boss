# Build stage
FROM maven:3.8.6-jdk-18 AS build
WORKDIR /backend
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:18-jre
WORKDIR /backend
COPY --from=build /backend/target/*.jar app.jar

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=prod
ENV PORT=8081

# Expose the port
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 
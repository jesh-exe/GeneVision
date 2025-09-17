FROM openjdk:21-jdk-slim

# Set working dir
WORKDIR /app

# Copy the built jar (make sure you run mvn clean package first)
COPY target/*.jar app.jar

# Expose backend port
EXPOSE 8080

# Start app
ENTRYPOINT ["java", "-jar", "app.jar"]


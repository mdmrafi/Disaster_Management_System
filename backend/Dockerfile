# =========================================================
# Multi-stage Dockerfile for the Spring Boot backend.
# Picked up by Render's Docker runtime (see ../render.yaml).
# =========================================================

# ---------- Build stage ----------
FROM eclipse-temurin:17-jdk AS build
WORKDIR /workspace

# Cache dependencies first so unchanged pom.xml doesn't bust the layer.
COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml ./
RUN chmod +x mvnw && ./mvnw -B -q -DskipTests dependency:go-offline

# Now copy sources and build the fat jar.
COPY src ./src
RUN ./mvnw -B -q -DskipTests package

# ---------- Runtime stage ----------
FROM eclipse-temurin:17-jre
WORKDIR /app

# Run as a non-root user for safer defaults.
RUN useradd -ms /bin/bash spring
USER spring

# Copy the fat jar built in the previous stage.
COPY --from=build /workspace/target/*.jar /app/app.jar

# Render injects $PORT; default to 8080 for local runs.
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
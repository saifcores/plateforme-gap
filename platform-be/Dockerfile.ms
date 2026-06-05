FROM maven:3.9-eclipse-temurin-21 AS build
ARG MODULE
WORKDIR /app
COPY pom.xml .
COPY gap-common gap-common
COPY gap-utilisateur gap-utilisateur
COPY gap-security gap-security
COPY gap-pedagogie gap-pedagogie
COPY gap-communication gap-communication
COPY gap-administration gap-administration
COPY gap-insertion gap-insertion
COPY gap-document gap-document
COPY gap-config gap-config
COPY gap-app gap-app
COPY gap-ms-identite gap-ms-identite
COPY gap-ms-pedagogie gap-ms-pedagogie
COPY gap-ms-administration gap-ms-administration
COPY gap-ms-insertion gap-ms-insertion
COPY gap-ms-document gap-ms-document
COPY gap-gateway gap-gateway
RUN mvn -pl ${MODULE} -am package -DskipTests

FROM eclipse-temurin:21-jre
ARG MODULE
WORKDIR /app
COPY --from=build /app/${MODULE}/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

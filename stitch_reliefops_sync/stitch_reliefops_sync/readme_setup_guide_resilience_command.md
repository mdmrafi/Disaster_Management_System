# Project README & Setup Guide

## Project Title
**Disaster Management and Relief Camp Resource Allocation System (Resilience Command)**

## Overview
A production-quality system for disaster relief coordination, featuring a Spring Boot backend and a React frontend.

## Technology Stack
- **Backend**: Java 17, Spring Boot 3.x, JPA/Hibernate, MySQL.
- **Frontend**: React 18 (Vite), Tailwind CSS, Axios, React Router.
- **Architecture**: Layered (Controller, Service, Repository, Entity, DTO).

## Setup Instructions

### 1. Database Setup (MySQL)
1. Create a database named `resilience_command`.
2. Run `schema.sql` to create tables.
3. Run `triggers.sql` to install safety-net triggers.
4. Run `sample_data.sql` for initial testing data.

### 2. Backend Setup (Spring Boot)
1. Open the project in IntelliJ IDEA.
2. Configure `src/main/resources/application.properties` with your MySQL credentials.
3. Run the application using Maven: `./mvnw spring-boot:run`.
4. API will be available at `http://localhost:8080/api`.

### 3. Frontend Setup (React)
1. Navigate to the `frontend/` directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.
4. The frontend will be available at `http://localhost:5173`.

## Core Logic
### Resource Allocation Algorithm
1. **Camp Need Assessment**: Evaluates victims by priority (HIGH > MEDIUM > LOW).
2. **Prioritization**: In multi-camp scenarios with limited resources, camps with higher counts of HIGH-priority victims are fulfilled first.
3. **Transaction Integrity**: Allocations are atomic; stock is deducted and allocation recorded within a single transaction.

### Shortage Monitoring
- **Food**: Triggered if < 1 unit per occupant.
- **Medical**: Triggered if victims have conditions and MEDICAL resources are zero.
- **Urgent**: Flagged if 2+ conditions are met OR if any HIGH-priority victim exists alongside 1+ shortage condition.

## CORS Configuration
This project uses **Option A (Decoupled)**. CORS is configured in `WebConfig.java` to allow the Vite dev server origin.
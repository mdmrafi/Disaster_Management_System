-- =====================================================================
-- Disaster Management and Relief Camp Resource Allocation System
-- Schema (3NF normalized, MySQL 8+)
-- Naming: snake_case tables/columns, camelCase Java class names
-- =====================================================================

-- Drop in reverse dependency order so re-running this script is safe.
DROP TABLE IF EXISTS resource_allocation;
DROP TABLE IF EXISTS donation;
DROP TABLE IF EXISTS volunteer_assignment;
DROP TABLE IF EXISTS victim;
DROP TABLE IF EXISTS volunteer;
DROP TABLE IF EXISTS resource;
DROP TABLE IF EXISTS relief_camp;
DROP TABLE IF EXISTS affected_area;
DROP TABLE IF EXISTS disaster;

-- ---------------------------------------------------------------------
-- disaster : top-level event (flood, cyclone, etc.)
-- ---------------------------------------------------------------------
CREATE TABLE disaster (
    disaster_id    BIGINT       NOT NULL AUTO_INCREMENT,
    disaster_name  VARCHAR(150) NOT NULL,
    disaster_type  ENUM('FLOOD','CYCLONE','EARTHQUAKE','LANDSLIDE','OTHER') NOT NULL,
    severity_level ENUM('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL,
    start_date     DATE         NOT NULL,
    end_date       DATE         NULL,
    description    TEXT         NULL,
    PRIMARY KEY (disaster_id),
    CONSTRAINT chk_disaster_dates CHECK (end_date IS NULL OR end_date >= start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- affected_area : one disaster can have many affected areas (1:M)
-- ---------------------------------------------------------------------
CREATE TABLE affected_area (
    area_id     BIGINT       NOT NULL AUTO_INCREMENT,
    area_name   VARCHAR(150) NOT NULL,
    district    VARCHAR(100) NOT NULL,
    population  INT          NOT NULL,
    disaster_id BIGINT       NOT NULL,
    PRIMARY KEY (area_id),
    CONSTRAINT fk_area_disaster
        FOREIGN KEY (disaster_id) REFERENCES disaster(disaster_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_area_population CHECK (population >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- relief_camp : each affected area can host many camps (1:M)
--   current_occupancy is derived from active victim registrations;
--   the service layer is the source of truth, CHECK is a safety net.
-- ---------------------------------------------------------------------
CREATE TABLE relief_camp (
    camp_id           BIGINT       NOT NULL AUTO_INCREMENT,
    camp_name         VARCHAR(150) NOT NULL,
    location          VARCHAR(200) NOT NULL,
    capacity          INT          NOT NULL,
    current_occupancy INT          NOT NULL DEFAULT 0,
    area_id           BIGINT       NOT NULL,
    PRIMARY KEY (camp_id),
    CONSTRAINT fk_camp_area
        FOREIGN KEY (area_id) REFERENCES affected_area(area_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_camp_capacity      CHECK (capacity > 0),
    CONSTRAINT chk_camp_occupancy_nonneg CHECK (current_occupancy >= 0),
    CONSTRAINT chk_camp_occupancy_le_cap CHECK (current_occupancy <= capacity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- victim : belongs to a camp; priority drives the allocation algorithm
-- ---------------------------------------------------------------------
CREATE TABLE victim (
    victim_id        BIGINT NOT NULL AUTO_INCREMENT,
    name             VARCHAR(150) NOT NULL,
    age              INT          NOT NULL,
    gender           VARCHAR(20)  NOT NULL,
    family_members   INT          NOT NULL DEFAULT 0,
    priority_level   ENUM('HIGH','MEDIUM','LOW') NOT NULL,
    medical_condition TEXT        NULL,
    camp_id          BIGINT       NOT NULL,
    PRIMARY KEY (victim_id),
    CONSTRAINT fk_victim_camp
        FOREIGN KEY (camp_id) REFERENCES relief_camp(camp_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_victim_age    CHECK (age >= 0),
    CONSTRAINT chk_victim_family CHECK (family_members >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- volunteer : independent person, status changes via assignments
-- ---------------------------------------------------------------------
CREATE TABLE volunteer (
    volunteer_id        BIGINT NOT NULL AUTO_INCREMENT,
    name                VARCHAR(150) NOT NULL,
    phone               VARCHAR(30)  NOT NULL,
    specialization      ENUM('MEDICAL','LOGISTICS','FOOD_DISTRIBUTION','RESCUE') NOT NULL,
    availability_status ENUM('AVAILABLE','ASSIGNED','UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE',
    PRIMARY KEY (volunteer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- volunteer_assignment : join table (M:N between volunteer and camp)
-- ---------------------------------------------------------------------
CREATE TABLE volunteer_assignment (
    assignment_id BIGINT NOT NULL AUTO_INCREMENT,
    volunteer_id  BIGINT NOT NULL,
    camp_id       BIGINT NOT NULL,
    duty_hours    INT    NULL,
    assigned_date DATE   NOT NULL,
    PRIMARY KEY (assignment_id),
    CONSTRAINT fk_va_volunteer
        FOREIGN KEY (volunteer_id) REFERENCES volunteer(volunteer_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_va_camp
        FOREIGN KEY (camp_id) REFERENCES relief_camp(camp_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_va_volunteer_camp UNIQUE (volunteer_id, camp_id),
    CONSTRAINT chk_va_duty_hours CHECK (duty_hours IS NULL OR duty_hours >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- resource : total vs available; available is derived from donations
--            (+quantity) and allocations (-quantity).
-- ---------------------------------------------------------------------
CREATE TABLE resource (
    resource_id      BIGINT NOT NULL AUTO_INCREMENT,
    resource_name    VARCHAR(150) NOT NULL,
    category         ENUM('FOOD','MEDICAL','SHELTER','EMERGENCY') NOT NULL,
    total_quantity   INT          NOT NULL DEFAULT 0,
    available_quantity INT        NOT NULL DEFAULT 0,
    PRIMARY KEY (resource_id),
    CONSTRAINT chk_resource_total_nonneg    CHECK (total_quantity >= 0),
    CONSTRAINT chk_resource_available_nonneg CHECK (available_quantity >= 0),
    CONSTRAINT chk_resource_available_le_total CHECK (available_quantity <= total_quantity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- donation : incoming stock; linked to a specific disaster
-- ---------------------------------------------------------------------
CREATE TABLE donation (
    donation_id    BIGINT NOT NULL AUTO_INCREMENT,
    donor_name     VARCHAR(150) NOT NULL,
    donation_date  DATE         NOT NULL,
    disaster_id    BIGINT       NOT NULL,
    resource_id    BIGINT       NOT NULL,
    quantity       INT          NOT NULL,
    PRIMARY KEY (donation_id),
    CONSTRAINT fk_donation_disaster
        FOREIGN KEY (disaster_id) REFERENCES disaster(disaster_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_donation_resource
        FOREIGN KEY (resource_id) REFERENCES resource(resource_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_donation_quantity CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- resource_allocation : outgoing stock to a camp
-- ---------------------------------------------------------------------
CREATE TABLE resource_allocation (
    allocation_id    BIGINT NOT NULL AUTO_INCREMENT,
    camp_id          BIGINT NOT NULL,
    resource_id      BIGINT NOT NULL,
    quantity         INT    NOT NULL,
    allocation_date  DATE   NOT NULL,
    PRIMARY KEY (allocation_id),
    CONSTRAINT fk_alloc_camp
        FOREIGN KEY (camp_id) REFERENCES relief_camp(camp_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_alloc_resource
        FOREIGN KEY (resource_id) REFERENCES resource(resource_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_alloc_quantity CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Helpful indexes for the shortage and allocation queries
CREATE INDEX idx_victim_camp_priority ON victim(camp_id, priority_level);
CREATE INDEX idx_alloc_resource       ON resource_allocation(resource_id);
CREATE INDEX idx_alloc_camp           ON resource_allocation(camp_id);
CREATE INDEX idx_donation_resource    ON donation(resource_id);
CREATE INDEX idx_area_disaster        ON affected_area(disaster_id);

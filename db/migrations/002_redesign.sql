-- =====================================================================
-- 002_redesign.sql
-- Additive schema changes for the relief-ops redesign.
-- Run AFTER db/schema.sql, db/triggers.sql, and db/sample_data.sql.
-- All changes are additive (no columns are dropped, no tables renamed).
-- =====================================================================

-- ---------------------------------------------------------------------
-- A1/A14: app_user table for JWT auth
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_user (
    user_id        BIGINT       NOT NULL AUTO_INCREMENT,
    email          VARCHAR(150) NOT NULL,
    password_hash  VARCHAR(200) NOT NULL,
    display_name   VARCHAR(150) NOT NULL,
    role           VARCHAR(20)  NOT NULL,
    created_at     DATETIME(6)  NOT NULL,
    PRIMARY KEY (user_id),
    UNIQUE KEY uq_app_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- A4: Volunteer email (nullable so existing rows stay valid)
-- ---------------------------------------------------------------------
ALTER TABLE volunteer
    ADD COLUMN email VARCHAR(150) NULL AFTER phone;

-- ---------------------------------------------------------------------
-- A5: AffectedArea lat/lng + severity
-- ---------------------------------------------------------------------
ALTER TABLE affected_area
    ADD COLUMN latitude  DOUBLE     NULL,
    ADD COLUMN longitude DOUBLE     NULL,
    ADD COLUMN severity  VARCHAR(20) NULL;

-- ---------------------------------------------------------------------
-- A6/A7: ReliefCamp lat/lng + status (CampStatus enum as VARCHAR)
-- ---------------------------------------------------------------------
ALTER TABLE relief_camp
    ADD COLUMN latitude  DOUBLE     NULL,
    ADD COLUMN longitude DOUBLE     NULL,
    ADD COLUMN status    VARCHAR(20) NULL;

-- ---------------------------------------------------------------------
-- Backfill: mark existing camps ACTIVE so the new status filter is useful
-- ---------------------------------------------------------------------
UPDATE relief_camp SET status = 'ACTIVE' WHERE status IS NULL;

-- ---------------------------------------------------------------------
-- Indexes that the new geo/filter queries will use
-- ---------------------------------------------------------------------
CREATE INDEX idx_relief_camp_status    ON relief_camp (status);
CREATE INDEX idx_affected_area_severity ON affected_area (severity);
CREATE INDEX idx_affected_area_geo      ON affected_area (latitude, longitude);
CREATE INDEX idx_relief_camp_geo        ON relief_camp (latitude, longitude);

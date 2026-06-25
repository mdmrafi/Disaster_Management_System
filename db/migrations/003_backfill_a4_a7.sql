-- Backfill for Phase 2 (A4-A7) optional enum columns added to legacy rows.
-- All new columns are nullable on the DTO, so this is a data-hygiene pass
-- that gives existing rows sensible defaults so the UI doesn't show blanks.
--
-- Idempotent: only updates rows where the column is currently NULL.

USE disaster_db;

-- A4: relief_camp.status -> 'ACTIVE' (camps in service)
UPDATE relief_camp
SET    status = 'ACTIVE'
WHERE  status IS NULL;

-- A5: affected_area.severity -> 'MEDIUM' (neutral default for legacy areas)
UPDATE affected_area
SET    severity = 'MEDIUM'
WHERE  severity IS NULL;

-- A6: volunteer.email already added in 002_redesign as nullable VARCHAR(150).
--     No default is safe to invent here (email must be unique if present), so
--     we leave legacy rows NULL and let admins fill them in via the form.

-- A7: latitude / longitude columns are nullable Doubles; no sensible default
--     exists for geographic coords, so legacy rows stay NULL until edited.

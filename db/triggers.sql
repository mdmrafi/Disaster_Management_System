-- =====================================================================
-- Triggers — DB-level safety nets
--
-- IMPORTANT: the Spring Boot service layer is the PRIMARY enforcement
-- mechanism. These triggers are backstops for the case where data is
-- inserted directly via SQL (admin scripts, fixtures, manual fixes)
-- and bypass the service layer.
--
-- Why "AFTER" update triggers for stock math?
--   In the recommended architecture (option a in the spec), the service
--   layer performs the resource update via a native SQL UPDATE BEFORE
--   the donation/allocation insert, and then calls
--   `entityManager.refresh(resource)` so the in-memory entity state
--   matches the DB. The trigger is the single place that performs the
--   stock arithmetic; the application does not perform it in Java.
--   This avoids the double-update hazard called out in the spec.
-- =====================================================================

DROP TRIGGER IF EXISTS trg_alloc_check_stock;
DROP TRIGGER IF EXISTS trg_alloc_update_stock;
DROP TRIGGER IF EXISTS trg_donation_update_stock;

DELIMITER $$

-- ---------------------------------------------------------------------
-- Trigger 1: prevent over-allocation. Even if a buggy or hostile
-- client bypasses the service-layer check, the DB will reject the row.
-- ---------------------------------------------------------------------
CREATE TRIGGER trg_alloc_check_stock
BEFORE INSERT ON resource_allocation
FOR EACH ROW
BEGIN
    DECLARE v_available INT;
    SELECT available_quantity INTO v_available
        FROM resource WHERE resource_id = NEW.resource_id;
    IF NEW.quantity > v_available THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Allocation quantity exceeds available resource stock';
    END IF;
END$$

-- ---------------------------------------------------------------------
-- Trigger 2: after an allocation row is inserted, decrement the
-- resource's available_quantity by the allocated amount.
-- ---------------------------------------------------------------------
CREATE TRIGGER trg_alloc_update_stock
AFTER INSERT ON resource_allocation
FOR EACH ROW
BEGIN
    UPDATE resource
        SET available_quantity = available_quantity - NEW.quantity
        WHERE resource_id = NEW.resource_id;
END$$

-- ---------------------------------------------------------------------
-- Trigger 3: after a donation row is inserted, increase BOTH the total
-- and available quantities of the linked resource.
-- ---------------------------------------------------------------------
CREATE TRIGGER trg_donation_update_stock
AFTER INSERT ON donation
FOR EACH ROW
BEGIN
    UPDATE resource
        SET available_quantity = available_quantity + NEW.quantity,
            total_quantity     = total_quantity     + NEW.quantity
        WHERE resource_id = NEW.resource_id;
END$$

DELIMITER ;

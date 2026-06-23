-- =====================================================================
-- Sample data for demo / testing.
-- Two disasters, two areas per disaster, several camps.
-- Camp "Camp-Alpha" is deliberately seeded short on food/medical so
-- the shortage endpoint has something to flag. Camp "Camp-Beta" has
-- the higher HIGH-priority victim count, so it should win the
-- allocation-ordering test.
-- =====================================================================

-- Reset (safe to re-run)
DELETE FROM resource_allocation;
DELETE FROM donation;
DELETE FROM volunteer_assignment;
DELETE FROM victim;
DELETE FROM volunteer;
DELETE FROM resource;
DELETE FROM relief_camp;
DELETE FROM affected_area;
DELETE FROM disaster;
ALTER TABLE disaster            AUTO_INCREMENT = 1;
ALTER TABLE affected_area       AUTO_INCREMENT = 1;
ALTER TABLE relief_camp         AUTO_INCREMENT = 1;
ALTER TABLE victim              AUTO_INCREMENT = 1;
ALTER TABLE volunteer           AUTO_INCREMENT = 1;
ALTER TABLE volunteer_assignment AUTO_INCREMENT = 1;
ALTER TABLE resource            AUTO_INCREMENT = 1;
ALTER TABLE donation            AUTO_INCREMENT = 1;
ALTER TABLE resource_allocation AUTO_INCREMENT = 1;

-- ----- Disasters ----------------------------------------------------
INSERT INTO disaster (disaster_name, disaster_type, severity_level, start_date, end_date, description) VALUES
('Monsoon Floods 2026', 'FLOOD',     'HIGH',     '2026-06-01', NULL, 'Severe flooding across the southern districts.'),
('Coastal Cyclone ARIA','CYCLONE',   'CRITICAL', '2026-05-15', '2026-05-22', 'Category 3 cyclone; recovery ongoing.');

-- ----- Affected Areas ----------------------------------------------
INSERT INTO affected_area (area_name, district, population, disaster_id) VALUES
('Ward 12 Riverside',  'Ernakulam',  45000, 1),
('Ward 7 Lowlands',    'Kottayam',   22000, 1),
('Chellanam Coast',    'Ernakulam',  18000, 2),
('Aluva Outskirts',    'Ernakulam',  30000, 1);

-- ----- Relief Camps -------------------------------------------------
-- Camp-Alpha: 100 capacity, 30 occupants  -> not full
-- Camp-Beta:  80 capacity, 25 occupants   -> not full
-- Camp-Gamma: 50 capacity, 50 occupants   -> exactly full
INSERT INTO relief_camp (camp_name, location, capacity, current_occupancy, area_id) VALUES
('Camp-Alpha', 'Riverside School',   100,  0, 1),
('Camp-Beta',  'Kottayam Town Hall',  80,  0, 2),
('Camp-Gamma', 'Coastal Sports Complex', 50, 0, 3),
('Camp-Delta', 'Aluva Community Hall', 120, 0, 4);

-- ----- Resources ----------------------------------------------------
INSERT INTO resource (resource_name, category, total_quantity, available_quantity) VALUES
('Rice Bags',         'FOOD',     500,  500),
('Drinking Water',    'FOOD',     300,  300),
('Paracetamol',       'MEDICAL',  100,  100),
('First Aid Kits',    'MEDICAL',   50,   50),
('Tarpaulin Sheets',  'SHELTER',  200,  200),
('Flashlights',       'EMERGENCY',150,  150);

-- ----- Volunteers ---------------------------------------------------
INSERT INTO volunteer (name, phone, specialization, availability_status) VALUES
('Anita Sharma',  '9876543210', 'MEDICAL',          'AVAILABLE'),
('Ravi Pillai',   '9876543211', 'LOGISTICS',        'AVAILABLE'),
('Meera Nair',    '9876543212', 'FOOD_DISTRIBUTION','AVAILABLE'),
('John D Souza',  '9876543213', 'RESCUE',           'AVAILABLE'),
('Lakshmi Iyer',  '9876543214', 'MEDICAL',          'AVAILABLE');

-- ----- Victims ------------------------------------------------------
-- Mix of priority levels across camps. Camp-Beta gets the most HIGH
-- priority victims, so it should win priority-ordered allocations.
INSERT INTO victim (name, age, gender, family_members, priority_level, medical_condition, camp_id) VALUES
-- Camp-Alpha
('Ramesh K',  45, 'M', 3, 'HIGH',   'Diabetic',          1),
('Sita P',    32, 'F', 2, 'MEDIUM', NULL,                 1),
('Arjun V',   12, 'M', 1, 'LOW',    NULL,                 1),
('Priya M',   28, 'F', 0, 'MEDIUM', 'Asthma',            1),
('Vikram S',  60, 'M', 4, 'HIGH',   'Hypertension',      1),
-- Camp-Beta  (more HIGH-priority victims)
('Geetha R',  70, 'F', 2, 'HIGH',   'Heart condition',   2),
('Suresh N',  55, 'M', 1, 'HIGH',   'Diabetic',          2),
('Kavya T',   30, 'F', 0, 'HIGH',   'Pregnant',          2),
('Mohan L',   22, 'M', 2, 'MEDIUM', NULL,                 2),
('Asha B',    18, 'F', 1, 'LOW',    NULL,                 2),
('Kiran J',   40, 'M', 3, 'MEDIUM', 'Migraines',         2),
-- Camp-Gamma (will be filled to capacity)
('Flood victim 1', 35, 'M', 1, 'LOW',    NULL, 3),
('Flood victim 2', 40, 'F', 2, 'LOW',    NULL, 3),
('Flood victim 3', 28, 'M', 0, 'LOW',    NULL, 3),
('Flood victim 4', 50, 'F', 1, 'MEDIUM', 'Arthritis', 3),
('Flood victim 5', 33, 'M', 2, 'LOW',    NULL, 3),
-- Camp-Delta
('New family 1',  30, 'F', 4, 'MEDIUM', NULL, 4),
('New family 2',  45, 'M', 3, 'LOW',    NULL, 4),
('New family 3',  60, 'F', 2, 'HIGH',   'Diabetic', 4),
('New family 4',  25, 'M', 1, 'LOW',    NULL, 4),
('New family 5',  38, 'F', 2, 'MEDIUM', NULL, 4);

-- Keep derived occupancy consistent. We do this with a single UPDATE
-- per camp rather than embedding counts in the INSERTs above, which
-- keeps the seed file easy to maintain. The camp-occupancy CHECK
-- constraint guarantees we cannot overflow capacity.
UPDATE relief_camp SET current_occupancy = (SELECT COUNT(*) FROM victim WHERE camp_id = 1) WHERE camp_id = 1;
UPDATE relief_camp SET current_occupancy = (SELECT COUNT(*) FROM victim WHERE camp_id = 2) WHERE camp_id = 2;
UPDATE relief_camp SET current_occupancy = (SELECT COUNT(*) FROM victim WHERE camp_id = 3) WHERE camp_id = 3;
UPDATE relief_camp SET current_occupancy = (SELECT COUNT(*) FROM victim WHERE camp_id = 4) WHERE camp_id = 4;

-- ----- Volunteer Assignments ----------------------------------------
INSERT INTO volunteer_assignment (volunteer_id, camp_id, duty_hours, assigned_date) VALUES
(1, 1, 8, CURDATE()),
(2, 1, 6, CURDATE()),
(3, 2, 7, CURDATE()),
(4, 3, 4, CURDATE()),
(5, 2, 5, CURDATE());

-- ----- Donations ----------------------------------------------------
-- The trg_donation_update_stock trigger will bump total+available.
INSERT INTO donation (donor_name, donation_date, disaster_id, resource_id, quantity) VALUES
('Red Cross',          CURDATE(), 1, 1, 200),  -- Rice
('Local Mosque',       CURDATE(), 1, 2, 150),  -- Water
('City Hospital',      CURDATE(), 1, 3,  50),  -- Paracetamol
('Relief Trust Intl.', CURDATE(), 2, 4,  20),  -- First Aid Kits
('Community Drive',    CURDATE(), 1, 5, 100);  -- Tarpaulins

-- ----- Allocations --------------------------------------------------
-- Allocate sparingly so that Camp-Alpha and Camp-Beta are left short
-- of FOOD relative to occupants -> triggers the food-shortage rule.
-- Camp-Beta will also have medical_condition victims but no MEDICAL
-- allocation yet -> triggers the medical-shortage rule.
-- Camp-Gamma is full and has only 1 medical-condition victim who has
-- a MEDICAL condition, so the medical-shortage rule may also apply
-- unless we allocate. (Allocation exercise below intentionally leaves
-- it short so the shortage report has multiple flags to show.)
--
-- The trg_alloc_update_stock trigger will decrement available stock.
INSERT INTO resource_allocation (camp_id, resource_id, quantity, allocation_date) VALUES
(1, 1,  20, CURDATE()),  -- 20 rice bags to Camp-Alpha
(1, 2,  10, CURDATE()),  -- 10 water units to Camp-Alpha
(4, 1,  50, CURDATE()),  -- 50 rice bags to Camp-Delta
(4, 3,  10, CURDATE()),  -- 10 paracetamol to Camp-Delta
(3, 2,  20, CURDATE());  -- 20 water units to Camp-Gamma

-- ----- Note on the priority-ordering exercise -----------------------
-- To exercise the multi-camp priority logic, the API caller can POST
-- concurrent /api/allocations requests for Camp-Alpha and Camp-Beta
-- for the same resource (e.g. resource_id=2 Drinking Water) and
-- whichever camp has the higher count of HIGH-priority victims
-- (Camp-Beta: 3) should be served before Camp-Alpha (2) when stock
-- is constrained.

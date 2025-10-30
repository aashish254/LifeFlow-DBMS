-- LifeFlow DBMS - Smart Blood Bank Management System
-- Database Schema with Normalized Tables (3NF)
-- PostgreSQL/Supabase Implementation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE 1: Staff (Blood Bank Employees)
-- ============================================
CREATE TABLE Staff (
    staff_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Technician', 'Nurse', 'Manager')),
    hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE 2: Donors
-- ============================================
CREATE TABLE Donors (
    donor_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    blood_group VARCHAR(5) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10),
    last_donation_date DATE,
    total_donations INTEGER DEFAULT 0,
    is_eligible BOOLEAN DEFAULT TRUE,
    registered_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_age CHECK (EXTRACT(YEAR FROM AGE(date_of_birth)) >= 18)
);

-- ============================================
-- TABLE 3: Hospitals
-- ============================================
CREATE TABLE Hospitals (
    hospital_id SERIAL PRIMARY KEY,
    hospital_name VARCHAR(100) NOT NULL,
    hospital_type VARCHAR(50) CHECK (hospital_type IN ('Government', 'Private', 'Trust')),
    contact_person VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    pincode VARCHAR(10),
    license_number VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    registered_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE 4: BloodStock
-- ============================================
CREATE TABLE BloodStock (
    stock_id SERIAL PRIMARY KEY,
    blood_group VARCHAR(5) NOT NULL UNIQUE CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    quantity_ml INTEGER NOT NULL DEFAULT 0 CHECK (quantity_ml >= 0),
    units_available INTEGER NOT NULL DEFAULT 0 CHECK (units_available >= 0),
    minimum_threshold INTEGER DEFAULT 10,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES Staff(staff_id),
    CONSTRAINT check_positive_quantity CHECK (quantity_ml >= 0 AND units_available >= 0)
);

-- ============================================
-- TABLE 5: Donations
-- ============================================
CREATE TABLE Donations (
    donation_id SERIAL PRIMARY KEY,
    donor_id INTEGER NOT NULL REFERENCES Donors(donor_id) ON DELETE CASCADE,
    donation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    blood_group VARCHAR(5) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    quantity_ml INTEGER NOT NULL DEFAULT 450 CHECK (quantity_ml > 0),
    hemoglobin_level DECIMAL(4,2) CHECK (hemoglobin_level >= 0),
    blood_pressure VARCHAR(20),
    donation_status VARCHAR(20) DEFAULT 'Completed' CHECK (donation_status IN ('Completed', 'Rejected', 'Pending')),
    staff_id INTEGER REFERENCES Staff(staff_id),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE 6: Requests (Hospital Blood Requests)
-- ============================================
CREATE TABLE Requests (
    request_id SERIAL PRIMARY KEY,
    hospital_id INTEGER NOT NULL REFERENCES Hospitals(hospital_id) ON DELETE CASCADE,
    blood_group VARCHAR(5) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    units_requested INTEGER NOT NULL CHECK (units_requested > 0),
    units_fulfilled INTEGER DEFAULT 0 CHECK (units_fulfilled >= 0),
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    required_by_date DATE NOT NULL,
    urgency_level VARCHAR(20) DEFAULT 'Normal' CHECK (urgency_level IN ('Critical', 'Urgent', 'Normal')),
    request_status VARCHAR(20) DEFAULT 'Pending' CHECK (request_status IN ('Pending', 'Approved', 'Fulfilled', 'Partially Fulfilled', 'Rejected', 'Cancelled')),
    approved_by INTEGER REFERENCES Staff(staff_id),
    approval_date TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_fulfillment CHECK (units_fulfilled <= units_requested)
);

-- ============================================
-- TABLE 7: Transfusions (Blood Allocation Records)
-- ============================================
CREATE TABLE Transfusions (
    transfusion_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES Requests(request_id) ON DELETE CASCADE,
    hospital_id INTEGER NOT NULL REFERENCES Hospitals(hospital_id),
    blood_group VARCHAR(5) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    units_transfused INTEGER NOT NULL CHECK (units_transfused > 0),
    quantity_ml INTEGER NOT NULL CHECK (quantity_ml > 0),
    transfusion_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    patient_name VARCHAR(100),
    patient_age INTEGER CHECK (patient_age > 0),
    staff_id INTEGER REFERENCES Staff(staff_id),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES for Performance Optimization
-- ============================================
CREATE INDEX idx_donors_blood_group ON Donors(blood_group);
CREATE INDEX idx_donors_email ON Donors(email);
CREATE INDEX idx_donations_donor_id ON Donations(donor_id);
CREATE INDEX idx_donations_date ON Donations(donation_date);
CREATE INDEX idx_requests_hospital_id ON Requests(hospital_id);
CREATE INDEX idx_requests_status ON Requests(request_status);
CREATE INDEX idx_requests_blood_group ON Requests(blood_group);
CREATE INDEX idx_transfusions_request_id ON Transfusions(request_id);
CREATE INDEX idx_hospitals_email ON Hospitals(email);

-- ============================================
-- TRIGGER 1: Auto-update BloodStock after Donation
-- ============================================
CREATE OR REPLACE FUNCTION update_stock_after_donation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.donation_status = 'Completed' THEN
        UPDATE BloodStock
        SET 
            quantity_ml = quantity_ml + NEW.quantity_ml,
            units_available = units_available + (NEW.quantity_ml / 450),
            last_updated = CURRENT_TIMESTAMP
        WHERE blood_group = NEW.blood_group;
        
        -- If blood group doesn't exist in stock, insert it
        IF NOT FOUND THEN
            INSERT INTO BloodStock (blood_group, quantity_ml, units_available)
            VALUES (NEW.blood_group, NEW.quantity_ml, NEW.quantity_ml / 450);
        END IF;
        
        -- Update donor's last donation date and total donations
        UPDATE Donors
        SET 
            last_donation_date = NEW.donation_date,
            total_donations = total_donations + 1,
            is_eligible = CASE 
                WHEN CURRENT_DATE - NEW.donation_date < 90 THEN FALSE 
                ELSE TRUE 
            END
        WHERE donor_id = NEW.donor_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stock_after_donation
AFTER INSERT ON Donations
FOR EACH ROW
EXECUTE FUNCTION update_stock_after_donation();

-- ============================================
-- TRIGGER 2: Auto-update BloodStock after Transfusion
-- ============================================
CREATE OR REPLACE FUNCTION update_stock_after_transfusion()
RETURNS TRIGGER AS $$
BEGIN
    -- Deduct from blood stock
    UPDATE BloodStock
    SET 
        quantity_ml = quantity_ml - NEW.quantity_ml,
        units_available = units_available - NEW.units_transfused,
        last_updated = CURRENT_TIMESTAMP
    WHERE blood_group = NEW.blood_group;
    
    -- Update request fulfillment
    UPDATE Requests
    SET 
        units_fulfilled = LEAST(units_fulfilled + NEW.units_transfused, units_requested),
        request_status = CASE 
            WHEN units_fulfilled + NEW.units_transfused >= units_requested THEN 'Fulfilled'
            WHEN units_fulfilled + NEW.units_transfused > 0 THEN 'Partially Fulfilled'
            ELSE request_status
        END
    WHERE request_id = NEW.request_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stock_after_transfusion
AFTER INSERT ON Transfusions
FOR EACH ROW
EXECUTE FUNCTION update_stock_after_transfusion();

-- ============================================
-- TRIGGER 3: Prevent Deletion of Hospital with Pending Requests
-- ============================================
CREATE OR REPLACE FUNCTION prevent_hospital_deletion()
RETURNS TRIGGER AS $$
DECLARE
    pending_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO pending_count
    FROM Requests
    WHERE hospital_id = OLD.hospital_id 
    AND request_status IN ('Pending', 'Approved');
    
    IF pending_count > 0 THEN
        RAISE EXCEPTION 'Cannot delete hospital with % pending requests', pending_count;
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_hospital_deletion
BEFORE DELETE ON Hospitals
FOR EACH ROW
EXECUTE FUNCTION prevent_hospital_deletion();

-- ============================================
-- TRIGGER 4: Validate Blood Stock Before Transfusion
-- ============================================
CREATE OR REPLACE FUNCTION validate_stock_before_transfusion()
RETURNS TRIGGER AS $$
DECLARE
    available_units INTEGER;
BEGIN
    SELECT units_available INTO available_units
    FROM BloodStock
    WHERE blood_group = NEW.blood_group;
    
    IF available_units IS NULL OR available_units < NEW.units_transfused THEN
        RAISE EXCEPTION 'Insufficient blood stock for blood group %. Available: %, Requested: %', 
            NEW.blood_group, COALESCE(available_units, 0), NEW.units_transfused;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_stock_before_transfusion
BEFORE INSERT ON Transfusions
FOR EACH ROW
EXECUTE FUNCTION validate_stock_before_transfusion();

-- ============================================
-- STORED PROCEDURE 1: Register New Donor with Validation
-- (Lab Assessment 4 - Question 1)
-- ============================================
CREATE OR REPLACE FUNCTION sp_register_donor(
    p_first_name VARCHAR(50),
    p_last_name VARCHAR(50),
    p_email VARCHAR(100),
    p_phone VARCHAR(15),
    p_blood_group VARCHAR(5),
    p_date_of_birth DATE,
    p_gender VARCHAR(10),
    p_address TEXT,
    p_city VARCHAR(50),
    p_state VARCHAR(50),
    p_pincode VARCHAR(10)
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    donor_id INTEGER
) AS $$
DECLARE
    v_donor_id INTEGER;
    v_age INTEGER;
    v_existing_email INTEGER;
BEGIN
    -- Calculate age
    v_age := EXTRACT(YEAR FROM AGE(p_date_of_birth));
    
    -- Validate age
    IF v_age < 18 THEN
        RETURN QUERY SELECT FALSE, 'Donor must be at least 18 years old', NULL::INTEGER;
        RETURN;
    END IF;
    
    IF v_age > 65 THEN
        RETURN QUERY SELECT FALSE, 'Donor must be under 65 years old', NULL::INTEGER;
        RETURN;
    END IF;
    
    -- Check for duplicate email
    SELECT COUNT(*) INTO v_existing_email FROM Donors WHERE email = p_email;
    IF v_existing_email > 0 THEN
        RETURN QUERY SELECT FALSE, 'Email already registered', NULL::INTEGER;
        RETURN;
    END IF;
    
    -- Insert donor
    INSERT INTO Donors (
        first_name, last_name, email, phone, blood_group, 
        date_of_birth, gender, address, city, state, pincode
    ) VALUES (
        p_first_name, p_last_name, p_email, p_phone, p_blood_group,
        p_date_of_birth, p_gender, p_address, p_city, p_state, p_pincode
    ) RETURNING Donors.donor_id INTO v_donor_id;
    
    RETURN QUERY SELECT TRUE, 'Donor registered successfully', v_donor_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STORED PROCEDURE 2: Process Blood Donation with Cursor
-- (Lab Assessment 4 - Question 1)
-- ============================================
CREATE OR REPLACE FUNCTION sp_process_donation(
    p_donor_id INTEGER,
    p_blood_group VARCHAR(5),
    p_quantity_ml INTEGER,
    p_hemoglobin_level DECIMAL(4,2),
    p_blood_pressure VARCHAR(20),
    p_staff_id INTEGER
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    donation_id INTEGER
) AS $$
DECLARE
    v_donation_id INTEGER;
    v_is_eligible BOOLEAN;
    v_last_donation_date DATE;
    v_days_since_last INTEGER;
    v_donor_blood_group VARCHAR(5);
BEGIN
    -- Fetch donor details
    SELECT is_eligible, last_donation_date, blood_group 
    INTO v_is_eligible, v_last_donation_date, v_donor_blood_group
    FROM Donors 
    WHERE donor_id = p_donor_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Donor not found', NULL::INTEGER;
        RETURN;
    END IF;
    
    -- Validate blood group match
    IF v_donor_blood_group != p_blood_group THEN
        RETURN QUERY SELECT FALSE, 'Blood group mismatch', NULL::INTEGER;
        RETURN;
    END IF;
    
    -- Check eligibility based on last donation
    IF v_last_donation_date IS NOT NULL THEN
        v_days_since_last := CURRENT_DATE - v_last_donation_date;
        IF v_days_since_last < 90 THEN
            RETURN QUERY SELECT FALSE, 
                FORMAT('Donor must wait %s more days before next donation', 90 - v_days_since_last),
                NULL::INTEGER;
            RETURN;
        END IF;
    END IF;
    
    -- Check hemoglobin level
    IF p_hemoglobin_level < 12.5 THEN
        RETURN QUERY SELECT FALSE, 'Hemoglobin level too low for donation', NULL::INTEGER;
        RETURN;
    END IF;
    
    -- Insert donation record
    INSERT INTO Donations (
        donor_id, blood_group, quantity_ml, hemoglobin_level,
        blood_pressure, donation_status, staff_id
    ) VALUES (
        p_donor_id, p_blood_group, p_quantity_ml, p_hemoglobin_level,
        p_blood_pressure, 'Completed', p_staff_id
    ) RETURNING Donations.donation_id INTO v_donation_id;
    
    RETURN QUERY SELECT TRUE, 'Donation processed successfully', v_donation_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STORED PROCEDURE 3: Generate Monthly Donation Report with Cursor
-- (Lab Assessment 4 - Question 1)
-- ============================================
CREATE OR REPLACE FUNCTION sp_generate_monthly_donation_report(
    p_month INTEGER,
    p_year INTEGER
)
RETURNS TABLE(
    blood_group VARCHAR(5),
    total_donations BIGINT,
    total_quantity_ml BIGINT,
    total_units NUMERIC,
    unique_donors BIGINT
) AS $$
DECLARE
    donation_cursor CURSOR FOR
        SELECT d.blood_group, d.quantity_ml, d.donor_id
        FROM Donations d
        WHERE EXTRACT(MONTH FROM d.donation_date) = p_month
        AND EXTRACT(YEAR FROM d.donation_date) = p_year
        AND d.donation_status = 'Completed';
    
    v_blood_group VARCHAR(5);
    v_quantity INTEGER;
    v_donor_id INTEGER;
BEGIN
    RETURN QUERY
    SELECT 
        d.blood_group,
        COUNT(*)::BIGINT as total_donations,
        SUM(d.quantity_ml)::BIGINT as total_quantity_ml,
        ROUND(SUM(d.quantity_ml)::NUMERIC / 450, 2) as total_units,
        COUNT(DISTINCT d.donor_id)::BIGINT as unique_donors
    FROM Donations d
    WHERE EXTRACT(MONTH FROM d.donation_date) = p_month
    AND EXTRACT(YEAR FROM d.donation_date) = p_year
    AND d.donation_status = 'Completed'
    GROUP BY d.blood_group
    ORDER BY d.blood_group;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STORED PROCEDURE 4: Allocate Blood to Hospital Request
-- (Lab Assessment 4 - Question 1)
-- ============================================
CREATE OR REPLACE FUNCTION sp_allocate_blood_to_request(
    p_request_id INTEGER,
    p_units_to_allocate INTEGER,
    p_patient_name VARCHAR(100),
    p_patient_age INTEGER,
    p_staff_id INTEGER
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    transfusion_id INTEGER
) AS $$
DECLARE
    v_transfusion_id INTEGER;
    v_blood_group VARCHAR(5);
    v_hospital_id INTEGER;
    v_available_units INTEGER;
    v_units_requested INTEGER;
    v_units_fulfilled INTEGER;
    v_request_status VARCHAR(20);
BEGIN
    -- Fetch request details
    SELECT r.blood_group, r.hospital_id, r.units_requested, 
           r.units_fulfilled, r.request_status
    INTO v_blood_group, v_hospital_id, v_units_requested, 
         v_units_fulfilled, v_request_status
    FROM Requests r
    WHERE r.request_id = p_request_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Request not found', NULL::INTEGER;
        RETURN;
    END IF;
    
    -- Check if request is already fulfilled
    IF v_request_status = 'Fulfilled' THEN
        RETURN QUERY SELECT FALSE, 'Request already fulfilled', NULL::INTEGER;
        RETURN;
    END IF;
    
    -- Check available stock
    SELECT units_available INTO v_available_units
    FROM BloodStock
    WHERE blood_group = v_blood_group;
    
    IF v_available_units IS NULL OR v_available_units < p_units_to_allocate THEN
        RETURN QUERY SELECT FALSE, 
            FORMAT('Insufficient stock. Available: %s units', COALESCE(v_available_units, 0)),
            NULL::INTEGER;
        RETURN;
    END IF;
    
    -- Check if allocation exceeds request
    IF v_units_fulfilled + p_units_to_allocate > v_units_requested THEN
        RETURN QUERY SELECT FALSE, 'Allocation exceeds requested units', NULL::INTEGER;
        RETURN;
    END IF;
    
    -- Create transfusion record
    INSERT INTO Transfusions (
        request_id, hospital_id, blood_group, units_transfused,
        quantity_ml, patient_name, patient_age, staff_id
    ) VALUES (
        p_request_id, v_hospital_id, v_blood_group, p_units_to_allocate,
        p_units_to_allocate * 450, p_patient_name, p_patient_age, p_staff_id
    ) RETURNING Transfusions.transfusion_id INTO v_transfusion_id;
    
    RETURN QUERY SELECT TRUE, 'Blood allocated successfully', v_transfusion_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STORED PROCEDURE 5: Get Low Stock Alerts
-- ============================================
CREATE OR REPLACE FUNCTION sp_get_low_stock_alerts()
RETURNS TABLE(
    blood_group VARCHAR(5),
    units_available INTEGER,
    minimum_threshold INTEGER,
    shortage INTEGER,
    alert_level VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bs.blood_group,
        bs.units_available,
        bs.minimum_threshold,
        (bs.minimum_threshold - bs.units_available) as shortage,
        CASE 
            WHEN bs.units_available = 0 THEN 'CRITICAL'::VARCHAR(20)
            WHEN bs.units_available < bs.minimum_threshold * 0.5 THEN 'URGENT'::VARCHAR(20)
            WHEN bs.units_available < bs.minimum_threshold THEN 'WARNING'::VARCHAR(20)
            ELSE 'NORMAL'::VARCHAR(20)
        END as alert_level
    FROM BloodStock bs
    WHERE bs.units_available < bs.minimum_threshold
    ORDER BY bs.units_available ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS for Common Queries
-- ============================================

-- View: Donor Summary
CREATE OR REPLACE VIEW vw_donor_summary AS
SELECT 
    d.donor_id,
    d.first_name || ' ' || d.last_name as donor_name,
    d.email,
    d.phone,
    d.blood_group,
    d.total_donations,
    d.last_donation_date,
    d.is_eligible,
    CASE 
        WHEN d.last_donation_date IS NULL THEN 'Can donate now'
        WHEN CURRENT_DATE - d.last_donation_date >= 90 THEN 'Can donate now'
        ELSE FORMAT('Can donate after %s days', 90 - (CURRENT_DATE - d.last_donation_date))
    END as eligibility_status
FROM Donors d;

-- View: Blood Stock Status
CREATE OR REPLACE VIEW vw_blood_stock_status AS
SELECT 
    bs.blood_group,
    bs.units_available,
    bs.quantity_ml,
    bs.minimum_threshold,
    CASE 
        WHEN bs.units_available = 0 THEN 'OUT OF STOCK'
        WHEN bs.units_available < bs.minimum_threshold * 0.5 THEN 'CRITICAL'
        WHEN bs.units_available < bs.minimum_threshold THEN 'LOW'
        ELSE 'ADEQUATE'
    END as stock_status,
    bs.last_updated
FROM BloodStock bs
ORDER BY bs.blood_group;

-- View: Pending Requests
CREATE OR REPLACE VIEW vw_pending_requests AS
SELECT 
    r.request_id,
    h.hospital_name,
    h.city,
    r.blood_group,
    r.units_requested,
    r.units_fulfilled,
    (r.units_requested - r.units_fulfilled) as units_pending,
    r.urgency_level,
    r.request_status,
    r.request_date,
    r.required_by_date,
    CASE 
        WHEN r.required_by_date < CURRENT_DATE THEN 'OVERDUE'
        WHEN r.required_by_date = CURRENT_DATE THEN 'DUE TODAY'
        WHEN r.required_by_date <= CURRENT_DATE + 2 THEN 'DUE SOON'
        ELSE 'ON TIME'
    END as deadline_status
FROM Requests r
JOIN Hospitals h ON r.hospital_id = h.hospital_id
WHERE r.request_status IN ('Pending', 'Approved', 'Partially Fulfilled')
ORDER BY r.urgency_level DESC, r.required_by_date ASC;

-- View: Recent Donations
CREATE OR REPLACE VIEW vw_recent_donations AS
SELECT 
    d.donation_id,
    don.first_name || ' ' || don.last_name as donor_name,
    don.blood_group,
    d.quantity_ml,
    d.donation_date,
    d.hemoglobin_level,
    d.donation_status,
    s.first_name || ' ' || s.last_name as staff_name
FROM Donations d
JOIN Donors don ON d.donor_id = don.donor_id
LEFT JOIN Staff s ON d.staff_id = s.staff_id
ORDER BY d.donation_date DESC;

-- ============================================
-- COMMENTS AND DOCUMENTATION
-- ============================================
COMMENT ON TABLE Staff IS 'Blood bank employees managing operations';
COMMENT ON TABLE Donors IS 'Registered blood donors with eligibility tracking';
COMMENT ON TABLE Hospitals IS 'Registered hospitals that can request blood';
COMMENT ON TABLE BloodStock IS 'Current inventory of blood by blood group';
COMMENT ON TABLE Donations IS 'Record of all blood donations received';
COMMENT ON TABLE Requests IS 'Hospital requests for blood units';
COMMENT ON TABLE Transfusions IS 'Record of blood allocations to hospitals';

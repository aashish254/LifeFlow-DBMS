-- LifeFlow DBMS - Sample Dataset
-- Comprehensive data for all tables

-- ============================================
-- SEED DATA: Staff
-- ============================================
INSERT INTO Staff (first_name, last_name, email, phone, role, hire_date) VALUES
('Rajesh', 'Kumar', 'rajesh.kumar@lifeflow.com', '9876543210', 'Admin', '2020-01-15'),
('Priya', 'Sharma', 'priya.sharma@lifeflow.com', '9876543211', 'Manager', '2020-03-20'),
('Amit', 'Patel', 'amit.patel@lifeflow.com', '9876543212', 'Technician', '2021-06-10'),
('Sneha', 'Reddy', 'sneha.reddy@lifeflow.com', '9876543213', 'Nurse', '2021-08-15'),
('Vikram', 'Singh', 'vikram.singh@lifeflow.com', '9876543214', 'Technician', '2022-01-05'),
('Anjali', 'Mehta', 'anjali.mehta@lifeflow.com', '9876543215', 'Nurse', '2022-04-12'),
('Rahul', 'Verma', 'rahul.verma@lifeflow.com', '9876543216', 'Technician', '2022-09-18'),
('Kavita', 'Joshi', 'kavita.joshi@lifeflow.com', '9876543217', 'Manager', '2023-02-25');

-- ============================================
-- SEED DATA: Donors
-- ============================================
INSERT INTO Donors (first_name, last_name, email, phone, blood_group, date_of_birth, gender, address, city, state, pincode, last_donation_date, total_donations) VALUES
('Arjun', 'Malhotra', 'arjun.malhotra@email.com', '9123456780', 'O+', '1995-03-15', 'Male', '123 MG Road', 'Bangalore', 'Karnataka', '560001', '2025-07-15', 5),
('Divya', 'Nair', 'divya.nair@email.com', '9123456781', 'A+', '1992-07-22', 'Female', '456 Park Street', 'Mumbai', 'Maharashtra', '400001', '2025-08-20', 3),
('Karan', 'Kapoor', 'karan.kapoor@email.com', '9123456782', 'B+', '1988-11-30', 'Male', '789 Nehru Place', 'Delhi', 'Delhi', '110019', '2025-06-10', 8),
('Meera', 'Iyer', 'meera.iyer@email.com', '9123456783', 'AB+', '1990-05-18', 'Female', '321 Anna Salai', 'Chennai', 'Tamil Nadu', '600002', '2025-09-05', 4),
('Rohan', 'Desai', 'rohan.desai@email.com', '9123456784', 'O-', '1994-09-25', 'Male', '654 FC Road', 'Pune', 'Maharashtra', '411004', '2025-08-01', 6),
('Ananya', 'Gupta', 'ananya.gupta@email.com', '9123456785', 'A-', '1996-12-08', 'Female', '987 Salt Lake', 'Kolkata', 'West Bengal', '700091', '2025-07-28', 2),
('Siddharth', 'Rao', 'siddharth.rao@email.com', '9123456786', 'B-', '1991-04-14', 'Male', '147 Banjara Hills', 'Hyderabad', 'Telangana', '500034', '2025-09-12', 7),
('Ishita', 'Bansal', 'ishita.bansal@email.com', '9123456787', 'AB-', '1993-08-20', 'Female', '258 Civil Lines', 'Jaipur', 'Rajasthan', '302006', '2025-06-25', 3),
('Aditya', 'Khanna', 'aditya.khanna@email.com', '9123456788', 'O+', '1989-01-12', 'Male', '369 Residency Road', 'Bangalore', 'Karnataka', '560025', '2025-08-15', 9),
('Riya', 'Chatterjee', 'riya.chatterjee@email.com', '9123456789', 'A+', '1997-06-05', 'Female', '741 Ballygunge', 'Kolkata', 'West Bengal', '700019', '2025-09-20', 1),
('Varun', 'Sinha', 'varun.sinha@email.com', '9123456790', 'B+', '1995-10-28', 'Male', '852 Boring Road', 'Patna', 'Bihar', '800001', '2025-07-05', 4),
('Pooja', 'Menon', 'pooja.menon@email.com', '9123456791', 'O-', '1992-03-17', 'Female', '963 MG Road', 'Kochi', 'Kerala', '682016', '2025-08-10', 5),
('Nikhil', 'Jain', 'nikhil.jain@email.com', '9123456792', 'AB+', '1990-07-09', 'Male', '159 MI Road', 'Jaipur', 'Rajasthan', '302001', '2025-06-30', 6),
('Shreya', 'Pillai', 'shreya.pillai@email.com', '9123456793', 'A-', '1994-11-23', 'Female', '357 Residency Road', 'Mysore', 'Karnataka', '570001', '2025-09-08', 2),
('Aryan', 'Bhatt', 'aryan.bhatt@email.com', '9123456794', 'B-', '1996-02-14', 'Male', '486 CG Road', 'Ahmedabad', 'Gujarat', '380009', '2025-07-22', 3),
('Tanvi', 'Kulkarni', 'tanvi.kulkarni@email.com', '9123456795', 'O+', '1991-05-30', 'Female', '753 Shivaji Nagar', 'Pune', 'Maharashtra', '411005', '2025-08-25', 7),
('Harsh', 'Agarwal', 'harsh.agarwal@email.com', '9123456796', 'A+', '1993-09-11', 'Male', '864 Hazratganj', 'Lucknow', 'Uttar Pradesh', '226001', '2025-09-15', 4),
('Nisha', 'Saxena', 'nisha.saxena@email.com', '9123456797', 'AB-', '1995-12-19', 'Female', '975 Gomti Nagar', 'Lucknow', 'Uttar Pradesh', '226010', '2025-07-18', 2),
('Kunal', 'Mishra', 'kunal.mishra@email.com', '9123456798', 'B+', '1988-04-07', 'Male', '135 Rajpur Road', 'Dehradun', 'Uttarakhand', '248001', '2025-08-05', 8),
('Sakshi', 'Pandey', 'sakshi.pandey@email.com', '9123456799', 'O-', '1992-08-26', 'Female', '246 Alambagh', 'Lucknow', 'Uttar Pradesh', '226005', '2025-09-10', 5),
('Mohit', 'Thakur', 'mohit.thakur@email.com', '9123456800', 'A-', '1990-01-03', 'Male', '357 Mall Road', 'Shimla', 'Himachal Pradesh', '171001', '2025-06-20', 6),
('Neha', 'Chopra', 'neha.chopra@email.com', '9123456801', 'AB+', '1994-06-16', 'Female', '468 Model Town', 'Ludhiana', 'Punjab', '141002', '2025-08-30', 3),
('Yash', 'Bose', 'yash.bose@email.com', '9123456802', 'O+', '1996-10-21', 'Male', '579 Park Street', 'Kolkata', 'West Bengal', '700016', '2025-07-12', 4),
('Aarti', 'Dubey', 'aarti.dubey@email.com', '9123456803', 'B-', '1991-03-29', 'Female', '680 Indira Nagar', 'Lucknow', 'Uttar Pradesh', '226016', '2025-09-03', 5),
('Vishal', 'Tiwari', 'vishal.tiwari@email.com', '9123456804', 'A+', '1993-07-14', 'Male', '791 Civil Lines', 'Allahabad', 'Uttar Pradesh', '211001', '2025-08-18', 6);

-- ============================================
-- SEED DATA: Hospitals
-- ============================================
INSERT INTO Hospitals (hospital_name, hospital_type, contact_person, email, phone, address, city, state, pincode, license_number) VALUES
('Apollo Hospital', 'Private', 'Dr. Ramesh Kumar', 'contact@apollobangalore.com', '9988776655', 'Bannerghatta Road', 'Bangalore', 'Karnataka', '560076', 'LIC-APO-2020-001'),
('AIIMS Delhi', 'Government', 'Dr. Sunita Verma', 'admin@aiims.edu', '9988776656', 'Ansari Nagar', 'Delhi', 'Delhi', '110029', 'LIC-AIIMS-2018-001'),
('Fortis Hospital', 'Private', 'Dr. Anil Mehta', 'info@fortismumbai.com', '9988776657', 'Mulund West', 'Mumbai', 'Maharashtra', '400080', 'LIC-FOR-2019-002'),
('Manipal Hospital', 'Private', 'Dr. Kavita Reddy', 'contact@manipalhyd.com', '9988776658', 'Banjara Hills', 'Hyderabad', 'Telangana', '500034', 'LIC-MAN-2020-003'),
('Government General Hospital', 'Government', 'Dr. Suresh Iyer', 'admin@gghchennai.gov.in', '9988776659', 'Park Town', 'Chennai', 'Tamil Nadu', '600003', 'LIC-GGH-2017-001'),
('Max Super Specialty Hospital', 'Private', 'Dr. Priya Singh', 'info@maxdelhi.com', '9988776660', 'Saket', 'Delhi', 'Delhi', '110017', 'LIC-MAX-2021-004'),
('Ruby Hall Clinic', 'Private', 'Dr. Vikram Desai', 'contact@rubyhall.com', '9988776661', 'Grant Road', 'Pune', 'Maharashtra', '411001', 'LIC-RUB-2019-005'),
('Narayana Health', 'Trust', 'Dr. Anjali Nair', 'info@narayanabangalore.org', '9988776662', 'Bommasandra', 'Bangalore', 'Karnataka', '560099', 'LIC-NAR-2020-006'),
('Medanta Hospital', 'Private', 'Dr. Rajesh Gupta', 'contact@medanta.org', '9988776663', 'Sector 38', 'Gurgaon', 'Haryana', '122001', 'LIC-MED-2021-007'),
('Tata Memorial Hospital', 'Government', 'Dr. Deepak Sharma', 'admin@tmc.gov.in', '9988776664', 'Parel', 'Mumbai', 'Maharashtra', '400012', 'LIC-TMC-2016-001'),
('Christian Medical College', 'Trust', 'Dr. Sarah Thomas', 'info@cmcvellore.ac.in', '9988776665', 'Ida Scudder Road', 'Vellore', 'Tamil Nadu', '632004', 'LIC-CMC-2015-001'),
('Lilavati Hospital', 'Private', 'Dr. Mohan Patel', 'contact@lilavatihospital.com', '9988776666', 'Bandra West', 'Mumbai', 'Maharashtra', '400050', 'LIC-LIL-2020-008');

-- ============================================
-- SEED DATA: Initialize BloodStock
-- ============================================
INSERT INTO BloodStock (blood_group, quantity_ml, units_available, minimum_threshold, updated_by) VALUES
('A+', 22500, 50, 15, 1),
('A-', 9000, 20, 10, 1),
('B+', 18000, 40, 15, 1),
('B-', 6750, 15, 8, 1),
('AB+', 13500, 30, 12, 1),
('AB-', 4500, 10, 5, 1),
('O+', 27000, 60, 20, 1),
('O-', 11250, 25, 12, 1);

-- ============================================
-- SEED DATA: Donations (Past 6 months)
-- ============================================
INSERT INTO Donations (donor_id, donation_date, blood_group, quantity_ml, hemoglobin_level, blood_pressure, donation_status, staff_id) VALUES
-- January 2025
(1, '2025-01-10', 'O+', 450, 14.5, '120/80', 'Completed', 3),
(3, '2025-01-15', 'B+', 450, 13.8, '118/78', 'Completed', 3),
(5, '2025-01-20', 'O-', 450, 15.2, '122/82', 'Completed', 5),
(9, '2025-01-25', 'O+', 450, 14.0, '120/80', 'Completed', 5),
-- February 2025
(2, '2025-02-05', 'A+', 450, 13.5, '115/75', 'Completed', 3),
(4, '2025-02-10', 'AB+', 450, 14.8, '120/80', 'Completed', 5),
(7, '2025-02-15', 'B-', 450, 13.2, '118/78', 'Completed', 7),
(11, '2025-02-20', 'B+', 450, 14.5, '120/80', 'Completed', 3),
-- March 2025
(6, '2025-03-05', 'A-', 450, 13.0, '116/76', 'Completed', 5),
(8, '2025-03-10', 'AB-', 450, 14.2, '120/80', 'Completed', 7),
(13, '2025-03-15', 'AB+', 450, 15.0, '122/82', 'Completed', 3),
(16, '2025-03-20', 'O+', 450, 14.3, '118/78', 'Completed', 5),
-- April 2025
(1, '2025-04-12', 'O+', 450, 14.7, '120/80', 'Completed', 3),
(3, '2025-04-17', 'B+', 450, 13.9, '118/78', 'Completed', 5),
(10, '2025-04-22', 'A+', 450, 13.6, '115/75', 'Completed', 7),
(12, '2025-04-27', 'O-', 450, 15.1, '122/82', 'Completed', 3),
-- May 2025
(5, '2025-05-05', 'O-', 450, 14.9, '120/80', 'Completed', 5),
(15, '2025-05-10', 'B-', 450, 13.4, '118/78', 'Completed', 7),
(17, '2025-05-15', 'A+', 450, 14.1, '120/80', 'Completed', 3),
(19, '2025-05-20', 'B+', 450, 14.6, '120/80', 'Completed', 5),
-- June 2025
(2, '2025-06-08', 'A+', 450, 13.7, '116/76', 'Completed', 3),
(4, '2025-06-13', 'AB+', 450, 14.4, '120/80', 'Completed', 7),
(21, '2025-06-18', 'A-', 450, 13.1, '118/78', 'Completed', 5),
(23, '2025-06-23', 'O+', 450, 14.8, '120/80', 'Completed', 3),
-- July 2025
(7, '2025-07-03', 'B-', 450, 13.5, '118/78', 'Completed', 5),
(9, '2025-07-08', 'O+', 450, 14.2, '120/80', 'Completed', 7),
(11, '2025-07-13', 'B+', 450, 14.0, '120/80', 'Completed', 3),
(16, '2025-07-18', 'O+', 450, 14.5, '118/78', 'Completed', 5),
-- August 2025
(1, '2025-08-05', 'O+', 450, 14.6, '120/80', 'Completed', 3),
(6, '2025-08-10', 'A-', 450, 13.3, '116/76', 'Completed', 7),
(12, '2025-08-15', 'O-', 450, 15.0, '122/82', 'Completed', 5),
(19, '2025-08-20', 'B+', 450, 14.4, '120/80', 'Completed', 3),
-- September 2025
(3, '2025-09-02', 'B+', 450, 13.8, '118/78', 'Completed', 5),
(8, '2025-09-07', 'AB-', 450, 14.1, '120/80', 'Completed', 7),
(13, '2025-09-12', 'AB+', 450, 14.9, '120/80', 'Completed', 3),
(17, '2025-09-17', 'A+', 450, 14.2, '118/78', 'Completed', 5),
-- October 2025 (Recent)
(5, '2025-10-01', 'O-', 450, 15.2, '120/80', 'Completed', 3),
(10, '2025-10-05', 'A+', 450, 13.9, '116/76', 'Completed', 7),
(15, '2025-10-10', 'B-', 450, 13.6, '118/78', 'Completed', 5),
(20, '2025-10-12', 'O-', 450, 14.8, '120/80', 'Completed', 3);

-- ============================================
-- SEED DATA: Requests (Hospital Blood Requests)
-- ============================================
INSERT INTO Requests (hospital_id, blood_group, units_requested, units_fulfilled, request_date, required_by_date, urgency_level, request_status, approved_by, approval_date) VALUES
-- Fulfilled Requests
(1, 'O+', 5, 5, '2025-09-01 10:00:00', '2025-09-03', 'Urgent', 'Fulfilled', 1, '2025-09-01 11:00:00'),
(2, 'A+', 3, 3, '2025-09-05 14:30:00', '2025-09-07', 'Normal', 'Fulfilled', 2, '2025-09-05 15:00:00'),
(3, 'B+', 4, 4, '2025-09-10 09:00:00', '2025-09-12', 'Urgent', 'Fulfilled', 1, '2025-09-10 09:30:00'),
(4, 'AB+', 2, 2, '2025-09-15 11:00:00', '2025-09-17', 'Normal', 'Fulfilled', 2, '2025-09-15 12:00:00'),
(5, 'O-', 3, 3, '2025-09-20 08:00:00', '2025-09-22', 'Critical', 'Fulfilled', 1, '2025-09-20 08:15:00'),
-- Partially Fulfilled Requests
(6, 'A-', 4, 2, '2025-10-01 10:00:00', '2025-10-05', 'Urgent', 'Partially Fulfilled', 1, '2025-10-01 10:30:00'),
(7, 'B-', 3, 1, '2025-10-05 13:00:00', '2025-10-08', 'Normal', 'Partially Fulfilled', 2, '2025-10-05 14:00:00'),
-- Pending Requests (Current)
(8, 'O+', 6, 0, '2025-10-10 09:00:00', '2025-10-20', 'Urgent', 'Approved', 1, '2025-10-10 09:30:00'),
(9, 'A+', 4, 0, '2025-10-12 11:00:00', '2025-10-22', 'Normal', 'Approved', 2, '2025-10-12 11:30:00'),
(10, 'AB-', 2, 0, '2025-10-14 14:00:00', '2025-10-18', 'Critical', 'Approved', 1, '2025-10-14 14:15:00'),
(11, 'B+', 5, 0, '2025-10-15 10:00:00', '2025-10-25', 'Normal', 'Pending', NULL, NULL),
(12, 'O-', 3, 0, '2025-10-16 08:00:00', '2025-10-19', 'Urgent', 'Pending', NULL, NULL);

-- ============================================
-- SEED DATA: Transfusions (Blood Allocations)
-- ============================================
INSERT INTO Transfusions (request_id, hospital_id, blood_group, units_transfused, quantity_ml, transfusion_date, patient_name, patient_age, staff_id) VALUES
-- For Request 1 (O+, 5 units)
(1, 1, 'O+', 3, 1350, '2025-09-02 10:00:00', 'Ramesh Patel', 45, 3),
(1, 1, 'O+', 2, 900, '2025-09-02 14:00:00', 'Sunita Devi', 38, 5),
-- For Request 2 (A+, 3 units)
(2, 2, 'A+', 3, 1350, '2025-09-06 11:00:00', 'Vijay Kumar', 52, 3),
-- For Request 3 (B+, 4 units)
(3, 3, 'B+', 2, 900, '2025-09-11 09:00:00', 'Lakshmi Reddy', 29, 5),
(3, 3, 'B+', 2, 900, '2025-09-11 15:00:00', 'Arun Sharma', 41, 7),
-- For Request 4 (AB+, 2 units)
(4, 4, 'AB+', 2, 900, '2025-09-16 10:00:00', 'Meena Iyer', 35, 3),
-- For Request 5 (O-, 3 units)
(5, 5, 'O-', 3, 1350, '2025-09-21 08:30:00', 'Suresh Nair', 48, 5),
-- For Request 6 (A-, 4 units - partially fulfilled with 2)
(6, 6, 'A-', 2, 900, '2025-10-02 11:00:00', 'Priya Singh', 33, 3),
-- For Request 7 (B-, 3 units - partially fulfilled with 1)
(7, 7, 'B-', 1, 450, '2025-10-06 14:00:00', 'Kiran Desai', 27, 5);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check total records
SELECT 'Staff' as table_name, COUNT(*) as record_count FROM Staff
UNION ALL
SELECT 'Donors', COUNT(*) FROM Donors
UNION ALL
SELECT 'Hospitals', COUNT(*) FROM Hospitals
UNION ALL
SELECT 'BloodStock', COUNT(*) FROM BloodStock
UNION ALL
SELECT 'Donations', COUNT(*) FROM Donations
UNION ALL
SELECT 'Requests', COUNT(*) FROM Requests
UNION ALL
SELECT 'Transfusions', COUNT(*) FROM Transfusions;

-- Check blood stock levels
SELECT * FROM vw_blood_stock_status ORDER BY blood_group;

-- Check pending requests
SELECT * FROM vw_pending_requests;

-- Check low stock alerts
SELECT * FROM sp_get_low_stock_alerts();

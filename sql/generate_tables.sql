# TODO: integrate to project for next release as a physician foreign key
#CREATE TABLE IF NOT EXISTS historify.specialties (
#  id int unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
#  title varchar(45) NOT NULL,
#  KEY title_idx (title)
#) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE DATABASE IF NOT EXISTS historify;

CREATE TABLE IF NOT EXISTS historify.users (
  id int unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username varchar(255) NOT NULL,
  passw varchar(255) NOT NULL,
  utype int unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS historify.physicians (
  id int unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fname varchar(100) NOT NULL,
  lname varchar(100) NOT NULL,
  gender enum('M','F','X') NOT NULL,
  birth datetime NOT NULL,
  registration varchar(10) NOT NULL,
  UNIQUE KEY registration_UNIQUE (registration),
  specialty varchar(45) NOT NULL,
  
  user_id int unsigned NOT NULL,
  
  FOREIGN KEY (user_id) REFERENCES historify.users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS historify.patients (
  id int unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_document varchar(8) NOT NULL,
  UNIQUE KEY id_document_UNIQUE (id_document),
  fname varchar(100) NOT NULL,
  lname varchar(100) NOT NULL,
  gender enum('M','F','X') NOT NULL,
  patient_desc varchar(255) NOT NULL,
  birth datetime NOT NULL,
  area enum('BAR','PLC','LEC') NOT NULL,
  phone varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS historify.consultations (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  consultation_date timestamp NOT NULL,
  consultation_desc varchar(255) NOT NULL,
  diagnosis varchar(255) DEFAULT NULL,
  observations varchar(255) DEFAULT NULL,
  register_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  consultation_status varchar(255) NOT NULL,
  
  patient_id int unsigned NOT NULL,
  physician_id int unsigned NOT NULL,
  
  FOREIGN KEY (physician_id) REFERENCES historify.physicians (id),
  FOREIGN KEY (patient_id) REFERENCES historify.patients (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO historify.users(username, passw, utype) values("admin", "admin", 0);
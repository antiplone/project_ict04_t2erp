CREATE TABLE employee_auth_tbl (
	e_id INT NOT NULL,
	e_auth_id VARCHAR(24) NOT NULL COLLATE 'utf8mb4_general_ci',
	e_password VARCHAR(64) NOT NULL COLLATE 'utf8mb4_general_ci',
	e_token VARCHAR(40) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (e_auth_id) USING BTREE,
	UNIQUE INDEX `e_id` (`e_id`) USING BTREE,
	CONSTRAINT employee_auth_tbl_ibfk_1 FOREIGN KEY (e_id) REFERENCES employee_tbl (e_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Users (
    usr_id INT AUTO_INCREMENT,
    user_mail varchar(255) not null,
    usr_name varchar(90) not null,
    usr_password varchar(255),
    usr_oauth boolean,
    usr_img varchar(255),
    PRIMARY KEY (usr_id)
);

CREATE TABLE Friendships (
    usr_id1 INT not null,
    usr_id2 INT not null,
    friend_accepted BOOLEAN not null,
    PRIMARY KEY (usr_id1, usr_id2),
    FOREIGN KEY (usr_id1) REFERENCES Users(usr_id),
    FOREIGN KEY (usr_id2) REFERENCES Users(usr_id)
);

CREATE TABLE Messages (
    msg_id INT auto_increment,
    usr_id_creator INT not null,
    evt_id INT not null,
    msg_text TEXT not null,
    msg_timestamp DATE not null,
    PRIMARY KEY (msg_id),
    FOREIGN KEY (usr_id_creator) REFERENCES Users(usr_id)
);

CREATE TABLE Events (
    evt_id INT AUTO_INCREMENT,
    usr_id_creator INT not null,
    evt_name VARCHAR(255) not null,
    evt_url VARCHAR(255) not null,
    evt_image_url VARCHAR(255),
    PRIMARY KEY(evt_id),
    FOREIGN KEY (usr_id_creator) REFERENCES Users(usr_id)
);

CREATE TABLE Schedule_ranges (
    usr_id INT not null,
    evt_id INT not null,
    sch__timestamp_start DATE not null,
    sch_timestamp_end DATE not null,
    sch_comment TEXT,
    PRIMARY KEY (usr_id, evt_id, sch__timestamp_start, sch_timestamp_end),
    FOREIGN KEY (usr_id) REFERENCES Users(usr_id),
    FOREIGN KEY (evt_id) REFERENCES Events(evt_id)
);

CREATE TABLE User_participation (
    evt_id INT not null,
    usr_id INT not null,
    PRIMARY KEY (evt_id, usr_id),
    FOREIGN KEY (evt_id) REFERENCES Events(evt_id),
    FOREIGN KEY (usr_id) REFERENCES Users(usr_id)
);

CREATE TABLE Expensses (
    exp_id INT AUTO_INCREMENT,
    evt_id INT NOT NULL,
    usr_id_creator INT NOT NULL,
    exp_concept VARCHAR(255) NOT NULL,
    exp_description TEXT,
    exp_data DATE NOT NULL,
    exp_coords VARCHAR(255),
    exp_foto1 VARCHAR(255),
    exp_foto2 VARCHAR(255),
    exp_foto3 VARCHAR(255),
    PRIMARY KEY (exp_id),
    FOREIGN KEY (evt_id) REFERENCES Events(evt_id),
    FOREIGN KEY (usr_id_creator) REFERENCES Users(usr_id)
);

CREATE TABLE Expensses_transaction (
    tra_id INT AUTO_INCREMENT,
    exp_id INT NOT NULL,
    usr_id_lender INT NOT NULL,
    usr_id_borrower INT NOT NULL,
    tra_amount DOUBLE NOT NULL,
    PRIMARY KEY (tra_id),
    FOREIGN KEY (exp_id) REFERENCES Expensses(exp_id),
    FOREIGN KEY (usr_id_lender) REFERENCES Users(usr_id),
    FOREIGN KEY (usr_id_borrower) REFERENCES Users(usr_id)
);


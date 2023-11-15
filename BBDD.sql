CREATE TABLE Users (
    usr_id char(36) not null unique,
    usr_mail varchar(255) not null unique,
    usr_name varchar(90) not null,
    usr_password varchar(255),
    usr_oauth boolean,
    usr_img varchar(255),
    usr_date_creation date,
    usr_mail_validated boolean DEFAULT FALSE,
    usr_google_id varchar(25),
    PRIMARY KEY (usr_id)
);


CREATE TABLE Friendships (
    usr_id1 char(36) not null,
    usr_id2 char(36) not null,
    friend_accepted BOOLEAN not null,
    PRIMARY KEY (usr_id1, usr_id2),
    FOREIGN KEY (usr_id1) REFERENCES Users(usr_id) ON UPDATE CASCADE,
    FOREIGN KEY (usr_id2) REFERENCES Users(usr_id) ON UPDATE CASCADE
);

CREATE TABLE Messages (
    msg_id char(36) not null unique,
    usr_id_creator char(36) not null,
    evt_id char(36) not null,
    msg_text TEXT not null,
    msg_timestamp DATE not null,
    PRIMARY KEY (msg_id),
    FOREIGN KEY (usr_id_creator) REFERENCES Users(usr_id) ON UPDATE CASCADE
);

CREATE TABLE Events (
    evt_id char(36) not null unique,
    usr_id_creator char(36) not null,
    evt_name VARCHAR(255) not null,
    evt_url VARCHAR(255) not null,
    evt_image_url VARCHAR(255),
    evt_creation_timestamp INT NOT NULL,
    evt_modification_timestamp INT NOT NULL,
    PRIMARY KEY(evt_id),
    FOREIGN KEY (usr_id_creator) REFERENCES Users(usr_id) ON UPDATE CASCADE
);

CREATE TABLE Schedule_ranges (
    usr_id char(36) not null,
    evt_id char(36) not null,
    sch__timestamp_start DATE not null,
    sch_timestamp_end DATE not null,
    sch_comment TEXT,
    PRIMARY KEY (usr_id, evt_id, sch__timestamp_start, sch_timestamp_end),
    FOREIGN KEY (usr_id) REFERENCES Users(usr_id) ON UPDATE CASCADE,
    FOREIGN KEY (evt_id) REFERENCES Events(evt_id) ON UPDATE CASCADE
);

CREATE TABLE User_participation (
    evt_id char(36) not null,
    usr_id char(36) not null,
    active BOOLEAN not null DEFAULT true,
    PRIMARY KEY (evt_id, usr_id),
    FOREIGN KEY (evt_id) REFERENCES Events(evt_id) ON UPDATE CASCADE,
    FOREIGN KEY (usr_id) REFERENCES Users(usr_id) ON UPDATE CASCADE
);

CREATE TABLE Expensses (
    exp_id char(36) not null unique,
    evt_id char(36) NOT NULL,
    usr_id_creator char(36) NOT NULL,
    exp_concept VARCHAR(255) NOT NULL,
    exp_description TEXT,
    exp_data DATE NOT NULL,
    exp_coords VARCHAR(255),
    exp_foto1 VARCHAR(255),
    exp_foto2 VARCHAR(255),
    exp_foto3 VARCHAR(255),
    PRIMARY KEY (exp_id),
    FOREIGN KEY (evt_id) REFERENCES Events(evt_id) ON UPDATE CASCADE,
    FOREIGN KEY (usr_id_creator) REFERENCES Users(usr_id) ON UPDATE CASCADE
);

CREATE TABLE Expensses_transaction (
    tra_id char(36) not null unique,
    exp_id char(36) NOT NULL,
    usr_id_lender char(36) NOT NULL,
    usr_id_borrower char(36) NOT NULL,
    tra_amount DOUBLE NOT NULL,
    PRIMARY KEY (tra_id),
    FOREIGN KEY (exp_id) REFERENCES Expensses(exp_id) ON UPDATE CASCADE,
    FOREIGN KEY (usr_id_lender) REFERENCES Users(usr_id) ON UPDATE CASCADE,
    FOREIGN KEY (usr_id_borrower) REFERENCES Users(usr_id) ON UPDATE CASCADE
);

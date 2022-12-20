--CREATE TABLE
CREATE TABLE AUTH_USER
(
    user_id  serial PRIMARY KEY,
    username VARCHAR(50) UNIQUE  NOT NULL,
    password VARCHAR(50)         NOT NULL,
    email    VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE AUTH_USERGROUP
(
    usergroup_id serial PRIMARY KEY,
    group_name   VARCHAR(50) UNIQUE NOT NULL,
)

CREATE TABLE AUTH_PERMISSION
(
    permission_id serial PRIMARY KEY,
    permission_name VARCHAR (50) NOT NULL,
)

CREATE TABLE AUTH_USER_IN_USERGROUPS
(
user_in_groups_id serial PRIMARY KEY,
username VARCHAR (50) NOT NULL,
usergroup VARCHAR (50) NOT null,
UNIQUE(usernam

CREATE TABLE AUTH_GROUPS_PERMISSIONS
(
    groups_permission_id serial PRIMARY key,
    usergroup VARCHAR (50) NOT NULL,
    permission VARCHAR (50) NOT null,
    unique (usergroup, permission)
);
--name pg-container -e POSTGRES_USER=pg-user -e POSTGRES_PASSWORD=test1234 -e POSTGRES_DB=auth-db -p 5432:5432 -d postgres

DROP TABLE AUTH_USER_IN_USERGROUPS;
DROP TABLE AUTH_GROUPS_PERMISSIONS;

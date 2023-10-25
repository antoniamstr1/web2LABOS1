create table natjecanje(
                           natjecanje_id serial primary key not null,
                           naziv varchar(255) unique,
                           bodovi_pobjeda float,
                           bodovi_remi float,
                           bodovi_poraz float,
                           korisnik_sub varchar(255)
);
create table natjecatelj(
                            natjecatelj_id serial primary key not null,
                            ime  varchar(255) unique
);
create table kolo(
                     kolo_id serial primary key not null,
                     natjecanje varchar(255),
                     natjecatelj1 varchar(255),
                     natjecatelj2 varchar(255),
                     foreign key (natjecanje) references natjecanje(naziv),
                     foreign key (natjecatelj1) references natjecatelj(ime),
                     foreign key (natjecatelj2) references natjecatelj(ime),
                     natjecatelj1_ishod int,
                     natjecatelj2_ishod int
);

create table bodovi(
                       natjecatelj varchar(255),
                       natjecanje varchar(255),
                       bodovi int,
                       primary key(natjecanje, natjecatelj),
                       foreign key (natjecatelj) references natjecatelj(ime),
                       foreign key (natjecanje) references natjecanje(naziv)
);

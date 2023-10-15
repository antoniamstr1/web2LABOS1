for (var k = 0; k < lista_natjecatelja.length; k++) {
    pool.query('insert into bodovi (natjecatelj, natjecanje) values ($1,$2)',
        [lista_natjecatelja[k], naziv], (error, results) => {
            if (error) {
                throw error
            }});
}




for (var i = 0; i < lista_natjecatelja.length; i++) {
    for (var j = 0; j < lista_natjecatelja.length; j++) {
        if (lista_natjecatelja[i] != lista_natjecatelja[j] && j > i) {
            pool.query('insert into kolo (natjecatelj1, natjecatelj2,natjecanje) values ($1,$2,$3)',
                [lista_natjecatelja[i], lista_natjecatelja[j], naziv], (error, results) => {
                    if (error) {
                        throw error
                    }
                });
        }
    }
}
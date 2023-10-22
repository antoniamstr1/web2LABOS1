/**
 * TU SE NALAZE SVI UPITI IZ BAZE
 */
const { DB_USER, DB_HOST, DB_PASSWORD } = process.env;
require('dotenv').config();
const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'natjecanja_m9z9',
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: true
})

/**
 * vraća sva natjecanja
 */
const getAllNatjecanje = (req, res) => {
    pool.query('SELECT * FROM natjecanje ORDER BY naziv', (error, results) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred while fetching data from the database.' });
        } else {
            res.status(200).json(results.rows);
        }
    });
};

const getNatjecanje = (req, res) => {
    const naziv = req.params.naziv;
    pool.query('SELECT * FROM natjecanje where naziv = $1',[naziv] ,(error, results) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred while fetching data from the database.' });
        } else {
            res.status(200).json(results.rows);
        }
    });
};


/**
 * vraća sva natjecanja povezana s određenim korisnikom
 */
const getNatjecanjaByKorisnik = (req,res) => {
    const sub = req.params.sub;
    console.log('current user:',req.oidc.isAuthenticated());
    //console.log('sub:', sub.toString());
    pool.query('select * from natjecanje where korisnik_sub = $1 ',[sub], (error,results) => {
        if(error) {
            throw error;

        }
        res.status(200).json(results.rows)
    })
}

/**
 * vraća sve natjecatelje određenog natjecanja poredanih po bodovima
 */
const getNatjecatelji = (req,res) => {

    const naziv = req.params.naziv;

    pool.query('select * from bodovi where natjecanje = $1 order by bodovi desc', [naziv] ,(error,results) => {
        if(error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

/**
 * vraća sve natjecatelje određenog kola
 */
const getKolo = (req,res) => {

    const kolo_id = parseInt(req.params.koloid);
    pool.query('select natjecatelj.ime from kolo left join natjecatelj on natjecatelj.ime=kolo.ime where kolo_id = $1 ',[kolo_id], (error,results) => {
        if(error) {
            throw error
        }

    })
    pool.query('select natjecatelj.ime from kolo left join natjecatelj on natjecatelj.ime=kolo.ime where kolo_id = $1 ',[kolo_id], (error,results) => {
        if(error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

/**
 * vraća sva kola određenog natjecanja
 */
const getKolaByNatjecanje = (req,res) => {

    const natj = req.params.natj;
    pool.query('select * from kolo where natjecanje = $1 ',[natj], (error,results) => {
        if(error) {
            throw error
        }

        res.status(200).json(results.rows)
    })
}


/**
 * dodavanje natjecanja
 */
const createNatjecanje = (req, res) => {
    const { naziv, bodovi_pobjeda, bodovi_remi, bodovi_poraz } = req.body;
    const sub = req.params.sub;
    let lista_natjecatelja = [];


    const insertContestant = (ime) => {
        return new Promise((resolve, reject) => {
            pool.query('insert into natjecatelj (ime) values ($1)', [ime], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    };
    const checkContestantExists = (ime) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM natjecatelj WHERE ime = $1', [ime], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows.length > 0);
                }
            });
        });
    };

    const insertContestants = async () => {
        for (const ime of lista_natjecatelja) {

            const trimmedName = ime.trim();

            const exists = await checkContestantExists(trimmedName);
            if (!exists) {
                await insertContestant(trimmedName);

            }
        }
    };


    pool.query(
        'insert into natjecanje (naziv, bodovi_pobjeda, bodovi_remi, bodovi_poraz, korisnik_sub) values ($1, $2, $3, $4, $5) returning natjecanje_id',
        [naziv, bodovi_pobjeda, bodovi_remi, bodovi_poraz, sub],
        async (error, results) => {
            if (error) {
                    res.status(400).json({ error: 'Name is already taken.' });

            }else
            {
                const natjecanje_id = results.rows[0].natjecanje_id;


                const {popis_natjecatelja} = req.body;

                if (popis_natjecatelja.includes('\n')) {
                    lista_natjecatelja = popis_natjecatelja.split("\n");
                } else if (popis_natjecatelja.includes(',')) {
                    lista_natjecatelja = popis_natjecatelja.split(",");
                }



                await insertContestants();


                for (let i = 0; i < lista_natjecatelja.length; i++) {
                    for (let j = i + 1; j < lista_natjecatelja.length; j++) {
                        const trimmedName1 = lista_natjecatelja[i].trim();
                        const trimmedName2 = lista_natjecatelja[j].trim();
                        await insertKoloPair(trimmedName1, trimmedName2, natjecanje_id, naziv);
                    }
                }
                await insertBodoviData(lista_natjecatelja, naziv);

                res.status(201).json({ message: 'Competition and contestants added successfully', naziv: naziv });
            }
        }
    );
};


const insertKoloPair = (natjecatelj1, natjecatelj2, natjecanje_id, naziv) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'insert into kolo (natjecatelj1, natjecatelj2, natjecanje) values ($1, $2, $3)',
            [natjecatelj1, natjecatelj2, naziv],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }
        );
    });
};

const insertBodoviData = async (natjecatelja, natjecanje) => {
    for (const ime of natjecatelja) {
        const trimmedName = ime.trim();
        await insertBodoviDataForContestant(trimmedName, natjecanje);
    }
};


const insertBodoviDataForContestant = (ime, natjecanje) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO bodovi (natjecatelj, natjecanje, bodovi) VALUES ($1, $2, $3)',
            [ime, natjecanje, 0], // You can initialize 'bodovi' with 0
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }
        );
    });
};







//1.pogledam u tablici kolo koje je natjecanje u pitanju
//2. pogledam u tablici natjecanje koje su vrijednosti ishoda
//3. pogledam koji je drugi natjecatelj - dodajem mu suprotan ishod
    /**
 * dodavanje bodova - korisnik odabire pobjeda/poraz/remi i ažurira se tablica bodovi
 */
    const updateBodovi = async (req, res) => {
        try {

            const natjecatelj1_ishod = determineNatjecatelj1Ishod(req.body.natjecatelj1_ishod,req.body.natjecatelj2_ishod);

            const kolo_id = parseInt(req.params.kolo_id);
            const koloResult = await pool.query('SELECT * FROM kolo WHERE kolo_id = $1', [kolo_id]);

            if (koloResult.rows.length === 0) {
                return res.status(404).json({ error: 'Kolo not found' });
            }

            const naziv = koloResult.rows[0].natjecanje;
            const natjecatelj1 = koloResult.rows[0].natjecatelj1;
            const natjecatelj2 = koloResult.rows[0].natjecatelj2;

            const natjResult = await pool.query('SELECT * FROM natjecanje WHERE naziv = $1', [naziv]);

            if (natjResult.rows.length === 0) {
                return res.status(404).json({ error: 'Natj not found' });
            }

            const { bodovi_pobjeda, bodovi_remi, bodovi_poraz } = natjResult.rows[0];

            const { bodovi_1, bodovi_2 } = calculateBodovi(natjecatelj1_ishod, bodovi_pobjeda, bodovi_remi, bodovi_poraz);

            const updateResult = await pool.query(
                'UPDATE bodovi SET bodovi = bodovi + $1 WHERE natjecatelj = $2 AND natjecanje = $3;',
                [bodovi_1, natjecatelj1, naziv]
            );

            const updateResult2 = await pool.query(
                'UPDATE bodovi SET bodovi = bodovi + $1 WHERE natjecatelj = $2 AND natjecanje = $3;',
                [bodovi_2, natjecatelj2, naziv]
            );


            const addIshodToKolo = await pool.query(
                'update kolo set natjecatelj1_ishod = $1, natjecatelj2_ishod =$2  WHERE kolo_id = $3 AND natjecanje = $4;',
                [parseInt(req.body.natjecatelj1_ishod), parseInt(req.body.natjecatelj2_ishod), kolo_id, naziv]
            );

            res.status(201).json({ message: 'Results added successfully', ishod1: req.body.natjecatelj1_ishod, ishod2: req.body.natjecatelj2_ishod});

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

function determineNatjecatelj1Ishod(ishod,ishod2) {
    if (parseInt(ishod) > parseInt(ishod2)) {
        return 'pobjeda';
    } else if (parseInt(ishod) < parseInt(ishod2)) {
        return 'poraz';
    } else {
        return 'remi';
    }
}

function calculateBodovi(natjecatelj1_ishod, bodovi_pobjeda, bodovi_remi, bodovi_poraz) {
    let bodovi_1, bodovi_2;

    if (natjecatelj1_ishod === 'pobjeda') {
        bodovi_1 = bodovi_pobjeda;
        bodovi_2 = bodovi_poraz;
    } else if (natjecatelj1_ishod === 'poraz') {
        bodovi_1 = bodovi_poraz;
        bodovi_2 = bodovi_pobjeda;
    } else if (natjecatelj1_ishod === 'remi') {
        bodovi_1 = bodovi_remi;
        bodovi_2 = bodovi_remi;
    }

    return { bodovi_1, bodovi_2 };
}






module.exports = {
    getAllNatjecanje,
    getNatjecanje,
    getNatjecanjaByKorisnik,
    getNatjecatelji,
    getKolo,
    getKolaByNatjecanje,
    createNatjecanje,
    updateBodovi
}

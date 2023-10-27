import React, {useEffect, useState} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import PutBodovi from './PutBodovi';
function PopisNatjecanja() {
    const {user, isAuthenticated} = useAuth0();
    const [data, setData] = useState([]);
    const [kola, setKola] = useState([]);
    const [izabranoNatjecanje, setIzabranoNatjecanje] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [ setLoading] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('firstLoadDone') === null) {
            localStorage.setItem('firstLoadDone', 1);
            console.log('This is the initial load');
        } else {
            console.log('This is a page refresh');
        }

        fetch(`https://web2lab1natjecanja.onrender.com/natjecanjaByKorisnik/${user?.sub}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                console.log('user:'+user)

                setData(data);
            })
            .catch((error) => console.error('Error fetching natjecana data:', error))
            .finally(() => {
                setLoading(false); // Set loading to false when the data is fetched
            });
    }, [user]);


    const fetchKola = (naziv) => {
        fetch(`https://web2lab1natjecanja.onrender.com/kola/${naziv}`)
            .then((response) => response.json())
            .then((kolaData) => setKola(kolaData))
            .catch((error) => console.error('Error fetching kola data:', error));
    };


    const handleShowKola = (naziv) => {
        setIzabranoNatjecanje(naziv);
        fetchKola(naziv);
    };


    const filteredData = data.filter((natj) =>
        natj.naziv.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function br_nat(kola){
        const kola_length = kola.length;
        console.log('kola_length:', kola_length);
        const natjecatelji_n  = (1+Math.sqrt(1-4*-2*10)) / (2);
        console.log('natjecatelji n: ', natjecatelji_n)
        return natjecatelji_n;
    }
    let index2 = 1;

    return (
        <>
            {isAuthenticated ? (
                <div className="flex-container">
                    <div className="competition-container">
                        <h1>Popis natjecanja</h1>
                        <div className="list-container">
                            <input
                                type="text"
                                placeholder="  Pretraži natjecanja ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <ul className="competition-list scrollable-container">
                                {filteredData.map((natj) => (
                                    <li key={natj.naziv}>
                                        <button className="button-list" onClick={() => handleShowKola(natj.naziv)}>
                                            {natj.naziv}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h1>Raspored kola</h1>
                        {izabranoNatjecanje && (
                            <div className="contestants-container">
                                {kola.map((kolo, index ) => (
                                    <div key={kolo.natjecatelj1 + kolo.natjecatelj2}>
                                        <div className="flex-container-vertical">

                                            {index % Math.floor(br_nat(kola) / 2) === 0 && <div>{index2++}. kolo:</div>}

                                            <div className="flex-container-horizontal div-smaller color1">

                                            <div className="kolo-imena">{kolo.natjecatelj1}</div>
                                            <div className="kolo-imena">:</div>
                                            <div className="kolo-imena">{kolo.natjecatelj2}</div>
                                        </div>
                                        <div >
                                            {kolo.natjecatelj1_ishod === null ? (
                                                <PutBodovi kolo_id={kolo.kolo_id} />
                                            ) : (
                                                <div className="flex-container-horizontal div-smaller color2">
                                                <div>{kolo.natjecatelj1_ishod}</div>
                                                    <div> : </div>
                                                <div>{kolo.natjecatelj2_ishod}</div>
                                                </div>
                                            )}
                                        </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <p>Potrebna je prijava za kreiranje natjecanja..</p>
                </div>
            )}
        </>
    );
}

export default PopisNatjecanja;

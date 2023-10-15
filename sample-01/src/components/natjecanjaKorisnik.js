import React, { useState, useEffect } from 'react';
import NavBar from './NavBar'
import { useAuth0 } from '@auth0/auth0-react';
import IzborIshoda from './PutBodovi'
import PutBodovi from './PutBodovi'


function PopisNatjecanja() {
    const { user, isAuthenticated, loginWithRedirect  } = useAuth0();
    const [data, setData] = useState([]);
    const [kola, setKola] = useState([]);
    const [selectedCompetition, setSelectedCompetition] = useState(null);

    useEffect(() => {
        // Fetch data from the API when the component mounts
        fetch(`http://localhost:5000/natjecanjaByKorisnik/${user.sub}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Log the data to the console
                setData(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);
    // Function to fetch contestants for a specific competition
    const fetchKola = (naziv) => {
        fetch(`http://localhost:5000/kola/${naziv}`)
            .then((response) => response.json())
            .then((kolaData) => setKola(kolaData))
            .catch((error) => console.error('Error fetching kola data:', error));
    };

    // Handle button click to fetch contestants data
    const handleShowKola = (naziv) => {
        setSelectedCompetition(naziv);
        fetchKola(naziv);
    };
    return (
        <div>
            <h1>List of Competitions</h1>

            {!isAuthenticated ? (
                <div>
                    <p>You need to be logged in to view competitions.</p>

                </div>
            ) : (
                <ul>

                    {data.map((competition) => (
                        <li key={competition.naziv}>
                            {competition.naziv}
                            <button onClick={() => handleShowKola(competition.naziv)}>
                                Show Kola and contestants
                            </button>
                            {selectedCompetition === competition.naziv && (
                                <ul>
                                    {kola.map((kolo) => (
                                        <div key={kolo.natjecatelj1 + kolo.natjecatelj2}>
                                            <div>{kolo.natjecatelj1}</div>
                                            <div>{kolo.natjecatelj2}</div>
                                            <div>
                                                <PutBodovi kolo_id={kolo.kolo_id} />
                                            </div>
                                        </div>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}


export default PopisNatjecanja;
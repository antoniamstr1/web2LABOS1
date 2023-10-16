import React, {useEffect, useState} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import PutBodovi from './PutBodovi';
function PopisNatjecanja() {
    const {user, isAuthenticated, loginWithRedirect} = useAuth0();
    const [data, setData] = useState([]);
    const [kola, setKola] = useState([]);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

    // Filter competitions based on the search term
    const filteredData = data.filter((competition) =>
        competition.naziv.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {isAuthenticated ? (
                <div className="flex-container">
                    <div className="competition-container">
                        <h1>List of Competitions</h1>
                        <div className="list-container">
                            <input
                                type="text"
                                placeholder="Search competitions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <ul className="competition-list scrollable-container">
                                {filteredData.map((competition) => (
                                    <li key={competition.naziv}>
                                        <button onClick={() => handleShowKola(competition.naziv)}>
                                            {competition.naziv}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h1>Raspored kola</h1>
                        {selectedCompetition && (
                            <div className="contestants-container">
                                {kola.map((kolo) => (
                                    <div key={kolo.natjecatelj1 + kolo.natjecatelj2}>
                                        <div className="flex-container-vertical">
                                        <div className="flex-container-horizontal">
                                            <div className="kolo-imena">{kolo.natjecatelj1}</div>

                                            <div className="kolo-imena">{kolo.natjecatelj2}</div>
                                        </div>
                                        <div>
                                            <PutBodovi kolo_id={kolo.kolo_id}/>
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
                    <p>You need to be logged in to view competitions.</p>
                </div>
            )}
        </>
    );
}

export default PopisNatjecanja;

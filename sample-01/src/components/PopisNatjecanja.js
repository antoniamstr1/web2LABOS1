import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';

function PopisNatjecanja() {
    const [data, setData] = useState([]);
    const [contestants, setContestants] = useState([]);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/natjecanja')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setData(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const fetchContestants = (naziv) => {
        fetch(`http://localhost:5000/natjecatelji/${naziv}`)
            .then((response) => response.json())
            .then((contestantsData) => setContestants(contestantsData))
            .catch((error) => console.error('Error fetching contestants data:', error));
    };

    const handleShowContestants = (naziv) => {
        setSelectedCompetition(naziv);
        fetchContestants(naziv);
    };

    const filteredData = data.filter((competition) =>
        competition.naziv.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className = "flex-container">
            <div className="competition-container">
                <h1>Popis natjecanja</h1>
                <div className="list-container" >

                    <input
                        type="text"
                        placeholder="Search competitions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ul className="competition-list scrollable-container">
                        {filteredData.map((competition) => (
                            <li key={competition.naziv}>
                                <button className="button-list"  onClick={() => handleShowContestants(competition.naziv)}>
                                    {competition.naziv}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
            <div>
            <h1>Trenutni poredak natjecatelja</h1>
            <div className="flex-container-vertical">

            <div className="flex-container-horizontal">

                <div >
                {selectedCompetition && (
                    <div className="contestants-container">

                        <div className="contestants-list">
                            <div>NATJECATELJI</div>
                            {contestants.map((contestant, index) => (
                                <div className="contestant-element" key={contestant.natjecatelj}>
                                    {index + 1}. {contestant.natjecatelj}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
                <div>
                {selectedCompetition && (
                    <div className="contestants-container">

                        <div className="contestants-list">
                            <div>BODOVI</div>
                            {contestants.map((contestant) => (
                                <div className="contestant-element" key={contestant.natjecatelj + contestant.bodovi}>
                                    {contestant.bodovi}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}

export default PopisNatjecanja;

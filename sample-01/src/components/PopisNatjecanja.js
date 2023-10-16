import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';

function PopisNatjecanja() {
    const [data, setData] = useState([]);
    const [contestants, setContestants] = useState([]);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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
                <h1>List of Competitions</h1>
                <div className="list-container" >

                    <input
                        type="text"
                        placeholder="Search competitions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ul className="competition-list" className="scrollable-container">
                        {filteredData.map((competition) => (
                            <li key={competition.naziv}>
                                <button onClick={() => handleShowContestants(competition.naziv)}>
                                    {competition.naziv}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
            <div>
                <h1>Contestants and Points</h1>
                {selectedCompetition && (
                    <div className="contestants-container">

                        <ul className="contestants-list">
                            {contestants.map((contestant) => (
                                <li key={contestant.natejcatelj + contestant.bodovi}>
                                    {contestant.natjecatelj} - Bodovi: {contestant.bodovi}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>

    );
}

export default PopisNatjecanja;

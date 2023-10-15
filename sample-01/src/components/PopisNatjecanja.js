import React, { useState, useEffect } from 'react';
import NavBar from './NavBar'

function PopisNatjecanja() {
    const [data, setData] = useState([]);
    const [contestants, setContestants] = useState([]);
    const [selectedCompetition, setSelectedCompetition] = useState(null);

    useEffect(() => {
        // Fetch data from the API when the component mounts
        fetch('http://localhost:5000/natjecanja')
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Log the data to the console
                setData(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);
    // Function to fetch contestants for a specific competition
    const fetchContestants = (naziv) => {
        fetch(`http://localhost:5000/natjecatelji/${naziv}`)
            .then((response) => response.json())
            .then((contestantsData) => setContestants(contestantsData))
            .catch((error) => console.error('Error fetching contestants data:', error));
    };

    // Handle button click to fetch contestants data
    const handleShowContestants = (naziv) => {
        setSelectedCompetition(naziv);
        fetchContestants(naziv);
    };
    return (
        <div>

            <h1>List of Competitions</h1>

            <ul>
                {data.map((competition) => (
                    <li key={competition.naziv}>
                        {competition.naziv}
                        <button onClick={() => handleShowContestants(competition.naziv)}>
                            Show Contestants
                        </button>
                        {selectedCompetition === competition.naziv && (
                            <ul>
                                {contestants.map((contestant) => (
                                    <li key={contestant.natejcatelj + contestant.bodovi}>
                                        {contestant.natjecatelj} - Bodovi: {contestant.bodovi}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}


export default PopisNatjecanja;
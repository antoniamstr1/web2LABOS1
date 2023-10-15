import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ContestDetail({ match }) {
    const [contest, setContest] = useState({});
    const [contestants, setContestants] = useState([]);
    const [kola, setKola] = useState([]);

    useEffect(() => {
        // Fetch contest details
        axios.get(`http://localhost:5000/natjecanje/${match.params.naziv}`).then((response) => {
            setContest(response.data);
        });

        // Fetch contestants
        axios.get(`http://localhost:5000/natjecatelji/${match.params.naziv}`).then((response) => {
            setContestants(response.data);
        });

        // Fetch kola
        axios.get(`http://localhost:5000/kola/${match.params.naziv}`).then((response) => {
            setKola(response.data);
        });
    }, [match.params.naziv]);

    return (
        <div>
            <h1>Contest: {contest.naziv}</h1>
            <h2>Contestants:</h2>
            <ul>
                {contestants.map((contestant) => (
                    <li key={contestant.natejcatelj + contestant.bodovi}>
                        {contestant.natjecatelj} - Bodovi: {contestant.bodovi}
                    </li>
                ))}
            </ul>
            <h2>Kola:</h2>
            <ul>
                {kola.map((kolo) => (
                    <li key={kolo.natjecatelj1 + kolo.natjecatelj2 + kolo.natjecatelj1_ishod + kolo.natjecatelj2_ishod}>
                        {kolo.natjecatelj1} : {kolo.natjecatelj2} ->{' '}
                        {kolo.natjecatelj1_ishod !== null ? kolo.natjecatelj1_ishod : '-'} :{' '}
                        {kolo.natjecatelj2_ishod !== null ? kolo.natjecatelj2_ishod : '-'}

                    </li>
                    // You can display more details about each kolo here
                ))}
            </ul>
        </div>
    );
}

export default ContestDetail;

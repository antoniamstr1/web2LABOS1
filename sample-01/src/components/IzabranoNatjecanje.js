import React, {useEffect, useState} from 'react';
import axios from 'axios';
import PutBodovi from "./PutBodovi";

function ContestDetail({match}) {
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
            <div className="title"><h1> {match.params.naziv}</h1></div>
        <div className="flex-container-horizontal">

            <div >
            <h3>Trenutni poredak natjecatelja:</h3>
            <div className="flex-container-horizontal">

                <div className="contestants-container">

                    <div className="contestants-list">
                        <div>NATJECATELJI</div>
                        {contestants.map((contestant, index) => (
                            <div className="contestant-element" key={contestant.natjecatelj}>
                                {index + 1}.  {contestant.natjecatelj}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="contestants-container">

                    <div className="contestants-list">
                        <div>BODOVI</div>
                        {contestants.map((contestant) => (
                            <div className="contestant-element" key={contestant.bodovi}>
                                {contestant.bodovi}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </div>
            <div>
                    <h3>Raspored kola</h3>

                    <div className="contestants-container">
                        {kola.map((kolo, index) => (
                            <div key={kolo.natjecatelj1 + kolo.natjecatelj2}>
                                <div className="flex-container-vertical">
                                    <div>{index + 1}. kolo:</div>
                                    <div className="flex-container-horizontal div-smaller color2">

                                        <div className="kolo-imena">{kolo.natjecatelj1}</div>
                                        <div className="kolo-imena">:</div>
                                        <div className="kolo-imena">{kolo.natjecatelj2}</div>
                                    </div>
                                    <div>
                                        {kolo.natjecatelj1_ishod === null ? (
                                            <PutBodovi kolo_id={kolo.kolo_id}/>
                                        ) : (
                                            <div className="flex-container-horizontal div-smaller color1">
                                                <div>{kolo.natjecatelj1_ishod}</div>
                                                <div> :</div>
                                                <div>{kolo.natjecatelj2_ishod}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ContestDetail;

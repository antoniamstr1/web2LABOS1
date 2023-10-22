import React, {useEffect, useState} from 'react';
import axios from 'axios';
import PutBodovi from "./PutBodovi";

function IzabranoNatjecanje({match}) {
    const [contest, setNatjecanje] = useState({});
    const [natjecatelji, setNatjecatelji] = useState([]);
    const [kola, setKola] = useState([]);

    useEffect(() => {

        axios.get(`http://localhost:5000/natjecanje/${match.params.naziv}`).then((response) => {
            setNatjecanje(response.data);
        });


        axios.get(`http://localhost:5000/natjecatelji/${match.params.naziv}`).then((response) => {
            setNatjecatelji(response.data);
        });


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
                        {natjecatelji.map((nat, index) => (
                            <div className="contestant-element" key={nat.natjecatelj}>
                                {index + 1}.  {nat.natjecatelj}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="contestants-container">

                    <div className="contestants-list">
                        <div>BODOVI</div>
                        {natjecatelji.map((nat) => (
                            <div className="contestant-element" key={nat.bodovi}>
                                {nat.bodovi}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </div>
            <div>
                    <h3>Raspored kola</h3>

                    <div className="natejcatelji-container">
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
                                            <div className="flex-container-horizontal div-smaller color1">
                                                <div>-</div>
                                                <div> :</div>
                                                <div>-</div>
                                            </div>
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

export default IzabranoNatjecanje;

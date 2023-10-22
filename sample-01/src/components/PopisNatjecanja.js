import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';

function PopisNatjecanja() {
    const [data, setData] = useState([]);
    const [natjecatelji, setNatjecatelji] = useState([]);
    const [izabranoNatjecanje, setIzabranoNatjecanje] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/natjecanja')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setData(data);
            })
            .catch((error) => console.error('Error fetching natjecanja data:', error));
    }, []);

    const fetchNatjecatelji = (naziv) => {
        fetch(`http://localhost:5000/natjecatelji/${naziv}`)
            .then((response) => response.json())
            .then((contestantsData) => setNatjecatelji(contestantsData))
            .catch((error) => console.error('Error fetching natjecatelji data:', error));
    };

    const handleShowContestants = (naziv) => {
        setIzabranoNatjecanje(naziv);
        fetchNatjecatelji(naziv);
    };

    const filteredData = data.filter((natj) =>
        natj.naziv.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className = "flex-container">
            <div className="competition-container">
                <h1>Popis natjecanja</h1>
                <div className="list-container" >

                    <input
                        type="text"
                        placeholder="Pretraži natjecanja..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ul className="competition-list scrollable-container">
                        {filteredData.map((natj) => (
                            <li key={natj.naziv}>
                                <button className="button-list"  onClick={() => handleShowContestants(natj.naziv)}>
                                    {natj.naziv}
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
                {izabranoNatjecanje && (
                    <div className="contestants-container">

                        <div className="contestants-list">
                            <div>NATJECATELJI</div>
                            {natjecatelji.map((n, index) => (
                                <div className="contestant-element" key={n.natjecatelj}>
                                    {index + 1}. {n.natjecatelj}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
                <div>
                {izabranoNatjecanje && (
                    <div className="contestants-container">

                        <div className="contestants-list">
                            <div>BODOVI</div>
                            {natjecatelji.map((n) => (
                                <div className="contestant-element" key={n.natjecatelj + n.bodovi}>
                                    {n.bodovi}
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

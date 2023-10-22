import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

function PostNatjecanja() {

    const [formData, setFormData] = useState({
        naziv: '',
        bodovi_pobjeda: '',
        bodovi_remi: '',
        bodovi_poraz: '',
        popis_natjecatelja: '',
    });

    const { user,isAuthenticated, loginWithRedirect } = useAuth0();
    const [errorMessage, setErrorMessage] = useState(null); // State to hold the error message
    const [successMessage, setSuccessMessage] = useState(null); // State to hold the success message

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const resetMessages = () => {
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        resetMessages();
        if (!isAuthenticated) {
            setErrorMessage('You need to log in to create a competition.');
            return;
        }


        if (
            formData.naziv.trim() === '' ||
            formData.bodovi_pobjeda.trim() === '' ||
            formData.bodovi_remi.trim() === '' ||
            formData.bodovi_poraz.trim() === '' ||
            formData.popis_natjecatelja.trim() === ''
        ) {
            setErrorMessage('Sva polja moraju biti popunjena');
            return;
        }

        if (
            (formData.popis_natjecatelja.includes(',') && formData.popis_natjecatelja.includes(';')) ||
            ((!formData.popis_natjecatelja.includes(',')) &&
            (!formData.popis_natjecatelja.includes('\n')))
        ) {
            setErrorMessage('Natjecatelji moraju biti odvojeni , ili \n');
            return;
        }
        //split da vidim jel ima 4 do 8
        var lista_natjecatelja = []
        if (formData.popis_natjecatelja.includes('\n')) {
            lista_natjecatelja = formData.popis_natjecatelja.split("\n");
        } else if (formData.popis_natjecatelja.includes(',')) {
            lista_natjecatelja = formData.popis_natjecatelja.split(",");
        }
        if (lista_natjecatelja.length < 4){
            setErrorMessage('Minimalan broj natjecatelja je 4.');
            return; // Stop form submission if any field is empty
        }
        //https://www.geeksforgeeks.org/javascript-program-to-find-duplicate-elements-in-an-array/
        function hasDuplicates(array) {
            return (new Set(array)).size !== array.length;
        }

        const lista_natjecatelja_trim = lista_natjecatelja.map(element => {
            return element.trim();
        });

        if (hasDuplicates(lista_natjecatelja_trim)){
            setErrorMessage('Natjecatelji ne smiju imati ista imena.');
            return;
        }




        axios
            .post(`http://localhost:5000/kreirajnatjecanje/${user.sub}`, formData)
            .then((response) => {

                if (response.data && response.data.message) {
                    console.log('uspjesno spremljeno natjecanje');
                    const competitionURL = `http://localhost:3000/natjecanje/${response.data.naziv}`;
                    setSuccessMessage(
                        <div>
                            Natjecanje podijeli sa drugima: <a href={competitionURL}>{competitionURL}</a>.
                        </div>
                    );
                }
            })
            .catch((error) => {
                console.error('Error sending data:', error);
                if (error.response) {
                    setErrorMessage(error.response.data.error);
                } else {
                    setErrorMessage('An error occurred while sending data.');
                }
            });
    };


    return (
        <div>
            {isAuthenticated ? (
                <div>
                    <h2>Kreiraj natjecanje</h2>
                    <form onSubmit={handleSubmit}>


                <div>
                    <label htmlFor="naziv">Naziv:</label>
                    <input
                        type="text"
                        id="naziv"
                        name="naziv"
                        value={formData.naziv}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex-container-horizontal">
                <div >
                    <label className="label-padding" htmlFor="bodovi_pobjeda">Bodovi za pobjedu:</label>
                    <input
                        type="number"
                        id="bodovi_pobjeda"
                        name="bodovi_pobjeda"
                        value={formData.bodovi_pobjeda}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="label-padding" htmlFor="bodovi_remi">Bodovi za remi:</label>
                    <input
                        type="number"
                        id="bodovi_remi"
                        name="bodovi_remi"
                        value={formData.bodovi_remi}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="label-padding" htmlFor="bodovi_poraz">Bodovi za poraz:</label>
                    <input
                        type="number"
                        id="bodovi_poraz"
                        name="bodovi_poraz"
                        value={formData.bodovi_poraz}
                        onChange={handleChange}
                    />
                </div>
                </div>
                <div>
                    <label htmlFor="popis_natjecatelja">Popis natjecatelja:</label>
                    <textarea

                        id="popis_natjecatelja"
                        name="popis_natjecatelja"
                        value={formData.popis_natjecatelja}
                        onChange={handleChange}
                    />
                </div>
                        <button className="btn btn-primary " type="submit">Submit</button>
                    </form>
                    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                    {successMessage && <div>{successMessage}</div>}
                </div>
            ) : (
                <div>
                    <p>Potrebna je prijava za kreiranje natjecanja.</p>

                </div>
            )}
        </div>
    );
}

export default PostNatjecanja;
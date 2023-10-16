import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

function PutBodovi({ kolo_id }) {
    console.log('kolo_id', kolo_id);
    const [formData, setFormData] = useState({
        natjecatelj1_ishod: '',
        natjecatelj2_ishod: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: parseInt(value) || '' // Ensure it's a number or empty string
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Send data to the backend using a PUT request
        axios
            .put(`http://localhost:5000/bodovi/${kolo_id}`, formData)
            .then((response) => {
                // Handle the response from the server, e.g., display a success message
                console.log('Data updated successfully:', response.data);
            })
            .catch((error) => {
                // Handle errors, e.g., display an error message
                console.error('Error updating data:', error);
            });
    };

    return (
        <div>

            <form onSubmit={handleSubmit}>
                <div className="flex-container-horizontal">
                <div>
                    <label htmlFor="natjecatelj1_ishod"></label>
                    <input
                        type="number"
                        id="natjecatelj1_ishod"
                        name="natjecatelj1_ishod"
                        value={formData.natjecatelj1_ishod}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="natjecatelj2_ishod"></label>
                    <input
                        type="number"
                        id="natjecatelj2_ishod"
                        name="natjecatelj2_ishod"
                        value={formData.natjecatelj2_ishod}
                        onChange={handleChange}
                    />
                </div>


                <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default PutBodovi;

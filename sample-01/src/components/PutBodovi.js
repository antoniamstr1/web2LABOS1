import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

function PutBodovi({ kolo_id }) {
    const { user } = useAuth0();

    const [formData, setFormData] = useState({
        natjecatelj1_ishod: '',
        natjecatelj2_ishod: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;


        const numericValue = parseInt(value);
        if (!isNaN(numericValue) && numericValue >= 0) {
            setFormData({
                ...formData,
                [name]: numericValue
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .put(`http://localhost:5000/bodovi/${kolo_id}`, formData)
            .then((response) => {
                console.log('uspjesno spremljeno kolo');
                console.log('response.data.success:',response.data);
                if (response.data && response.data.message) {
                    const ishod1  = response.data.ishod1;
                    const ishod2  = response.data.ishod2;
                    setIsSubmitted(true);
                    setSuccessMessage(
                        <div className="flex-container-vertical" >
                            <div className="flex-container-horizontal div-smaller color1" >
                                <div className="kolo-imena">{ishod1}</div>
                                <div className="kolo-imena"> : </div>
                                <div className="kolo-imena">{ishod2}</div>
                            </div>


                        </div>
                    );
                }
            })
            .catch((error) => {
                console.error('Error updating data:', error);
            });
    };

    return (
        <div>
            {isSubmitted ? (

                <div className="success-message">
                    {successMessage}
                </div>
            ) : (
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
                        <div className="dvotocka">:</div>
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
                        <button className="btn btn-primary smaller-button" type="submit">Submit</button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default PutBodovi;

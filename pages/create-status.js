import React, { useEffect, useState } from 'react';
import auth0 from '../lib/auth0';
import router from 'next/router';
import axios from 'axios';

const CreateStatus = (props) => {

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const geo = navigator.geolocation;

        if (!props.isAuth) {
            router.push('/');
        } else if (geo) {
            geo
                .getCurrentPosition(({ coords: { latitude, longitude } }) => {
                    setLatitude(latitude);
                    setLongitude(longitude);

                });
        }
    }, []);

    const onStatusChange = ({ target }) => {
        setStatus(target.value);
    }

    const save = async () => {
        await axios
            .post('/api/save-status', {
                status,
                coords: {
                    latitude,
                    longitude,
                },
            });
        console.log('test');
    }

    if (!props.isAuth) {
        return null
    }

    return (
        <>
            <h1>Create Status</h1>
            <label className='block'>
                <input
                    type="radio"
                    name="status"
                    value="bem"
                    onClick={onStatusChange}
                />
                Estou bem e sem sintomas.
            </label>
            <label className='block'>
                <input
                    type="radio"
                    name="status"
                    value="gripe"
                    onClick={onStatusChange}
                />
                Estou com sintomas de grip.
            </label>
            <label className='block'>
                <input
                    type="radio"
                    name="status"
                    value="covid"
                    onClick={onStatusChange}
                />
                Estou com sintomas da covid.
            </label>
            <button onClick={save}>Salvar</button>
            Sua posição atual : {latitude && `${latitude} X ${longitude}`}
        </>
    )
}

export default CreateStatus;

export async function getServerSideProps({ req, res }) {
    const session = await auth0.getSession(req);

    if (session) {

        return {
            props: {
                isAuth: true,
                user: session.user,
            }
        }
    }


    return {
        props: {
            isAuth: false,
            user: {}
        }
    }
}
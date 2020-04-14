import React, { useEffect } from 'react';
import auth0 from '../lib/auth0';
import router from 'next/router';
import { db } from '../lib/db';

const App = (props) => {
    useEffect(() => {
        if (!props.isAuth) {
            router.push('/');
        } else if (props.forceCreate) {
            router.push('/create-status');
        }
    }, []);

    if (!props.isAuth || props.forceCreate) {
        return null
    }

    return (
        <>
            <h1>app</h1>
            <pre>{JSON.stringify(props, null, 2)}</pre>
        </>
    )
}

export default App;

export async function getServerSideProps({ req, res }) {
    const session = await auth0.getSession(req);

    if (session) {
        const todaysCheckin = await db
            .collection('markers')
            .doc('2020-04-14')
            .collection('checks')
            .doc(session.user.sub)
            .get();
        const todaysData = todaysCheckin.data();

        return {
            props: {
                isAuth: true,
                user: session.user,
                forceCreate: todaysData ? false : true
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
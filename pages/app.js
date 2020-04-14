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
            <h1>Pessoas proximas a você</h1>
            <table>
                {
                    props.checkins.map(checkin => (
                        <tr>
                            <td>{checkin.id}</td>
                            <td>{checkin.status}</td>
                            <td>{checkin.coodinates.latitude}</td>
                            <td>{JSON.stringify(checkin.coodinates)}</td>

                        </tr>
                    ))
                }
            </table>

        </>
    )
}

export default App;

export async function getServerSideProps({ req, res }) {
    const session = await auth0.getSession(req);
    const date = new Date();
    const currentDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    if (session) {
        const todaysCheckin = await db
            .collection('markers')
            .doc(currentDate)
            .collection('checks')
            .doc(session.user.sub)
            .get();
        const todaysData = todaysCheckin.data();
        if (todaysData) {
            const checkins = await db
                .collection('markers')
                .doc(currentDate)
                .collection('checks')
                .near({
                    center: todaysData.coordinates,
                    radius: 1000,
                })
                .get();

            const checkinsLinst = await checkins.docs.map(doc => ({
                id: doc.id,
                status: doc.data().status,
                coodinates: {
                    latitude: doc.data().coordinates.latitude,
                    longitude: doc.data().coordinates.longitude,
                }
            }));

            return {
                props: {
                    isAuth: true,
                    user: session.user,
                    forceCreate: false,
                    checkins: checkinsLinst,
                }
            }
        }

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
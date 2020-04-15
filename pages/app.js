import React, { useEffect } from 'react';
import auth0 from '../lib/auth0';
import router from 'next/router';
import { db } from '../lib/db';
import { distance } from '../lib/geo';

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
            <h1 className="text-2xl text-gray-900 font-bold py-4" >Pessoas proximas a você</h1>
            <table className="table-auto w-full">
                <thead>
                    <tr className="bg-gray-700 text-white">
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Latitude x Longitude</th>
                        <th className="border px-4 py-2">Distancia</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        props.checkins.map((checkin, index) => (
                            <tr className={index % 2 === 0 ? "bg-gray-500" : "bg-gray-400"}>
                                <td className=" text-white text-center border px-4 py-2">{checkin.status} {checkin.id === props.user.sub && '(Seu status)'}</td>
                                <td className=" text-white text-center border px-4 py-2">{checkin.coodinates.latitude} x {checkin.coodinates.longitude}</td>
                                <td className=" text-white text-center border px-4 py-2">{checkin.distance}</td>
                            </tr>
                        ))
                    }
                </tbody>
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
                },
                distance: distance(
                    todaysData.coordinates.latitude, //-22.202920,
                    todaysData.coordinates.longitude, //-45.943670,
                    doc.data().coordinates.latitude,
                    doc.data().coordinates.longitude,

                ).toFixed(2),
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
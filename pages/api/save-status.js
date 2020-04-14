import { db } from '../../lib/db';
import admin from 'firebase-admin';
import auth0 from '../../lib/auth0';

const saveStatus = async (request, response) => {
    const session = await auth0.getSession(request);
    const date = new Date();
    const currentDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const userId = session.user.sub;
    const data = request.body;
    await db
        .collection('markers')
        .doc(currentDate)
        .collection('checks')
        .doc(userId)
        .set({
            status: data.status,
            user: userId,
            coordinates: new admin.firestore.GeoPoint(
                data.coords.latitude,
                data.coords.longitude
            ),
        });
    response.send({ ok: true });

}

export default saveStatus
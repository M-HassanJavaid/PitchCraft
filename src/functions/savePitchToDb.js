import app from '../config/firebase'
import { getFirestore , addDoc , collection } from 'firebase/firestore'
const db = getFirestore(app);


export default async function savePitch(pitch , email) {
    let ideasCollection = collection(db , 'ideas');

    let newDoc = await addDoc(ideasCollection , {
        ...pitch,
        user: email
    });

    console.log('Document has successfully added!')
    console.log(newDoc);
}

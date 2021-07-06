import admin from 'firebase-admin';

export default function () {
  const serviceAccount = require('../../../firebase-admin-key.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://default-bucket',
  });
}

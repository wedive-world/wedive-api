const { initializeApp, getApp } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging')

class FirebaseClient {
    constructor() {
        if (!FirebaseClient.instance) {
            FirebaseClient.instance = this
        }

        return FirebaseClient.instance
    }

    async sendMulticast(tokenList, data) {
        console.log(`FirebaseClient | sendMulticast: tokenList=${JSON.stringify(tokenList)}, data=${JSON.stringify(data)}`)

        let result = await getMessaging(getApp()).sendMulticast({
            data: JSON.parse(JSON.stringify(data)),
            tokens: tokenList
        })

        console.log(`FirebaseClient | sendMulticast: result=${JSON.stringify(result)}`)
    }
}

module.exports = FirebaseClient
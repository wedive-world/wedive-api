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
        if (!tokenList || tokenList.length == 0) {
            return
        }
        tokenList = tokenList.filter(token => token)

        if (!tokenList || tokenList.length == 0) {
            return
        }

        try {
            await sendMulticastInternal(tokenList, data)
        } catch (e) {
            console.error(e)
        }

        // console.log(`FirebaseClient | sendMulticast: result=${JSON.stringify(result)}`)
    }

    async sendMulticastInternal(tokenList, data) {
        await getMessaging(getApp()).sendMulticast({
            data: JSON.parse(JSON.stringify(data)),
            tokens: tokenList,
            android: {
                priority: "normal"
            },
            apns: {
                headers: {
                    "apns-priority": "5"
                }
            },
        })
    }
}

module.exports = FirebaseClient
const { gql, GraphQLClient } = require('graphql-request')

class ChatServiceProxy {

    constructor() {
        if (!ChatServiceProxy.instance) {
            ChatServiceProxy.instance = this
        }

        this.client = new GraphQLClient('https://chat.wedives.com/graphql')

        return ChatServiceProxy.instance
    }

    async createUser({
        uid, email, nickName
    }, idToken) {

        const query = gql`
            mutation Mutation($id: String!, $email: String!, $name: String!) {
                createChatUser(_id: $id, email: $email, name: $name) {
                    _id
                    active
                    name
                    email
                    utcOffset
                    avatarOrigin
                    createdAt
                    updatedAt
                }
            }
        `

        const variable = {
            id: uid,
            email: email,
            name: nickName ? nickName : uid
        }

        try {
            console.log(`ChatServiceProxy | createUser: variable=${JSON.stringify(variable)}, idToken=${idToken}`)
            const data = await this.client.request(query, variable, { idtoken: idToken })
            console.log(`ChatServiceProxy | createUser: data=${data}`)

            return data

        } catch (err) {
            console.log(`ChatServiceProxy | createUser: ERROR, ${err}`)
        }
    }

    async updateUser({ name, profileImageUrl }, idToken) {

        const query = gql`
        mutation Mutation($name: String!, $avatarUrl: String) {
            updateChatUser(name: $name, avatarUrl: $avatarUrl) {
                success
                reason
            }
        }
        `

        const variable = {
            name: name,
            avatarUrl: profileImageUrl
        }

        try {
            console.log(`ChatServiceProxy | updateUser: variable=${JSON.stringify(variable)}`)
            const data = await this.client.request(query, variable, { idtoken: idToken })
            console.log(`ChatServiceProxy | updateUser: data=${JSON.stringify(data)}`)

            return data

        } catch (err) {
            console.log(`ChatServiceProxy | updateUser: ERROR, ${err}`)
        }
    }

    async updateFcmToken({ uid, fcmToken }, idToken) {

        const query = gql`
            mutation Mutation($id: String!, $fcmToken: String!) {
                updateFcmToken(_id: $id, fcmToken: $fcmToken) {
                    success
                    reason
                }
            }
        `

        const variable = {
            id: uid,
            fcmToken: fcmToken
        }

        try {
            console.log(`ChatServiceProxy | updateFcmToken: variable=${JSON.stringify(variable)}, idToken=${idToken}`)
            const data = await this.client.request(query, variable, { idtoken: idToken })
            console.log(`ChatServiceProxy | updateFcmToken: data=${JSON.stringify(data)}`)

            return data

        } catch (err) {
            console.log(`ChatServiceProxy | updateFcmToken: ERROR, ${err}`)
        }
    }

    async createChatRoom(title, idToken) {

        const query = gql`
            mutation CreateRoom($title: String!) {
                createRoom(title: $title) {
                    _id
                }
            }
        `

        const variable = {
            title: title
        }

        try {
            console.log(`ChatServiceProxy | createChatRoom: variable=${JSON.stringify(variable)}, idToken=${idToken}`)
            const data = await this.client.request(query, variable, { idtoken: idToken })
            console.log(`ChatServiceProxy | createChatRoom: data=${JSON.stringify(data)}`)

            return data.createRoom._id

        } catch (err) {
            console.log(`ChatServiceProxy | createChatRoom: ERROR, ${err}`)
        }
    }

    async invite({ roomId, uid }, idToken) {

        const query = gql`
        mutation CreateRoom($roomId: String!, $uid: String!) {
            invite(roomId: $roomId, uid: $uid) {
                success
            }
        }
        `

        const variable = {
            roomId: roomId,
            uid: uid
        }

        try {
            console.log(`ChatServiceProxy | createChatRoom: variable=${JSON.stringify(variable)}, idToken=${idToken}`)
            const data = await this.client.request(query, variable, { idtoken: idToken })
            console.log(`ChatServiceProxy | createChatRoom: data=${JSON.stringify(data)}`)

            return data.createRoom._id

        } catch (err) {
            console.log(`ChatServiceProxy | createChatRoom: ERROR, ${err}`)
        }
    }

    async kick({ roomId, uid }, idToken) {

        const query = gql`
            mutation CreateRoom($roomId: String!, $uid: String!) {
                kick(roomId: $roomId, uid: $uid) {
                    success
                }
            }
        `

        const variable = {
            roomId: roomId,
            uid: uid
        }

        try {
            console.log(`ChatServiceProxy | createChatRoom: variable=${JSON.stringify(variable)}, idToken=${idToken}`)
            const data = await this.client.request(query, variable, { idtoken: idToken })
            console.log(`ChatServiceProxy | createChatRoom: data=${JSON.stringify(data)}`)

            return data.createRoom._id

        } catch (err) {
            console.log(`ChatServiceProxy | createChatRoom: ERROR, ${err}`)
        }
    }
}

module.exports = ChatServiceProxy
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

    async createChatRoom(title, memberUids, idToken) {

        const query = gql`
            mutation Mutation($title: String!, $membersUids: [String]) {
                createRoom(title: $title, membersUids: $membersUids) {
                    _id
                }
            }
        `

        const variable = {
            title: title,
            membersUids: memberUids
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
            mutation CreateRoom($roomId: String!, $userId: String!) {
                invite(roomId: $roomId, userId: $userId) {
                    success
                    reason
                }
            }
        `

        const variable = {
            roomId: roomId,
            userId: uid
        }

        try {
            console.log(`ChatServiceProxy | invite: variable=${JSON.stringify(variable)}, idToken=${idToken}`)
            const data = await this.client.request(query, variable, { idtoken: idToken })
            console.log(`ChatServiceProxy | invite: data=${JSON.stringify(data)}`)

            return data.createRoom._id

        } catch (err) {
            console.log(`ChatServiceProxy | invite: ERROR, ${err}`)
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
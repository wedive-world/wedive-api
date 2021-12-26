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
            name: nickName
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

    async updateUser({ nickName, profileImageUrl }, idToken) {

        const query = gql`
        mutation Mutation($name: String!, $avatarUrl: String) {
            updateChatUser(name: $name, avatarUrl: $avatarUrl) {
                success
                reason
            }
        }
        `

        const variable = {
            name: nickName,
            avatarUrl: profileImageUrl
        }

        try {
            console.log(`ChatServiceProxy | updateUser: variable=${JSON.stringify(variable)}, idToken=${idToken}`)
            const data = await this.client.request(query, variable, { idtoken: idToken })
            console.log(`ChatServiceProxy | updateUser: data=${data}`)

            return data

        } catch (err) {
            console.log(`ChatServiceProxy | updateUser: ERROR, ${err}`)
        }
    }
}

module.exports = ChatServiceProxy
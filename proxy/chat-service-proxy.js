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
            const data = await this.client.request(query, variable, { authorization: idToken })
            console.log(`ChatServiceProxy | createUser: data=${data}`)

            return data

        } catch (err) {
            console.log(`ChatServiceProxy | createUser: ERROR, ${err}`)
        }
    }

    async updateUser() {

    }
}

module.exports = ChatServiceProxy
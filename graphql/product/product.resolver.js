const { Product } = require('../../model').schema;

const translator = require('../common/util/translator')

module.exports = {

    DiveCenter: {
        async tickets(parent, args, context, info) {
            return await getProductsByIds(parent.tickets, context.languageCode)
        },

        async educations(parent, args, context, info) {
            return await getProductsByIds(parent.educations, context.languageCode)
        },

        async courses(parent, args, context, info) {
            return await getProductsByIds(parent.courses, context.languageCode)
        },

        async rentals(parent, args, context, info) {
            return await getProductsByIds(parent.rentals, context.languageCode)
        },
    },

    Instructor: {
        async educations(parent, args, context, info) {
            return await getProductsByIds(parent.educations, context.languageCode)
        },
        async courses(parent, args, context, info) {
            return await getProductsByIds(parent.courses, context.languageCode)
        },
        async services(parent, args, context, info) {
            return await getProductsByIds(parent.courses, context.languageCode)
        },
    },

    Query: {
        async getAllProducts(parent, args, context, info) {
            return await getAllProducts()
        },

        async getProductsByIds(parent, args, context, info) {
            return await getProductsByIds(args._ids)
        },

        async getProductById(parent, args, context, info) {
            return await getProductById(args._id)
        },
    },

    Mutation: {
        async upsertProduct(parent, args, context, info) {
            console.log(`mutation | upsertProduct: args=${JSON.stringify(args)}`)

            let product = null

            if (!args.input._id) {
                product = new Product(args.input)

            } else {
                product = await Product.findOne({ _id: args.input._id })
                Object.assign(product, args.input)
                product.updatedAt = Date.now()
            }

            if (!product.uniqueName) {
                product.uniqueName = product._id
            }

            await product.save()

            return product
        },

        async deleteProductById(parent, args, context, info) {
            await deleteProductRecurrsively(args._id)
            console.log(`mutation | deleteProductById: args._id=${JSON.stringify(args._id)}`)
            return args._id
        },
    }
};

async function getProductsByIds(ids, languageCode) {
    let products = await Product.find({ _id: { $in: ids } })
        .lean()

    return products.map(product => translator.translateOut(product, languageCode))
}


async function getAllProducts(languageCode) {
    let products = await Product.find()
        .lean()

    return products.map(product => translator.translateOut(product, languageCode))
}


async function getProductById(id, languageCode) {
    let product = await Product.find({ _id: id })
        .lean()

    return translator.translateOut(product, languageCode)
}

async function deleteProductRecurrsively(productId) {
    let product = await Product.findById(productId)
        .populate('options')

    for (childProduct of product.options) {
        await deleteProductRecurrsively(childProduct._id)
    }

    await product.remove()
}


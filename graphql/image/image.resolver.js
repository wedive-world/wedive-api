require('dotenv').config({ path: process.env.PWD + '/wedive-secret/s3-config.env' })
require('dotenv').config({ path: process.env.PWD + '/wedive-secret/aws-secret.env' })

const IMAGE_CDN_DNS = process.env.IMAGE_CDN_DNS

const schema = require('../../model').schema;
const Image = schema.Image

const {
    GraphQLUpload,
    Upload
} = require('graphql-upload');

const THUMBNAIL_WIDTH = 256

const {
    getImagesByIds,
    getResizedImage,
    updateImage,
    uploadImage,
} = require('../../controller/image-congtroller')

module.exports = {
    Upload: GraphQLUpload,

    Image: {
        thumbnailUrl: async (parent, args, context, info) => {
            if (parent.thumbnailUrl) {
                return parent.thumbnailUrl
            }

            let isGif = parent.mimeType.includes('gif')
            let thumbnailUrl = isGif
                ? `${IMAGE_CDN_DNS}/${image.s3ObjectKey}`
                : await getResizedImage(image._id, THUMBNAIL_WIDTH)

            await Image.findByIdAndUpdate(parent._id, { thumbnailUrl: thumbnailUrl })

            return thumbnailUrl
        }
    },

    Query: {
        getImageUrlById: async (parent, args, context, info) => {
            let result = await getResizedImage(args._id, args.width)
            // console.log(`query | getImageUrlById: _id=${args._id}, width=${args.width}, result=${result}`)
            return result
        },

        getImageUrlsByIds: async (parent, args, context, info) => {
            const ids = args._ids
            const widths = args.widths

            let resultList = []
            for ([i, id] of ids.entries()) {
                let result = await getResizedImage(id, widths[i])
                resultList.push(result)
            }

            // console.log(`query | getImageUrlsByIds: _ids=${args._ids}, widths=${args.widths}, resultList=${resultList}`)

            return resultList
        },

        getResizedImageById: async (parent, args, context, info) => {
            let resizedImageUrl = await getResizedImage(args._id, args.width)
            let image = await getImageById(args._id)

            let result = {
                url: resizedImageUrl,
                ...image
            }

            // console.log(`query | getResizedImageById: _id=${args._id}, width=${args.width}, result=${JSON.stringify(result)}`)
            return result
        },

        getResizedImagesByIds: async (parent, args, context, info) => {
            const ids = args._ids
            const widths = args.widths

            let resultList = []
            for ([i, id] of ids.entries()) {
                let resizedImageUrl = await getResizedImage(id, widths[i])
                let image = await getImageById(id)

                let result = {
                    url: resizedImageUrl,
                    ...image
                }

                resultList.push(result)
            }

            // console.log(`query | getResizedImagesByIds: _ids=${args._ids}, widths=${args.widths}, resultList=${resultList}`)

            return resultList
        },
    },

    Mutation: {
        uploadImage: async (parent, { file }) => {

            const { createReadStream, filename, mimetype, encoding } = await file;
            console.log(`mutation | singleUpload: file=${JSON.stringify(file)} filename=${filename}, mimetype=${mimetype}, encoding=${encoding}`)
            let image = await uploadImage(createReadStream(), filename, mimetype, encoding)

            if (image.mimeType.includes('gif')) {
                image.thumbnailUrl = `${IMAGE_CDN_DNS}/${image.s3ObjectKey}`
            } else {
                image.thumbnailUrl = await getResizedImage(image._id, THUMBNAIL_WIDTH)
            }
            await image.save()
            return image
        },

        updateImage: async (parent, args, context, info) => {
            // console.log(`mutation | updateImage: input=${JSON.stringify(args.input)}`)

            return await updateImage(args.input)
        },

        updateThmbnailForAllImages: async (parent, args, context, info) => {
            console.log(`mutation | updateThmbnailForAllImages`)

            let imageIds = await Image.find({
                mimeType: { $ne: 'image/gif' },
                thumbnailUrl: { $eq: null }
            })
                .select('_id')
                .lean()

            for (let imageId of imageIds) {
                try {
                    let thumbnailUrl = await getResizedImage(imageId, THUMBNAIL_WIDTH)
                    await Image.updateOne({ _id: imageId }, { thumbnailUrl: thumbnailUrl })
                } catch (err) {
                    console.error(`mutation | updateThmbnailForAllImages: err=${err}`)
                }
            }

            return {
                'success': true
            }
        },
    }
}
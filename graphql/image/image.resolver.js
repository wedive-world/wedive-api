const AWS = require('aws-sdk');

require('dotenv').config({ path: process.env.PWD + '/wedive-secret/s3-config.env' })
require('dotenv').config({ path: process.env.PWD + '/wedive-secret/aws-secret.env' })

const END_POINT = process.env.IMAGE_BUCKET_END_POINT
const REGION = process.env.IMAGE_BUCKET_REGION
const BUCKET_NAME = process.env.IMAGE_BUCKET_NAME
const IMAGE_CDN_DNS = process.env.IMAGE_CDN_DNS

console.log(`============ENV_LIST of image-resolver.js============`)
console.log(`pwd=${process.env.PWD}`)
console.log(`REGION=${REGION}`)
console.log(`BUCKET_NAME=${BUCKET_NAME}`)
console.log(`IMAGE_CDN_DNS=${IMAGE_CDN_DNS}`)
console.log(`=====================================================`)

const s3 = new AWS.S3({
    region: REGION,
    accesKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const schema = require('../../model').schema;
const Image = schema.Image
const ImageContent = schema.ImageContent

const {
    GraphQLUpload,
    Upload
} = require('graphql-upload');
const { finished } = require('stream/promises');

const fs = require('fs')
const sharp = require('sharp')
const https = require('https')

const TMP_DIR_PATH = `tmp/image/` //must end with '/'
const ORIGIN_IMAGE_DIR_PATH = `image/origin/` //must end with '/'
const RESIZED_IMAGE_DIR_PATH = `image/resized/` //must end with '/'

const THUMBNAIL_WIDTH = 128

module.exports = {
    Upload: GraphQLUpload,

    DiveSite: {
        async images(parent, args, context, info) {
            return await getImagesByIds(parent.images)
        },

        async backgroundImages(parent, args, context, info) {
            return await getImagesByIds(parent.backgroundImages)
        },
    },

    DivePoint: {
        async images(parent, args, context, info) {
            return await getImagesByIds(parent.images)
        },

        async backgroundImages(parent, args, context, info) {
            return await getImagesByIds(parent.backgroundImages)
        },
    },

    DiveCenter: {
        async images(parent, args, context, info) {
            return await getImagesByIds(parent.images)
        },

        async backgroundImages(parent, args, context, info) {
            return await getImagesByIds(parent.backgroundImages)
        },
    },

    Highlight: {
        async images(parent, args, context, info) {
            return await getImagesByIds(parent.images)
        },
    },

    Product: {
        async images(parent, args, context, info) {
            return await getImagesByIds(parent.images)
        },

        async backgroundImages(parent, args, context, info) {
            return await getImagesByIds(parent.backgroundImages)
        },

        async courseInformations(parent, args, context, info) {
            return await getImagesByIds(parent.courseInformations)
        },

        async briefIcon(parent, args, context, info) {
            return await getImageById(parent.briefIcon)
        },
    },

    User: {
        async profileImages(parent, args, context, info) {
            return await getImagesByIds(parent.profileImages)
        },
    },

    Diving: {
        async images(parent, args, context, info) {
            return await getImagesByIds(parent.images)
        },
    },

    InstructorVerification: {
        async profileImages(parent, args, context, info) {
            return await getImageById(parent.instructorLicenseImage)
        },

        async licenseImages(parent, args, context, info) {
            return await getImageById(parent.instructorLicenseImage)
        },
    },

    Instructor: {
        async profileImages(parent, args, context, info) {
            return await getImageById(parent.instructorLicenseImage)
        },

        async licenseImages(parent, args, context, info) {
            return await getImageById(parent.instructorLicenseImage)
        },
    },

    Review: {
        async images(parent, args, context, info) {
            return await getImagesByIds(parent.images)
        },
    },
    
    Agenda: {
        async images(parent, args, context, info) {
            return await getImagesByIds(parent.images)
        },
    },

    Query: {
        getImageUrlById: async (parent, args, context, info) => {
            let result = await getResizedImage(args._id, args.width)
            console.log(`query | getImageUrlById: _id=${args._id}, width=${args.width}, result=${result}`)
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

            console.log(`query | getImageUrlsByIds: _ids=${args._ids}, widths=${args.widths}, resultList=${resultList}`)

            return resultList
        },

        getResizedImageById: async (parent, args, context, info) => {
            let resizedImageUrl = await getResizedImage(args._id, args.width)
            let image = await getImageById(args._id)

            let result = {
                url: resizedImageUrl,
                ...image
            }

            console.log(`query | getResizedImageById: _id=${args._id}, width=${args.width}, result=${JSON.stringify(result)}`)
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

            console.log(`query | getResizedImagesByIds: _ids=${args._ids}, widths=${args.widths}, resultList=${resultList}`)

            return resultList
        },
    },

    Mutation: {
        uploadImage: async (parent, { file }) => {

            const { createReadStream, filename, mimetype, encoding } = await file;
            console.log(`mutation | singleUpload: file=${JSON.stringify(file)} filename=${filename}, mimetype=${mimetype}, encoding=${encoding}`)
            let image = await uploadImage(createReadStream, filename, mimetype, encoding)

            if (image.mimeType.includes('gif')) {

                image.thumbnailUrl = `${IMAGE_CDN_DNS}/${image.s3ObjectKey}`
            } else {
                image.thumbnailUrl = await getResizedImage(image._id, THUMBNAIL_WIDTH)
            }
            await image.save()
            return image
        },

        updateImage: async (parent, args, context, info) => {
            console.log(`mutation | updateImage: input=${JSON.stringify(args.input)}`)

            return await updateImage(args.input)
        },

        updateThmbnailForAllImages: async (parent, args, context, info) => {
            console.log(`mutation | updateThmbnailForAllImages`)

            let images = await Image.find()
            for (image of images) {
                let thumbnailUrl = await getResizedImage(image._id, THUMBNAIL_WIDTH)
                image.thumbnailUrl = thumbnailUrl;
                await image.save()
            }

            return {
                'success': true
            }
        },
    }
}

async function getImageById(id) {
    let image = await Image.findOne({ _id: id })
        .lean()

    return image
}

async function getImagesByIds(ids) {
    let images = await Image.find({ _id: { $in: ids } })
        .lean()

    return images
}

async function updateImage({
    _id,
    name,
    description,
    reference,
    uploaderId,
}) {
    let image = await Image.findOne({ _id: _id })
    image.name = name
    image.description = description
    image.reference = reference
    image.uploaderId = uploaderId

    await image.save()
    return image
}

async function uploadImage(createReadStream, filename, mimetype, encoding) {

    let image = new Image({
        s3EndPoint: END_POINT,
        s3Region: REGION,
        s3BucketName: BUCKET_NAME,
        name: filename,
        mimeType: mimetype,
        encoding: encoding
    })

    const ext = filename.split('.').pop()
    console.log(`mutation | singleUpload: ext=${ext}`)

    await fs.mkdirSync(TMP_DIR_PATH, { recursive: true })

    const tmpFilePath = `${TMP_DIR_PATH}${image._id}.${ext}`

    // Invoking the `createReadStream` will return a Readable Stream.
    // See https://nodejs.org/api/stream.html#stream_readable_streams
    const stream = createReadStream();

    // This is purely for demonstration purposes and will overwrite the
    // local-file-output.txt in the current working directory on EACH upload.

    const out = fs.createWriteStream(tmpFilePath);
    stream.pipe(out);
    await finished(out);

    let fileStat = await fs.readFileSync(tmpFilePath)
    image.fileSize = fileStat.length

    console.log(`mutation | singleUpload: fileSize=${image.fileSize}`)

    var uploadParams = {
        Bucket: BUCKET_NAME,
        Key: `${ORIGIN_IMAGE_DIR_PATH}${image._id}.${ext}`,
        ACL: 'private',
        Body: fs.createReadStream(tmpFilePath),
    };

    image.s3ObjectKey = uploadParams.Key
    console.log(`mutation | singleUpload: bucket=${JSON.stringify(uploadParams.Bucket)}, Key=${JSON.stringify(uploadParams.Key)}`)

    try {
        let result = await s3.putObject(uploadParams).promise()
        console.log(`mutation | singleUpload: result=${JSON.stringify(result.$response.data)}`)
        await fs.rmSync(tmpFilePath)

    } catch (err) {
        console.log(`mutation | singleUpload: putObject err=${err}}`)
    }

    await image.save()
    return image
}

async function getResizedImage(imageId, width) {

    // console.log(`query | getResizedImage: imageId=${imageId} width=${width}`)
    let image = await Image.findOne({ _id: imageId })

    if (!image) {
        return null
    }

    console.log(`query | getResizedImage: image=${JSON.stringify(image)}`)

    if (image.mimeType.includes('gif')) {
        return image.thumbnailUrl
    }

    if (!image.contentMap) {
        image.contentMap = new Map()
    }

    let imageContent = null

    if (image.contentMap.has(width.toString())) {
        let imageContentId = image.contentMap.get(width.toString())
        // console.log(`query | getResizedImage: imageContentId=${imageContentId}`)
        imageContent = await ImageContent.findOne({ _id: imageContentId })

        // console.log(`imageContent=${JSON.stringify(imageContent)}`)

    }

    if (imageContent == null) {
        const ext = image.s3ObjectKey.split('.').pop()

        imageContent = new ImageContent({
            s3EndPoint: END_POINT,
            s3Region: REGION,
            s3BucketName: BUCKET_NAME,
        })

        imageContent.s3ObjectKey = `${RESIZED_IMAGE_DIR_PATH}${imageContent._id}.${ext}`

        let getOriginImageParams = {
            Bucket: image.s3BucketName,
            Key: image.s3ObjectKey,
            Expires: 300
        }
        console.log(`query | getResizedImage: getOriginImageParams=${JSON.stringify(getOriginImageParams)}`)

        let signedUrl = await s3.getSignedUrlPromise('getObject', getOriginImageParams)
        console.log(`query | getResizedImage: signedUrl=${signedUrl}`)

        let originTmpDirPath = `${TMP_DIR_PATH}${imageContent._id}/`
        await fs.mkdirSync(originTmpDirPath, { recursive: true })

        let originTmpFilePath = `${originTmpDirPath}${image._id}.${ext}`
        await download(signedUrl, originTmpFilePath)

        let resizedTmpFilePath = `${originTmpDirPath}${imageContent._id}.${ext}`

        console.log(`query | getResizedImage: originTmpFilePath=${originTmpFilePath}, resizedTmpFilePath=${resizedTmpFilePath}`)

        await sharp(originTmpFilePath)
            .resize(width)
            .toFile(resizedTmpFilePath)

        await fs.rmSync(originTmpFilePath)

        var uploadParams = {
            Bucket: BUCKET_NAME,
            Key: `${RESIZED_IMAGE_DIR_PATH}${imageContent._id}.${ext}`,
            // ACL: 'public-read',
            Body: fs.createReadStream(resizedTmpFilePath),
        };

        imageContent.s3ObjectKey = uploadParams.Key
        // console.log(`query | getResizedImage: bucket=${JSON.stringify(uploadParams.Bucket)}, Key=${JSON.stringify(uploadParams.Key)}`)

        try {
            let result = await s3.putObject(uploadParams).promise()
            console.log(`result=${JSON.stringify(result.$response.data)}`)

            await imageContent.save()
            if (!image.contentMap) {
                image.contentMap = new Map()
            }
            image.contentMap.set(width.toString(), imageContent._id)
            await image.save()

            await fs.rmSync(resizedTmpFilePath)
            await fs.rmdirSync(originTmpDirPath)

            // return `https://${imageContent.s3BucketName}.s3.${imageContent.s3Region}.${imageContent.s3EndPoint}/${imageContent.s3ObjectKey}`

        } catch (err) {
            console.log(`query | getResizedImage: putObject err=${err}}`)
            return null;
        }
    }

    return `${IMAGE_CDN_DNS}/${imageContent.s3ObjectKey}`
}

async function download(url, dest) {

    /* Create an empty file where we can save data */

    /* Using Promises so that we can use the ASYNC AWAIT syntax */
    await new Promise((resolve, reject) => {
        https.get(url, resp =>
            resp.pipe(fs.createWriteStream(dest))
                .on('finish', async () => {
                    console.log(`query | download: finished - ${dest}`);
                    resolve();
                })
                .on('error', (error) => {
                    reject(error);
                })
        )
    })
        .catch((error) => {
            console.log(`query | download: url: ${url} Something happened: ${error}`);
        });
}

async function getImagesByIds(ids) {
    return await Image.find({ _id: { $in: ids } })
        .lean()
}
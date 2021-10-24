const AWS = require('aws-sdk');

require('dotenv').config({ path: process.env.PWD + '/wedive-secret/s3-config.env' })
require('dotenv').config({ path: process.env.PWD + '/wedive-secret/aws-secret.env' })

const END_POINT = process.env.IMAGE_BUCKET_END_POINT
const REGION = process.env.IMAGE_BUCKET_REGION
const BUCKET_NAME = process.env.IMAGE_BUCKET_NAME

console.log(`============ENV_LIST of image-resolver.js============`)
console.log(`pwd=${process.env.PWD}`)
console.log(`END_POINT=${END_POINT}`)
console.log(`REGION=${REGION}`)
console.log(`BUCKET_NAME=${BUCKET_NAME}`)
console.log(`=====================================================`)

const s3 = new AWS.S3({
    endpoint: END_POINT,
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
const http = require('http')

const TMP_DIR_PATH = `tmp/image/` //must end with '/'
const ORIGIN_IMAGE_DIR_PATH = `image/origin/` //must end with '/'
const RESIZED_IMAGE_DIR_PATH = `image/resized/` //must end with '/'

module.exports = {
    Upload: GraphQLUpload,

    Query: {
        getImageUrlById: async (parent, args, context, info) => {
            return await getResizedImage(args._id, args.width)
        }
    },

    Mutation: {
        uploadImage: async (parent, { file }) => {

            const { createReadStream, filename, mimetype, encoding } = await file;
            console.log(`mutation | singleUpload: file=${JSON.stringify(file)} filename=${filename}, mimetype=${mimetype}, encoding=${encoding}`)
            return await uploadImage(createReadStream, filename, mimetype, encoding)
        },

        updateImage: async (parent, args, context, info) => {
            console.log(`mutation | updateImage: input=${JSON.stringify(args.input)}`)

            return await updateImage(args.input)
        },
    }
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
    return image()
}

async function getResizedImage(imageId, width) {

    console.log(`query | getResizedImage: imageId=${imageId} width=${width}`)
    let image = await Image.findOne({ _id: imageId })

    if (!image) {
        return null
    }

    console.log(`query | getResizedImage: image=${JSON.stringify(image)}`)

    if (!image.contentMap) {
        image.contentMap = new Map()
    }

    let imageContent = null

    if (image.contentMap.has(width.toString())) {
        let imageContentId = image.contentMap.get(width.toString())
        console.log(`query | getResizedImage: imageContentId=${imageContentId}`)
        imageContent = await ImageContent.findOne({ _id: imageContentId })

        console.log(`imageContent=${JSON.stringify(imageContent)}`)

    } else {
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
        // http.get(signedUrl, resp => resp.pipe(fs.createWriteStream(originTmpFilePath)));
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
            ACL: 'public-read',
            Body: fs.createReadStream(resizedTmpFilePath),
        };

        imageContent.s3ObjectKey = uploadParams.Key
        console.log(`query | getResizedImage: bucket=${JSON.stringify(uploadParams.Bucket)}, Key=${JSON.stringify(uploadParams.Key)}`)

        try {
            let result = await s3.putObject(uploadParams).promise()
            console.log(`result=${JSON.stringify(result.$response.data)}`)

        } catch (err) {
            console.log(`query | getResizedImage: putObject err=${err}}`)
        }

        await imageContent.save()
        if (!image.contentMap) {
            image.contentMap = new Map()
        }
        image.contentMap.set(width.toString(), imageContent._id)
        await image.save()

        await fs.rmSync(resizedTmpFilePath)
        await fs.rmdirSync(originTmpDirPath)
    }

    return `https://${imageContent.s3BucketName}.${imageContent.s3Region}.linodeobjects.com/${imageContent.s3ObjectKey}`
}

async function download(url, dest) {

    /* Create an empty file where we can save data */

    /* Using Promises so that we can use the ASYNC AWAIT syntax */
    await new Promise((resolve, reject) => {
        http.get(url, resp =>
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
            console.log(`query | download: Something happened: ${error} `);
        });
}
const AWS = require('aws-sdk');
const END_POINT = process.env.IMAGE_BUCKET_END_POINT || 'http://us-east-1.linodeobjects.com'
const REGION = process.env.IMAGE_BUCKET_REGION || 'us-east-1'
const BUCKET_NAME = process.env.IMAGE_BUCKET_BUCKET_NAME || 'image-bucket'

const s3 = new AWS.S3({
    endpoint: END_POINT,
    region: REGION,
    accesKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const schema = require('../../model').schema;
const Image = schema.Image
const {
    GraphQLUpload,
    Upload
} = require('graphql-upload');
const { finished } = require('stream/promises');

const fs = require('fs')

module.exports = {
    Upload: GraphQLUpload,

    Mutation: {
        uploadImage: async (parent, { file }) => {

            const { createReadStream, filename, mimetype, encoding } = await file;
            console.log(`mutation | singleUpload: file=${JSON.stringify(file)} filename=${filename}, mimetype=${mimetype}, encoding=${encoding}`)

            let image = new Image({
                s3EndPoint: END_POINT,
                s3Region: REGION,
                s3BucketName: BUCKET_NAME,
                name: filename,
                mimeType: mimetype,
                encoding: encoding
            })

            const tmpDirPath = `tmp/image/`
            await fs.mkdirSync(tmpDirPath, { recursive: true })

            const tmpFilePath = `${tmpDirPath}${image._id}`

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
                Key: `image/origin/${image._id}`,
                Body: fs.createReadStream(tmpFilePath),
            };

            image.s3ObjectKey = uploadParams.Key
            console.log(`mutation | singleUpload: bucket=${JSON.stringify(uploadParams.Bucket)}, Key=${JSON.stringify(uploadParams.Key)}`)

            try {
                await s3.putObject(uploadParams, async (err, data) => {
                    console.log(`err=${err}, data=${data}`)
                    await fs.rmSync(tmpFilePath)
                })

            } catch (err) {
                console.log(`mutation | singleUpload: putObject err=${err}}`)
            }

            return await image.save()
        },
    }
}
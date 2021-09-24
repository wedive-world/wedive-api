const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    endpoint: process.env.IMAGE_BUCKET_END_POINT,
    region: process.env.IMAGE_BUCKET_REGION,
    accesKeyId: process.env.IMAGE_BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.IMAGE_BUCKET_SECRET_KEY,
});
const schema = require('../../model').schema;
const Image = schema.Image
const {
    GraphQLUpload,
    Upload
} = require('graphql-upload');


module.exports = {
    Upload: GraphQLUpload,

    Mutation: {
        uploadImage: async (parent, { file }) => {
            console.log(`mutation | singleUpload: file=${file}`)

            const { createReadStream, filename, mimetype, encoding } = await file;

            console.log(`mutation | singleUpload: file=${JSON.stringify(file)} filename=${filename}, mimetype=${mimetype}, encoding=${encoding}`)

            let image = new Image({
                name: filename,
                mimeType: mimetype,
                encoding: encoding
            })

            const tmpFilePath = `tmp/image/${image._id}`

            // Invoking the `createReadStream` will return a Readable Stream.
            // See https://nodejs.org/api/stream.html#stream_readable_streams
            const stream = createReadStream();

            // This is purely for demonstration purposes and will overwrite the
            // local-file-output.txt in the current working directory on EACH upload.
            // const fs = require('fs')
            // const out = fs.createWriteStream(tmpFilePath);
            // console.log(`mutation | singleUpload: start copy file ${image._id}`)
            // stream.pipe(out);
            // await finished(out);
            // console.log(`mutation | singleUpload: finished copy file ${image._id}`)

            // let fileStat = await fs.readFileSync(tmpFilePath)
            // image.fileSize = fileStat.length

            // console.log(`mutation | singleUpload: fileSize=${image.fileSize}`)

            var uploadParams = {
                Bucket: process.env.IMAGE_BUCKET_BUCKET_NAME,
                Key: `image/origin/${image._id}`,
                Body: stream
            };
            console.log(`mutation | singleUpload: uploadParams=${JSON.stringify(uploadParams)}`)

            let result = await s3.upload(uploadParams)
            console.log(`mutation | singleUpload: result=${JSON.stringify(result)}`)
            return await image.save()
        },
    }
}
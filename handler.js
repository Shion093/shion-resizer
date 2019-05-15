import { readStreamFromS3, writeStreamToS3, streamToSharp } from './src/resize';

const BUCKET = process.env.BUCKET;
const URL = `http://${BUCKET}.s3-website.${process.env.REGION}.amazonaws.com`;

export const resize = async (event) => {
  const key = event.queryStringParameters.key;
  // match a string like: '/1280x720/image.jpg'
  const match = key.match(/(\d+)x(\d+)\/(.*)/);
  // get the dimensions of the new image
  const width = parseInt(match[1], 10);
  const height = parseInt(match[2], 10);
  const originalKey = match[3];
  // create the new name of the image, note this has a '/' - S3 will create a directory
  const newKey = '' + width + 'x' + height + '/' + originalKey;
  const imageLocation = `${URL}/${newKey}`;

  try {
    const readStream = readStreamFromS3({ Bucket: BUCKET, Key: originalKey });
    const resizeStream = streamToSharp({ width, height });
    const {
      writeStream,
      uploadFinished
    } = writeStreamToS3({ Bucket: BUCKET, Key: newKey });


    readStream
      .pipe(resizeStream)
      .pipe(writeStream);

    const uploadedData = await uploadFinished;

    console.log('Data: ', {
      ...uploadedData,
      BucketEndpoint: URL,
      ImageURL: imageLocation
    });

    console.log('Data: ', {
      ...uploadedData,
      BucketEndpoint: URL,
      ImageURL: imageLocation
    });

    return {
      statusCode: '301',
      headers: { 'location': imageLocation },
      body: ''
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: '500',
      body: err.message
    }
  }
};
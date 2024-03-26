import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';
import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';
import { createReadStream, promises as fs } from 'fs';

const cfn = new CloudFormationClient();
const s3 = new S3Client();
const cloudfront = new CloudFrontClient();

const getOutputs = async (stackName: string): Promise<Record<string, string>> => {
  const command = new DescribeStacksCommand({
    StackName: stackName,
  });

  const response = await cfn.send(command);

  return response.Stacks![0].Outputs!.reduce(
    (acc, { OutputKey, OutputValue }) => ({ ...acc, [OutputKey!]: OutputValue! }),
    {} as Record<string, string>
  );
};

const uploadToS3 = async (folder: string, bucketName: string) => {
  const getContentType = (file: string) => {
    if (file.endsWith('.html')) {
      return 'text/html';
    } else if (file.endsWith('.js')) {
      return 'application/javascript';
    } else if (file.endsWith('.css')) {
      return 'text/css';
    }
  };

  const uploadFile = async (file: string) => {
    console.log(`UPLOADING ${file}`);

    const command = new PutObjectCommand({
      Body: createReadStream(file),
      Bucket: bucketName,
      ACL: 'public-read',
      Key: file.slice(folder.length + 1), // drop 'dist/' prefix
      ContentType: getContentType(file),
    });

    await s3.send(command);
  };

  const uploadFolder = async (folder: string) => {
    const files = await fs.readdir(folder);

    await Promise.all(
      files.map(async (filename) => {
        const path = folder + '/' + filename;
        if ((await fs.stat(path)).isDirectory()) {
          return uploadFolder(path);
        } else {
          return uploadFile(path);
        }
      })
    );
  };

  console.log(`UPLOADING TO ${bucketName}`);
  await uploadFolder(folder);
  console.log('UPLOAD FINISHED');
};

const createInvalidation = async (distroId: string) => {
  console.log(`CREATING INVALIDATION for ${distroId}`);

  await cloudfront.send(
    new CreateInvalidationCommand({
      DistributionId: distroId,
      InvalidationBatch: {
        CallerReference: String(Date.now()),
        Paths: {
          Quantity: 1,
          Items: ['/*'],
        },
      },
    })
  );

  console.log('INVALIDATION SUCCESSFUL');
};

const { bucketName, distributionId } = await getOutputs('InfraStack');
await uploadToS3('dist', bucketName);
await createInvalidation(distributionId);

import { CfnOutput, Fn, Stack, StackProps } from 'aws-cdk-lib/core';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Distribution, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ARecord, PublicHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { CfnAccessKey, Policy, PolicyStatement, User } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface InfraStackProps extends StackProps {
  certificate_id: string; // uuid for cert
}

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props: InfraStackProps) {
    super(scope, id, props);

    const websiteBucket = new Bucket(this, 'websiteBucket', {
      websiteIndexDocument: 'index',
      websiteErrorDocument: '404',
    });

    const websiteHostedZone = new PublicHostedZone(this, 'websiteHostedZone', {
      zoneName: 'wile.xyz',
    });

    const certArn = `arn:aws:acm:us-east-1:${props.env?.account}:certificate/${props.certificate_id}`;
    const websiteCert = Certificate.fromCertificateArn(this, 'websiteCert', certArn);

    const websiteDistribution = new Distribution(this, 'websiteDistribution', {
      defaultBehavior: {
        origin: new S3Origin(websiteBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: ['wile.xyz'],
      certificate: websiteCert,
    });

    new ARecord(this, 'ARecord', {
      zone: websiteHostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(websiteDistribution)),
    });

    // Note that NS and SOA records are created automatically
    // Remember to manually update name servers on the domain

    // Configure User for doing GitHub Deployments
    const deploymentUser = new User(this, 'DeploymentUser', {
      userName: 'XYZWebsite_GithubDeploymentUser',
    });
    const accessKey = new CfnAccessKey(this, 'DeploymentUserAccessKey', {
      userName: deploymentUser.userName,
    });
    new Policy(this, 'DeploymentPolicy', {
      statements: [
        new PolicyStatement({
          actions: ['cloudformation:DescribeStackResources', 'cloudformation:DescribeStacks'],
          resources: [this.stackId],
        }),
        new PolicyStatement({
          actions: ['s3:ListBucket', 's3:PutObject', 's3:PutObjectAcl', 's3:DeleteObject'],
          resources: [websiteBucket.bucketArn, Fn.join('/', [websiteBucket.bucketArn, '*'])],
        }),
        new PolicyStatement({
          actions: ['cloudfront:CreateInvalidation'],
          resources: [Fn.join('/', ['arn:aws:cloudfront::***:distribution', websiteDistribution.distributionId])],
        }),
      ],
    }).attachToUser(deploymentUser);

    new CfnOutput(this, 'accessKeyId', { value: accessKey.ref });
    new CfnOutput(this, 'secretAccessKey', { value: accessKey.attrSecretAccessKey });
    new CfnOutput(this, 'bucketName', { value: websiteBucket.bucketName });
    new CfnOutput(this, 'distributionId', { value: websiteDistribution.distributionId });
  }
}

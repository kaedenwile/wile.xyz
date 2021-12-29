import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';

import * as acm from '@aws-cdk/aws-certificatemanager';

import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets';

import * as iam from '@aws-cdk/aws-iam';

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let websiteBucket = new s3.Bucket(this, 'websiteBucket', {
      websiteIndexDocument: 'index'
    });

    let websiteHostedZone = new route53.PublicHostedZone(this, 'websiteHostedZone', {
      zoneName: 'wile.xyz'
    });

    let websiteCert = acm.Certificate.fromCertificateArn(this, 'websiteCert','arn:aws:acm:us-east-1:745658675557:certificate/ff7ac770-3f08-4896-8831-38495304a758');

    let websiteDistribution = new cloudfront.Distribution(this, 'websiteDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      },
      domainNames: ['wile.xyz'],
      certificate: websiteCert
    });

    new route53.ARecord(this, 'ARecord', {
      zone: websiteHostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(websiteDistribution)),
    });

    // Note that NS and SOA records are created automatically
    // Remember to manually update name servers on the domain

    let devBucket = new s3.Bucket(this, 'devBucket', {
      websiteIndexDocument: 'index'
    });

    // Configure User for doing Github Deployments
    let deploymentUser = new iam.User(this, 'DeploymentUser', {
      userName: 'XYZWebsite_GithubDeploymentUser',
    });
    let accessKey = new iam.CfnAccessKey(this, 'DeploymentUserAccessKey', {
      userName: deploymentUser.userName
    });
    new iam.Policy(this, 'DeploymentPolicy', {
      statements: [
        new iam.PolicyStatement({
          actions: ["cloudformation:DescribeStackResources"],
          resources: [this.stackId]
        }),
        new iam.PolicyStatement({
          actions: [
            "s3:ListBucket",
            "s3:PutObject",
            "s3:PutObjectAcl",
            "s3:DeleteObject"
          ],
          resources: [
            websiteBucket.bucketArn,
            cdk.Fn.join("/", [websiteBucket.bucketArn, "*"]),
            devBucket.bucketArn,
            cdk.Fn.join("/", [devBucket.bucketArn, "*"]),
          ],
        })
      ]
    }).attachToUser(deploymentUser);

    new cdk.CfnOutput(this, 'accessKeyId', { value: accessKey.ref });
    new cdk.CfnOutput(this, 'secretAccessKey', { value: accessKey.attrSecretAccessKey });
  }
}

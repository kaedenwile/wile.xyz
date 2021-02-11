import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';

import * as acm from '@aws-cdk/aws-certificatemanager';

import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets';

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let websiteBucket = new s3.Bucket(this, 'websiteBucket', {
      websiteIndexDocument: 'index.html'
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
  }
}

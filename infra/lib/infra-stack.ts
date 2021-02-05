import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as route53 from '@aws-cdk/aws-route53';
import { BucketWebsiteTarget } from '@aws-cdk/aws-route53-targets';

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let websiteBucket = new s3.Bucket(this, 'wile.xyz', {
      websiteIndexDocument: 'index.html'
    });

    let zone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: 'wile.xyz'
    });

    new route53.ARecord(this, 'ARecord', {
      zone,
      target: route53.RecordTarget.fromAlias(new BucketWebsiteTarget(websiteBucket)),
    })

    // Note that NS and SOA records are created automatically
    // Remember to manually update name servers on the domain
  }
}

import { CfnOutput, Construct, Duration, Fn, Stack, StackProps } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { Distribution, ViewerProtocolPolicy } from '@aws-cdk/aws-cloudfront';
import { S3Origin } from '@aws-cdk/aws-cloudfront-origins';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { ARecord, PublicHostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { CfnAccessKey, Policy, PolicyStatement, User } from '@aws-cdk/aws-iam';

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

        const devBucket = new Bucket(this, 'devBucket', {
            websiteIndexDocument: 'index',
            websiteErrorDocument: '404',
            lifecycleRules: [
                {
                    expiration: Duration.days(1),
                },
            ],
        });

        // Configure User for doing Github Deployments
        const deploymentUser = new User(this, 'DeploymentUser', {
            userName: 'XYZWebsite_GithubDeploymentUser',
        });
        const accessKey = new CfnAccessKey(this, 'DeploymentUserAccessKey', {
            userName: deploymentUser.userName,
        });
        new Policy(this, 'DeploymentPolicy', {
            statements: [
                new PolicyStatement({
                    actions: ['cloudformation:DescribeStackResources'],
                    resources: [this.stackId],
                }),
                new PolicyStatement({
                    actions: ['s3:ListBucket', 's3:PutObject', 's3:PutObjectAcl', 's3:DeleteObject'],
                    resources: [
                        websiteBucket.bucketArn,
                        Fn.join('/', [websiteBucket.bucketArn, '*']),
                        devBucket.bucketArn,
                        Fn.join('/', [devBucket.bucketArn, '*']),
                    ],
                }),
            ],
        }).attachToUser(deploymentUser);

        new CfnOutput(this, 'accessKeyId', { value: accessKey.ref });
        new CfnOutput(this, 'secretAccessKey', { value: accessKey.attrSecretAccessKey });
    }
}

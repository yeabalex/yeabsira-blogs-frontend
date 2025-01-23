import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

export async function POST(request: NextRequest) {
  console.log('Request received');
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

 // console.log(s3Client)

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const articleId = randomUUID();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const key = `static/articles/${articleId}/${sanitizedFileName}`;

    console.log(key)
    const params = {
      Bucket: 'static-assets-crtfy',
      Key: key,
      Body: buffer,
      ContentType: file.type,
    };

    await s3Client.send(new PutObjectCommand(params));

    const publicUrl = `https://static-assets-crtfy.s3.${process.env.AWS_REGION || 'us-west-2'}.amazonaws.com/${key}`;

    return NextResponse.json({ publicUrl, articleId });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed', details: (error as Error).message }, { status: 500 });
  }
}

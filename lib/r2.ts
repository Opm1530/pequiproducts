import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

let _client: S3Client | null = null

function getClient(): S3Client {
  if (!_client) {
    const accountId = process.env.R2_ACCOUNT_ID
    const accessKeyId = process.env.R2_ACCESS_KEY_ID
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
    if (!accountId || !accessKeyId || !secretAccessKey) throw new Error('R2 env vars not set')
    _client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    })
  }
  return _client
}

export async function getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
  const bucket = process.env.R2_BUCKET_NAME!
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType })
  return getSignedUrl(getClient(), command, { expiresIn: 300 })
}

export function getPublicUrl(key: string): string {
  return `${process.env.R2_PUBLIC_URL}/${key}`
}

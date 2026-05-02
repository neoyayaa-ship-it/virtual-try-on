import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ENDPOINT = process.env.R2_ENDPOINT || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

// 验证环境变量
function validateEnvVars(): boolean {
  const required = [
    { name: 'R2_ACCESS_KEY_ID', value: R2_ACCESS_KEY_ID },
    { name: 'R2_SECRET_ACCESS_KEY', value: R2_SECRET_ACCESS_KEY },
    { name: 'R2_BUCKET_NAME', value: R2_BUCKET_NAME },
    { name: 'R2_PUBLIC_URL', value: R2_PUBLIC_URL },
  ];

  console.log('[uploadToCloud] 环境变量检查:');
  required.forEach(({ name, value }: { name: string; value: string }) => {
    console.log(`  ${name}: ${value ? '✓ 已配置' : '✗ 未配置'}`);
  });

  if (R2_ENDPOINT) {
    console.log(`  R2_ENDPOINT: ✓ 已配置 (${R2_ENDPOINT})`);
  } else if (R2_ACCOUNT_ID) {
    console.log(`  R2_ACCOUNT_ID: ✓ 已配置 (${R2_ACCOUNT_ID})`);
  } else {
    console.log(`  R2_ENDPOINT/R2_ACCOUNT_ID: ✗ 未配置 (至少需要一个)`);
  }

  const missing = required.filter(({ value }) => !value);
  if (missing.length > 0) {
    console.error(`[uploadToCloud] 缺少环境变量: ${missing.map(({ name }) => name).join(', ')}`);
    return false;
  }

  if (!R2_ENDPOINT && !R2_ACCOUNT_ID) {
    console.error('[uploadToCloud] 必须配置 R2_ENDPOINT 或 R2_ACCOUNT_ID 其中一个');
    return false;
  }

  return true;
}

// 初始化 S3 客户端
let s3Client: S3Client | null = null;
function getS3Client(): S3Client {
  if (!s3Client) {
    let endpoint: string;
    if (R2_ENDPOINT) {
      endpoint = R2_ENDPOINT;
    } else {
      endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    }

    console.log('[uploadToCloud] 初始化 S3 客户端:');
    console.log(`  Endpoint: ${endpoint}`);
    console.log(`  Access Key: ${R2_ACCESS_KEY_ID.substring(0, 8)}...`);
    console.log(`  Bucket: ${R2_BUCKET_NAME}`);

    s3Client = new S3Client({
      region: 'auto',
      endpoint: endpoint,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
}

// 生成唯一文件名（添加 UUID 前缀避免冲突）
function generateUniqueFileName(fileName: string): string {
  const uuid = crypto.randomUUID().slice(0, 8);
  const ext = fileName.includes('.') 
    ? fileName.slice(fileName.lastIndexOf('.')) 
    : '.jpg';
  const baseName = fileName.includes('.') 
    ? fileName.slice(0, fileName.lastIndexOf('.')) 
    : fileName;
  return `${uuid}-${baseName}${ext}`;
}

// 下载图片内容
async function downloadImage(imageUrl: string): Promise<Buffer> {
  console.log(`[uploadToCloud] 开始下载图片: ${imageUrl}`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

  try {
    const response = await fetch(imageUrl, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`[uploadToCloud] 图片下载成功，大小: ${(buffer.length / 1024).toFixed(2)} KB`);
    return buffer;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('下载图片超时（30秒）');
    }
    throw error;
  }
}

// 上传到 Cloudflare R2
async function uploadToR2(buffer: Buffer, fileName: string, contentType: string): Promise<string> {
  console.log(`[uploadToCloud] 开始上传到 R2: ${fileName}`);

  const client = getS3Client();
  const uniqueFileName = generateUniqueFileName(fileName);

  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: contentType,
    });

    console.log(`[uploadToCloud] 发送上传请求: Key=${uniqueFileName}, Size=${buffer.length} bytes`);
    const response = await client.send(command);
    console.log(`[uploadToCloud] R2 响应:`, response);

    console.log(`[uploadToCloud] 上传成功: ${uniqueFileName}`);
    return uniqueFileName;
  } catch (error: any) {
    console.error('[uploadToCloud] 上传到 R2 失败:', error);
    if (error instanceof Error) {
      console.error('[uploadToCloud] 错误名称:', error.name);
      console.error('[uploadToCloud] 错误消息:', error.message);
    }
    throw error;
  }
}

/**
 * 上传图片到 Cloudflare R2
 * @param imageUrl - 临时图片 URL
 * @param fileName - 自定义文件名
 * @returns 永久可访问的 URL
 */
export async function uploadToCloud(imageUrl: string, fileName: string): Promise<string> {
  console.log(`[uploadToCloud] 开始处理: imageUrl=${imageUrl}, fileName=${fileName}`);

  // 验证环境变量
  if (!validateEnvVars()) {
    throw new Error('R2 配置不完整，请检查环境变量');
  }

  try {
    // 1. 下载图片
    const buffer = await downloadImage(imageUrl);

    // 2. 上传到 R2
    const contentType = 'image/jpeg'; // 默认值
    const uploadedFileName = await uploadToR2(buffer, fileName, contentType);

    // 3. 构建永久链接
    let publicUrl: string;
    if (R2_PUBLIC_URL.startsWith('http')) {
      publicUrl = `${R2_PUBLIC_URL}/${uploadedFileName}`;
    } else {
      publicUrl = `https://${R2_PUBLIC_URL}/${uploadedFileName}`;
    }
    console.log(`[uploadToCloud] 处理完成: ${publicUrl}`);

    return publicUrl;
  } catch (error: any) {
    console.error('[uploadToCloud] 处理失败:', error);
    throw error;
  }
}

export default uploadToCloud;

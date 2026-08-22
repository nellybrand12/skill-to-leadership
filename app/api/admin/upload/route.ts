import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Validate mime types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed formats: PNG, JPG, WebP, SVG, MP4, WebM.' },
        { status: 400 }
      );
    }

    // Size limit: 30MB
    if (file.size > 30 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 30MB limit.' }, { status: 400 });
    }

    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeFolder);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || '.png';
    const cleanBaseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const filename = `${cleanBaseName}-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFolder}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (err) {
    console.error('File upload error:', err);
    return NextResponse.json({ error: 'Failed to process file upload.' }, { status: 500 });
  }
}

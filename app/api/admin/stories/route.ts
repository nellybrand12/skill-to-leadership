import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const body = await req.json();
    const { title, excerpt, content, coverImage, author, category } = body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const story = await db.story.create({
      data: {
        title,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        excerpt,
        content,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
        author: author || 'Skill to Leadership Team',
        category: category || 'SUCCESS_STORY',
        isPublished: true,
      },
    });

    return NextResponse.json({ success: true, story });
  } catch (err) {
    console.error('Create story error:', err);
    return NextResponse.json({ error: 'Failed to create story.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing story id.' }, { status: 400 });

    await db.story.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete story error:', err);
    return NextResponse.json({ error: 'Failed to delete story.' }, { status: 500 });
  }
}

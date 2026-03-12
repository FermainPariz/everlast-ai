import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceSlug = searchParams.get('workspaceSlug') ?? 'default';

    const supabase = createServerClient();

    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('slug', workspaceSlug)
      .single();

    if (!workspace) {
      return NextResponse.json({ documents: [] });
    }

    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select(`id, title, source_url, created_at, chunks(count)`)
      .eq('workspace_id', workspace.id)
      .order('created_at', { ascending: false });

    if (docsError) throw docsError;

    const formatted = (documents ?? []).map((doc) => ({
      id: doc.id,
      title: doc.title,
      sourceUrl: doc.source_url,
      createdAt: doc.created_at,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chunkCount: (doc.chunks as any)?.[0]?.count ?? 0,
    }));

    return NextResponse.json({ documents: formatted });
  } catch (error) {
    console.error('Documents list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing document id' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { error } = await supabase.from('documents').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Documents delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

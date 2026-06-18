import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api.js';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/posts/${slug}`).then((r) => setPost(r.data)).catch(() => setNotFound(true));
    window.scrollTo(0, 0);
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A18]" style={{ fontFamily: "'Gambetta', serif" }}>Post not found</h1>
          <Link to="/blog" className="mt-4 inline-block text-sm font-semibold text-[#3A5E48] hover:underline">← Back to blog</Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center text-black/40">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A18]">
      {/* Header */}
      <div className="relative border-b border-black/8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(#d5d0c8 1px, transparent 1px), linear-gradient(90deg, #d5d0c8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 80%)',
          }}
        />
        <div className="container-x relative z-10 max-w-3xl py-16">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-[11px] font-medium text-black/35 transition-colors hover:text-black/60">
            ← All articles
          </Link>
          <div className="mt-6 flex flex-wrap gap-2">
            {(post.tags || []).map((t) => (
              <span key={t} className="rounded-full bg-[#3A5E48]/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#3A5E48]">{t}</span>
            ))}
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl" style={{ fontFamily: "'Gambetta', serif" }}>
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-black/40">
            By <span className="font-medium text-black/60">{post.author}</span>
            {post.publishedAt ? ` · ${new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}
          </p>
        </div>
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="container-x max-w-4xl">
          <img
            src={post.coverImage}
            alt={post.title}
            className="-mt-px w-full rounded-2xl border border-black/8 object-cover"
            style={{ maxHeight: '480px' }}
          />
        </div>
      )}

      {/* Body */}
      <article className="container-x max-w-3xl py-12">
        <div className="whitespace-pre-wrap text-[16px] leading-[1.85] text-black/70">
          {post.body}
        </div>
      </article>

      {/* Bottom nav */}
      <div className="border-t border-black/8">
        <div className="container-x max-w-3xl flex items-center justify-between py-8">
          <Link to="/blog" className="text-sm font-semibold text-[#3A5E48] hover:underline">← All articles</Link>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#3A5E48] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#22372B]">
            Work with us →
          </Link>
        </div>
      </div>
    </div>
  );
}

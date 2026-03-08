import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import './Visitor.css';

const RECOMMENDED_TOPICS = [
    'Programming', 'Digital Marketing', 'Social Media', 'Design',
    'SEO', 'Content Strategy', 'Branding', 'Analytics',
    'UX Design', 'Copywriting', 'Growth Hacking', 'AI & Marketing',
];

/* Block-based content editor */
function BlockEditor({ blocks, setBlocks }) {
    const addBlock = (type, afterIndex) => {
        const newBlock = type === 'image'
            ? { type: 'image', url: '', alt: '', credit: '' }
            : { type: 'text', content: '' };
        const updated = [...blocks];
        updated.splice(afterIndex + 1, 0, newBlock);
        setBlocks(updated);
    };

    const updateBlock = (index, data) => {
        const updated = [...blocks];
        updated[index] = { ...updated[index], ...data };
        setBlocks(updated);
    };

    const removeBlock = (index) => {
        if (blocks.length <= 1) return;
        setBlocks(blocks.filter((_, i) => i !== index));
    };

    const moveBlock = (index, direction) => {
        const newIdx = index + direction;
        if (newIdx < 0 || newIdx >= blocks.length) return;
        const updated = [...blocks];
        [updated[index], updated[newIdx]] = [updated[newIdx], updated[index]];
        setBlocks(updated);
    };

    return (
        <div className="block-editor">
            {blocks.map((block, idx) => (
                <div key={idx} className="block-editor-block">
                    <div className="block-editor-controls">
                        <button type="button" className="block-ctrl-btn" onClick={() => moveBlock(idx, -1)} title="Move up" disabled={idx === 0}>↑</button>
                        <button type="button" className="block-ctrl-btn" onClick={() => moveBlock(idx, 1)} title="Move down" disabled={idx === blocks.length - 1}>↓</button>
                        <span className="block-type-label">{block.type === 'image' ? '🖼️ Image' : '📝 Text'}</span>
                        {blocks.length > 1 && (
                            <button type="button" className="block-ctrl-btn block-ctrl-delete" onClick={() => removeBlock(idx)} title="Remove block">✕</button>
                        )}
                    </div>

                    {block.type === 'text' ? (
                        <TextBlock
                            content={block.content}
                            onChange={(content) => updateBlock(idx, { content })}
                        />
                    ) : (
                        <ImageBlock
                            block={block}
                            onChange={(data) => updateBlock(idx, data)}
                        />
                    )}

                    <div className="block-editor-add">
                        <button type="button" className="block-add-btn" onClick={() => addBlock('text', idx)}>
                            + Text
                        </button>
                        <button type="button" className="block-add-btn" onClick={() => addBlock('image', idx)}>
                            + Image
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function TextBlock({ content, onChange }) {
    const textareaRef = useRef(null);

    const insertFormat = (prefix, suffix = prefix) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = content.substring(start, end);
        const before = content.substring(0, start);
        const after = content.substring(end);
        const newContent = before + prefix + selected + suffix + after;
        onChange(newContent);
        setTimeout(() => {
            ta.focus();
            ta.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    };

    return (
        <div className="text-block">
            <div className="text-block-toolbar">
                <button type="button" onClick={() => insertFormat('**')} title="Bold"><strong>B</strong></button>
                <button type="button" onClick={() => insertFormat('*')} title="Italic"><em>I</em></button>
                <button type="button" onClick={() => insertFormat('\n## ', '\n')} title="Heading">H</button>
                <button type="button" onClick={() => insertFormat('[', '](url)')} title="Link">🔗</button>
                <button type="button" onClick={() => insertFormat('\n> ', '\n')} title="Quote">"</button>
                <button type="button" onClick={() => insertFormat('`')} title="Code">&lt;/&gt;</button>
            </div>
            <textarea
                ref={textareaRef}
                className="text-block-textarea"
                placeholder="Write your content here... (supports **bold**, *italic*, ## headings, [links](url), > quotes, `code`)"
                value={content}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function ImageBlock({ block, onChange }) {
    const [preview, setPreview] = useState(block.url || '');

    const handleUrlChange = (url) => {
        onChange({ url });
        setPreview(url);
    };

    return (
        <div className="image-block">
            <div className="image-block-fields">
                <div className="image-block-field">
                    <label>Image URL</label>
                    <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={block.url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                    />
                </div>
                <div className="image-block-field">
                    <label>Alt Text <span className="field-hint">(accessibility)</span></label>
                    <input
                        type="text"
                        placeholder="Describe the image for screen readers"
                        value={block.alt}
                        onChange={(e) => onChange({ alt: e.target.value })}
                    />
                </div>
                <div className="image-block-field">
                    <label>Image Credit <span className="field-hint">(optional)</span></label>
                    <input
                        type="text"
                        placeholder="Photo by John Doe on Unsplash"
                        value={block.credit}
                        onChange={(e) => onChange({ credit: e.target.value })}
                    />
                </div>
            </div>
            {preview && (
                <div className="image-block-preview">
                    <img src={preview} alt={block.alt || 'Preview'} onError={(e) => { e.target.style.display = 'none'; }} />
                    {block.credit && <span className="image-block-credit">{block.credit}</span>}
                </div>
            )}
        </div>
    );
}

/* Serialize blocks to storable format */
function serializeBlocks(blocks) {
    return JSON.stringify(blocks);
}

/* Deserialize stored content to blocks */
function deserializeContent(content) {
    if (!content) return [{ type: 'text', content: '' }];
    try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
    // Legacy plain text → single text block
    return [{ type: 'text', content }];
}

/* Get plain text for read time calculation */
function getPlainText(blocks) {
    return blocks
        .filter(b => b.type === 'text')
        .map(b => b.content)
        .join(' ');
}

function VisitorWriteBlog() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const [title, setTitle] = useState('');
    const [blocks, setBlocks] = useState([{ type: 'text', content: '' }]);
    const [featureImage, setFeatureImage] = useState('');
    const [featureUploading, setFeatureUploading] = useState(false);
    const featureFileRef = useRef(null);
    const [excerpt, setExcerpt] = useState('');
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [readTime, setReadTime] = useState('1 min read');
    const [visitor, setVisitor] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('noxtm_visitor_token');
        const user = localStorage.getItem('noxtm_visitor_user');
        if (!token || !user) {
            navigate('/visitor/login');
            return;
        }
        try {
            setVisitor(JSON.parse(user));
        } catch {
            navigate('/visitor/login');
        }
    }, [navigate]);

    /* Load existing blog for editing */
    const loadBlog = useCallback(async () => {
        if (!editId) return;
        try {
            const blog = await api.getVisitorBlog(editId);
            setTitle(blog.title || '');
            setBlocks(deserializeContent(blog.content));
            setFeatureImage(blog.featureImage || '');
            setExcerpt(blog.excerpt || '');
            setSelectedTopics(blog.topics || []);
        } catch (err) {
            console.error('Failed to load blog for editing:', err);
        }
    }, [editId]);

    useEffect(() => { loadBlog(); }, [loadBlog]);

    /* Auto-calculate read time */
    useEffect(() => {
        const text = getPlainText(blocks);
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        const minutes = Math.max(1, Math.ceil(words / 200));
        setReadTime(`${minutes} min read`);
    }, [blocks]);

    const handleFeatureImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { alert('File size must be under 5MB'); return; }
        setFeatureUploading(true);
        try {
            const result = await api.uploadBlogImage(file);
            setFeatureImage(result.url);
        } catch (err) {
            alert(err.message || 'Upload failed');
        } finally {
            setFeatureUploading(false);
            if (featureFileRef.current) featureFileRef.current.value = '';
        }
    };

    const toggleTopic = (topic) => {
        setSelectedTopics(prev => {
            if (prev.includes(topic)) return prev.filter(t => t !== topic);
            if (prev.length >= 3) return prev;
            return [...prev, topic];
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const textContent = getPlainText(blocks);
        if (!title.trim() || !textContent.trim()) return;
        if (!visitor) return;
        setLoading(true);

        try {
            const payload = {
                title: title.trim(),
                content: serializeBlocks(blocks),
                excerpt: excerpt.trim() || textContent.trim().substring(0, 160) + '...',
                featureImage: featureImage.trim(),
                topics: selectedTopics,
                readTime,
            };

            if (editId) {
                await api.updateVisitorBlog(editId, payload);
            } else {
                await api.createVisitorBlog(payload);
            }

            setSuccess(true);
            setTimeout(() => navigate('/visitor/my-blogs'), 2000);
        } catch (err) {
            alert(err.message || 'Failed to submit blog.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="visitor-write-success">
                <div className="visitor-write-success-icon">✅</div>
                <h2>{editId ? 'Blog Updated Successfully!' : 'Blog Submitted Successfully!'}</h2>
                <p>{editId ? 'Your changes have been saved.' : 'Your blog post has been submitted for review.'} You'll be redirected shortly.</p>
            </div>
        );
    }

    return (
        <div className="visitor-write-page">
            <div className="visitor-write-header">
                <h1>{editId ? 'Edit Blog Post' : 'Write a Blog Post'}</h1>
                <p>Share your knowledge with the community</p>
            </div>

            <form className="visitor-write-form" onSubmit={handleSubmit}>
                {/* Title */}
                <div className="visitor-write-field">
                    <input
                        type="text"
                        className="visitor-write-title-input"
                        placeholder="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Block Editor */}
                <div className="visitor-write-field">
                    <label className="visitor-write-label">Content</label>
                    <BlockEditor blocks={blocks} setBlocks={setBlocks} />
                    <div className="visitor-write-readtime">
                        📖 Estimated read time: <strong>{readTime}</strong>
                    </div>
                </div>

                {/* Feature Image Upload */}
                <div className="visitor-write-field">
                    <label className="visitor-write-label">Feature Image</label>
                    <div className="feature-upload-area">
                        {featureImage ? (
                            <div className="visitor-write-feature-preview">
                                <img src={featureImage} alt="Feature preview" />
                                <button type="button" className="feature-remove-btn" onClick={() => setFeatureImage('')}>✕ Remove</button>
                            </div>
                        ) : (
                            <div className="feature-upload-placeholder" onClick={() => featureFileRef.current?.click()}>
                                <span className="feature-upload-icon">🖼️</span>
                                <span>{featureUploading ? 'Uploading...' : 'Click to upload feature image'}</span>
                                <span className="feature-upload-hint">JPEG, PNG, GIF, WebP · Max 5MB</span>
                            </div>
                        )}
                        <input
                            ref={featureFileRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            style={{ display: 'none' }}
                            onChange={handleFeatureImageUpload}
                        />
                    </div>
                </div>

                {/* Excerpt */}
                <div className="visitor-write-field">
                    <label className="visitor-write-label">Excerpt / Description</label>
                    <textarea
                        className="visitor-write-excerpt-input"
                        placeholder="A short description of your blog post (optional, auto-generated from content if left empty)"
                        value={excerpt}
                        onChange={e => setExcerpt(e.target.value)}
                    />
                </div>

                {/* Topics */}
                <div className="visitor-write-field">
                    <label className="visitor-write-label">
                        Select Topics (1–3)
                        <span className="visitor-write-topic-count">{selectedTopics.length}/3</span>
                    </label>
                    <div className="visitor-write-topics-grid">
                        {RECOMMENDED_TOPICS.map(topic => (
                            <button
                                key={topic}
                                type="button"
                                className={`visitor-write-topic-pill ${selectedTopics.includes(topic) ? 'active' : ''}`}
                                onClick={() => toggleTopic(topic)}
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div className="visitor-write-actions">
                    <button type="submit" className="visitor-write-submit-btn" disabled={!title.trim() || loading}>
                        {loading ? 'Submitting...' : editId ? 'Update' : 'Publish'}
                    </button>
                    <button type="button" className="visitor-write-cancel-btn" onClick={() => navigate('/visitor/my-blogs')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default VisitorWriteBlog;

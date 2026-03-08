import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Visitor.css';

const RECOMMENDED_TOPICS = [
    'Programming', 'Digital Marketing', 'Social Media', 'Design',
    'SEO', 'Content Strategy', 'Branding', 'Analytics',
    'UX Design', 'Copywriting', 'Growth Hacking', 'AI & Marketing',
];

function VisitorWriteBlog() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [featureImage, setFeatureImage] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [readTime, setReadTime] = useState('1 min read');
    const [visitor, setVisitor] = useState(null);
    const [success, setSuccess] = useState(false);

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

    /* Auto-calculate read time based on word count (~200 words/min) */
    useEffect(() => {
        const words = content.trim().split(/\s+/).filter(Boolean).length;
        const minutes = Math.max(1, Math.ceil(words / 200));
        setReadTime(`${minutes} min read`);
    }, [content]);

    const toggleTopic = (topic) => {
        setSelectedTopics(prev => {
            if (prev.includes(topic)) {
                return prev.filter(t => t !== topic);
            }
            if (prev.length >= 3) return prev;
            return [...prev, topic];
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        if (!visitor) return;

        try {
            await api.createVisitorBlog({
                title: title.trim(),
                content: content.trim(),
                excerpt: excerpt.trim() || content.trim().substring(0, 160) + '...',
                featureImage: featureImage.trim(),
                topics: selectedTopics,
                readTime,
            });

            setSuccess(true);
            setTimeout(() => {
                navigate('/visitor/my-blogs');
            }, 2000);
        } catch (err) {
            alert(err.message || 'Failed to submit blog.');
        }
    };

    if (success) {
        return (
            <div className="visitor-write-success">
                <div className="visitor-write-success-icon">✅</div>
                <h2>Blog Submitted Successfully!</h2>
                <p>Your blog post has been submitted for review. You'll be redirected to your blogs shortly.</p>
            </div>
        );
    }

    return (
        <div className="visitor-write-page">
            <div className="visitor-write-header">
                <h1>Write a Blog Post</h1>
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

                {/* Content */}
                <div className="visitor-write-field">
                    <textarea
                        className="visitor-write-content-input"
                        placeholder="Tell your story..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        required
                    />
                    <div className="visitor-write-readtime">
                        📖 Estimated read time: <strong>{readTime}</strong>
                    </div>
                </div>

                {/* Feature Image URL */}
                <div className="visitor-write-field">
                    <label className="visitor-write-label">Feature Image URL</label>
                    <input
                        type="text"
                        className="visitor-write-input"
                        placeholder="https://example.com/image.jpg"
                        value={featureImage}
                        onChange={e => setFeatureImage(e.target.value)}
                    />
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
                    <button type="submit" className="visitor-write-submit-btn" disabled={!title.trim() || !content.trim()}>
                        Publish
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

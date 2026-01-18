import React from 'react';
import { Share2, Twitter, Facebook, Link2 } from 'lucide-react';

interface SocialShareProps {
    title: string;
    text: string;
    url?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({ title, text, url }) => {
    const shareUrl = url || window.location.href;

    const handleShare = async (platform?: 'twitter' | 'facebook') => {
        // Try native Web Share API first
        if (navigator.share && !platform) {
            try {
                await navigator.share({
                    title,
                    text,
                    url: shareUrl
                });
                return;
            } catch (err) {
                console.log('Web Share failed, falling back to platform shares');
            }
        }

        // Platform-specific sharing
        let shareLink = '';
        switch (platform) {
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            default:
                // Copy link to clipboard
                navigator.clipboard.writeText(shareUrl);
                alert('Link copied to clipboard!');
                return;
        }

        window.open(shareLink, '_blank', 'width=600,height=400');
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => handleShare()}
                className="share-button p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-500/30 flex items-center gap-2 text-blue-400"
            >
                <Share2 size={16} />
                <span className="text-sm font-medium">Share</span>
            </button>

            <button
                onClick={() => handleShare('twitter')}
                className="p-2 bg-sky-500/20 rounded-lg hover:bg-sky-500/30 transition-colors border border-sky-500/30 text-sky-400"
                title="Share on Twitter"
            >
                <Twitter size={16} />
            </button>

            <button
                onClick={() => handleShare('facebook')}
                className="p-2 bg-indigo-500/20 rounded-lg hover:bg-indigo-500/30 transition-colors border border-indigo-500/30 text-indigo-400"
                title="Share on Facebook"
            >
                <Facebook size={16} />
            </button>

            <button
                onClick={() => handleShare()}
                className="p-2 bg-gray-500/20 rounded-lg hover:bg-gray-500/30 transition-colors border border-gray-500/30 text-gray-400"
                title="Copy Link"
            >
                <Link2 size={16} />
            </button>
        </div>
    );
};

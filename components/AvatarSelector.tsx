import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles } from 'lucide-react';
import { AVATAR_OPTIONS, imageToBase64, FRAME_STYLES, AvatarFrame } from '../utils/avatars';
import { fadeIn, slideUp } from '../utils/animations';

interface AvatarSelectorProps {
    currentAvatar?: string;
    currentFrame?: AvatarFrame;
    onSelect: (avatar: string, type: 'emoji' | 'photo') => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
    currentAvatar,
    currentFrame = 'none',
    onSelect,
}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(true);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const base64 = await imageToBase64(file);
            onSelect(base64, 'photo');
        } catch (error) {
            alert('Error uploading photo');
        }
    };

    const frameStyle = FRAME_STYLES[currentFrame];

    return (
        <motion.div
            className="avatar-selector"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            <div className="flex gap-3 mb-4">
                <button
                    onClick={() => setShowEmojiPicker(true)}
                    className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all ${showEmojiPicker
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    <Sparkles size={16} className="inline mr-2" />
                    Choose Emoji
                </button>
                <button
                    onClick={() => setShowEmojiPicker(false)}
                    className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all ${!showEmojiPicker
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    <Upload size={16} className="inline mr-2" />
                    Upload Photo
                </button>
            </div>

            <AnimatePresence mode="wait">
                {showEmojiPicker ? (
                    <motion.div
                        key="emoji"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-8 gap-2"
                    >
                        {AVATAR_OPTIONS.map((emoji, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onSelect(emoji, 'emoji')}
                                className={`text-3xl p-3 rounded-xl transition-all ${currentAvatar === emoji
                                        ? 'bg-purple-500/30 ring-2 ring-purple-500'
                                        : 'bg-gray-800 hover:bg-gray-700'
                                    }`}
                                style={{
                                    border: currentAvatar === emoji ? frameStyle.border : undefined,
                                    boxShadow: currentAvatar === emoji ? frameStyle.shadow : undefined,
                                }}
                            >
                                {emoji}
                            </motion.button>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="text-center py-12"
                    >
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                            />
                            <div className="bg-gray-800 hover:bg-gray-700 rounded-2xl p-8 transition-all border-2 border-dashed border-gray-700">
                                <Upload size={48} className="mx-auto mb-4 text-gray-500" />
                                <p className="text-gray-400 font-semibold">Click to upload photo</p>
                                <p className="text-xs text-gray-600 mt-2">PNG, JPG up to 5MB</p>
                            </div>
                        </label>

                        {currentAvatar && !AVATAR_OPTIONS.includes(currentAvatar) && (
                            <div className="mt-4">
                                <img
                                    src={currentAvatar}
                                    alt="Avatar preview"
                                    className="w-24 h-24 rounded-full mx-auto object-cover"
                                    style={{
                                        border: frameStyle.border,
                                        boxShadow: frameStyle.shadow,
                                    }}
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

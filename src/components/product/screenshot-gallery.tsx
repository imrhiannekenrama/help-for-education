'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, ChevronLeft, ChevronRight, X, Image as ImageIcon, Sparkles } from 'lucide-react';

export interface ScreenshotItem {
  id: string;
  title: string;
  category: string;
  description: string;
  gradient: string;
  aspectRatio?: string;
}

const DEFAULT_SCREENSHOTS: ScreenshotItem[] = [
  {
    id: 'shot-1',
    title: 'DepEd Automated Grading Sheet (K-12 Compliant)',
    category: 'Grading Tool',
    description: 'Calculates initial grades, transmuted grades, and ranks automatically based on current DepEd Order standards.',
    gradient: 'from-blue-600 via-indigo-600 to-blue-800',
  },
  {
    id: 'shot-2',
    title: 'Daily Lesson Log (DLL) & Detailed Lesson Plan (DLP) Generator',
    category: 'Lesson Planning',
    description: 'Pre-filled objectives, MELCs alignment, learning tasks, and assessment strategies across all subjects.',
    gradient: 'from-emerald-500 via-teal-600 to-emerald-700',
  },
  {
    id: 'shot-3',
    title: 'SF 1, SF 2, SF 9 & SF 10 School Forms Automator',
    category: 'School Forms',
    description: 'One-click student data synchronization to generate error-free DepEd official school forms.',
    gradient: 'from-blue-500 via-emerald-600 to-teal-700',
  },
  {
    id: 'shot-4',
    title: 'Interactive Quiz & Exam Bank Builder',
    category: 'Assessment',
    description: 'Over 2,000+ item bank with answer key generator, TOS (Table of Specification) matrix maker.',
    gradient: 'from-indigo-600 via-purple-600 to-blue-700',
  },
  {
    id: 'shot-5',
    title: 'Classroom Management & Student Progress Dashboard',
    category: 'Classroom Tools',
    description: 'Visual tracking of attendance, behavior records, and individual student intervention tracking.',
    gradient: 'from-teal-600 via-emerald-600 to-blue-700',
  },
  {
    id: 'shot-6',
    title: 'Parent Communication & Report Card Comment Automator',
    category: 'Communication',
    description: 'Constructive performance comments in English & Tagalog ready to copy-paste into report cards.',
    gradient: 'from-emerald-600 via-blue-600 to-indigo-700',
  },
];

interface ScreenshotGalleryProps {
  screenshots?: ScreenshotItem[];
}

export const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({
  screenshots = DEFAULT_SCREENSHOTS,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev === 0 ? screenshots.length - 1 : (prev as number) - 1));
    }
  }, [selectedIndex, screenshots.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev === screenshots.length - 1 ? 0 : (prev as number) + 1));
    }
  }, [selectedIndex, screenshots.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, closeLightbox, handlePrev, handleNext]);

  return (
    <div className="w-full my-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Product Preview
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Screenshots & Live System Gallery
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Click any preview card below to expand and view features in high detail.
          </p>
        </div>
      </div>

      {/* Grid of Screenshot Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {screenshots.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            onClick={() => openLightbox(index)}
            className="group relative cursor-pointer rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 flex flex-col"
          >
            {/* Mock Screenshot Banner with Gradient */}
            <div className={`relative h-48 w-full bg-gradient-to-br ${item.gradient} p-4 flex flex-col justify-between text-white overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 shadow-sm">
                  {item.category}
                </span>
                <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-wider font-medium text-emerald-200">Interactive Preview</span>
                </div>
                <h4 className="font-bold text-base line-clamp-2 text-white group-hover:text-blue-100 transition-colors">
                  {item.title}
                </h4>
              </div>
            </div>

            {/* Description Card Footer */}
            <div className="p-4 flex-1 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {item.description}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-medium">
                <span>View Full Details</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col"
            >
              {/* Lightbox Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {screenshots[selectedIndex].category}
                  </span>
                  <span className="text-xs text-slate-400">
                    Image {selectedIndex + 1} of {screenshots.length}
                  </span>
                </div>
                <button
                  onClick={closeLightbox}
                  className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Close lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lightbox Content Area */}
              <div className="relative min-h-[320px] md:min-h-[420px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-8 text-center">
                {/* Large Visual Graphic Box */}
                <div className={`w-full max-w-2xl h-64 md:h-80 rounded-xl bg-gradient-to-br ${screenshots[selectedIndex].gradient} p-8 shadow-2xl flex flex-col justify-between text-left text-white border border-white/10 relative overflow-hidden my-4`}>
                  <div className="absolute top-0 right-0 p-8 text-white/10 pointer-events-none">
                    <ImageIcon className="w-48 h-48 -mr-12 -mt-12" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Feature Highlight</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold mt-2 text-white">
                      {screenshots[selectedIndex].title}
                    </h2>
                  </div>
                  <div className="bg-black/30 backdrop-blur-md p-4 rounded-lg border border-white/10">
                    <p className="text-sm text-slate-200">
                      {screenshots[selectedIndex].description}
                    </p>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 hover:bg-blue-600 text-white transition-all shadow-lg hover:scale-110 border border-slate-700"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 hover:bg-blue-600 text-white transition-all shadow-lg hover:scale-110 border border-slate-700"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Lightbox Footer */}
              <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Tip: Use Left / Right arrow keys to navigate, Esc to close.</span>
                <span className="text-emerald-400 font-medium">Included in ₱99 Bundle</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

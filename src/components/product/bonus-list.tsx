'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Award, Sparkles, FileText, Download, Star, Check } from 'lucide-react';

export interface BonusItem {
  id: string;
  title: string;
  value: string;
  description: string;
  badgeText?: string;
}

const DEFAULT_BONUSES: BonusItem[] = [
  {
    id: 'b1',
    title: 'Bonus #1: DepEd IPCRF & OPCRF Automated Portfolio Builder',
    value: '₱500 VALUE',
    badgeText: 'FREE BONUS',
    description: 'Complete automated template for Individual Performance Commitment and Review Form with ready-to-attach MOVs and evidence folders.',
  },
  {
    id: 'b2',
    title: 'Bonus #2: Classroom Decor & Visual Learning Aids Printable Mega Pack',
    value: '₱350 VALUE',
    badgeText: 'FREE BONUS',
    description: 'Over 200+ high-resolution classroom banners, welcome signages, subject posters, alphabet charts, and motivational quotes ready for print.',
  },
  {
    id: 'b3',
    title: 'Bonus #3: Complete Tagalog & English Storybooks Library (PDF & Audio)',
    value: '₱400 VALUE',
    badgeText: 'FREE BONUS',
    description: 'Digital collection of classic storybooks and reading passages with comprehension questions for elementary students.',
  },
  {
    id: 'b4',
    title: 'Bonus #4: Teacher Mental Health & Work-Life Planner (2026 Edition)',
    value: '₱250 VALUE',
    badgeText: 'FREE BONUS',
    description: 'Weekly teacher goal tracker, financial planner, lesson priority matrix, and self-care journal specifically tailored for educators.',
  },
];

interface BonusListProps {
  bonuses?: BonusItem[];
}

export const BonusList: React.FC<BonusListProps> = ({
  bonuses = DEFAULT_BONUSES,
}) => {
  return (
    <div className="w-full my-12 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-2xl border border-blue-500/30">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-400 text-slate-950 shadow-md mb-3">
          <Gift className="w-4 h-4" /> Exclusive FREE Bonuses Included
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-white">
          Get ₱1,500+ Worth of Free Teaching Bonuses
        </h3>
        <p className="text-slate-300 text-sm md:text-base mt-2">
          When you grab the Teacher Ultimate Bundle today for only <span className="text-emerald-400 font-bold">₱99</span>, you unlock all these exclusive extra packages at zero extra cost.
        </p>
      </div>

      {/* Bonuses Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {bonuses.map((bonus, idx) => (
          <motion.div
            key={bonus.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
                    {bonus.badgeText || 'FREE BONUS'}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-300 line-through">
                  {bonus.value}
                </span>
              </div>

              <h4 className="text-lg font-bold text-white mb-2 leading-snug">
                {bonus.title}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {bonus.description}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-300 font-medium">
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-400" /> Instant Digital Download
              </span>
              <span className="text-white font-bold bg-emerald-500/20 px-2.5 py-1 rounded">FREE</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Value Banner Footer */}
      <div className="relative z-10 mt-8 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl p-4 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <Sparkles className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-white">Total Package Value: ₱1,500+</p>
            <p className="text-xs text-emerald-200">Yours today for just ₱99 total during this limited release.</p>
          </div>
        </div>
        <a
          href="#buy-now"
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/20 whitespace-nowrap"
        >
          Claim All Bonuses Now
        </a>
      </div>
    </div>
  );
};

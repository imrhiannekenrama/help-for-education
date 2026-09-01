'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Zap, ShieldCheck, Layers, FileCheck } from 'lucide-react';

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  category?: string;
}

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    id: 'f1',
    title: 'Automated DepEd K-12 Grading Sheet (Excel & Web)',
    description: 'Auto-computes Written Works (20%-40%), Performance Tasks (40%-60%), and Quarterly Assessment (20%) with automatic grade transmutation.',
    category: 'Grading',
  },
  {
    id: 'f2',
    title: 'Detailed Lesson Plan (DLP) & Daily Lesson Log (DLL) Templates',
    description: 'Aligned with Most Essential Learning Competencies (MELCs) across Grade 1 to Grade 12 for all major subjects.',
    category: 'Lesson Planning',
  },
  {
    id: 'f3',
    title: 'DepEd Official School Forms Automator (SF1 - SF10)',
    description: 'Generate SF1 (School Register), SF2 (Daily Attendance), SF9 (Report Card), and SF10 (Learner Permanent Record) seamlessly.',
    category: 'Forms',
  },
  {
    id: 'f4',
    title: 'Table of Specification (TOS) & Exam Question Bank Generator',
    description: 'Create standardized quarterly tests with auto-calculated TOS matrix and ready-to-print answer keys.',
    category: 'Assessment',
  },
  {
    id: 'f5',
    title: 'Classroom Management & Behavioral Incident Tracker',
    description: 'Record student attendance, parent consultations, and anecdotal records with pre-formatted printable logs.',
    category: 'Management',
  },
  {
    id: 'f6',
    title: 'PowerPoint & Canva Animated Lesson Slides Pack',
    description: 'Over 150+ ready-to-present interactive lesson slides with custom animations designed for engaging classroom delivery.',
    category: 'Presentations',
  },
  {
    id: 'f7',
    title: 'Remediation & Reading Intervention Materials (Phil-IRI)',
    description: 'Complete diagnostic, passage reading, and comprehension assessment sheets in English.',
    category: 'Intervention',
  },
  {
    id: 'f8',
    title: 'Lifetime Product Updates & Cloud Backup Access',
    description: 'Get instant access to future DepEd form updates and new teaching templates without additional fees.',
    category: 'Updates',
  },
];

interface FeatureListProps {
  features?: FeatureItem[];
}

export const FeatureList: React.FC<FeatureListProps> = ({
  features = DEFAULT_FEATURES,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="w-full my-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> What&apos;s Included
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          Powerful Features Built for DepEd Educators
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm md:text-base">
          Save 15+ hours every week on paperwork and focus on what matters most — teaching your students.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {features.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all duration-300 flex items-start gap-4"
          >
            {/* Check Icon with Emerald Branding */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              {item.category && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900">
                  {item.category}
                </span>
              )}
              <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {item.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Feature summary stats strip */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-emerald-50 to-blue-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-slate-900 border border-emerald-200/60 dark:border-emerald-800/40 flex flex-wrap items-center justify-around gap-4 text-center">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">100% DepEd K-12 Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">500+ Templates Included</span>
        </div>
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Works in Excel, Google Sheets & Word</span>
        </div>
      </div>
    </div>
  );
};

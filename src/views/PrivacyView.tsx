import React from 'react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { toolStore } from '../services/store';

interface LegalViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const PrivacyView: React.FC<LegalViewProps> = ({ onNavigate }) => {
  const settings = toolStore.getSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('home') },
          { label: 'Privacy Policy' }
        ]}
      />

      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 font-mono">Last updated: November 2026</p>
      </div>

      <div className="prose dark:prose-invert text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
        <p>
          At <strong>{settings.siteName}</strong>, your digital privacy is our paramount priority. This policy outlines our commitment to zero-retention data operations.
        </p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          1. Zero-Upload Architecture
        </h2>
        <p>
          Unlike legacy web tools that transmit user files to cloud storage buckets or remote processing clusters, our platform executes media conversions, image compression, PDF operations, code formatting, and mathematical calculations directly within your local web browser sandbox.
        </p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          2. Information We Do Not Collect
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>We do not collect or view your uploaded images or PDFs.</li>
          <li>We do not store your parsed JSON records or text analytics payloads.</li>
          <li>We do not record sensitive user IP addresses or geographical coordinates.</li>
        </ul>

        <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          3. Local Browser Storage
        </h2>
        <p>
          We use browser <code className="font-mono">localStorage</code> strictly to store your saved favorite tools, your chosen light/dark color theme preference, and recently accessed tools for your convenience. This data remains on your physical device.
        </p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          4. Contact Information
        </h2>
        <p>
          If you have inquiries regarding privacy practices, please contact our data team at{' '}
          <span className="font-mono text-indigo-600 dark:text-indigo-400">{settings.contactEmail}</span>.
        </p>
      </div>
    </div>
  );
};

export const TermsView: React.FC<LegalViewProps> = ({ onNavigate }) => {
  const settings = toolStore.getSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('home') },
          { label: 'Terms and Conditions' }
        ]}
      />

      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500 font-mono">Last updated: November 2026</p>
      </div>

      <div className="prose dark:prose-invert text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
        <p>
          Welcome to <strong>{settings.siteName}</strong>. By accessing or using our website, you agree to comply with and be bound by the following terms.
        </p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          1. Acceptable Use
        </h2>
        <p>
          You agree to use our services exclusively for lawful purposes. You may not use our utilities to generate harmful payloads, violate intellectual property rights, or disrupt the integrity of the platform.
        </p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          2. Intellectual Property & File Ownership
        </h2>
        <p>
          All files, images, documents, and code processed through our tools remain 100% the intellectual property of you, the user. {settings.siteName} claims zero rights or licenses over user-processed content.
        </p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          3. Disclaimer of Warranties
        </h2>
        <p>
          {settings.termsOfService}
        </p>
      </div>
    </div>
  );
};

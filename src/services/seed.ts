import { Category, ToolDefinition, AdSlotConfig, SiteSettings, UserProfile, AuditLog } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'image',
    name: 'Image Tools',
    slug: 'image',
    description: 'Compress, resize, crop, and convert images directly in your browser without uploading files.',
    icon: 'ImageIcon',
    order: 1,
    seoTitle: 'Free Online Image Tools - Compress, Resize, Convert',
    seoDescription: 'High performance browser-based image utilities. Zero uploads, 100% private and instant.'
  },
  {
    id: 'pdf',
    name: 'PDF Tools',
    slug: 'pdf',
    description: 'Merge multiple PDF documents or split pages locally with zero server file transfers.',
    icon: 'FileText',
    order: 2,
    seoTitle: 'Free Client-Side PDF Tools - Merge & Split PDF Files',
    seoDescription: 'Fast, secure, private PDF tools that process documents entirely in client memory.'
  },
  {
    id: 'text',
    name: 'Text & Content',
    slug: 'text',
    description: 'Analyze word frequency, word counts, reading speeds, and manipulate casing in one click.',
    icon: 'Type',
    order: 3,
    seoTitle: 'Online Text & Writing Tools - Word Counter, Case Converter',
    seoDescription: 'Essential utilities for writers, students, content creators, and copywriters.'
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    slug: 'developer',
    description: 'Format, validate, and minify JSON, decode data formats, and inspect structures.',
    icon: 'Code2',
    order: 4,
    seoTitle: 'Developer Utilities & Code Formatters',
    seoDescription: 'Clean formatting, syntax validation, and minification tools for modern software engineers.'
  },
  {
    id: 'calculators',
    name: 'Calculators',
    slug: 'calculators',
    description: 'Compute percentages, proportion deltas, margin calculations, and financial breakdowns.',
    icon: 'Calculator',
    order: 5,
    seoTitle: 'Free Online Calculators - Percentage, Financial & Math',
    seoDescription: 'Fast, accurate math and percentage calculators with step-by-step breakdown.'
  },
  {
    id: 'generators',
    name: 'Generators',
    slug: 'generators',
    description: 'Generate high resolution QR codes, secure hashes, and structured assets in real time.',
    icon: 'QrCode',
    order: 6,
    seoTitle: 'Online QR Code & Asset Generators',
    seoDescription: 'Create custom QR codes with color palettes, error correction, and instant downloads.'
  }
];

export const INITIAL_TOOLS: ToolDefinition[] = [
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    slug: 'image-compressor',
    description: 'Shrink JPEG, PNG, and WebP image sizes by up to 90% without compromising visual clarity.',
    category: 'image',
    icon: 'Minimize2',
    toolType: 'image',
    featured: true,
    published: true,
    executionCount: 14280,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-11-01T10:30:00Z',
    seoTitle: 'Free Online Image Compressor - Reduce Image File Size',
    seoDescription: 'Compress JPG, PNG, and WebP photos in your browser with real-time preview and custom quality controls.',
    howToUse: [
      'Select or drag & drop an image (JPG, PNG, or WebP) into the upload area.',
      'Adjust the quality slider to find your desired balance between file size and sharpness.',
      'Optionally enable maximum dimension constraints to downscale large camera photos.',
      'Compare original vs compressed size savings and click "Download Compressed Image".'
    ],
    faqs: [
      {
        question: 'Are my images uploaded to any remote server?',
        answer: 'No. All compression happens completely inside your web browser via HTML5 Canvas. Your photos never leave your device.'
      },
      {
        question: 'What image formats are supported?',
        answer: 'We support JPEG, PNG, WebP, and standard bitmap images.'
      },
      {
        question: 'Is there a file size or quantity limit?',
        answer: 'You can compress files of any standard size as long as your browser has enough memory.'
      }
    ],
    tags: ['image', 'compress', 'shrink', 'photo', 'optimize', 'media']
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    slug: 'image-resizer',
    description: 'Quickly resize images to exact pixel dimensions, standard social media presets, or target ratios.',
    category: 'image',
    icon: 'Scaling',
    toolType: 'image',
    featured: true,
    published: true,
    executionCount: 9840,
    createdAt: '2026-01-20T09:00:00Z',
    updatedAt: '2026-11-02T12:00:00Z',
    seoTitle: 'Free Image Resizer - Resize Images Online Instantly',
    seoDescription: 'Change photo dimensions by pixels or percentage with aspect ratio lock and social media presets.',
    howToUse: [
      'Upload any photo from your computer or mobile device.',
      'Enter new Width and Height in pixels, or click a standard preset (Full HD, Square, OG Card).',
      'Toggle the aspect ratio lock to preserve natural proportions.',
      'Click "Apply Resize" and download the scaled image.'
    ],
    faqs: [
      {
        question: 'Will resizing stretch or distort my image?',
        answer: 'Not if you keep the "Maintain Aspect Ratio" checkbox checked. Changing one dimension automatically calculates the proportional other.'
      },
      {
        question: 'Can I export in a different format while resizing?',
        answer: 'Yes, you can choose to export as JPEG, PNG, or WebP.'
      }
    ],
    tags: ['image', 'resize', 'dimensions', 'pixels', 'social media', 'thumbnail']
  },
  {
    id: 'image-converter',
    name: 'Image Converter',
    slug: 'image-converter',
    description: 'Convert between PNG, JPEG, and WebP formats instantly with client-side canvas re-encoding.',
    category: 'image',
    icon: 'RefreshCw',
    toolType: 'converter',
    featured: false,
    published: true,
    executionCount: 7620,
    createdAt: '2026-02-01T11:00:00Z',
    updatedAt: '2026-10-25T14:15:00Z',
    seoTitle: 'Free Online Image Converter - PNG, JPG, WebP',
    seoDescription: 'Convert images to PNG, JPG, or modern WebP format securely in your web browser.',
    howToUse: [
      'Select the image you want to convert.',
      'Choose the target format (PNG, JPEG, or WebP).',
      'Adjust quality if converting to a lossy format like JPEG or WebP.',
      'Click "Convert & Download".'
    ],
    faqs: [
      {
        question: 'Which format gives the smallest file size?',
        answer: 'WebP usually provides the best compression ratio while preserving high fidelity.'
      },
      {
        question: 'Does PNG support transparent backgrounds?',
        answer: 'Yes, PNG fully supports alpha transparency.'
      }
    ],
    tags: ['image', 'converter', 'png to jpg', 'webp', 'format']
  },
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    slug: 'pdf-merger',
    description: 'Combine multiple PDF documents into a single organized file with customizable order.',
    category: 'pdf',
    icon: 'Layers',
    toolType: 'pdf',
    featured: true,
    published: true,
    executionCount: 18450,
    createdAt: '2026-02-10T14:00:00Z',
    updatedAt: '2026-11-05T09:40:00Z',
    seoTitle: 'Free PDF Merger - Combine Multiple PDFs Online',
    seoDescription: 'Merge PDF files in your preferred sequence locally without server uploads. Secure and fast.',
    howToUse: [
      'Select two or more PDF files from your device.',
      'Use the Up/Down arrows to arrange the files in your desired sequence.',
      'Verify the total combined page count in the summary bar.',
      'Click "Merge PDFs" and download your consolidated PDF file.'
    ],
    faqs: [
      {
        question: 'Is my confidential PDF uploaded to a server?',
        answer: 'Never. The merger runs completely within client-side memory using the pdf-lib WebAssembly/JavaScript engine. No data is transmitted.'
      },
      {
        question: 'How many PDF documents can I combine at once?',
        answer: 'You can merge as many documents as your device memory can comfortably handle.'
      }
    ],
    tags: ['pdf', 'merge', 'combine', 'documents', 'pages']
  },
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter',
    slug: 'pdf-splitter',
    description: 'Extract specific page ranges or extract single pages from any PDF document safely.',
    category: 'pdf',
    icon: 'Split',
    toolType: 'pdf',
    featured: false,
    published: true,
    executionCount: 8910,
    createdAt: '2026-02-15T15:30:00Z',
    updatedAt: '2026-10-28T16:20:00Z',
    seoTitle: 'Free PDF Splitter - Extract PDF Pages Online',
    seoDescription: 'Separate PDF pages or extract custom page ranges quickly and securely in your browser.',
    howToUse: [
      'Upload the PDF document you need to divide.',
      'Review total detected pages.',
      'Specify page numbers or ranges (for example: "1-3, 5, 7-9").',
      'Click "Extract Pages" to generate and download the new split PDF.'
    ],
    faqs: [
      {
        question: 'How do I specify multiple distinct pages?',
        answer: 'Use commas to separate single pages and hyphens for ranges (e.g. "1, 3, 5-8").'
      },
      {
        question: 'Does splitting reduce the document quality?',
        answer: 'No, text vectors, embedded fonts, and high-resolution images are preserved byte-for-byte.'
      }
    ],
    tags: ['pdf', 'split', 'extract', 'pages', 'document']
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    description: 'Create customized high-resolution QR codes for URLs, plain text, WiFi, or contact details.',
    category: 'generators',
    icon: 'QrCode',
    toolType: 'generator',
    featured: true,
    published: true,
    executionCount: 22100,
    createdAt: '2026-01-10T12:00:00Z',
    updatedAt: '2026-11-06T18:00:00Z',
    seoTitle: 'Free QR Code Generator - Custom Colors & High Resolution',
    seoDescription: 'Generate clean QR codes with custom foreground and background colors. Download in PNG or SVG.',
    howToUse: [
      'Type or paste your destination URL, text message, or contact info.',
      'Customize foreground and background colors to match your branding.',
      'Select error correction level (High recommended for printed logos).',
      'Download high-resolution PNG or SVG instantly.'
    ],
    faqs: [
      {
        question: 'Do these QR codes expire?',
        answer: 'No! These are standard static QR codes. They never expire and do not depend on external redirect servers.'
      },
      {
        question: 'Can I use these QR codes for commercial projects?',
        answer: 'Yes, 100% free for personal and commercial usage with no royalties or fees.'
      }
    ],
    tags: ['qr', 'generator', 'barcode', 'marketing', 'url', 'scannable']
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    slug: 'word-counter',
    description: 'Count words, characters, sentences, paragraphs, and analyze reading time with keyword density metrics.',
    category: 'text',
    icon: 'FileSpreadsheet',
    toolType: 'text',
    featured: true,
    published: true,
    executionCount: 31200,
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-11-08T09:15:00Z',
    seoTitle: 'Free Online Word Counter - Character, Reading Time & Density',
    seoDescription: 'Comprehensive text analysis tool: word count, characters with/without spaces, speaking time, and keyword frequency.',
    howToUse: [
      'Type or paste your text into the editor area.',
      'Inspect instant metrics: total words, characters, sentences, and paragraphs.',
      'Review estimated silent reading and spoken presentation times.',
      'Scroll down to analyze keyword density percentages to optimize for SEO or essays.'
    ],
    faqs: [
      {
        question: 'How is reading time calculated?',
        answer: 'We estimate reading speed at the standard average of 200 words per minute, and speaking speed at 130 words per minute.'
      },
      {
        question: 'Is there a maximum word limit?',
        answer: 'No, you can paste entire book chapters or research papers with instant calculations.'
      }
    ],
    tags: ['text', 'words', 'characters', 'counter', 'writing', 'seo', 'density']
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    slug: 'case-converter',
    description: 'Transform text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.',
    category: 'text',
    icon: 'CaseSensitive',
    toolType: 'text',
    featured: false,
    published: true,
    executionCount: 11400,
    createdAt: '2026-02-05T13:00:00Z',
    updatedAt: '2026-10-30T11:45:00Z',
    seoTitle: 'Free Case Converter - Upper, Lower, Title & Camel Case',
    seoDescription: 'Convert any text into Sentence case, Title Case, camelCase, snake_case, or CONSTANT_CASE with one click.',
    howToUse: [
      'Paste your content into the input field.',
      'Click the button corresponding to your desired casing style.',
      'Copy the converted text to your clipboard or download it as a plain text file.'
    ],
    faqs: [
      {
        question: 'What is Title Case?',
        answer: 'Title Case capitalizes the first letter of each significant word while keeping minor articles lowercase.'
      },
      {
        question: 'Which cases are best for coding?',
        answer: 'camelCase and PascalCase for variable and class names; snake_case and kebab-case for filenames and URLs.'
      }
    ],
    tags: ['text', 'case', 'converter', 'uppercase', 'lowercase', 'camelcase', 'developer']
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    slug: 'json-formatter',
    description: 'Format, validate, beautify, and minify raw JSON with exact line/column syntax error detection.',
    category: 'developer',
    icon: 'FileCode2',
    toolType: 'developer',
    featured: true,
    published: true,
    executionCount: 26500,
    createdAt: '2026-01-12T16:00:00Z',
    updatedAt: '2026-11-07T14:30:00Z',
    seoTitle: 'Online JSON Formatter, Validator & Minifier',
    seoDescription: 'Beautify messy JSON data, validate syntax with clear error messages, and minify payloads for production.',
    howToUse: [
      'Paste unformatted or stringified JSON into the editor.',
      'Choose your preferred indentation spacing (2 spaces, 4 spaces, or Tab).',
      'Click "Format JSON" to beautify or "Minify JSON" to compress onto a single line.',
      'Copy the output or download as a .json file.'
    ],
    faqs: [
      {
        question: 'What happens if my JSON has a syntax mistake?',
        answer: 'The validator identifies the exact error message and pinpoints the line and character position of the syntax error.'
      },
      {
        question: 'Does this tool sort object keys?',
        answer: 'Yes, you can toggle the "Sort Keys Alphabetically" option.'
      }
    ],
    tags: ['json', 'formatter', 'validator', 'minify', 'beautify', 'developer', 'api']
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    description: 'Solve percentage calculations, calculate increases/decreases, and find relative proportions with formulas.',
    category: 'calculators',
    icon: 'Percent',
    toolType: 'calculator',
    featured: true,
    published: true,
    executionCount: 19800,
    createdAt: '2026-01-18T14:00:00Z',
    updatedAt: '2026-11-09T10:10:00Z',
    seoTitle: 'Free Percentage Calculator - Fast Online Percent Math',
    seoDescription: 'Calculate percentages of numbers, percent change from A to B, discount prices, and proportions easily.',
    howToUse: [
      'Choose the calculation mode tab that matches your problem.',
      'Fill in the number fields; the calculation updates in real time.',
      'Review the step-by-step mathematical explanation showing how the formula was solved.',
      'Copy the calculated answer with one click.'
    ],
    faqs: [
      {
        question: 'How is percentage increase calculated?',
        answer: 'Formula: ((New Value - Original Value) / Original Value) * 100.'
      },
      {
        question: 'Can this calculate negative percentages or discounts?',
        answer: 'Yes, entering lower second values properly computes percentage decreases or negative deltas.'
      }
    ],
    tags: ['calculator', 'percentage', 'math', 'discount', 'increase', 'proportion']
  }
];

export const INITIAL_AD_SLOTS: AdSlotConfig[] = [
  {
    id: 'ad-home-top',
    position: 'home-top',
    name: 'Homepage Top (Below Hero)',
    enabled: true,
    slotId: '1234567890',
    format: 'responsive'
  },
  {
    id: 'ad-home-middle',
    position: 'home-middle',
    name: 'Homepage Middle (Between Categories and Why Choose Us)',
    enabled: true,
    slotId: '2345678901',
    format: 'responsive'
  },
  {
    id: 'ad-home-bottom',
    position: 'home-bottom',
    name: 'Homepage Bottom (Above Footer)',
    enabled: true,
    slotId: '3456789012',
    format: 'responsive'
  },
  {
    id: 'ad-dir-top',
    position: 'directory-top',
    name: 'Tools Directory Top',
    enabled: true,
    slotId: '4567890123',
    format: 'responsive'
  },
  {
    id: 'ad-dir-middle',
    position: 'directory-middle',
    name: 'Tools Directory In-Grid',
    enabled: false,
    slotId: '5678901234',
    format: 'rectangle'
  },
  {
    id: 'ad-tool-top',
    position: 'tool-top',
    name: 'Tool Page Top (Above Interactive Workspace)',
    enabled: true,
    slotId: '6789012345',
    format: 'responsive'
  },
  {
    id: 'ad-tool-bottom',
    position: 'tool-bottom',
    name: 'Tool Page Bottom (Below Interactive Workspace)',
    enabled: true,
    slotId: '7890123456',
    format: 'responsive'
  },
  {
    id: 'ad-tool-between',
    position: 'tool-between',
    name: 'Tool Page In-Content (Between How-To and FAQs)',
    enabled: true,
    slotId: '8901234567',
    format: 'responsive'
  },
  {
    id: 'ad-cat-top',
    position: 'category-top',
    name: 'Category Page Top',
    enabled: true,
    slotId: '9012345678',
    format: 'responsive'
  },
  {
    id: 'ad-cat-bottom',
    position: 'category-bottom',
    name: 'Category Page Bottom',
    enabled: true,
    slotId: '0123456789',
    format: 'responsive'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'OmniTools',
  tagline: 'Fast, Free & Private Online Utilities',
  description: 'A comprehensive suite of browser-based utilities for students, developers, designers, and creators. All operations run 100% locally on your machine.',
  contactEmail: 'support@omnitools.app',
  adsEnabled: true,
  adsenseClientId: 'ca-pub-9988776655443322',
  socialLinks: {
    twitter: 'https://twitter.com/omnitools',
    github: 'https://github.com/omnitools',
    discord: 'https://discord.gg/omnitools'
  },
  privacyPolicy: 'At OmniTools, user privacy is our foundational value. All media files, image processing, PDF operations, code formatting, and calculation data execute exclusively within client-side browser memory. Zero files are uploaded or stored on our servers.',
  termsOfService: 'By using OmniTools, you agree to utilize our tools for lawful and appropriate purposes. We provide our services on an "as is" and "as available" basis without warranties of any kind.',
  analyticsEnabled: true,
  previewAdsMode: true // allows previewing ad placements during development
};

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@omnitools.app',
    name: 'Platform Administrator',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z',
    lastActive: '2026-11-10T19:00:00Z',
    status: 'active'
  },
  {
    id: 'usr-guest-2',
    email: 'creator@studio.design',
    name: 'Elena Rostova',
    role: 'user',
    createdAt: '2026-06-14T11:20:00Z',
    lastActive: '2026-11-09T18:40:00Z',
    status: 'active'
  },
  {
    id: 'usr-guest-3',
    email: 'dev@codepath.io',
    name: 'Marcus Chen',
    role: 'user',
    createdAt: '2026-08-22T14:15:00Z',
    lastActive: '2026-11-10T08:12:00Z',
    status: 'active'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-11-10T18:30:00Z',
    actor: 'admin@omnitools.app',
    action: 'SETTINGS_UPDATE',
    target: 'Site Settings',
    details: 'Configured AdSense publisher ID and privacy policies'
  },
  {
    id: 'log-2',
    timestamp: '2026-11-09T14:10:00Z',
    actor: 'admin@omnitools.app',
    action: 'TOOL_FEATURED',
    target: 'JSON Formatter & Validator',
    details: 'Featured on homepage showcase'
  },
  {
    id: 'log-3',
    timestamp: '2026-11-08T09:45:00Z',
    actor: 'admin@omnitools.app',
    action: 'AD_SLOT_TOGGLE',
    target: 'tool-top',
    details: 'Enabled responsive banner unit'
  }
];

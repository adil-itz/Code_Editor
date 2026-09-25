import React from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Code2, 
  Database, 
  FileCode, 
  FileJson, 
  Settings, 
  Lock,
  Image as ImageIcon
} from 'lucide-react';

export function FileIcon({ filename = '', language = '', isFolder = false, isOpen = false, className = 'w-4 h-4' }) {
  if (isFolder) {
    if (isOpen) {
      return <FolderOpen className={`${className} text-[#E8AB53] shrink-0`} />;
    }
    return <Folder className={`${className} text-[#DCB67A] shrink-0`} />;
  }

  const nameLower = (filename || '').toLowerCase().trim();
  const ext = nameLower.includes('.') ? nameLower.split('.').pop() : nameLower;
  const langLower = (language || '').toLowerCase().trim();

  // HTML
  if (ext === 'html' || ext === 'htm' || langLower === 'html') {
    return (
      <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 3L5.7 20.2L12 22L18.3 20.2L20 3H4Z" fill="#E44D26"/>
        <path d="M12 4.6V20.2L16.9 18.8L18.3 4.6H12Z" fill="#F16529"/>
        <path d="M7.4 7.6H12V10.1H9.9L10.1 12.6H12V15.1H7.9L7.4 7.6Z" fill="#EBEBEB"/>
        <path d="M12 7.6H16.6L16.4 10.1H12V7.6ZM12 12.6H16.1L15.7 17.6L12 18.6V16.1L14.2 15.5L14.4 13.1H12V12.6Z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // CSS
  if (ext === 'css' || ext === 'scss' || ext === 'less' || langLower === 'css') {
    return (
      <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 3L5.7 20.2L12 22L18.3 20.2L20 3H4Z" fill="#264DE4"/>
        <path d="M12 4.6V20.2L16.9 18.8L18.3 4.6H12Z" fill="#2965F1"/>
        <path d="M7.4 7.6H16.6L16.4 10.1H9.9L10.1 12.6H16.1L15.6 18L12 19L8.4 18L8.1 15.1H10.6L10.7 16.2L12 16.6L13.3 16.2L13.5 14.1H7.9L7.4 7.6Z" fill="#EBEBEB"/>
      </svg>
    );
  }

  // JavaScript
  if (ext === 'js' || ext === 'mjs' || ext === 'cjs' || langLower === 'javascript') {
    return (
      <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#F7DF1E"/>
        <path d="M11.5 17.5C11.5 19 10.5 19.8 8.8 19.8C7.3 19.8 6.4 19 5.9 18.1L7.2 17.3C7.6 17.9 8.1 18.4 8.8 18.4C9.5 18.4 10 18.1 10 17.3V10.8H11.5V17.5ZM18.8 17.3C18.2 18.8 16.9 19.8 14.9 19.8C13.2 19.8 12.1 18.7 12.1 16.9C12.1 15 13.3 14 15.2 13.2L15.8 12.9C16.6 12.6 17.1 12.2 17.1 11.6C17.1 11 16.6 10.6 15.7 10.6C14.8 10.6 14.2 11.1 13.8 11.9L12.5 11.1C13.2 9.8 14.4 9.2 15.9 9.2C17.7 9.2 18.7 10.2 18.7 11.6C18.7 13 17.8 13.9 16.2 14.6L15.5 14.9C14.7 15.2 14.2 15.6 14.2 16.3C14.2 17 14.8 17.4 15.7 17.4C16.7 17.4 17.3 16.8 17.7 15.9L18.8 17.3Z" fill="#000000"/>
      </svg>
    );
  }

  // React JSX / TSX
  if (ext === 'jsx' || ext === 'tsx' || ext === 'react' || langLower === 'react') {
    return (
      <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="12" cy="12" rx="3" ry="8" transform="rotate(30 12 12)" stroke="#61DAFB" strokeWidth="1.5"/>
        <ellipse cx="12" cy="12" rx="3" ry="8" transform="rotate(90 12 12)" stroke="#61DAFB" strokeWidth="1.5"/>
        <ellipse cx="12" cy="12" rx="3" ry="8" transform="rotate(150 12 12)" stroke="#61DAFB" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="1.8" fill="#61DAFB"/>
      </svg>
    );
  }

  // TypeScript
  if (ext === 'ts' || langLower === 'typescript') {
    return (
      <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#3178C6"/>
        <path d="M11 11H6V12.5H7.75V19.5H9.25V12.5H11V11ZM17.8 13.8C17.2 13.2 16.3 12.9 15.2 12.7L14.5 12.5C13.9 12.3 13.6 12.1 13.6 11.7C13.6 11.3 14 11 14.7 11C15.4 11 16.1 11.3 16.5 11.8L17.5 10.7C16.8 9.9 15.8 9.5 14.6 9.5C12.9 9.5 11.9 10.4 11.9 11.8C11.9 13.1 12.8 13.8 14.1 14.2L14.8 14.4C15.5 14.6 15.9 14.9 15.9 15.4C15.9 15.9 15.3 16.3 14.4 16.3C13.4 16.3 12.6 15.8 12.1 15L11 16.3C11.8 17.4 13 18 14.5 18C16.4 18 17.6 17 17.6 15.4C17.6 14.7 17.3 14.2 16.8 13.8Z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // Python
  if (ext === 'py' || ext === 'pyw' || langLower === 'python') {
    return (
      <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.8 2C6.8 2 7 4.2 7 4.2V6.4H12.2V7.2H5C2.8 7.2 2 8.7 2 11.8C2 14.9 3.4 15.8 5 15.8H6.5V13.8C6.5 11.8 8.1 10.2 10.1 10.2H14.8C16.3 10.2 17 9.3 17 7.8V4.2C17 2 14.8 2 11.8 2ZM9.5 3.6C10.1 3.6 10.6 4.1 10.6 4.7C10.6 5.3 10.1 5.8 9.5 5.8C8.9 5.8 8.4 5.3 8.4 4.7C8.4 4.1 8.9 3.6 9.5 3.6Z" fill="#3776AB"/>
        <path d="M12.2 22C17.2 22 17 19.8 17 19.8V17.6H11.8V16.8H19C21.2 16.8 22 15.3 22 12.2C22 9.1 20.6 8.2 19 8.2H17.5V10.2C17.5 12.2 15.9 13.8 13.9 13.8H9.2C7.7 13.8 7 14.7 7 16.2V19.8C7 22 9.2 22 12.2 22ZM14.5 20.4C13.9 20.4 13.4 19.9 13.4 19.3C13.4 18.7 13.9 18.2 14.5 18.2C15.1 18.2 15.6 18.7 15.6 19.3C15.6 19.9 15.1 20.4 14.5 20.4Z" fill="#FFD43B"/>
      </svg>
    );
  }

  // C / Header
  if (ext === 'c' || ext === 'h' || langLower === 'c') {
    return (
      <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#A8B9CC"/>
        <path d="M16 16.5C14.8 17.5 13.2 18 11.5 18C7.9 18 5.5 15.4 5.5 12C5.5 8.6 7.9 6 11.5 6C13.2 6 14.8 6.5 16 7.5L14.6 9.2C13.7 8.4 12.6 8 11.5 8C9.2 8 7.8 9.7 7.8 12C7.8 14.3 9.2 16 11.5 16C12.6 16 13.7 15.6 14.6 14.8L16 16.5Z" fill="#1B2A4A"/>
      </svg>
    );
  }

  // C++
  if (ext === 'cpp' || ext === 'cc' || ext === 'cxx' || ext === 'hpp' || langLower === 'cpp') {
    return (
      <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#00599C"/>
        <path d="M13 15.5C12.1 16.2 10.9 16.5 9.6 16.5C6.9 16.5 5 14.6 5 12C5 9.4 6.9 7.5 9.6 7.5C10.9 7.5 12.1 7.8 13 8.5L12 9.8C11.3 9.2 10.5 8.9 9.6 8.9C7.9 8.9 6.8 10.2 6.8 12C6.8 13.8 7.9 15.1 9.6 15.1C10.5 15.1 11.3 14.8 12 14.2L13 15.5ZM15 11.3H16.3V9.8H17.7V11.3H19V12.7H17.7V14.2H16.3V12.7H15V11.3Z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // Java
  if (ext === 'java' || ext === 'jar' || ext === 'class' || langLower === 'java') {
    return (
      <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C10 5 13 6 12 8C11 10 9 10 10 12" stroke="#ED8B00" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 4C13.5 6.5 16 7.5 15 9.5" stroke="#F58220" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M5 14C5 17.5 8.1 19 12 19C15.9 19 19 17.5 19 14H5Z" fill="#5382A1"/>
        <path d="M19 14C20.5 14 21.5 15 21.5 16C21.5 17 20.5 18 19 18" stroke="#5382A1" strokeWidth="1.5"/>
        <path d="M4 21C8 22.5 16 22.5 20 21" stroke="#ED8B00" strokeWidth="1.5"/>
      </svg>
    );
  }

  // JSON
  if (ext === 'json' || langLower === 'json') {
    return <FileJson className={`${className} text-[#F2C94C] shrink-0`} />;
  }

  // SQL
  if (ext === 'sql' || langLower === 'sql') {
    return <Database className={`${className} text-[#336791] shrink-0`} />;
  }

  // Markdown
  if (ext === 'md' || ext === 'markdown' || langLower === 'markdown') {
    return (
      <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#0891B2"/>
        <path d="M5 7V17H7.5V11.5L10 14.5L12.5 11.5V17H15V7H12.5L10 10L7.5 7H5ZM18.5 7L15.5 12H17.5V17H19.5V12H21.5L18.5 7Z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // PHP
  if (ext === 'php' || langLower === 'php') {
    return (
      <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#777BB4"/>
        <path d="M7 9H10.5C11.5 9 12 9.5 12 10.5C12 11.5 11.5 12 10.5 12H8.5V15H7V9ZM8.5 10.3V11H10.2C10.5 11 10.7 10.8 10.7 10.6C10.7 10.4 10.5 10.3 10.2 10.3H8.5ZM13 9H14.5V11.3H16.5V9H18V15H16.5V12.5H14.5V15H13V9Z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // Ruby
  if (ext === 'rb' || langLower === 'ruby') {
    return (
      <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 3L18 3L22 9L12 21L2 9L6 3Z" fill="#CC342D"/>
        <path d="M6 3L12 21L2 9L6 3Z" fill="#E84E40"/>
        <path d="M12 21L18 3L22 9L12 21Z" fill="#990000"/>
      </svg>
    );
  }

  // Go
  if (ext === 'go' || langLower === 'go') {
    return (
      <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#00ADD8"/>
        <path d="M15 10H8V11.5H15V10ZM13 13.5H8V15H13V13.5ZM6.5 10H5V15H6.5V10ZM17.5 10H16.5V15H17.5V10Z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // Rust
  if (ext === 'rs' || langLower === 'rust') {
    return (
      <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="#DEA584" strokeWidth="2" strokeDasharray="3 2"/>
        <path d="M8 8H13C14.5 8 15.5 8.8 15.5 10C15.5 11 14.8 11.7 13.8 11.9L16 16H14L12.2 12.2H10V16H8V8ZM10 10.5V11H12.8C13.4 11 13.7 10.8 13.7 10.5C13.7 10.2 13.4 10 12.8 10H10V10.5Z" fill="#DEA584"/>
      </svg>
    );
  }

  // Kotlin
  if (ext === 'kt' || ext === 'kts' || langLower === 'kotlin') {
    return (
      <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 2H2V22H22L12 12L22 2Z" fill="url(#kt-grad)"/>
        <defs>
          <linearGradient id="kt-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E44857"/>
            <stop offset="0.5" stopColor="#C711E1"/>
            <stop offset="1" stopColor="#7F52FF"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Swift
  if (ext === 'swift' || langLower === 'swift') {
    return (
      <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.5 14.5C17 12 13.5 10 10 9C13 11 14 13.5 12 17C10 14 8 13.5 5 14C8 17 12 21 17 19.5C21 18.2 22 13 19.5 14.5Z" fill="#F05138"/>
      </svg>
    );
  }

  // Config / Env
  if (ext === 'env' || nameLower.includes('.env') || ext === 'config' || ext === 'gitignore') {
    return <Lock className={`${className} text-[#F59E0B] shrink-0`} />;
  }

  // Images
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(ext)) {
    return <ImageIcon className={`${className} text-[#A7F3D0] shrink-0`} />;
  }

  // Default fallback code icon
  return <FileCode className={`${className} text-brand-primary shrink-0`} />;
}

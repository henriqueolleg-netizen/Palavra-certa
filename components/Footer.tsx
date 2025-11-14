import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-6 mt-8">
      <p className="text-gray-500 text-sm">
        Powered by{' '}
        <a 
          href="https://ai.google.dev/gemini-api" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-semibold text-purple-600 hover:underline"
        >
          Google Gemini
        </a>
      </p>
    </footer>
  );
};

export default Footer;

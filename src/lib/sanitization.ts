import DOMPurify from 'dompurify';

export interface SanitizedMarketData {
  question: string;
  description: string;
  category: string;
}

/**
 * Sanitizes user input to prevent XSS attacks and injection
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potential script tags and dangerous HTML
  const sanitized = DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  // Additional sanitization for database safety
  return sanitized
    .trim()
    .replace(/[<>]/g, '') // Remove any remaining angle brackets
    .slice(0, 1000); // Limit length
};

/**
 * Sanitizes market data for safe storage
 */
export const sanitizeMarketData = (data: {
  question: string;
  description: string;
  category: string;
}): SanitizedMarketData => {
  return {
    question: sanitizeInput(data.question),
    description: sanitizeInput(data.description),
    category: sanitizeInput(data.category)
  };
};

/**
 * Validates and sanitizes email addresses
 */
export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  
  const sanitized = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }
  
  return sanitized;
};
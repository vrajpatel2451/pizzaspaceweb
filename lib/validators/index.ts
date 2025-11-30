/**
 * Validators Index
 *
 * Central export point for all validation utilities
 */

// Phone validators
export {
  isValidUKPhone,
  formatUKPhone,
  formatUKPhoneNational,
  getPhoneTelLink,
} from './phone';

// Postcode validators
export {
  isValidUKPostcode,
  formatUKPostcode,
  getPostcodeArea,
  getPostcodeDistrict,
  validateAndFormatPostcode,
  POSTCODE_EXAMPLES,
} from './postcode';

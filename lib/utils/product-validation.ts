import type {
  VariantGroupResponse,
  AddonGroupResponse,
  AddonResponse,
} from "@/types/product";

/**
 * Addon selection with quantity
 */
interface AddonSelection {
  selected: boolean;
  quantity: number;
}

/**
 * Validation result
 */
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate selections before adding to cart
 *
 * Rules:
 * 1. If primary variant groups exist, at least one variant must be selected from each
 * 2. Quantity must be >= 1
 *
 * Note: Addon validation is intentionally skipped - addons are optional
 */
export function validateSelections(params: {
  selectedVariants: Map<string, string>;
  selectedAddons: Map<string, AddonSelection>;
  variantGroupList: VariantGroupResponse[];
  addonGroupList: AddonGroupResponse[];
  addonList: AddonResponse[];
  quantity: number;
}): ValidationResult {
  const {
    selectedVariants,
    variantGroupList,
    quantity,
  } = params;

  const errors: string[] = [];

  // Rule 1: Validate all primary variant groups are selected
  const primaryGroups = variantGroupList.filter((g) => g.isPrimary);
  for (const group of primaryGroups) {
    if (!selectedVariants.has(group._id)) {
      errors.push(`Please select a ${group.label.toLowerCase()}`);
    }
  }

  // Rule 2: Validate quantity
  if (quantity < 1) {
    errors.push("Quantity must be at least 1");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a specific addon group
 * Useful for showing per-group validation feedback
 */
export function validateAddonGroup(params: {
  group: AddonGroupResponse;
  selectedAddons: Map<string, AddonSelection>;
  addonList: AddonResponse[];
}): {
  isValid: boolean;
  error: string | null;
} {
  const { group, selectedAddons, addonList } = params;

  // Get all addons in this group
  const groupAddons = addonList.filter((a) => a.groupId === group._id);
  const groupAddonIds = groupAddons.map((a) => a._id);

  // Count total selections
  let totalSelected = 0;
  for (const [addonId, selection] of selectedAddons.entries()) {
    if (groupAddonIds.includes(addonId) && selection.selected) {
      if (group.allowMulti) {
        totalSelected += selection.quantity;
      } else {
        totalSelected += 1;
      }
    }
  }

  // Check minimum
  if (group.min > 0 && totalSelected < group.min) {
    return {
      isValid: false,
      error:
        group.min === 1
          ? `Please select at least one ${group.label.toLowerCase()}`
          : `Please select at least ${group.min} ${group.label.toLowerCase()}`,
    };
  }

  // Check maximum
  if (group.max > 0 && totalSelected > group.max) {
    return {
      isValid: false,
      error:
        group.max === 1
          ? `Maximum one ${group.label.toLowerCase()} allowed`
          : `Maximum ${group.max} ${group.label.toLowerCase()} allowed`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Check if a variant group is valid
 */
export function validateVariantGroup(params: {
  group: VariantGroupResponse;
  selectedVariants: Map<string, string>;
}): {
  isValid: boolean;
  error: string | null;
} {
  const { group, selectedVariants } = params;

  if (group.isPrimary && !selectedVariants.has(group._id)) {
    return {
      isValid: false,
      error: `Please select a ${group.label.toLowerCase()}`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

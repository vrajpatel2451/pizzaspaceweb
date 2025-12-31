/**
 * Example usage of useCartValidation hook
 *
 * This file demonstrates how to use the cart validation hook
 * for Phase 5.1 of the delivery type selection feature.
 */

import { useCartValidation } from "./use-cart-validation";

export function CartValidationExample() {
  const {
    invalidItems,
    validItems,
    hasInvalidItems,
    isCartValid,
    invalidItemCount,
    isLoading,
  } = useCartValidation();

  if (isLoading) {
    return <div>Validating cart...</div>;
  }

  return (
    <div>
      <h2>Cart Validation Status</h2>

      {/* Display validation status */}
      <div>
        <p>Cart is {isCartValid ? "valid" : "invalid"}</p>
        <p>Has invalid items: {hasInvalidItems ? "Yes" : "No"}</p>
        <p>Invalid item count: {invalidItemCount}</p>
      </div>

      {/* Display invalid items */}
      {hasInvalidItems && (
        <div>
          <h3>Invalid Items ({invalidItems.length})</h3>
          <ul>
            {invalidItems.map((item) => (
              <li key={item._id}>
                {item.productDetails?.product.name || "Unknown Product"}
                {" - "}
                Available for: {item.availableDeliveryTypes?.join(", ") || "N/A"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display valid items */}
      <div>
        <h3>Valid Items ({validItems.length})</h3>
        <ul>
          {validItems.map((item) => (
            <li key={item._id}>
              {item.productDetails?.product.name || "Unknown Product"}
            </li>
          ))}
        </ul>
      </div>

      {/* Example: Disable checkout button if cart is invalid */}
      <button disabled={!isCartValid || isLoading}>
        {isCartValid ? "Proceed to Checkout" : `Cannot checkout (${invalidItemCount} invalid items)`}
      </button>
    </div>
  );
}

/**
 * Example: Show warning banner for invalid items
 */
export function InvalidItemsBanner() {
  const { hasInvalidItems, invalidItemCount, invalidItems } = useCartValidation();

  if (!hasInvalidItems) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
      <h4 className="font-semibold text-yellow-800">
        {invalidItemCount} {invalidItemCount === 1 ? "item" : "items"} not available for selected delivery type
      </h4>
      <p className="text-sm text-yellow-700">
        The following items are not available for the selected delivery type:
      </p>
      <ul className="list-disc list-inside text-sm text-yellow-700">
        {invalidItems.map((item) => (
          <li key={item._id}>
            {item.productDetails?.product.name || "Unknown Product"}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example: Conditionally render checkout section
 */
export function CheckoutSection() {
  const { isCartValid, isLoading, hasInvalidItems, invalidItemCount } = useCartValidation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isCartValid) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600 font-semibold mb-2">
          Cannot proceed to checkout
        </p>
        <p className="text-gray-600">
          {invalidItemCount} {invalidItemCount === 1 ? "item is" : "items are"} not available for the selected delivery type.
          Please remove {invalidItemCount === 1 ? "it" : "them"} or change your delivery type.
        </p>
      </div>
    );
  }

  return (
    <div>
      <button className="w-full bg-blue-600 text-white py-3 rounded">
        Proceed to Checkout
      </button>
    </div>
  );
}

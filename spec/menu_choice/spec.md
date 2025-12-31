# Need to integrate Delivery type selection on website load

1. user refresh or load page user must select deliverytype otherwise do not allow to let any operations happen in -> menu page, cart page
2. once deliverytype selected it should be global state
3. based on delivery type -> menu page should pass it in the menu api added types in the types file @types/product.ts
4. even if by mistake product details container opened which does not support delivery type from selection -> it should hold add to cart button show as it is not available for this delivery
5. in cart page products added for any deliveryType which is not supported for delivery type should be disabled and checkout button should also be disabled
6. if deliveryType is delivery instead of dine in/pickup it should show increment price in product card, product details container, cart product card and price which will help to increment will be packaging charges from product response

**No errors thourough testing is needed**
**Need all functionality to be working with APIs and fully tested.**

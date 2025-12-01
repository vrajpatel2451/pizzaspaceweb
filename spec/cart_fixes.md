# Cart Fixes

## First of all the feature is shittiest nothing is working properly

- Lets me list down each points and it should be **FIXED AND TESTED PROPERLY**

### 1. Cart

- 1.1 Cart UI

  - 1.1.1 Do not need cart menu/dropdown on header once click on cart it should be going to cart only
  - 1.2.1 The product details should be fetched in each card of in cart items then and only it will be reflected in the card this id base thing is not acceptable. I need photo, name, which addons, variants selected and quantity counter should be shown with delete button and edit pen button
  - 1.3.1 Cart screen heading section is not designed properly see menu screen heading section need upto the mark UI based on current design guideline even whole cart screen UI is not upto the mark
  - 1.3.2 Apply discount not working at all no APIs no applything is written nothing is built need to **BUILD IT AND TEST IT**
  - 1.3.3 Add address redirecting to profile screen which is worse should redirect to address screen page
  - 1.3.4 Delivery Type selection UI is not upto the mark. Looking like 1 month developer has made it
  - 1.3.5 I am sure Summary UI is not well written it is not upto the mark as well (So it should be based on screen shot I am mentioning **REMEMBER IT IS ONLY FOR WHICH CONTENT SHOULD BE THERE THE REPHRASE OF CONTENT AND UI SHOULD BE BASED ON OUR DESIGN GUIDELINES** see screenshots @spec/cartandaddress/ordersummarymain.png, @spec/cartandaddress/deliveryfeesummary.png, @spec/cartandaddress/taxsummary.png these are from my old website)
  - 1.3.6 Why creating new component for edit cart summary we already have ProductDetails component right? USE THAT AND IF NEED MODIFICATION PLEASE DO THAT
  - 1.3.7 No toasts or snackbars when adding cart updating cart errors or closing dialog of add and edit carts. these things are highly unprofessional.
  - 1.3.8 Mobile view is also broken needs to be fixed
  - 1.3.9 use QuantityIncrementor in the cart item card which already built do not try to be smart and create unnessassary components
  - 1.3.10 if cart summary is null or error then show as empty state with error message instead of completly removing component
  - 1.3.11 no loading shimmers when loading product details dialog or bottomsheet

- 1.2 Cart Logic and APIs handling
  - 1.2.1 in summary API call storeId is passed as "default-store" so needs to handled properly
  - 1.2.2 while adding or updating to cart I do not think so we update global state as I do not see any cart item increased on cart badge on header
  - 1.2.3 if store is not selected then why we show add to cart success without API call? if such things show snackbar or toasts
  - 1.2.4 in product details dialog when I add to cart no API calls are happening and API calls happening then UI starts misbehaving. it shows empty dialog instead of button to be show loading. Just remove this animated button which is looking weird and show my Button component only and manage API calls states and toasts

### 2. Address

- 2.1 Address UI
  - 2.1.1 Address screen heading section is not designed properly see menu screen heading section need upto the mark UI based on current design guideline even whole address screen UI is not upto the mark
  - 2.1.2 Address form is not good at all need proper google map and google dropdown for address fetching logic is needed I shares screenshots to attach with that see again @spec/cartandaddress/add_address.png, @spec/cartandaddress/add_address_2.png, @spec/cartandaddress/add_address_3.png
  - 2.1.3 Also need to provide for me and for other toggle button group same we did for home, work, other if select for other then and only it should provide option to enter contact details if selected me API call should pass name and phone from logged in user
  - 2.1.4 If showing toggle button group then no need to show radio button along with it as it is common sense
  - 2.1.5 Card of addresses are looking weird so much padding on top-down
  - 1.3.7 No toasts or snackbars when adding removing address updating address errors or closing dialog of add and edit carts. these things are highly unprofessional.
  - 1.3.8 why showing loader instead of shimmer when loading addresses. Please be consistant
- 2.2 Address Logic and APIs handling
  - 2.2.1 Without lat,lng APIs should not be calling that is why I told u to use maps and all.
  - 2.2.2 remove patch api call for set default functionality use update address call

## Rules

1. Every point should be researched, developed/fixed, and tested once all phases passes then an only it should be passed otherwise iterate loop
2. Highly use mcps available because it will help you only
3. Take your time but develop something great out of it as we are this much close to finish. only order management will be left after this.

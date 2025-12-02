# Need to develop order feature

## Screens needed

### 1. Order History Screen (PATH - /order)

    - 1.1 Need order cards in a grid Content and design reference (@spec/order/order_card.png)
    - 1.2 APIs and types are added
    - 1.3 Need filters of timerange (relative dropdown only eg. All time, 7 days, 30 days, etc...), Status filter (need interactive UI for that)
    - 1.4 Need Pagination as it is paginated response
    - 1.5 Should be protected
    - 1.6 Need to update in header of page link
    - 1.7 Heading of the page should match design guideline like menu page heading

### 2. Order Details Screen (PATH - /order/{orderId})

    - 2.1 Need order Details with different sections mentioned below
        - Heading which should match menu page heading as per design guideline
        - Status or Status bar and actions (rate order and have problem) for Designs use mcps available to us like shadcdn or 21st dev. Use our design guideline
        - Order items, it should show name, variant, addons, price, discounted price, item status and quantity
        - Order Summary (you can use cart summary component as we have same response avaialble in order response)
        - Order Information (status, payment method, payment ref id)
        - Store details (name, phone, address, email)
        - Deliveryboy Details if available (see StaffResponse in order response as rider.info) (name, email)
    - 2.2 I will give you screenshot but *** PLEASE DO NOT COPY SAME DESIGN. AS IT IS CONTENT REFERENCE FROM MY PREVIOUS WEBSITE ***
    - 2.3 Screenshot Reference: @spec/order/order_details.png
    - 2.4 APIs and types are added

### 3. Order Success Screen (PATH - /order/{orderId}/success)

    - 2.1 Need order Details with different sections mentioned below
        - Heading which should match menu page heading as per design guideline which shows order successfully placed with green accent
        - Order items, it should show name, variant, addons, price, discounted price, item status and quantity
        - Order Summary (you can use cart summary component as we have same response avaialble in order response)
        - Actions View Details and Order More
    - 2.2 I will give you screenshot but *** PLEASE DO NOT COPY SAME DESIGN. AS IT IS CONTENT REFERENCE FROM MY PREVIOUS WEBSITE ***
    - 2.3 Screenshot Reference: @spec/order/order_success.png

### 3. Order Failure Screen (PATH - /order/{orderId}/error)

    - 2.1 Need order Details with different sections mentioned below
        - Heading which should match menu page heading as per design guideline which shows order failed to placed with red accent
        - Order items, it should show name, variant, addons, price, discounted price, item status and quantity
        - Order Summary (you can use cart summary component as we have same response avaialble in order response)
        - Actions View Details, Contact Support and Order More
    - 2.2 I will give you screenshot but *** PLEASE DO NOT COPY SAME DESIGN. AS IT IS CONTENT REFERENCE FROM MY PREVIOUS WEBSITE ***
    - 2.3 Screenshot Reference: @spec/order/order_failure.png

**_These Screenshots references are only for content shown in my previous website. As we are redefining the website, we should not copy design and we should do it by our own guidelines of Designs_**

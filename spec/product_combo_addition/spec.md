# Need to integrate product combination as combo in product container

## Added fields in type now need to integrate that with cart item added additional type in cart as well.

## Flow

1. if product is not combo type it should work as same way it is working now
2. if it is combo it should map combo group and combo items same as we map variants and addons
3. if allow cusomisation is true in combo group based on that on click on customise of that item should open cusomise tab which will again call api of product details from id of combo group product and select customisation
4. in the selection step the primary variant group should be hidden and based on defaultVariantId the default variant should be selected so we can see variations on pricing based on that
5. now need to track additional price of that comboid of that product and on select button it should append that in main product cart and pricing should be shown
6. the combo group product should show selected if it is selected chip and allow option to remove
7. validation and selection should be based on combo group.

## Example json data how it should look when it is added to cart

1. Product Details API Response (Combo Product)

Example: "2 X 9 Inch Pizzas" Deal

```json
{
  "product": {
    "_id": "combo123",
    "name": "2 X 9 Inch Pizzas",
    "description": "Choose any 2 delicious 9 inch pizzas",
    "type": "veg",
    "photoList": ["https://example.com/combo-deal.jpg"],
    "category": "cat001",
    "subCategory": "subcat001",
    "basePrice": 599,
    "packagingCharges": 20,
    "isCombo": true,
    "availableDeliveryTypes": ["dineIn", "pickup", "delivery"],
    "noOfPeople": 2,
    "dishSize": { "count": 9, "unit": "inch" },
    "tags": ["combo", "deal", "popular"],
    "spiceLevel": [],
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-05T10:00:00.000Z"
  },
  "variantList": [],
  "variantGroupList": [],
  "addonList": [],
  "addonGroupList": [],
  "pricing": [],
  "comboGroups": [
    {
      "_id": "cg001",
      "groupId": "uuid-pizza-group-1",
      "comboId": "combo123",
      "label": "Choose Your First Pizza",
      "description": "Select your first 9 inch pizza",
      "minSelection": 1,
      "maxSelection": 1,
      "allowCustomization": true,
      "storeIds": ["store001"],
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-05T10:00:00.000Z"
    },
    {
      "_id": "cg002",
      "groupId": "uuid-pizza-group-2",
      "comboId": "combo123",
      "label": "Choose Your Second Pizza",
      "description": "Select your second 9 inch pizza",
      "minSelection": 1,
      "maxSelection": 1,
      "allowCustomization": true,
      "storeIds": ["store001"],
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-05T10:00:00.000Z"
    }
  ],
  "comboGroupProducts": [
    {
      "_id": "cgp001",
      "comboGroupId": "cg001",
      "productId": "pizza001",
      "defaultVariantId": "var9inch001",
      "storeIds": ["store001"],
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-05T10:00:00.000Z",
      "product": {
        "_id": "pizza001",
        "name": "Margherita Pizza",
        "photoList": ["https://example.com/margherita.jpg"]
      }
    },
    {
      "_id": "cgp002",
      "comboGroupId": "cg001",
      "productId": "pizza002",
      "defaultVariantId": "var9inch002",
      "storeIds": ["store001"],
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-05T10:00:00.000Z",
      "product": {
        "_id": "pizza002",
        "name": "Pepperoni Pizza",
        "photoList": ["https://example.com/pepperoni.jpg"]
      }
    },
    {
      "_id": "cgp003",
      "comboGroupId": "cg001",
      "productId": "pizza003",
      "defaultVariantId": "var9inch003",
      "storeIds": ["store001"],
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-05T10:00:00.000Z",
      "product": {
        "_id": "pizza003",
        "name": "BBQ Chicken Pizza",
        "photoList": ["https://example.com/bbq-chicken.jpg"]
      }
    },
    {
      "_id": "cgp004",
      "comboGroupId": "cg002",
      "productId": "pizza001",
      "defaultVariantId": "var9inch001",
      "storeIds": ["store001"],
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-05T10:00:00.000Z",
      "product": {
        "_id": "pizza001",
        "name": "Margherita Pizza",
        "photoList": ["https://example.com/margherita.jpg"]
      }
    },
    {
      "_id": "cgp005",
      "comboGroupId": "cg002",
      "productId": "pizza002",
      "defaultVariantId": "var9inch002",
      "storeIds": ["store001"],
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-05T10:00:00.000Z",
      "product": {
        "_id": "pizza002",
        "name": "Pepperoni Pizza",
        "photoList": ["https://example.com/pepperoni.jpg"]
      }
    }
  ]
}
```

---

2. Cart Entry (Combo Product)

Customer selected: Margherita (with extra cheese) + Pepperoni (with jalapeños)

```json
{
  "_id": "cart001",
  "userId": "user123",
  "storeId": "store001",
  "productId": "combo123",
  "quantity": 1,
  "isCombo": true,
  "pricing": [],
  "comboSelections": [
    {
      "groupId": "uuid-pizza-group-1",
      "productId": "pizza001",
      "pricing": [
        {
          "id": "addon-extra-cheese-001",
          "quantity": 1,
          "price": 49
        }
      ]
    },
    {
      "groupId": "uuid-pizza-group-2",
      "productId": "pizza002",
      "pricing": [
        {
          "id": "addon-jalapeno-001",
          "quantity": 1,
          "price": 29
        }
      ]
    }
  ],
  "createdAt": "2025-01-05T12:00:00.000Z",
  "updatedAt": "2025-01-05T12:00:00.000Z"
}
```

---

3. Product Details - "Deal 1" (Pizza + Sides + Drink)

```json
{
  "product": {
    "_id": "deal001",
    "name": "Deal 1 - Complete Meal",
    "description": "1 Pizza + 1 Side + 1 Drink",
    "type": "veg",
    "photoList": ["https://example.com/deal1.jpg"],
    "category": "cat002",
    "subCategory": "subcat002",
    "basePrice": 449,
    "packagingCharges": 30,
    "isCombo": true,
    "availableDeliveryTypes": ["dineIn", "pickup", "delivery"],
    "noOfPeople": 1,
    "dishSize": { "count": 1, "unit": "portion" },
    "tags": ["deal", "meal"],
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-05T10:00:00.000Z"
  },
  "variantList": [],
  "variantGroupList": [],
  "addonList": [],
  "addonGroupList": [],
  "pricing": [],
  "comboGroups": [
    {
      "_id": "cg101",
      "groupId": "uuid-deal1-pizza",
      "comboId": "deal001",
      "label": "Choose Your Pizza",
      "description": "Select any pizza",
      "minSelection": 1,
      "maxSelection": 1,
      "allowCustomization": true,
      "storeIds": ["store001"]
    },
    {
      "_id": "cg102",
      "groupId": "uuid-deal1-side",
      "comboId": "deal001",
      "label": "Choose Your Side",
      "description": "Select a side dish",
      "minSelection": 1,
      "maxSelection": 1,
      "allowCustomization": false,
      "storeIds": ["store001"]
    },
    {
      "_id": "cg103",
      "groupId": "uuid-deal1-drink",
      "comboId": "deal001",
      "label": "Choose Your Drink",
      "description": "Select a beverage",
      "minSelection": 1,
      "maxSelection": 1,
      "allowCustomization": false,
      "storeIds": ["store001"]
    }
  ],
  "comboGroupProducts": [
    {
      "_id": "cgp101",
      "comboGroupId": "cg101",
      "productId": "pizza001",
      "defaultVariantId": "var7inch001",
      "product": {
        "_id": "pizza001",
        "name": "Margherita Pizza",
        "photoList": ["https://example.com/margherita.jpg"]
      }
    },
    {
      "_id": "cgp102",
      "comboGroupId": "cg101",
      "productId": "pizza002",
      "defaultVariantId": "var7inch002",
      "product": {
        "_id": "pizza002",
        "name": "Pepperoni Pizza",
        "photoList": ["https://example.com/pepperoni.jpg"]
      }
    },
    {
      "_id": "cgp103",
      "comboGroupId": "cg102",
      "productId": "side001",
      "defaultVariantId": "",
      "product": {
        "_id": "side001",
        "name": "Garlic Bread",
        "photoList": ["https://example.com/garlic-bread.jpg"]
      }
    },
    {
      "_id": "cgp104",
      "comboGroupId": "cg102",
      "productId": "side002",
      "defaultVariantId": "",
      "product": {
        "_id": "side002",
        "name": "Cheesy Fries",
        "photoList": ["https://example.com/fries.jpg"]
      }
    },
    {
      "_id": "cgp105",
      "comboGroupId": "cg103",
      "productId": "drink001",
      "defaultVariantId": "",
      "product": {
        "_id": "drink001",
        "name": "Coca Cola",
        "photoList": ["https://example.com/coke.jpg"]
      }
    },
    {
      "_id": "cgp106",
      "comboGroupId": "cg103",
      "productId": "drink002",
      "defaultVariantId": "",
      "product": {
        "_id": "drink002",
        "name": "Pepsi",
        "photoList": ["https://example.com/pepsi.jpg"]
      }
    }
  ]
}
```

---

4. Cart Entry - "Deal 1"

Customer selected: Margherita + Garlic Bread + Coca Cola

```json
{
  "_id": "cart002",
  "userId": "user123",
  "storeId": "store001",
  "productId": "deal001",
  "quantity": 1,
  "isCombo": true,
  "pricing": [],
  "comboSelections": [
    {
      "groupId": "uuid-deal1-pizza",
      "productId": "pizza001",
      "pricing": []
    },
    {
      "groupId": "uuid-deal1-side",
      "productId": "side001",
      "pricing": []
    },
    {
      "groupId": "uuid-deal1-drink",
      "productId": "drink001",
      "pricing": []
    }
  ],
  "createdAt": "2025-01-05T12:30:00.000Z",
  "updatedAt": "2025-01-05T12:30:00.000Z"
}
```

---

Pricing Calculation Example

For "2 X 9 Inch Pizzas" cart above:
Base Combo Price: ₹599

- Extra Cheese: ₹49 (from pricing[0].price)
- Jalapeños: ₹29 (from pricing[0].price)
- Packaging: ₹20
  ─────────────────────────
  Subtotal: ₹697

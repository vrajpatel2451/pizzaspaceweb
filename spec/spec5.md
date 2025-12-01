# Need to implement product details section for each product card

## Information and requirements

1. Need UI where we can show product details with addons and variants (screenshots I will attach but no need design should be same. It should be based on our design guideline)
2. For Web UI dialog/popup should be opened and for mobile view bottomsheet should be opened
3. When Dialog or bottomsheet is opened then and only API call should happen
4. API for product details are available I have added types and api

## Variants and addons logic

1. Variants and addons should be listed based on groups
2. no variants should be outside of group
3. Variants and their groups has two types primary and non primary variants
4. Order of showcasing variants and addons are these: Primary Variants, Secondary Variants, Addons
5. Addons are basically 2 types like just adding it as 1 quantity or multi quantity
6. Each Variant groups variants, only one variant should be selected (radio buttons)
7. Each Addon groups, addons can be selected multiple (checkboxes if multiple mentioned in group then quantity counters)

## Variant and addons price showcase logic

1. Primary Variants should direct show pricing from its own object
2. for Secondary Variants, first get the object from variant pricing of selected primary variant and that variant combination
3. for addon it will be same as secondary variants if u see types u will understand.

## Rules of logic

1. if variants available from primary variants first one should be selected by default
2. if not available do not show in the UI. product details are enough.
3. product details should be collapsed as read more
4. all validations should be applied if variants available then primary variants should be selected enough

## Rules of UI

1. UI should be based on our current brand guideline and how we are implementing right now
2. It should be eyecatchy and production ready like how a 10-20 years experienced developer would achieve
3. It should be supported both mobile responsiveness and dark-light theme as well

## Rules of API fetching

1. once dialog or bottom sheet is opened then and only API should be fetched
2. we can implement caching at global level that like once product details are opened and close it and second time I try to open it should not fetch API
3. API might send nulls in response so that case should be handled as well in UI side.

## Artifacts and its rules

1. Product Details dialog reference: @spec/product_details
2. This is just and example **I DO NOT WANT SAME UI**
3. I need proper product details production ready UI for variant and addon selections
4. I need product details as well collapsible to showcase as well

**PLEASE MAKE A ROBUST PLAN WITH NO BUILD ERRORS AND RUNTIME ERRORS**

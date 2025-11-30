# Need Fixes in home screen phase 3

1. In Header Section
   - there are 2 headers I guess like one is main one which is good but remove another one where find a store is written as it should be in main header.
   - Also header does not look good in light mode
   - in click of search popup is getting opened so there categories and product APIs should be integrated
   - Store locator should be in header where use must select one of his nearby store API is already there need to use it and need to maintain global state on server and client side both so that API can use store Id to fetch info on home screen specific to that store
2. In Hero section
   - use product API for hero section already build and it was there in previous version
   - use categories api for trending written below search bar u can pass limit like 2,3
   - use same API for showing popular searches
   - view menu and order now belongs same Meaning so keep one of them
3. Remove Make Your Order Section
4. Categories Section
   - Remove chips only image grid are good
   - No need to show 6 categories label like no need to show count
   - API should be used for categories which is already there no mockdata needed
   - for mobile view need 2 item grid and font size in card can be smaller so that we can fit more categories
   - if possible can we make it server side as good for SEO
5. Menu section
   - API should be used for tabbar of categories and menu items
   - selected tab position is weird css issue can u fix it?
   - if possible can we make it server side as good for SEO
   - no need to show count of 6 out of 6 dishes
   - no mock data only real data needed
6. Store Section
   - no consistencies in input field
   - Use API for stores fetching which is already provided
   - Dark mode is not working properly in this section like not getting applied for this section
   - this component can be serverside and form can be client side
7. Remove Awards and achievements
8. AboutUs Section
   - the cards of counts should be better as counts and content is clipped
9. Vision mission
   - This component can be redesined completely as no dark light mode and no such exciting UI
10. Footer
    - remove playstore and appstore as there is no app here
11. Overall home screen
    - need to convert all money to british pound use helper so that can be changed from one single file
    - same date formats, addresses locations and all, phone formats, validations and date and time picker should be british like london only
    - SEO needs to be added like all meta tags, favicons and all

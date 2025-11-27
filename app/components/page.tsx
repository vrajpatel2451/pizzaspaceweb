"use client";

import * as React from "react";
import {
  Search,
  User,
  ShoppingCart,
  MapPin,
  Mail,
  Eye,
  EyeOff,
  Plus,
  Heart,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";

import {
  Button,
  IconButton,
  Input,
  TextArea,
  Badge,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

import {
  QuantityIncrementor,
  Rating,
  SearchSelect,
} from "@/components/composite";

import { PriceWrapper, DateWrapper } from "@/components/formatters";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function ComponentsShowcase() {
  const { theme, setTheme } = useTheme();
  const [quantity, setQuantity] = React.useState(1);
  const [rating, setRating] = React.useState(3.5);
  const [searchValue, setSearchValue] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const selectOptions = [
    { value: "margherita", label: "Margherita" },
    { value: "pepperoni", label: "Pepperoni" },
    { value: "hawaiian", label: "Hawaiian" },
    { value: "veggie", label: "Veggie Supreme" },
    { value: "bbq", label: "BBQ Chicken" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Toaster />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-xl font-bold text-primary">Pizza Space</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-secondary-foreground"
            >
              {theme === "dark" ? "Light" : "Dark"} Mode
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-h1 mb-4">Pizzaspace Component Library</h1>
          <p className="text-body-lg text-muted-foreground">
            A comprehensive collection of UI components for the Pizzaspace food ordering platform.
          </p>
        </div>

        {/* Design Tokens Section */}
        <section className="mb-16">
          <h2 className="text-h2 mb-6">Design Tokens</h2>

          <div className="grid gap-8">
            {/* Colors */}
            <div>
              <h3 className="text-h4 mb-4">Colors</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-lg bg-primary shadow-md" />
                  <span className="text-caption">Primary</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-lg bg-secondary shadow-md" />
                  <span className="text-caption">Secondary</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-lg bg-destructive shadow-md" />
                  <span className="text-caption">Destructive</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-lg bg-green-500 shadow-md" />
                  <span className="text-caption">Success</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-lg bg-yellow-500 shadow-md" />
                  <span className="text-caption">Warning</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-lg bg-muted shadow-md border" />
                  <span className="text-caption">Muted</span>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="text-h4 mb-4">Typography</h3>
              <div className="space-y-3 bg-card p-6 rounded-lg border">
                <p className="text-h1">Heading 1 - Montserrat Bold</p>
                <p className="text-h2">Heading 2 - Montserrat Bold</p>
                <p className="text-h3">Heading 3 - Montserrat Semibold</p>
                <p className="text-h4">Heading 4 - Montserrat Semibold</p>
                <p className="text-h5">Heading 5 - Montserrat Semibold</p>
                <p className="text-h6">Heading 6 - Montserrat Semibold</p>
                <Separator />
                <p className="text-body-lg">Body Large - Regular text for emphasis</p>
                <p className="text-body">Body - Default paragraph text</p>
                <p className="text-body-sm">Body Small - Secondary text</p>
                <p className="text-caption text-muted-foreground">Caption - Small helper text</p>
                <p className="text-label">Label - Form labels</p>
                <p className="text-overline">OVERLINE - CATEGORY TEXT</p>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-h2 mb-6">Buttons</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-h5 mb-4">Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <div>
              <h3 className="text-h5 mb-4">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            <div>
              <h3 className="text-h5 mb-4">States</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
              </div>
            </div>

            <div>
              <h3 className="text-h5 mb-4">With Icons</h3>
              <div className="flex flex-wrap gap-4">
                <Button>
                  <Plus className="size-4" />
                  Add Item
                </Button>
                <Button variant="outline">
                  <Heart className="size-4" />
                  Favorite
                </Button>
                <Button variant="secondary">
                  <ShoppingCart className="size-4" />
                  Add to Cart
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-h5 mb-4">Icon Buttons</h3>
              <div className="flex flex-wrap items-center gap-4">
                <IconButton aria-label="Search" variant="default">
                  <Search className="size-5" />
                </IconButton>
                <IconButton aria-label="User profile" variant="secondary">
                  <User className="size-5" />
                </IconButton>
                <IconButton aria-label="Shopping cart" variant="outline">
                  <ShoppingCart className="size-5" />
                </IconButton>
                <IconButton aria-label="Location" variant="ghost">
                  <MapPin className="size-5" />
                </IconButton>
                <IconButton aria-label="Loading" variant="muted" loading>
                  <Bell className="size-5" />
                </IconButton>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Inputs Section */}
        <section className="mb-16">
          <h2 className="text-h2 mb-6">Inputs</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Input
                label="Email"
                placeholder="Enter your email"
                leftIcon={<Mail className="size-4" />}
              />

              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                }
              />

              <Input
                label="Search"
                placeholder="Search for pizza..."
                leftIcon={<Search className="size-4" />}
                helperText="Try searching for 'Margherita'"
              />

              <Input
                label="With Error"
                placeholder="Enter value"
                error="This field is required"
                defaultValue="Invalid input"
              />
            </div>

            <div className="space-y-6">
              <TextArea
                label="Special Instructions"
                placeholder="Any special requests for your order?"
                showCharCount
                maxLength={200}
              />

              <TextArea
                label="Feedback"
                placeholder="Tell us about your experience"
                helperText="Your feedback helps us improve"
              />

              <TextArea
                label="With Error"
                placeholder="Enter your message"
                error="Message is too short"
              />
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Select Components */}
        <section className="mb-16">
          <h2 className="text-h2 mb-6">Select Components</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-h5 mb-4">Basic Select</h3>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a pizza" />
                </SelectTrigger>
                <SelectContent>
                  {selectOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-h5 mb-4">Search Select</h3>
              <SearchSelect
                options={selectOptions}
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Search pizza types..."
                searchPlaceholder="Type to search..."
              />
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Form Controls */}
        <section className="mb-16">
          <h2 className="text-h2 mb-6">Form Controls</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-h5 mb-4">Checkbox</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="cheese" />
                  <Label htmlFor="cheese">Extra Cheese</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="mushrooms" />
                  <Label htmlFor="mushrooms">Mushrooms</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="olives" defaultChecked />
                  <Label htmlFor="olives">Black Olives</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="disabled" disabled />
                  <Label htmlFor="disabled" className="text-muted-foreground">
                    Disabled
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-h5 mb-4">Radio Group</h3>
              <RadioGroup defaultValue="medium">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="small" />
                  <Label htmlFor="small">Small - <PriceWrapper value={10} size="sm" /></Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium - <PriceWrapper value={15} size="sm" /></Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large">Large - <PriceWrapper value={20} size="sm" /></Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="text-h5 mb-4">Switch</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Notifications</Label>
                  <Switch id="notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing">Marketing emails</Label>
                  <Switch id="marketing" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="disabled-switch" className="text-muted-foreground">
                    Disabled
                  </Label>
                  <Switch id="disabled-switch" disabled />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Badges */}
        <section className="mb-16">
          <h2 className="text-h2 mb-6">Badges</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-h5 mb-4">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="outline-primary">Outline Primary</Badge>
                <Badge variant="muted">Muted</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-h5 mb-4">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge size="sm">Small</Badge>
                <Badge size="default">Default</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-h5 mb-4">Removable</h3>
              <div className="flex flex-wrap gap-3">
                <Badge removable onRemove={() => toast("Badge removed!")}>
                  Click to remove
                </Badge>
                <Badge variant="secondary" removable onRemove={() => toast("Badge removed!")}>
                  Secondary
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Tabs */}
        <section className="mb-16">
          <h2 className="text-h2 mb-6">Tabs</h2>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pizza">Pizza</TabsTrigger>
              <TabsTrigger value="starters">Starters</TabsTrigger>
              <TabsTrigger value="fries">Fries</TabsTrigger>
              <TabsTrigger value="desserts">Desserts</TabsTrigger>
              <TabsTrigger value="beverages">Beverages</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <p className="text-muted-foreground">Showing all menu items...</p>
            </TabsContent>
            <TabsContent value="pizza" className="mt-4">
              <p className="text-muted-foreground">Pizza selection: Margherita, Pepperoni, Hawaiian...</p>
            </TabsContent>
            <TabsContent value="starters" className="mt-4">
              <p className="text-muted-foreground">Starters: Garlic Bread, Bruschetta, Wings...</p>
            </TabsContent>
            <TabsContent value="fries" className="mt-4">
              <p className="text-muted-foreground">Fries: Classic, Loaded, Sweet Potato...</p>
            </TabsContent>
            <TabsContent value="desserts" className="mt-4">
              <p className="text-muted-foreground">Desserts: Tiramisu, Gelato, Cheesecake...</p>
            </TabsContent>
            <TabsContent value="beverages" className="mt-4">
              <p className="text-muted-foreground">Beverages: Sodas, Juices, Cocktails...</p>
            </TabsContent>
          </Tabs>
        </section>

        <Separator className="my-8" />

        {/* Accordion */}
        <section className="mb-16">
          <h2 className="text-h2 mb-6">Accordion</h2>

          <Accordion type="single" collapsible className="w-full max-w-xl">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I place an order?</AccordionTrigger>
              <AccordionContent>
                Simply browse our menu, add items to your cart, and proceed to checkout.
                You can pay online or choose cash on delivery.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What are your delivery hours?</AccordionTrigger>
              <AccordionContent>
                We deliver from 11:00 AM to 11:00 PM, seven days a week.
                Orders placed after 10:30 PM may be delayed.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Do you offer vegetarian options?</AccordionTrigger>
              <AccordionContent>
                Yes! We have a wide variety of vegetarian pizzas and sides.
                Look for the green leaf icon on our menu.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <Separator className="my-8" />

        {/* Dialogs & Overlays */}
        <section className="mb-16">
          <h2 className="text-h2 mb-6">Dialogs & Overlays</h2>

          <div className="flex flex-wrap gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Customize Order</DialogTitle>
                  <DialogDescription>
                    Make it perfect for you
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-2xl">🍕</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Margherita Pizza</h4>
                      <PriceWrapper value={12} variant="primary" />
                    </div>
                  </div>
                  <Separator />
                  <RadioGroup defaultValue="medium">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="small" id="d-small" />
                        <Label htmlFor="d-small">Small</Label>
                      </div>
                      <PriceWrapper value={10} size="sm" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="d-medium" />
                        <Label htmlFor="d-medium">Medium</Label>
                      </div>
                      <PriceWrapper value={15} size="sm" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="large" id="d-large" />
                        <Label htmlFor="d-large">Large</Label>
                      </div>
                      <PriceWrapper value={20} size="sm" />
                    </div>
                  </RadioGroup>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Quantity</span>
                    <QuantityIncrementor
                      value={quantity}
                      onChange={setQuantity}
                      min={1}
                      max={10}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button className="w-full">
                    <ShoppingCart className="size-4 mr-2" />
                    Add to Cart - <PriceWrapper value={15 * quantity} className="ml-1" />
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-semibold">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-muted transition-colors">
                      <Settings className="size-4" />
                      <span>Settings</span>
                    </button>
                    <button className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-muted transition-colors">
                      <User className="size-4" />
                      <span>Profile</span>
                    </button>
                    <button className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-muted transition-colors text-destructive">
                      <LogOut className="size-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary">Open Sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Your Cart</SheetTitle>
                  <SheetDescription>
                    Review your order before checkout
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                        🍕
                      </div>
                      <div>
                        <p className="font-medium">Margherita</p>
                        <p className="text-sm text-muted-foreground">Medium</p>
                      </div>
                    </div>
                    <PriceWrapper value={15} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <PriceWrapper value={15} size="lg" variant="primary" />
                  </div>
                  <Button className="w-full">Proceed to Checkout</Button>
                </div>
              </SheetContent>
            </Sheet>

            <Button
              variant="ghost"
              onClick={() => toast.success("Order placed successfully!")}
            >
              Show Toast
            </Button>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Specialized Components */}
        <section className="mb-16">
          <h2 className="text-h2 mb-6">Specialized Components</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-h5 mb-4">Quantity Incrementor</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-20">Small:</span>
                  <QuantityIncrementor
                    value={quantity}
                    onChange={setQuantity}
                    size="sm"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-20">Default:</span>
                  <QuantityIncrementor
                    value={quantity}
                    onChange={setQuantity}
                    size="default"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-20">Large:</span>
                  <QuantityIncrementor
                    value={quantity}
                    onChange={setQuantity}
                    size="lg"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-h5 mb-4">Rating</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-24">Display:</span>
                  <Rating value={4.5} showValue />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-24">Interactive:</span>
                  <Rating
                    value={rating}
                    onChange={setRating}
                    interactive
                    showValue
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-24">Sizes:</span>
                  <div className="flex items-center gap-4">
                    <Rating value={4} size="sm" />
                    <Rating value={4} size="default" />
                    <Rating value={4} size="lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Formatters */}
        <section className="mb-16">
          <h2 className="text-h2 mb-6">Formatters (UK Locale)</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-h5 mb-4">Price Wrapper</h3>
              <div className="space-y-3 bg-card p-6 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Small:</span>
                  <PriceWrapper value={9.99} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Default:</span>
                  <PriceWrapper value={12.50} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Large (Primary):</span>
                  <PriceWrapper value={24.99} size="lg" variant="primary" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">XL:</span>
                  <PriceWrapper value={99.99} size="xl" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-h5 mb-4">Date Wrapper</h3>
              <div className="space-y-3 bg-card p-6 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Short:</span>
                  <DateWrapper value={new Date()} format="short" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Medium:</span>
                  <DateWrapper value={new Date()} format="medium" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Long:</span>
                  <DateWrapper value={new Date()} format="long" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Relative:</span>
                  <DateWrapper value={new Date(new Date().getTime() - 3600000)} format="relative" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">With Time:</span>
                  <DateWrapper value={new Date()} format="medium" showTime />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Skeleton */}
        <section className="mb-16">
          <h2 className="text-h2 mb-6">Skeleton / Loading States</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-h5 mb-4">Card Skeleton</h3>
              <div className="p-4 border rounded-lg space-y-3">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-10 w-24 rounded-full" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-h5 mb-4">Shimmer Animation</h3>
              <div className="p-4 border rounded-lg space-y-3">
                <div className="h-32 w-full rounded-lg animate-shimmer" />
                <div className="h-4 w-3/4 rounded animate-shimmer" />
                <div className="h-4 w-1/2 rounded animate-shimmer" />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-muted-foreground">
          <p className="text-body-sm">
            Pizzaspace Component Library - Built with Next.js 16, React 19, Tailwind CSS 4, and shadcn/ui
          </p>
        </footer>
      </main>
    </div>
  );
}

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
  Trash2,
  Edit,
  Copy,
  MoreVertical,
  CheckCircle2,
  Save,
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
  // Sheet,
  // SheetContent,
  // SheetDescription,
  // SheetHeader,
  // SheetTitle,
  // SheetTrigger,
  Skeleton,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Modal,
  Drawer,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
} from "@/components/ui";

import {
  QuantityIncrementor,
  Rating,
  SearchSelect,
} from "@/components/composite";

import { formatPrice, formatDate } from "@/lib/formatters";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function ComponentsShowcase() {
  const { theme, setTheme } = useTheme();
  const [quantity, setQuantity] = React.useState(1);
  const [rating, setRating] = React.useState(3.5);
  const [searchValue, setSearchValue] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  // Modal states
  const [isModalSmOpen, setIsModalSmOpen] = React.useState(false);
  const [isModalMdOpen, setIsModalMdOpen] = React.useState(false);
  const [isModalActionsOpen, setIsModalActionsOpen] = React.useState(false);

  // Drawer states
  const [isDrawerRightOpen, setIsDrawerRightOpen] = React.useState(false);
  const [isDrawerLeftOpen, setIsDrawerLeftOpen] = React.useState(false);
  const [isDrawerBottomOpen, setIsDrawerBottomOpen] = React.useState(false);

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
            A comprehensive collection of UI components for the Pizzaspace food
            ordering platform.
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
                <p className="text-body-lg">
                  Body Large - Regular text for emphasis
                </p>
                <p className="text-body">Body - Default paragraph text</p>
                <p className="text-body-sm">Body Small - Secondary text</p>
                <p className="text-caption text-muted-foreground">
                  Caption - Small helper text
                </p>
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
              </div>
            </div>

            <div>
              <h3 className="text-h5 mb-4">States</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
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
                  <Label htmlFor="small">Small - {formatPrice(10)}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium - {formatPrice(15)}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large">Large - {formatPrice(20)}</Label>
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
                  <Label
                    htmlFor="disabled-switch"
                    className="text-muted-foreground"
                  >
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
              <h3 className="text-h5 mb-4">Standard Variants</h3>
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
              <h3 className="text-h5 mb-4">Food-Specific Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="new">New</Badge>
                <Badge variant="popular">Popular</Badge>
                <Badge variant="spicy">Spicy</Badge>
                <Badge variant="veg">Vegetarian</Badge>
                <Badge variant="nonveg">Non-Veg</Badge>
                <Badge variant="offer">20% Off</Badge>
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

            {/* Removable badges - TODO: implement removable feature */}

            <div>
              <h3 className="text-h5 mb-4">Real-World Usage</h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">Margherita Pizza</h4>
                    <div className="flex gap-2">
                      <Badge variant="veg" size="sm">
                        Veg
                      </Badge>
                      <Badge variant="popular" size="sm">
                        Popular
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Classic pizza with tomatoes and mozzarella
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">Spicy Chicken Wings</h4>
                    <div className="flex gap-2">
                      <Badge variant="nonveg" size="sm">
                        Non-Veg
                      </Badge>
                      <Badge variant="spicy" size="sm">
                        Spicy
                      </Badge>
                      <Badge variant="new" size="sm">
                        New
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Crispy wings with hot sauce
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">BBQ Loaded Fries</h4>
                    <div className="flex gap-2">
                      <Badge variant="offer" size="sm">
                        15% Off
                      </Badge>
                      <Badge variant="popular" size="sm">
                        Bestseller
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fries topped with BBQ sauce and cheese
                  </p>
                </div>
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
              <p className="text-muted-foreground">
                Pizza selection: Margherita, Pepperoni, Hawaiian...
              </p>
            </TabsContent>
            <TabsContent value="starters" className="mt-4">
              <p className="text-muted-foreground">
                Starters: Garlic Bread, Bruschetta, Wings...
              </p>
            </TabsContent>
            <TabsContent value="fries" className="mt-4">
              <p className="text-muted-foreground">
                Fries: Classic, Loaded, Sweet Potato...
              </p>
            </TabsContent>
            <TabsContent value="desserts" className="mt-4">
              <p className="text-muted-foreground">
                Desserts: Tiramisu, Gelato, Cheesecake...
              </p>
            </TabsContent>
            <TabsContent value="beverages" className="mt-4">
              <p className="text-muted-foreground">
                Beverages: Sodas, Juices, Cocktails...
              </p>
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
                Simply browse our menu, add items to your cart, and proceed to
                checkout. You can pay online or choose cash on delivery.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What are your delivery hours?</AccordionTrigger>
              <AccordionContent>
                We deliver from 11:00 AM to 11:00 PM, seven days a week. Orders
                placed after 10:30 PM may be delayed.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Do you offer vegetarian options?
              </AccordionTrigger>
              <AccordionContent>
                Yes! We have a wide variety of vegetarian pizzas and sides. Look
                for the green leaf icon on our menu.
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
                  <DialogDescription>Make it perfect for you</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-2xl">🍕</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Margherita Pizza</h4>
                      <span className="font-semibold text-primary">
                        {formatPrice(12)}
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <RadioGroup defaultValue="medium">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="small" id="d-small" />
                        <Label htmlFor="d-small">Small</Label>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatPrice(10)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="d-medium" />
                        <Label htmlFor="d-medium">Medium</Label>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatPrice(15)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="large" id="d-large" />
                        <Label htmlFor="d-large">Large</Label>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatPrice(20)}
                      </span>
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
                    Add to Cart -{" "}
                    <span className="ml-1">{formatPrice(15 * quantity)}</span>
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

            {/* <Sheet>
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
                    <span className="font-semibold">{formatPrice(15)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-semibold text-primary">
                      {formatPrice(15)}
                    </span>
                  </div>
                  <Button className="w-full">Proceed to Checkout</Button>
                </div>
              </SheetContent>
            </Sheet> */}

            <Button
              variant="ghost"
              onClick={() => toast.success("Order placed successfully!")}
            >
              Show Toast
            </Button>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Modal Component */}
        <section className="mb-16">
          <h2 className="text-h2 mb-6">Modal Component</h2>
          <p className="text-body-sm text-muted-foreground mb-4">
            Controlled modal component using createPortal with built-in header,
            footer, and actions
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-h5 mb-4">Sizes</h3>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => setIsModalSmOpen(true)}>
                  Small Modal
                </Button>
                <Button
                  onClick={() => setIsModalMdOpen(true)}
                  variant="secondary"
                >
                  Medium Modal
                </Button>
                <Button
                  onClick={() => setIsModalActionsOpen(true)}
                  variant="outline"
                >
                  Modal with Actions
                </Button>
              </div>
            </div>
          </div>

          {/* Small Modal */}
          <Modal
            isOpen={isModalSmOpen}
            onClose={() => setIsModalSmOpen(false)}
            title="Small Modal"
            subtitle="This is a compact modal for quick actions"
            size="sm"
          >
            <div className="space-y-4">
              <p className="text-sm">
                This is a small modal with minimal content.
              </p>
              <Input label="Name" placeholder="Enter your name" />
            </div>
          </Modal>

          {/* Medium Modal */}
          <Modal
            isOpen={isModalMdOpen}
            onClose={() => setIsModalMdOpen(false)}
            title="Pizza Details"
            subtitle="View and customize your selection"
            size="md"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-4xl">🍕</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Margherita Pizza</h4>
                  <p className="text-sm text-muted-foreground">
                    Classic Italian pizza with tomatoes, mozzarella, and fresh
                    basil
                  </p>
                  <span className="font-semibold text-primary mt-2 inline-block">
                    {formatPrice(12)}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label>Choose Size</Label>
                <RadioGroup defaultValue="medium">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small" id="m-small" />
                      <Label htmlFor="m-small">Small (8&quot;)</Label>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(10)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="m-medium" />
                      <Label htmlFor="m-medium">Medium (12&quot;)</Label>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(15)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="large" id="m-large" />
                      <Label htmlFor="m-large">Large (16&quot;)</Label>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(20)}
                    </span>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </Modal>

          {/* Modal with Actions */}
          <Modal
            isOpen={isModalActionsOpen}
            onClose={() => setIsModalActionsOpen(false)}
            title="Confirm Order"
            subtitle="Review your order before placing"
            size="md"
            actions={{
              tertiary: {
                label: "Cancel",
                onClick: () => setIsModalActionsOpen(false),
                variant: "ghost",
              },
              secondary: {
                label: "Save Draft",
                onClick: () => {
                  toast.success("Draft saved!");
                  setIsModalActionsOpen(false);
                },
                variant: "outline",
                startIcon: <Save className="size-4" />,
              },
              primary: {
                label: "Place Order",
                onClick: () => {
                  toast.success("Order placed successfully!");
                  setIsModalActionsOpen(false);
                },
                startIcon: <CheckCircle2 className="size-4" />,
              },
            }}
          >
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-semibold mb-2">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Margherita Pizza (Medium)</span>
                    <span>{formatPrice(15)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Extra Cheese</span>
                    <span>{formatPrice(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(17)}</span>
                  </div>
                </div>
              </div>
              <TextArea
                label="Special Instructions"
                placeholder="Any special requests?"
                rows={3}
              />
            </div>
          </Modal>
        </section>

        <Separator className="my-8" />

        {/* Drawer Component */}
        <section className="mb-16">
          <h2 className="text-h2 mb-6">Drawer Component</h2>
          <p className="text-body-sm text-muted-foreground mb-4">
            Slide-in panel component from different sides of the screen
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-h5 mb-4">Positions</h3>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => setIsDrawerRightOpen(true)}>
                  Right Drawer
                </Button>
                <Button
                  onClick={() => setIsDrawerLeftOpen(true)}
                  variant="secondary"
                >
                  Left Drawer
                </Button>
                <Button
                  onClick={() => setIsDrawerBottomOpen(true)}
                  variant="outline"
                >
                  Bottom Drawer
                </Button>
              </div>
            </div>
          </div>

          {/* Right Drawer */}
          <Drawer
            isOpen={isDrawerRightOpen}
            onClose={() => setIsDrawerRightOpen(false)}
            title="Filters"
            subtitle="Refine your search results"
            side="right"
            size="md"
            actions={{
              secondary: {
                label: "Reset",
                onClick: () => toast.info("Filters reset"),
                variant: "ghost",
              },
              primary: {
                label: "Apply Filters",
                onClick: () => {
                  toast.success("Filters applied!");
                  setIsDrawerRightOpen(false);
                },
              },
            }}
          >
            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Price Range</Label>
                <RadioGroup defaultValue="all">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="price-all" />
                    <Label htmlFor="price-all">All Prices</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="budget" id="price-budget" />
                    <Label htmlFor="price-budget">
                      Under {formatPrice(10)}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mid" id="price-mid" />
                    <Label htmlFor="price-mid">
                      {formatPrice(10)} - {formatPrice(20)}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="premium" id="price-premium" />
                    <Label htmlFor="price-premium">
                      Above {formatPrice(20)}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Separator />
              <div>
                <Label className="mb-3 block">Dietary Preferences</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="filter-veg" />
                    <Label htmlFor="filter-veg">Vegetarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="filter-vegan" />
                    <Label htmlFor="filter-vegan">Vegan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="filter-gluten" />
                    <Label htmlFor="filter-gluten">Gluten-Free</Label>
                  </div>
                </div>
              </div>
            </div>
          </Drawer>

          {/* Left Drawer */}
          <Drawer
            isOpen={isDrawerLeftOpen}
            onClose={() => setIsDrawerLeftOpen(false)}
            title="Navigation Menu"
            subtitle="Browse all categories"
            side="left"
            size="sm"
          >
            <div className="space-y-2">
              <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors">
                <span className="text-2xl">🍕</span>
                <span className="font-medium">Pizza</span>
              </button>
              <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors">
                <span className="text-2xl">🍟</span>
                <span className="font-medium">Fries</span>
              </button>
              <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors">
                <span className="text-2xl">🥗</span>
                <span className="font-medium">Salads</span>
              </button>
              <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors">
                <span className="text-2xl">🍰</span>
                <span className="font-medium">Desserts</span>
              </button>
              <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors">
                <span className="text-2xl">🥤</span>
                <span className="font-medium">Beverages</span>
              </button>
            </div>
          </Drawer>

          {/* Bottom Drawer */}
          <Drawer
            isOpen={isDrawerBottomOpen}
            onClose={() => setIsDrawerBottomOpen(false)}
            title="Quick Order"
            subtitle="Add your favorite pizza to cart"
            side="bottom"
            size="md"
            actions={{
              primary: {
                label: "Add to Cart",
                onClick: () => {
                  toast.success("Added to cart!");
                  setIsDrawerBottomOpen(false);
                },
                startIcon: <ShoppingCart className="size-4" />,
              },
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-3xl">🍕</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Pepperoni Pizza</h4>
                  <p className="text-sm text-muted-foreground">
                    Classic pepperoni with extra cheese
                  </p>
                  <span className="font-semibold text-primary mt-1 inline-block">
                    {formatPrice(14)}
                  </span>
                </div>
                <QuantityIncrementor
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={10}
                />
              </div>
            </div>
          </Drawer>
        </section>

        <Separator className="my-8" />

        {/* Dropdown Component */}
        <section className="mb-16">
          <h2 className="text-h2 mb-6">Dropdown Component</h2>
          <p className="text-body-sm text-muted-foreground mb-4">
            Popover-style dropdown menu with items, icons, and separators
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-h5 mb-4">Examples</h3>
              <div className="flex flex-wrap gap-4">
                <Dropdown
                  trigger={
                    <Button variant="outline">
                      <User className="size-4" />
                      User Menu
                    </Button>
                  }
                >
                  <DropdownItem startIcon={<User className="size-4" />}>
                    Profile
                  </DropdownItem>
                  <DropdownItem startIcon={<Settings className="size-4" />}>
                    Settings
                  </DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem
                    startIcon={<LogOut className="size-4" />}
                    destructive
                    onClick={() => toast.error("Logged out")}
                  >
                    Logout
                  </DropdownItem>
                </Dropdown>

                <Dropdown
                  trigger={
                    <IconButton aria-label="More options" variant="ghost">
                      <MoreVertical className="size-5" />
                    </IconButton>
                  }
                  align="end"
                >
                  <DropdownItem
                    startIcon={<Edit className="size-4" />}
                    onClick={() => toast.info("Edit clicked")}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    startIcon={<Copy className="size-4" />}
                    onClick={() => toast.success("Copied!")}
                  >
                    Duplicate
                  </DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem
                    startIcon={<Trash2 className="size-4" />}
                    destructive
                    onClick={() => toast.error("Deleted")}
                  >
                    Delete
                  </DropdownItem>
                </Dropdown>

                <Dropdown
                  trigger={<Button variant="secondary">Order Actions</Button>}
                  side="top"
                >
                  <DropdownItem startIcon={<Save className="size-4" />}>
                    Save for later
                  </DropdownItem>
                  <DropdownItem startIcon={<Heart className="size-4" />}>
                    Add to favorites
                  </DropdownItem>
                  <DropdownItem startIcon={<ShoppingCart className="size-4" />}>
                    Reorder
                  </DropdownItem>
                </Dropdown>
              </div>
            </div>

            <div>
              <h3 className="text-h5 mb-4">In Context</h3>
              <div className="max-w-md border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      🍕
                    </div>
                    <div>
                      <h4 className="font-semibold">Margherita Pizza</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(15)}
                      </p>
                    </div>
                  </div>
                  <Dropdown
                    trigger={
                      <IconButton
                        aria-label="Order options"
                        variant="ghost"
                        size="sm"
                      >
                        <MoreVertical className="size-4" />
                      </IconButton>
                    }
                    align="end"
                  >
                    <DropdownItem startIcon={<Edit className="size-4" />}>
                      Customize
                    </DropdownItem>
                    <DropdownItem startIcon={<Heart className="size-4" />}>
                      Add to favorites
                    </DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem
                      startIcon={<Trash2 className="size-4" />}
                      destructive
                    >
                      Remove from cart
                    </DropdownItem>
                  </Dropdown>
                </div>
                <Badge variant="popular" size="sm">
                  Popular
                </Badge>
              </div>
            </div>
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
              <h3 className="text-h5 mb-4">Price Formatting</h3>
              <div className="space-y-3 bg-card p-6 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Default:</span>
                  <span className="font-semibold text-base">
                    {formatPrice(9.99)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Without Symbol:</span>
                  <span className="font-semibold text-base">
                    {formatPrice(12.5, { showSymbol: false })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">No Decimals:</span>
                  <span className="font-semibold text-base">
                    {formatPrice(24.99, { decimals: 0 })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Large Amount:</span>
                  <span className="font-semibold text-base">
                    {formatPrice(1299.99)}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground font-mono">
                    {`formatPrice(9.99)`}
                    <br />
                    {`formatPrice(12.50, { showSymbol: false })`}
                    <br />
                    {`formatPrice(24.99, { decimals: 0 })`}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-h5 mb-4">Date Formatting</h3>
              <div className="space-y-3 bg-card p-6 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Short:</span>
                  <span>{formatDate(new Date(), { format: "short" })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Medium:</span>
                  <span>{formatDate(new Date(), { format: "medium" })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Long:</span>
                  <span>{formatDate(new Date(), { format: "long" })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Relative:</span>
                  <span>
                    {formatDate(new Date(new Date().getTime() - 3600000), {
                      format: "relative",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">With Time:</span>
                  <span>
                    {formatDate(new Date(), {
                      format: "medium",
                      includeTime: true,
                    })}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground font-mono">
                    {`formatDate(date, { format: "short" })`}
                    <br />
                    {`formatDate(date, { format: "relative" })`}
                    <br />
                    {`formatDate(date, { includeTime: true })`}
                  </p>
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
            Pizzaspace Component Library - Built with Next.js 16, React 19,
            Tailwind CSS 4, and shadcn/ui
          </p>
        </footer>
      </main>
    </div>
  );
}

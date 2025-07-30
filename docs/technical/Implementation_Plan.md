# YouTube Sponsorship Workflow - shadcn/ui Component Implementation

## 1. Navigation Flow Components

├─ Landing/Login Page
│ ├─ Authentication Process
│ │ ├─ Email/Password Login → **Form, Input, Label, Button**
│ │ ├─ Social Login Options → **Button**
│ │ └─ Password Recovery Flow → **Dialog, Form, Input**
│ └─ Redirect to Dashboard → **useRouter (Next.js)**
├─ Main Dashboard (Kanban Board)
│ ├─ Deal Management Actions
│ │ ├─ Create New Deal → **Dialog, Form**
│ │ ├─ Edit Existing Deal → **Dialog, Form**
│ │ ├─ Move Deal Between Stages → **DropdownMenu, Command**
│ │ └─ Delete Deal → **AlertDialog**
│ ├─ Filtering and Search
│ │ ├─ Filter by Status → **Select, Command**
│ │ ├─ Filter by Brand → **Select, Command**
│ │ ├─ Filter by Date Range → **Popover, Calendar**
│ │ └─ Search by Deal Name → **Input, Command**
│ └─ User Account Management
│ ├─ Profile Settings → **Dialog, Form, Tabs**
│ ├─ Notification Preferences → **Switch, Checkbox**
│ └─ Logout Function → **DropdownMenu, AlertDialog**

## 2. Login Page Structure Components

├─ Header Section
│ ├─ Application Logo → **Avatar, Image**
│ ├─ Application Title → **Typography (h1)**
│ └─ Tagline/Description → **Typography (p)**
├─ Main Login Form Container → **Card, CardHeader, CardContent**
│ ├─ Welcome Message → **Typography (h2)**
│ ├─ Email Input Field
│ │ ├─ Email Label → **Label**
│ │ ├─ Email Input Box → **Input**
│ │ └─ Email Validation Message → **Alert, AlertDescription**
│ ├─ Password Input Field
│ │ ├─ Password Label → **Label**
│ │ ├─ Password Input Box → **Input**
│ │ ├─ Show/Hide Password Toggle → **Button, Eye Icon**
│ │ └─ Password Validation Message → **Alert, AlertDescription**
│ ├─ Remember Me Checkbox → **Checkbox, Label**
│ ├─ Sign In Button → **Button**
│ └─ Forgot Password Link → **Button (variant="link")**
├─ Alternative Login Options
│ ├─ Divider Line with "OR" Text → **Separator**
│ ├─ Google Sign In Button → **Button**
│ ├─ YouTube Account Sign In Button → **Button**
│ └─ GitHub Sign In Button → **Button**
├─ Registration Section
│ ├─ "Don't have an account?" Text → **Typography (p)**
│ └─ Sign Up Link → **Button (variant="link")**
└─ Footer Section
├─ Terms of Service Link → **Button (variant="link")**
├─ Privacy Policy Link → **Button (variant="link")**
└─ Contact Support Link → **Button (variant="link")**

## 3. Dashboard Page Structure Components

├─ Top Navigation Bar → **NavigationMenu, Flex Container**
│ ├─ Left Section
│ │ ├─ Application Logo → **Avatar, Image**
│ │ ├─ Dashboard Title → **Typography (h1)**
│ │ └─ Breadcrumb Navigation → **Breadcrumb, BreadcrumbList, BreadcrumbItem**
│ ├─ Center Section
│ │ ├─ Global Search Bar
│ │ │ ├─ Search Input Field → **Input, Search Icon**
│ │ │ ├─ Search Icon → **Search Icon**
│ │ │ └─ Search Suggestions Dropdown → **Command, CommandInput, CommandList**
│ │ └─ Filter Controls
│ │ ├─ Status Filter Dropdown → **Select, SelectContent, SelectItem**
│ │ ├─ Brand Filter Dropdown → **Select, SelectContent, SelectItem**
│ │ ├─ Date Range Picker → **Popover, Calendar, Button**
│ │ └─ Clear Filters Button → **Button (variant="outline")**
│ └─ Right Section
│ ├─ Add New Deal Button → **Button**
│ ├─ Notification Bell Icon → **Button, Bell Icon**
│ │ └─ Notification Dropdown → **DropdownMenu, DropdownMenuContent**
│ └─ User Profile Menu
│ ├─ Profile Picture → **Avatar, AvatarImage, AvatarFallback**
│ ├─ Username Display → **Typography (span)**
│ └─ Dropdown Menu → **DropdownMenu, DropdownMenuTrigger, DropdownMenuContent**
│ ├─ Profile Settings → **DropdownMenuItem**
│ ├─ Account Settings → **DropdownMenuItem**
│ ├─ Help & Support → **DropdownMenuItem**
│ └─ Logout Option → **DropdownMenuItem**
├─ Dashboard Statistics Bar → **Card, CardContent, Flex Container**
│ ├─ Total Deals Counter → **Card, CardHeader, CardTitle, CardContent**
│ ├─ Active Deals Counter → **Card, CardHeader, CardTitle, CardContent**
│ ├─ Completed Deals Counter → **Card, CardHeader, CardTitle, CardContent**
│ ├─ Total Revenue Display → **Card, CardHeader, CardTitle, CardContent**
│ └─ This Month Revenue Display → **Card, CardHeader, CardTitle, CardContent**
├─ Kanban Board Container → **ScrollArea, Flex Container**
│ ├─ Column 1: Prospecting → **Card, CardHeader, CardContent**
│ │ ├─ Column Header
│ │ │ ├─ Stage Title → **Typography (h3)**
│ │ │ ├─ Deal Count Badge → **Badge**
│ │ │ └─ Column Options Menu → **DropdownMenu, MoreHorizontal Icon**
│ │ ├─ Deal Cards Container → **ScrollArea, Flex Container**
│ │ │ └─ Individual Deal Cards → **Card, CardHeader, CardContent, CardFooter**
│ │ │ ├─ Deal Title → **Typography (h4)**
│ │ │ ├─ Brand Logo/Name → **Avatar, Typography**
│ │ │ ├─ Deal Value → **Typography, Badge**
│ │ │ ├─ Due Date → **Typography, Calendar Icon**
│ │ │ ├─ Priority Indicator → **Badge (variant based on priority)**
│ │ │ ├─ Progress Bar → **Progress**
│ │ │ ├─ Tags/Labels → **Badge (multiple)**
│ │ │ └─ Quick Action Buttons
│ │ │ ├─ Edit Button → **Button (variant="ghost"), Edit Icon**
│ │ │ ├─ Move Button → **Button (variant="ghost"), Move Icon**
│ │ │ └─ Delete Button → **Button (variant="ghost"), Trash Icon**
│ │ └─ Add New Deal Button (Column-specific) → **Button (variant="dashed")**
│ ├─ Column 2: Initial Contact → **Card, CardHeader, CardContent**
│ │ ├─ Column Header
│ │ │ ├─ Stage Title → **Typography (h3)**
│ │ │ ├─ Deal Count Badge → **Badge**
│ │ │ └─ Column Options Menu → **DropdownMenu, MoreHorizontal Icon**
│ │ ├─ Deal Cards Container → **ScrollArea, Flex Container**
│ │ │ └─ Individual Deal Cards → **Card, CardHeader, CardContent, CardFooter**
│ │ │ ├─ Deal Title → **Typography (h4)**
│ │ │ ├─ Brand Logo/Name → **Avatar, Typography**
│ │ │ ├─ Deal Value → **Typography, Badge**
│ │ │ ├─ Due Date → **Typography, Calendar Icon**
│ │ │ ├─ Priority Indicator → **Badge (variant based on priority)**
│ │ │ ├─ Progress Bar → **Progress**
│ │ │ ├─ Tags/Labels → **Badge (multiple)**
│ │ │ └─ Quick Action Buttons
│ │ │ ├─ Edit Button → **Button (variant="ghost"), Edit Icon**
│ │ │ ├─ Move Button → **Button (variant="ghost"), Move Icon**
│ │ │ └─ Delete Button → **Button (variant="ghost"), Trash Icon**
│ │ └─ Add New Deal Button (Column-specific) → **Button (variant="dashed")**
│ ├─ Column 3: Negotiation → **Card, CardHeader, CardContent**
│ │ ├─ Column Header
│ │ │ ├─ Stage Title → **Typography (h3)**
│ │ │ ├─ Deal Count Badge → **Badge**
│ │ │ └─ Column Options Menu → **DropdownMenu, MoreHorizontal Icon**
│ │ ├─ Deal Cards Container → **ScrollArea, Flex Container**
│ │ │ └─ Individual Deal Cards → **Card, CardHeader, CardContent, CardFooter**
│ │ │ ├─ Deal Title → **Typography (h4)**
│ │ │ ├─ Brand Logo/Name → **Avatar, Typography**
│ │ │ ├─ Deal Value → **Typography, Badge**
│ │ │ ├─ Due Date → **Typography, Calendar Icon**
│ │ │ ├─ Priority Indicator → **Badge (variant based on priority)**
│ │ │ ├─ Progress Bar → **Progress**
│ │ │ ├─ Tags/Labels → **Badge (multiple)**
│ │ │ └─ Quick Action Buttons
│ │ │ ├─ Edit Button → **Button (variant="ghost"), Edit Icon**
│ │ │ ├─ Move Button → **Button (variant="ghost"), Move Icon**
│ │ │ └─ Delete Button → **Button (variant="ghost"), Trash Icon**
│ │ └─ Add New Deal Button (Column-specific) → **Button (variant="dashed")**
│ ├─ Column 4: Contract Sent → **Card, CardHeader, CardContent**
│ │ ├─ Column Header
│ │ │ ├─ Stage Title → **Typography (h3)**
│ │ │ ├─ Deal Count Badge → **Badge**
│ │ │ └─ Column Options Menu → **DropdownMenu, MoreHorizontal Icon**
│ │ ├─ Deal Cards Container → **ScrollArea, Flex Container**
│ │ │ └─ Individual Deal Cards → **Card, CardHeader, CardContent, CardFooter**
│ │ │ ├─ Deal Title → **Typography (h4)**
│ │ │ ├─ Brand Logo/Name → **Avatar, Typography**
│ │ │ ├─ Deal Value → **Typography, Badge**
│ │ │ ├─ Due Date → **Typography, Calendar Icon**
│ │ │ ├─ Priority Indicator → **Badge (variant based on priority)**
│ │ │ ├─ Progress Bar → **Progress**
│ │ │ ├─ Tags/Labels → **Badge (multiple)**
│ │ │ └─ Quick Action Buttons
│ │ │ ├─ Edit Button → **Button (variant="ghost"), Edit Icon**
│ │ │ ├─ Move Button → **Button (variant="ghost"), Move Icon**
│ │ │ └─ Delete Button → **Button (variant="ghost"), Trash Icon**
│ │ └─ Add New Deal Button (Column-specific) → **Button (variant="dashed")**
│ ├─ Column 5: Contract Signed → **Card, CardHeader, CardContent**
│ │ ├─ Column Header
│ │ │ ├─ Stage Title → **Typography (h3)**
│ │ │ ├─ Deal Count Badge → **Badge**
│ │ │ └─ Column Options Menu → **DropdownMenu, MoreHorizontal Icon**
│ │ ├─ Deal Cards Container → **ScrollArea, Flex Container**
│ │ │ └─ Individual Deal Cards → **Card, CardHeader, CardContent, CardFooter**
│ │ │ ├─ Deal Title → **Typography (h4)**
│ │ │ ├─ Brand Logo/Name → **Avatar, Typography**
│ │ │ ├─ Deal Value → **Typography, Badge**
│ │ │ ├─ Due Date → **Typography, Calendar Icon**
│ │ │ ├─ Priority Indicator → **Badge (variant based on priority)**
│ │ │ ├─ Progress Bar → **Progress**
│ │ │ ├─ Tags/Labels → **Badge (multiple)**
│ │ │ └─ Quick Action Buttons
│ │ │ ├─ Edit Button → **Button (variant="ghost"), Edit Icon**
│ │ │ ├─ Move Button → **Button (variant="ghost"), Move Icon**
│ │ │ └─ Delete Button → **Button (variant="ghost"), Trash Icon**
│ │ └─ Add New Deal Button (Column-specific) → **Button (variant="dashed")**
│ ├─ Column 6: Content Creation → **Card, CardHeader, CardContent**
│ │ ├─ Column Header
│ │ │ ├─ Stage Title → **Typography (h3)**
│ │ │ ├─ Deal Count Badge → **Badge**
│ │ │ └─ Column Options Menu → **DropdownMenu, MoreHorizontal Icon**
│ │ ├─ Deal Cards Container → **ScrollArea, Flex Container**
│ │ │ └─ Individual Deal Cards → **Card, CardHeader, CardContent, CardFooter**
│ │ │ ├─ Deal Title → **Typography (h4)**
│ │ │ ├─ Brand Logo/Name → **Avatar, Typography**
│ │ │ ├─ Deal Value → **Typography, Badge**
│ │ │ ├─ Due Date → **Typography, Calendar Icon**
│ │ │ ├─ Priority Indicator → **Badge (variant based on priority)**
│ │ │ ├─ Progress Bar → **Progress**
│ │ │ ├─ Tags/Labels → **Badge (multiple)**
│ │ │ └─ Quick Action Buttons
│ │ │ ├─ Edit Button → **Button (variant="ghost"), Edit Icon**
│ │ │ ├─ Move Button → **Button (variant="ghost"), Move Icon**
│ │ │ └─ Delete Button → **Button (variant="ghost"), Trash Icon**
│ │ └─ Add New Deal Button (Column-specific) → **Button (variant="dashed")**
│ ├─ Column 7: Content Review → **Card, CardHeader, CardContent**
│ │ ├─ Column Header
│ │ │ ├─ Stage Title → **Typography (h3)**
│ │ │ ├─ Deal Count Badge → **Badge**
│ │ │ └─ Column Options Menu → **DropdownMenu, MoreHorizontal Icon**
│ │ ├─ Deal Cards Container → **ScrollArea, Flex Container**
│ │ │ └─ Individual Deal Cards → **Card, CardHeader, CardContent, CardFooter**
│ │ │ ├─ Deal Title → **Typography (h4)**
│ │ │ ├─ Brand Logo/Name → **Avatar, Typography**
│ │ │ ├─ Deal Value → **Typography, Badge**
│ │ │ ├─ Due Date → **Typography, Calendar Icon**
│ │ │ ├─ Priority Indicator → **Badge (variant based on priority)**
│ │ │ ├─ Progress Bar → **Progress**
│ │ │ ├─ Tags/Labels → **Badge (multiple)**
│ │ │ └─ Quick Action Buttons
│ │ │ ├─ Edit Button → **Button (variant="ghost"), Edit Icon**
│ │ │ ├─ Move Button → **Button (variant="ghost"), Move Icon**
│ │ │ └─ Delete Button → **Button (variant="ghost"), Trash Icon**
│ │ └─ Add New Deal Button (Column-specific) → **Button (variant="dashed")**
│ ├─ Column 8: Published → **Card, CardHeader, CardContent**
│ │ ├─ Column Header
│ │ │ ├─ Stage Title → **Typography (h3)**
│ │ │ ├─ Deal Count Badge → **Badge**
│ │ │ └─ Column Options Menu → **DropdownMenu, MoreHorizontal Icon**
│ │ ├─ Deal Cards Container → **ScrollArea, Flex Container**
│ │ │ └─ Individual Deal Cards → **Card, CardHeader, CardContent, CardFooter**
│ │ │ ├─ Deal Title → **Typography (h4)**
│ │ │ ├─ Brand Logo/Name → **Avatar, Typography**
│ │ │ ├─ Deal Value → **Typography, Badge**
│ │ │ ├─ Due Date → **Typography, Calendar Icon**
│ │ │ ├─ Priority Indicator → **Badge (variant based on priority)**
│ │ │ ├─ Progress Bar → **Progress**
│ │ │ ├─ Tags/Labels → **Badge (multiple)**
│ │ │ └─ Quick Action Buttons
│ │ │ ├─ Edit Button → **Button (variant="ghost"), Edit Icon**
│ │ │ ├─ Move Button → **Button (variant="ghost"), Move Icon**
│ │ │ └─ Delete Button → **Button (variant="ghost"), Trash Icon**
│ │ └─ Add New Deal Button (Column-specific) → **Button (variant="dashed")**
│ └─ Column 9: Completed → **Card, CardHeader, CardContent**
│ ├─ Column Header
│ │ ├─ Stage Title → **Typography (h3)**
│ │ ├─ Deal Count Badge → **Badge**
│ │ └─ Column Options Menu → **DropdownMenu, MoreHorizontal Icon**
│ ├─ Deal Cards Container → **ScrollArea, Flex Container**
│ │ └─ Individual Deal Cards → **Card, CardHeader, CardContent, CardFooter**
│ │ ├─ Deal Title → **Typography (h4)**
│ │ ├─ Brand Logo/Name → **Avatar, Typography**
│ │ ├─ Deal Value → **Typography, Badge**
│ │ ├─ Due Date → **Typography, Calendar Icon**
│ │ ├─ Priority Indicator → **Badge (variant based on priority)**
│ │ ├─ Progress Bar → **Progress**
│ │ ├─ Tags/Labels → **Badge (multiple)**
│ │ └─ Quick Action Buttons
│ │ ├─ Edit Button → **Button (variant="ghost"), Edit Icon**
│ │ ├─ Move Button → **Button (variant="ghost"), Move Icon**
│ │ └─ Delete Button → **Button (variant="ghost"), Trash Icon**
│ └─ Add New Deal Button (Column-specific) → **Button (variant="dashed")**
└─ Bottom Action Bar → **Card, CardContent, Flex Container**
├─ Bulk Actions Section
│ ├─ Select All Checkbox → **Checkbox, Label**
│ ├─ Bulk Move Button → **Button, DropdownMenu**
│ ├─ Bulk Delete Button → **Button, AlertDialog**
│ └─ Export Selected Button → **Button, Download Icon**
└─ View Options
├─ Board View Toggle → **ToggleGroup, ToggleGroupItem**
├─ List View Toggle → **ToggleGroup, ToggleGroupItem**
├─ Calendar View Toggle → **ToggleGroup, ToggleGroupItem**
└─ Zoom Controls → **Button, Slider**

## 4. "Add New Deal" Modal Structure Components

├─ Modal Overlay → **Dialog, DialogOverlay**
├─ Modal Container → **DialogContent**
│ ├─ Modal Header → **DialogHeader**
│ │ ├─ Modal Title ("Add New Sponsorship Deal") → **DialogTitle**
│ │ ├─ Close Button (X) → **DialogClose, X Icon**
│ │ └─ Progress Indicator (Step 1 of 3) → **Progress, Steps Component**
│ ├─ Modal Body → **DialogDescription, Form**
│ │ ├─ Step 1: Basic Information → **Card, CardContent**
│ │ │ ├─ Deal Name Field
│ │ │ │ ├─ Field Label → **Label**
│ │ │ │ ├─ Text Input → **Input**
│ │ │ │ └─ Validation Message → **Alert, AlertDescription**
│ │ │ ├─ Brand/Company Field
│ │ │ │ ├─ Field Label → **Label**
│ │ │ │ ├─ Dropdown/Autocomplete Input → **Combobox, Command, CommandInput**
│ │ │ │ └─ Add New Brand Button → **Button (variant="outline")**
│ │ │ ├─ Deal Value Field
│ │ │ │ ├─ Field Label → **Label**
│ │ │ │ ├─ Currency Selector → **Select, SelectContent, SelectItem**
│ │ │ │ ├─ Amount Input → **Input (type="number")**
│ │ │ │ └─ Validation Message → **Alert, AlertDescription**
│ │ │ ├─ Deal Type Field
│ │ │ │ ├─ Field Label → **Label**
│ │ │ │ └─ Radio Button Options → **RadioGroup, RadioGroupItem**
│ │ │ │ ├─ Sponsored Video → **RadioGroupItem, Label**
│ │ │ │ ├─ Product Review → **RadioGroupItem, Label**
│ │ │ │ ├─ Brand Integration → **RadioGroupItem, Label**
│ │ │ │ └─ Other (with text input) → **RadioGroupItem, Label, Input**
│ │ │ └─ Priority Level Field
│ │ │ ├─ Field Label → **Label**
│ │ │ └─ Dropdown Options → **Select, SelectContent, SelectItem**
│ │ │ ├─ Low → **SelectItem**
│ │ │ ├─ Medium → **SelectItem**
│ │ │ ├─ High → **SelectItem**
│ │ │ └─ Urgent → **SelectItem**
│ │ ├─ Step 2: Timeline & Deliverables → **Card, CardContent**
│ │ │ ├─ Start Date Field
│ │ │ │ ├─ Field Label → **Label**
│ │ │ │ ├─ Date Picker → **Popover, Calendar, Button**
│ │ │ │ └─ Validation Message → **Alert, AlertDescription**
│ │ │ ├─ Due Date Field
│ │ │ │ ├─ Field Label → **Label**
│ │ │ │ ├─ Date Picker → **Popover, Calendar, Button**
│ │ │ │ └─ Validation Message → **Alert, AlertDescription**
│ │ │ ├─ Content Requirements Field
│ │ │ │ ├─ Field Label → **Label**
│ │ │ │ ├─ Textarea Input → **Textarea**
│ │ │ │ └─ Character Counter → **Typography (small)**
│ │ │ ├─ Deliverables Checklist
│ │ │ │ ├─ Field Label → **Label**
│ │ │ │ └─ Checkbox Options → **Checkbox, Label (multiple)**
│ │ │ │ ├─ Video Content → **Checkbox, Label**
│ │ │ │ ├─ Social Media Posts → **Checkbox, Label**
│ │ │ │ ├─ Blog Post → **Checkbox, Label**
│ │ │ │ ├─ Email Newsletter → **Checkbox, Label**
│ │ │ │ └─ Custom (with text input) → **Checkbox, Label, Input**
│ │ │ └─ Estimated Hours Field
│ │ │ ├─ Field Label → **Label**
│ │ │ ├─ Number Input → **Input (type="number")**
│ │ │ └─ Unit Selector (hours/days) → **Select, SelectContent, SelectItem**
│ │ └─ Step 3: Contact & Notes → **Card, CardContent**
│ │ ├─ Primary Contact Field
│ │ │ ├─ Field Label → **Label**
│ │ │ ├─ Name Input → **Input**
│ │ │ ├─ Email Input → **Input (type="email")**
│ │ │ └─ Phone Input → **Input (type="tel")**
│ │ ├─ Secondary Contact Field
│ │ │ ├─ Field Label → **Label**
│ │ │ ├─ Name Input → **Input**
│ │ │ ├─ Email Input → **Input (type="email")**
│ │ │ └─ Phone Input → **Input (type="tel")**
│ │ ├─ Tags Field
│ │ │ ├─ Field Label → **Label**
│ │ │ ├─ Tag Input with Autocomplete → **Command, CommandInput, Badge**
│ │ │ └─ Selected Tags Display → **Badge (multiple), X Icon**
│ │ ├─ Notes Field
│ │ │ ├─ Field Label → **Label**
│ │ │ ├─ Rich Text Editor → **Textarea (or custom rich text component)**
│ │ │ └─ Character Counter → **Typography (small)**
│ │ └─ File Attachments
│ │ ├─ Field Label → **Label**
│ │ ├─ Drag & Drop Zone → **Card (dashed border), Upload Icon**
│ │ ├─ Browse Files Button → **Button (variant="outline")**
│ │ └─ Attached Files List → **Card, File Icon, Typography**
│ └─ Modal Footer → **DialogFooter, Flex Container**
│ ├─ Left Section
│ │ └─ Save as Draft Button → **Button (variant="outline")**
│ ├─ Center Section
│ │ ├─ Previous Step Button → **Button (variant="outline"), ChevronLeft Icon**
│ │ └─ Next Step Button → **Button, ChevronRight Icon**
│ └─ Right Section
│ ├─ Cancel Button → **Button (variant="ghost")**
│ └─ Create Deal Button → **Button**
└─ Form Validation Messages
├─ Required Field Indicators → **Typography (small, red)**
├─ Error Message Display → **Alert (variant="destructive"), AlertDescription**
└─ Success Confirmation Message → **Alert (variant="default"), AlertDescription, CheckCircle Icon**

## Additional shadcn/ui Components Needed

├─ **Icons** (from lucide-react)
│ ├─ Search, Bell, User, Settings, LogOut
│ ├─ Edit, Move, Trash, Plus, MoreHorizontal
│ ├─ Calendar, Upload, File, X, ChevronLeft, ChevronRight
│ ├─ CheckCircle, AlertCircle, Eye, EyeOff
│ └─ Download, Filter, Grid, List
├─ **Layout Components**
│ ├─ Container, Flex, Grid
│ └─ Spacer, Divider
└─ **Utility Components**
├─ Tooltip, HoverCard
├─ Skeleton (for loading states)
└─ Toast (for notifications)

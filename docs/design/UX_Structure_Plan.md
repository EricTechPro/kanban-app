# YouTube Sponsorship Workflow - UX Structure Plan

## 1. Navigation Flow

├─ Landing/Login Page
│ ├─ Authentication Process
│ │ ├─ Email/Password Login
│ │ ├─ Social Login Options
│ │ └─ Password Recovery Flow
│ └─ Redirect to Dashboard
├─ Main Dashboard (Kanban Board)
│ ├─ Deal Management Actions
│ │ ├─ Create New Deal
│ │ ├─ Edit Existing Deal
│ │ ├─ Move Deal Between Stages
│ │ └─ Delete Deal
│ ├─ Filtering and Search
│ │ ├─ Filter by Status
│ │ ├─ Filter by Brand
│ │ ├─ Filter by Date Range
│ │ └─ Search by Deal Name
│ └─ User Account Management
│ ├─ Profile Settings
│ ├─ Notification Preferences
│ └─ Logout Function

## 2. Login Page Structure

├─ Header Section
│ ├─ Application Logo
│ ├─ Application Title
│ └─ Tagline/Description
├─ Main Login Form Container
│ ├─ Welcome Message
│ ├─ Email Input Field
│ │ ├─ Email Label
│ │ ├─ Email Input Box
│ │ └─ Email Validation Message
│ ├─ Password Input Field
│ │ ├─ Password Label
│ │ ├─ Password Input Box
│ │ ├─ Show/Hide Password Toggle
│ │ └─ Password Validation Message
│ ├─ Remember Me Checkbox
│ ├─ Sign In Button
│ └─ Forgot Password Link
├─ Alternative Login Options
│ ├─ Divider Line with "OR" Text
│ ├─ Google Sign In Button
│ ├─ YouTube Account Sign In Button
│ └─ GitHub Sign In Button
├─ Registration Section
│ ├─ "Don't have an account?" Text
│ └─ Sign Up Link
└─ Footer Section
├─ Terms of Service Link
├─ Privacy Policy Link
└─ Contact Support Link

## 3. Dashboard Page Structure

├─ Top Navigation Bar
│ ├─ Left Section
│ │ ├─ Application Logo
│ │ ├─ Dashboard Title
│ │ └─ Breadcrumb Navigation
│ ├─ Center Section
│ │ ├─ Global Search Bar
│ │ │ ├─ Search Input Field
│ │ │ ├─ Search Icon
│ │ │ └─ Search Suggestions Dropdown
│ │ └─ Filter Controls
│ │ ├─ Status Filter Dropdown
│ │ ├─ Brand Filter Dropdown
│ │ ├─ Date Range Picker
│ │ └─ Clear Filters Button
│ └─ Right Section
│ ├─ Add New Deal Button
│ ├─ Notification Bell Icon
│ │ └─ Notification Dropdown
│ └─ User Profile Menu
│ ├─ Profile Picture
│ ├─ Username Display
│ └─ Dropdown Menu
│ ├─ Profile Settings
│ ├─ Account Settings
│ ├─ Help & Support
│ └─ Logout Option
├─ Dashboard Statistics Bar
│ ├─ Total Deals Counter
│ ├─ Active Deals Counter
│ ├─ Completed Deals Counter
│ ├─ Total Revenue Display
│ └─ This Month Revenue Display
├─ Kanban Board Container
│ ├─ Column 1: Prospecting
│ │ ├─ Column Header
│ │ │ ├─ Stage Title
│ │ │ ├─ Deal Count Badge
│ │ │ └─ Column Options Menu
│ │ ├─ Deal Cards Container
│ │ │ └─ Individual Deal Cards
│ │ │ ├─ Deal Title
│ │ │ ├─ Brand Logo/Name
│ │ │ ├─ Deal Value
│ │ │ ├─ Due Date
│ │ │ ├─ Priority Indicator
│ │ │ ├─ Progress Bar
│ │ │ ├─ Tags/Labels
│ │ │ └─ Quick Action Buttons
│ │ │ ├─ Edit Button
│ │ │ ├─ Move Button
│ │ │ └─ Delete Button
│ │ └─ Add New Deal Button (Column-specific)
│ ├─ Column 2: Initial Contact
│ │ ├─ Column Header
│ │ │ ├─ Stage Title
│ │ │ ├─ Deal Count Badge
│ │ │ └─ Column Options Menu
│ │ ├─ Deal Cards Container
│ │ │ └─ Individual Deal Cards
│ │ │ ├─ Deal Title
│ │ │ ├─ Brand Logo/Name
│ │ │ ├─ Deal Value
│ │ │ ├─ Due Date
│ │ │ ├─ Priority Indicator
│ │ │ ├─ Progress Bar
│ │ │ ├─ Tags/Labels
│ │ │ └─ Quick Action Buttons
│ │ │ ├─ Edit Button
│ │ │ ├─ Move Button
│ │ │ └─ Delete Button
│ │ └─ Add New Deal Button (Column-specific)
│ ├─ Column 3: Negotiation
│ │ ├─ Column Header
│ │ │ ├─ Stage Title
│ │ │ ├─ Deal Count Badge
│ │ │ └─ Column Options Menu
│ │ ├─ Deal Cards Container
│ │ │ └─ Individual Deal Cards
│ │ │ ├─ Deal Title
│ │ │ ├─ Brand Logo/Name
│ │ │ ├─ Deal Value
│ │ │ ├─ Due Date
│ │ │ ├─ Priority Indicator
│ │ │ ├─ Progress Bar
│ │ │ ├─ Tags/Labels
│ │ │ └─ Quick Action Buttons
│ │ │ ├─ Edit Button
│ │ │ ├─ Move Button
│ │ │ └─ Delete Button
│ │ └─ Add New Deal Button (Column-specific)
│ ├─ Column 4: Contract Sent
│ │ ├─ Column Header
│ │ │ ├─ Stage Title
│ │ │ ├─ Deal Count Badge
│ │ │ └─ Column Options Menu
│ │ ├─ Deal Cards Container
│ │ │ └─ Individual Deal Cards
│ │ │ ├─ Deal Title
│ │ │ ├─ Brand Logo/Name
│ │ │ ├─ Deal Value
│ │ │ ├─ Due Date
│ │ │ ├─ Priority Indicator
│ │ │ ├─ Progress Bar
│ │ │ ├─ Tags/Labels
│ │ │ └─ Quick Action Buttons
│ │ │ ├─ Edit Button
│ │ │ ├─ Move Button
│ │ │ └─ Delete Button
│ │ └─ Add New Deal Button (Column-specific)
│ ├─ Column 5: Contract Signed
│ │ ├─ Column Header
│ │ │ ├─ Stage Title
│ │ │ ├─ Deal Count Badge
│ │ │ └─ Column Options Menu
│ │ ├─ Deal Cards Container
│ │ │ └─ Individual Deal Cards
│ │ │ ├─ Deal Title
│ │ │ ├─ Brand Logo/Name
│ │ │ ├─ Deal Value
│ │ │ ├─ Due Date
│ │ │ ├─ Priority Indicator
│ │ │ ├─ Progress Bar
│ │ │ ├─ Tags/Labels
│ │ │ └─ Quick Action Buttons
│ │ │ ├─ Edit Button
│ │ │ ├─ Move Button
│ │ │ └─ Delete Button
│ │ └─ Add New Deal Button (Column-specific)
│ ├─ Column 6: Content Creation
│ │ ├─ Column Header
│ │ │ ├─ Stage Title
│ │ │ ├─ Deal Count Badge
│ │ │ └─ Column Options Menu
│ │ ├─ Deal Cards Container
│ │ │ └─ Individual Deal Cards
│ │ │ ├─ Deal Title
│ │ │ ├─ Brand Logo/Name
│ │ │ ├─ Deal Value
│ │ │ ├─ Due Date
│ │ │ ├─ Priority Indicator
│ │ │ ├─ Progress Bar
│ │ │ ├─ Tags/Labels
│ │ │ └─ Quick Action Buttons
│ │ │ ├─ Edit Button
│ │ │ ├─ Move Button
│ │ │ └─ Delete Button
│ │ └─ Add New Deal Button (Column-specific)
│ ├─ Column 7: Content Review
│ │ ├─ Column Header
│ │ │ ├─ Stage Title
│ │ │ ├─ Deal Count Badge
│ │ │ └─ Column Options Menu
│ │ ├─ Deal Cards Container
│ │ │ └─ Individual Deal Cards
│ │ │ ├─ Deal Title
│ │ │ ├─ Brand Logo/Name
│ │ │ ├─ Deal Value
│ │ │ ├─ Due Date
│ │ │ ├─ Priority Indicator
│ │ │ ├─ Progress Bar
│ │ │ ├─ Tags/Labels
│ │ │ └─ Quick Action Buttons
│ │ │ ├─ Edit Button
│ │ │ ├─ Move Button
│ │ │ └─ Delete Button
│ │ └─ Add New Deal Button (Column-specific)
│ ├─ Column 8: Published
│ │ ├─ Column Header
│ │ │ ├─ Stage Title
│ │ │ ├─ Deal Count Badge
│ │ │ └─ Column Options Menu
│ │ ├─ Deal Cards Container
│ │ │ └─ Individual Deal Cards
│ │ │ ├─ Deal Title
│ │ │ ├─ Brand Logo/Name
│ │ │ ├─ Deal Value
│ │ │ ├─ Due Date
│ │ │ ├─ Priority Indicator
│ │ │ ├─ Progress Bar
│ │ │ ├─ Tags/Labels
│ │ │ └─ Quick Action Buttons
│ │ │ ├─ Edit Button
│ │ │ ├─ Move Button
│ │ │ └─ Delete Button
│ │ └─ Add New Deal Button (Column-specific)
│ └─ Column 9: Completed
│ ├─ Column Header
│ │ ├─ Stage Title
│ │ ├─ Deal Count Badge
│ │ └─ Column Options Menu
│ ├─ Deal Cards Container
│ │ └─ Individual Deal Cards
│ │ ├─ Deal Title
│ │ ├─ Brand Logo/Name
│ │ ├─ Deal Value
│ │ ├─ Due Date
│ │ ├─ Priority Indicator
│ │ ├─ Progress Bar
│ │ ├─ Tags/Labels
│ │ └─ Quick Action Buttons
│ │ ├─ Edit Button
│ │ ├─ Move Button
│ │ └─ Delete Button
│ └─ Add New Deal Button (Column-specific)
└─ Bottom Action Bar
├─ Bulk Actions Section
│ ├─ Select All Checkbox
│ ├─ Bulk Move Button
│ ├─ Bulk Delete Button
│ └─ Export Selected Button
└─ View Options
├─ Board View Toggle
├─ List View Toggle
├─ Calendar View Toggle
└─ Zoom Controls

## 4. "Add New Deal" Modal Structure

├─ Modal Overlay
├─ Modal Container
│ ├─ Modal Header
│ │ ├─ Modal Title ("Add New Sponsorship Deal")
│ │ ├─ Close Button (X)
│ │ └─ Progress Indicator (Step 1 of 3)
│ ├─ Modal Body
│ │ ├─ Step 1: Basic Information
│ │ │ ├─ Deal Name Field
│ │ │ │ ├─ Field Label
│ │ │ │ ├─ Text Input
│ │ │ │ └─ Validation Message
│ │ │ ├─ Brand/Company Field
│ │ │ │ ├─ Field Label
│ │ │ │ ├─ Dropdown/Autocomplete Input
│ │ │ │ └─ Add New Brand Button
│ │ │ ├─ Deal Value Field
│ │ │ │ ├─ Field Label
│ │ │ │ ├─ Currency Selector
│ │ │ │ ├─ Amount Input
│ │ │ │ └─ Validation Message
│ │ │ ├─ Deal Type Field
│ │ │ │ ├─ Field Label
│ │ │ │ └─ Radio Button Options
│ │ │ │ ├─ Sponsored Video
│ │ │ │ ├─ Product Review
│ │ │ │ ├─ Brand Integration
│ │ │ │ └─ Other (with text input)
│ │ │ └─ Priority Level Field
│ │ │ ├─ Field Label
│ │ │ └─ Dropdown Options
│ │ │ ├─ Low
│ │ │ ├─ Medium
│ │ │ ├─ High
│ │ │ └─ Urgent
│ │ ├─ Step 2: Timeline & Deliverables
│ │ │ ├─ Start Date Field
│ │ │ │ ├─ Field Label
│ │ │ │ ├─ Date Picker
│ │ │ │ └─ Validation Message
│ │ │ ├─ Due Date Field
│ │ │ │ ├─ Field Label
│ │ │ │ ├─ Date Picker
│ │ │ │ └─ Validation Message
│ │ │ ├─ Content Requirements Field
│ │ │ │ ├─ Field Label
│ │ │ │ ├─ Textarea Input
│ │ │ │ └─ Character Counter
│ │ │ ├─ Deliverables Checklist
│ │ │ │ ├─ Field Label
│ │ │ │ └─ Checkbox Options
│ │ │ │ ├─ Video Content
│ │ │ │ ├─ Social Media Posts
│ │ │ │ ├─ Blog Post
│ │ │ │ ├─ Email Newsletter
│ │ │ │ └─ Custom (with text input)
│ │ │ └─ Estimated Hours Field
│ │ │ ├─ Field Label
│ │ │ ├─ Number Input
│ │ │ └─ Unit Selector (hours/days)
│ │ └─ Step 3: Contact & Notes
│ │ ├─ Primary Contact Field
│ │ │ ├─ Field Label
│ │ │ ├─ Name Input
│ │ │ ├─ Email Input
│ │ │ └─ Phone Input
│ │ ├─ Secondary Contact Field
│ │ │ ├─ Field Label
│ │ │ ├─ Name Input
│ │ │ ├─ Email Input
│ │ │ └─ Phone Input
│ │ ├─ Tags Field
│ │ │ ├─ Field Label
│ │ │ ├─ Tag Input with Autocomplete
│ │ │ └─ Selected Tags Display
│ │ ├─ Notes Field
│ │ │ ├─ Field Label
│ │ │ ├─ Rich Text Editor
│ │ │ └─ Character Counter
│ │ └─ File Attachments
│ │ ├─ Field Label
│ │ ├─ Drag & Drop Zone
│ │ ├─ Browse Files Button
│ │ └─ Attached Files List
│ └─ Modal Footer
│ ├─ Left Section
│ │ └─ Save as Draft Button
│ ├─ Center Section
│ │ ├─ Previous Step Button
│ │ └─ Next Step Button
│ └─ Right Section
│ ├─ Cancel Button
│ └─ Create Deal Button
└─ Form Validation Messages
├─ Required Field Indicators
├─ Error Message Display
└─ Success Confirmation Message

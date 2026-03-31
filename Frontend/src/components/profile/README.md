# DriveEase ERP Profile Page - Component Structure

## 📁 Project Structure

```
outputs/
├── DriveEaseProfile.jsx          # Main page component (entry point)
└── components/
    ├── PageHeader.jsx            # Top navigation bar
    ├── ProfileHeader.jsx         # User profile section with avatar
    ├── TabNavigation.jsx         # Tab switcher component
    ├── PersonalDetailsSection.jsx # Personal info form
    ├── DrivingLicenseSection.jsx  # License information form
    ├── SecurityPasswordSection.jsx # Password and security settings
    └── ActionButtons.jsx         # Save/Cancel action buttons
```

## 📝 Component Documentation

### 1. **PageHeader.jsx**
Main navigation header with logo, menu items, and user profile.
- Navigation links: Dashboard, Vehicles, Bookings
- User profile dropdown with avatar
- Notification bell icon

### 2. **ProfileHeader.jsx**
User profile section displayed at the top of the page.
- User avatar with verification badge
- User name and verification status
- Member since date and completed trips count
- "View Public Profile" button

### 3. **TabNavigation.jsx**
Tab switcher for different profile sections.
- 3 tabs: Personal Info, Driving License, Preferences
- Active tab highlighting
- Smooth transition between tabs

### 4. **PersonalDetailsSection.jsx**
Form for editing personal information.
- First Name input
- Last Name input
- Email Address input
- Phone Number input (with country code prefix)

### 5. **DrivingLicenseSection.jsx**
Driving license information and document upload.
- License Number input
- Expiry Date input
- License document preview (front and back)
- Upload functionality for back of license

### 6. **SecurityPasswordSection.jsx**
Password and security settings.
- Current Password input
- New Password input with strength indicator
- Real-time password validation
- Security tips tooltip with checklist

### 7. **ActionButtons.jsx**
Action buttons at the bottom of the form.
- Cancel button (secondary)
- Save All Changes button (primary)
- Warning message about unsaved changes

### 8. **DriveEaseProfile.jsx**
Main page component that orchestrates all sub-components.
- State management for form data and active tab
- Handles save and cancel actions
- Conditionally renders sections based on active tab
- Integrates all child components

## 🚀 Usage

Import the main component in your app:

```jsx
import DriveEaseProfile from './DriveEaseProfile';

export default function App() {
  return <DriveEaseProfile />;
}
```

## 🎨 Features

✅ Modular component architecture  
✅ Tailwind CSS styling  
✅ Real-time form validation  
✅ Password strength indicator  
✅ Interactive security tips  
✅ Tab-based navigation  
✅ Responsive design  
✅ Lucide React icons  
✅ Hover effects and transitions  

## 📦 Dependencies

- React 16.8+ (for Hooks)
- Tailwind CSS
- Lucide React (for icons)

## 🔧 Customization

Each component is self-contained and can be easily customized:

1. **Colors**: Update Tailwind classes (e.g., `bg-blue-600` → `bg-green-600`)
2. **Icons**: Replace icons from Lucide React
3. **Labels**: Modify text directly in components
4. **Layout**: Adjust grid classes for responsive behavior
5. **Validation**: Add custom validation logic to form sections

## 💡 Props

Each component accepts specific props:

- **ProfileHeader**: `user` object with name, avatar, memberSince, completedTrips
- **TabNavigation**: `activeTab`, `setActiveTab`
- **Form Sections**: `formData`, `setFormData`
- **ActionButtons**: `onSave`, `onCancel` callbacks

## 🎯 Best Practices

- Each component is single-responsibility
- Components are easily testable and reusable
- State is managed at the page level
- Consistent styling using Tailwind CSS
- Accessible form inputs with proper labels

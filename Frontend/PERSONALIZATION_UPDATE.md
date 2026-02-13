# Voice Agent Personalization Update

## ✅ Changes Implemented

### 1. **Updated Consent Dialog** (`VapiVoiceInterface.tsx`)
Added two new input fields to collect participant names:
- **Employee Name** (required field with red asterisk)
- **Manager Name** (required field with red asterisk)

**Location:** The name fields appear in the consent dialog, right after the "Purpose of This Session" section and before the consent checkboxes.

**Validation:** 
- Both fields are required
- The "Start Session" button is disabled until:
  - Both names are entered
  - Both consent checkboxes are checked
- Button text changes from "Complete All Fields to Continue" to "Start Session" when all requirements are met

### 2. **Updated State Management**
Added new state variables:
```typescript
const [employeeName, setEmployeeName] = useState('');
const [managerName, setManagerName] = useState('');
```

These are properly reset when:
- User cancels the dialog
- Session ends (after thank you screen)

### 3. **Updated Call Initialization** (`useVapi.ts`)
Modified the `startCall` function to:
- Accept optional `employeeName` and `managerName` parameters
- Send participant names to Vapi after the call starts
- Use a system message to inform Tara about the participants

**How it works:**
```typescript
// When call starts, we send this to Vapi:
{
  type: 'add-message',
  message: {
    role: 'system',
    content: `The employee's name is ${employeeName} and the manager's name is ${managerName}. Please greet them by name when you start the conversation.`
  }
}
```

### 4. **Personalized Greeting**
Tara will now:
1. Receive the participant names when the call starts
2. Use those names in the initial greeting
3. Address participants by name throughout the conversation

Example greeting:
> "Hello [Employee Name] and [Manager Name], welcome to your performance review session with TalentSpotify. I'm Tara, your HR assistant..."

## 🎯 User Flow

1. User clicks "Connect with Tara"
2. Consent dialog appears with:
   - Purpose explanation
   - **Employee Name input field** ⭐ NEW
   - **Manager Name input field** ⭐ NEW
   - Manager consent checkbox
   - Employee consent checkbox
3. User must:
   - Enter both names
   - Check both consent boxes
4. "Start Session" button becomes enabled
5. Call starts and names are sent to Vapi
6. Tara greets participants by name

## 📋 Form Validation

The form validates:
- ✅ Employee name is not empty
- ✅ Manager name is not empty
- ✅ Manager consent is checked
- ✅ Employee consent is checked

Error messages:
- "Names Required" - if user tries to submit without entering names
- "Consent Required" - if user tries to submit without both consents

## 🔧 Technical Details

### Files Modified:
1. **`src/components/VapiVoiceInterface.tsx`**
   - Added name input fields
   - Updated validation logic
   - Pass names to `startCall()`

2. **`src/hooks/useVapi.ts`**
   - Updated `startCall()` signature to accept names
   - Send names to Vapi via system message
   - Added logging for debugging

### Console Logs:
When starting a call, you'll see:
```
🚀 Starting Vapi call with assistant ID: b971ee04...
👥 Sending participant names to Vapi: { employeeName: "John Doe", managerName: "Jane Smith" }
```

## 🎨 UI Preview

The consent dialog now includes:
1. **Purpose section** (existing)
2. **Name input fields** (NEW) - with required asterisks
3. **Consent checkboxes** (existing)
4. **Action buttons** (updated validation)

All fields use consistent styling with the rest of the application.

## 🚀 Testing

To test the new feature:
1. Start the dev server: `npm run dev`
2. Click "Connect with Tara"
3. Try submitting without names - should show error
4. Enter names and check consents
5. Start session - check console for name logs
6. Listen to Tara's greeting - should include names

## 📝 Notes

- Names are sent as a system message 1 second after call starts (to ensure connection is established)
- Names are stored in component state only (not persisted)
- Names are cleared when session ends or dialog is cancelled
- The Vapi assistant's system prompt should handle the personalized greeting based on the names provided

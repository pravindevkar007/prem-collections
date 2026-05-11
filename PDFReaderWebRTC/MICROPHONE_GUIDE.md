# Microphone Permissions Guide

## 🎤 Enabling Voice Features

The PDFReaderWebRTC application uses your browser's microphone for voice recognition. Here's how to enable it:

### Chrome/Edge Instructions

1. **When prompted**: Click "Allow" when the browser asks for microphone access
2. **If blocked**: Look for a microphone icon in the address bar (🎤 or 🚫)
3. **Click the icon** and select "Always allow on this site"
4. **Refresh the page** after changing permissions

### Manual Permission Setup

1. **Chrome**: 
   - Go to Settings → Privacy and Security → Site Settings → Microphone
   - Add your site (localhost:3000) to "Allowed" list

2. **Edge**:
   - Go to Settings → Site permissions → Microphone
   - Add your site to allowed list

### Firefox Instructions

1. Click the shield icon in the address bar
2. Turn off "Enhanced Tracking Protection" for this site
3. Refresh and allow microphone access when prompted

### Troubleshooting

**"Microphone access denied" error:**
- Check if another application is using your microphone
- Restart your browser
- Check system microphone permissions (Windows Settings → Privacy → Microphone)

**"No microphone found" error:**
- Ensure your microphone is connected and working
- Check Windows Sound settings
- Try a different microphone or headset

**Voice recognition not working:**
- Use Chrome or Edge for best compatibility
- Speak clearly and close to the microphone
- Ensure stable internet connection

### Browser Compatibility

| Browser | Voice Recognition | Recommended |
|---------|------------------|-------------|
| Chrome  | ✅ Full Support  | ⭐ Best     |
| Edge    | ✅ Full Support  | ⭐ Best     |
| Firefox | ⚠️ Limited       | ⚠️ Partial  |
| Safari  | ⚠️ Limited       | ⚠️ Partial  |

### Privacy Note

- Voice data is processed by your browser's built-in speech recognition
- No audio is stored or transmitted to external servers
- You can revoke microphone permissions at any time
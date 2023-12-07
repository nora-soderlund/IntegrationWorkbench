# Changelog
## 0.9.12
 - Added drag-and-drop functionality to requests across collections and requests

## 0.9.8
 - Optimization throughout all scripts, declarations, user inputs, etc.
 - Added "Duplicate request" command to context menu
 - Fix synchronization issue with responses
 - Added EventBridge requests and responses
 - Added user integrations and AWS credentials to environments (saved locally for the user only, opt-in)
 - Added file system watcher for workbenches to support source control
 - Added the HTTP and EventBridge request data to the responses
 - Fixed issue when writing too fast (saves are now down every unchanged 3000ms by default)

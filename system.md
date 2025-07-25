### **System Specification: Speech-to-Text Application in React**

### 1. **Purpose**
The application will provide a tool that converts speech to text in real-time. It will support multiple languages, allow users to edit the converted text with a rich text editor, and enable them to save the document as a text file.

---

### 2. **Key Features**

#### A. **Speech-to-Text Conversion**
- The system will use the **Web Speech API** (specifically **SpeechRecognition**) to convert speech to text in real-time.
- Support for multiple languages (Hebrew and English) that can be selected by the user.
- Real-time conversion with the ability to pause and resume transcription.
- The system will display the converted text clearly in the user interface.

#### B. **Rich Text Editor**
- The system will include a **rich text editor** that allows users to edit the converted text. The editor will support:
  - Basic text formatting such as **bold**, **italic**, **underline**, **font size**, and **font type**.
  - Options to create **headings**, **bulleted lists**, **numbered lists**, and **paragraphs**.
  - The ability to insert **hyperlinks**, **blockquotes**, and apply other basic formatting.
  
  The editor will be intuitive and allow users to freely edit the speech-to-text content.

  **Note**: The editor will use **Tiptap**, a highly flexible and extensible rich text editor suitable for modern React applications.

#### C. **Start/Stop Speech Recognition**
- A **Start/Stop button** will control the speech recognition process, allowing the user to start or stop speech-to-text conversion.
- The button will visually indicate the current status (e.g., change color when listening, e.g., from gray to red when active).

#### D. **Language Selection**
- Users will be able to choose the language for speech recognition (Hebrew or English).
- The selected language will be used to configure the SpeechRecognition settings.

#### E. **Save and Export**
- Users will be able to **save the converted text as a .txt file**.
- A **Save Text File** button will allow users to download the file with the converted and edited text.
- Optionally, there could be an automatic save feature (such as saving locally or backing up the file in the cloud), but this is not a primary requirement.

---

### 3. **Technologies**

#### A. **Vite**
- **Vite** will be used as the **modern build tool** and **development server**.
- It will ensure fast builds and instant hot reloading during development.

#### B. **React**
- **React** will be used for building the user interface and handling state management.
- React's modularity will ensure that the components are maintainable and extendable (e.g., a separate component for the text editor, one for speech recognition, etc.).

#### C. **TypeScript**
- **TypeScript** will provide static typing for variables and functions, helping to catch potential errors early during development.
- It will be especially helpful for managing the speech-to-text conversion data and ensuring the correct handling of user input.

#### D. **SpeechRecognition (Web Speech API)**
- The system will leverage the **SpeechRecognition** feature of the **Web Speech API** to convert speech to text in real-time.
- Supported languages will include **Hebrew** (he-IL) and **English** (en-US), based on user selection.

#### E. **Rich Text Editor (Tiptap)**
- **Tiptap** will be used as the rich text editor.
- Tiptap offers a highly customizable and extensible editor that integrates seamlessly with React. It provides features such as:
  - Basic text formatting (bold, italic, underline, etc.).
  - Support for complex rich text features like lists, links, and tables.
  - Extensible through plugins, allowing for custom integrations as needed.

---

### 4. **UI Design**

#### A. **Start/Stop Button**
- **Location**: Positioned at the top of the screen or centrally on the page.
- **Function**: The button will allow the user to start or stop the speech-to-text process.
- **Visual Feedback**: The button will change visually when the system is actively listening (e.g., changing from gray to red).
- **Status Indication**: A clear status indicator will be shown to let the user know whether speech recognition is active or inactive.

#### B. **Language Selection Dropdown**
- **Location**: Near the Start/Stop button.
- **Function**: A dropdown menu will allow the user to select the language for speech recognition.
- **Design**: A simple and clear dropdown menu with language options (Hebrew, English).

#### C. **Rich Text Editor (Tiptap)**
- **Location**: Below the Start/Stop button, occupying the main area of the page.
- **Functions**: The editor will include tools for text formatting (font type, font size, bold, italics, underline, etc.), paragraph creation, and adding lists or links.
- **Design**: The editor will be clean and intuitive. A toolbar will be provided for easy access to formatting options.

#### D. **Save and Export Button**
- **Location**: Near the bottom of the page or beneath the editor.
- **Function**: The button will allow users to save the current text as a .txt file.
- **Visual Feedback**: When clicked, the user will be able to download the text file to their computer. A success message or notification can be shown once the download starts.

---

### 5. **Optional Features (Future Enhancements)**

#### A. **Speech History**
- The system could include a feature to **display a history of transcriptions**, allowing users to view and edit previously transcribed text. Each transcription could be time-stamped, and the user could delete or modify old transcriptions.

#### B. **Cloud Integration**
- Future versions of the app could include **cloud integration** to automatically save documents to cloud services like Google Drive or Dropbox, making it easier for users to access their documents across different devices.

#### C. **Multi-Language Support**
- Additional languages could be added to the SpeechRecognition settings, expanding the app's usefulness to a global audience. This would require adding support for languages such as Spanish, French, German, etc.

---

### 6. **Accessibility Considerations**
- The interface will be designed with **accessibility** in mind to ensure that users with disabilities can use the application.
  - For example, the app will support **screen readers** to read the converted text for users with visual impairments.
  - High-contrast color schemes and large, easy-to-read fonts will be used to improve usability.
  - The app may include **Text-to-Speech** functionality to read out the transcribed text.

---

### 7. **Summary**
The system will offer an intuitive and straightforward way for users to convert speech to text in real-time. It will allow them to edit the transcribed text using a **Tiptap** rich text editor, and save or export the document as a text file. The system will be built using modern technologies such as **Vite**, **React**, **TypeScript**, and **Web Speech API**, with a clean, user-friendly UI. Optional future features include cloud integration and additional language support.

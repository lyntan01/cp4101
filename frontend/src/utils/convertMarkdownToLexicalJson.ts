import { createHeadlessEditor } from "@lexical/headless";
import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import PlaygroundNodes from "../rich-text-editor/nodes/PlaygroundNodes";

type LexicalNode = {
  type: string;
  children?: LexicalNode[];
  text?: string;
  [key: string]: any;
};

export async function convertMarkdownToLexicalJson(
  markdownString: string
): Promise<string> {
  const editor = createHeadlessEditor({
    nodes: PlaygroundNodes,
    onError: (error: Error) => {
      console.error("Lexical editor error:", error);
    },
  });

  // Convert the Markdown string to Lexical editor state
  await editor.update(() => {
    $convertFromMarkdownString(markdownString, TRANSFORMERS);
  });

  const editorStateJsonString = JSON.stringify(
    editor.getEditorState().toJSON()
  );

  return transformLexicalEditorState(editorStateJsonString);
}

/**
 * Helper function
 * Converts paragraphs with "---" into horizontal rule nodes.
 * Inserts an empty paragraph node before and after each heading node, except if it is the first node in the document.
 * Inserts an empty paragraph node before each horizontal rule, except if it is the first node in the document.
 * Recursively applies these transformations to all children nodes.
 */
function transformLexicalEditorState(editorStateJson: string): string {
  const editorState = JSON.parse(editorStateJson);

  const transformNodes = (nodes: any[]): any[] => {
    let transformedNodes: any[] = [];
    nodes.forEach((node, index) => {
      if (
        node.type === "paragraph" &&
        node.children?.length === 1 &&
        node.children[0].text === "---"
      ) {
        // Add an empty paragraph (line) before horizontal rule, if it's not the first node
        if (index !== 0) {
          transformedNodes.push({
            children: [],
            type: "paragraph",
            version: 1,
          });
        }
        // Convert paragraph with "---" to horizontal rule
        transformedNodes.push({ type: "horizontalrule", version: 1 });
      } else if (node.type.startsWith("heading")) {
        // Add an empty paragraph (line) before headings
        transformedNodes.push({ children: [], type: "paragraph", version: 1 });
        transformedNodes.push(node);
        // Add an empty paragraph (line) after headings
        transformedNodes.push({ children: [], type: "paragraph", version: 1 });
      } else {
        transformedNodes.push(node);
      }

      // Recursively transform children nodes, if they exist
      if (node.children && node.children.length > 0) {
        node.children = transformNodes(node.children);
      }
    });
    return transformedNodes;
  };

  // Apply transformations
  if (editorState.root && editorState.root.children) {
    editorState.root.children = transformNodes(editorState.root.children);
  }

  return JSON.stringify(editorState);
}

// TO DELETE FROM HERE ON
export async function testConvertMarkdownToLexicalJson() {
  const lexicalJson = await convertMarkdownToLexicalJson(lessonPageMarkdown);
  return transformLexicalEditorState(lexicalJson);
}

const lessonPageMarkdown: string = `
# Lesson: Introduction to Flutter

## Learning Outcomes:

By the end of this lesson, you should be able to:

1. Understand the history and significance of Flutter in mobile app development.
2. Identify the key features of the Flutter framework.
3. Set up a development environment for Flutter.

---

## Understanding Flutter

### History and Significance

Flutter is an open-source UI software development kit created by Google. It was first introduced in May 2017 at the Google I/O conference and has since gained significant traction in the mobile app development community.

Flutter is renowned for its ability to develop high-performance, cross-platform applications with a single codebase. It uses the Dart programming language, also developed by Google, which offers features like hot reload, enabling developers to quickly see the effects of their code changes.

### Key Features

- **Hot Reload:** Allows developers to instantly see the changes they make to the code reflected in the app, speeding up the development process.
  
- **Widgets:** Flutter utilizes a rich set of customizable widgets to build beautiful and interactive user interfaces.
  
- **Cross-Platform Development:** Flutter enables developers to write code once and deploy it on both Android and iOS platforms, reducing development time and costs.
  
- **High Performance:** Flutter's architecture is designed for high performance, resulting in smooth animations and fast rendering.
  
- **Access to Native Features:** Flutter provides plugins to access native features, allowing developers to integrate platform-specific functionality seamlessly.

---

## Setting Up Flutter Development Environment

### Step 1: Install Flutter SDK

1. Download the Flutter SDK from the official website: [Flutter SDK](https://flutter.dev/docs/get-started/install)
2. Extract the downloaded file to a location on your computer.
3. Add the Flutter \`bin\` directory to your system PATH variable.

### Step 2: Verify Installation

Open a terminal or command prompt and run the following command to verify that Flutter is correctly installed:

\`\`\`bash
flutter --version
\`\`\`

You should see output similar to the following:

\`\`\`
Flutter 2.10.0 • channel stable • https://github.com/flutter/flutter.git
Framework • revision abcdef1234 (x days ago) • 2024-01-01 00:00:00 -0800
Engine • revision 0123456789
Tools • Dart 2.16.0
\`\`\`

### Step 3: Set Up an Editor

Choose an editor for Flutter development. Popular choices include Visual Studio Code, Android Studio, and IntelliJ IDEA. Install the Flutter and Dart plugins for your chosen editor.

### Step 4: Run \`flutter doctor\`

Run the following command in your terminal to check if there are any dependencies you need to install to complete the setup:

\`\`\`bash
flutter doctor
\`\`\`

Follow any additional instructions provided by the \`flutter doctor\` tool to ensure your development environment is properly configured.
`;

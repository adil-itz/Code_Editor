export const EXTENSION_MAP = {
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  jsx: 'react',
  tsx: 'react',
  ts: 'typescript',
  py: 'python',
  pyw: 'python',
  kt: 'kotlin',
  kts: 'kotlin',
  swift: 'swift',
  html: 'html',
  htm: 'html',
  css: 'css',
  scss: 'css',
  cpp: 'cpp',
  cc: 'cpp',
  cxx: 'cpp',
  hpp: 'cpp',
  c: 'c',
  h: 'c',
  java: 'java',
  cs: 'csharp',
  php: 'php',
  rb: 'ruby',
  go: 'go',
  rs: 'rust',
  sql: 'sql',
  json: 'json',
  md: 'markdown',
  markdown: 'markdown',
  sh: 'bash',
  bash: 'bash'
};

export const BOILERPLATE_TEMPLATES = {
  react: `import React from "react";

export default function App() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}`,

  javascript: `console.log("Hello, World!");`,

  typescript: `const message: string = "Hello, World!";
console.log(message);`,

  python: `print("Hello, World!")`,

  kotlin: `fun main() {
    println("Hello, World!")
}`,

  swift: `import Foundation

print("Hello, World!")`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
</html>`,

  css: `body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}`,

  cpp: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,

  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,

  csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,

  php: `<?php

echo "Hello, World!\\n";`,

  ruby: `puts "Hello, World!"`,

  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,

  rust: `fn main() {
    println!("Hello, World!");
}`,

  sql: `SELECT 'Hello, World!' AS message;`,

  json: `{
  "message": "Hello, World!"
}`,

  markdown: `# Hello World`,

  bash: `echo "Hello, World!"`
};

export function getBoilerplateForFilename(filename) {
  if (!filename) return BOILERPLATE_TEMPLATES.javascript;
  const parts = filename.split('.');
  if (parts.length < 2) return BOILERPLATE_TEMPLATES.javascript;
  const ext = parts[parts.length - 1].toLowerCase();
  const langKey = EXTENSION_MAP[ext] || 'javascript';
  return BOILERPLATE_TEMPLATES[langKey] || BOILERPLATE_TEMPLATES.javascript;
}

export function getBoilerplateForLanguage(language) {
  if (!language) return BOILERPLATE_TEMPLATES.javascript;
  const langKey = language.toLowerCase();
  return BOILERPLATE_TEMPLATES[langKey] || BOILERPLATE_TEMPLATES.javascript;
}

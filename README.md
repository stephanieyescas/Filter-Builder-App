# ZTF Filter Builder

This project is a minimal frontend filter-building tool that allows users to drag-and-drop modules to build a pipeline for filtering JSON documents based on specified attributes, operators, and comparators.

## Features

- Drag-and-drop functionality for building filters
- Customizable filter modules for attributes, operators, and comparators
- Real-time rendering of the filter pipeline
- Utility functions for converting filters into query format

## Project Structure

```
ztf-filter-builder
├── public
│   ├── index.html        # Main HTML document
│   └── favicon.ico       # Application favicon
├── src
│   ├── components
│   │   └── FilterModule.css  # CSS styles for the filter module component
│   │   ├── FilterBuilder.js  # Component for the filter builder
│   │   └── FilterModule.js   # Component for the filter module
│   ├── styles
│   │   └── index.css         # CSS styles for the application
│   ├── App.js                # Main application component
│   ├── index.js              # Entry point for the React application
│   └── utils
│       └── filterUtils.js    # Utility functions for processing filters
├── package.json              # npm configuration file
├── .gitignore                # Files and directories to ignore by Git
└── README.md                 # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd ztf-filter-builder
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm start
```
This will launch the app in your default web browser.


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
   npm install webpack-dev-server --save-dev
   ```

## Usage

To start the application, run:
```
npm start
```
This will launch the app in your default web browser.
Select 'Create Filter' to begin creating a filter in the workspace.
Drag and drop the necessary specifications into filter components.
Double click to delete specifications or a filter.
To query additional filters, use the AND and OR operators by first creating a filter, then selecting the operator, and creating a second filter.
Run.


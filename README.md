# Quick Math

Quick Math is a small browser game for practicing mental arithmetic and measuring the average time needed to solve each problem.

## Features

- Infinite mode.
- Timed games of 1, 3 or 5 minutes.
- Addition, subtraction, multiplication and exact division.
- Two number ranges for every operation.
- Automatic validation: the next problem appears as soon as the correct answer is entered.
- Average response time.
- Best average saved for every operation and number range.
- Records stored locally in the browser.
- Responsive layout for desktop and mobile.

## Run the project

No installation or build step is required.

1. Download or clone the project.
2. Open `index.html` in a modern browser.

For development, you can also use a local server such as the VS Code Live Server extension.

## Project structure

```text
quick-math/
├── index.html
├── main.js
├── style.css
└── README.md
```

## How records work

A record is saved when a game ends and at least one problem was solved. The final average is compared with the saved record for the selected operation and number range.

Records are stored with `localStorage`, so they remain available after closing the page, but only in the same browser and device.

## Technologies

- HTML
- CSS
- JavaScript
- Browser Local Storage

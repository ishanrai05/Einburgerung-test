# Einbürgerungstest Practice Website

A web-based application designed to help users practice for the German citizenship test (Einbürgerungstest).

---

## Features

- **General Citizenship Test Questions**: Practice with a wide range of general questions.
- **State-Specific Questions**: Includes questions tailored for different German states (e.g., Berlin, Bavaria, etc.).
- **Multi-Language Support**:
  - German (de)
  - English (en)
- **Interactive Quiz Interface**: User-friendly and engaging quiz format.
- **Results Tracking**: Track your progress and performance.
- **Retry Incorrect Answers**: Option to revisit and retry questions answered incorrectly.

---

## Project Structure

```bash
einburgerungtest/
├── index.html                # Main entry point
├── LICENSE                   # License file
├── README.md                 # Project documentation
├── css/
│   └── style.css             # Styles for the application
├── images/                   # Images for questions
│   ├── general/              # General question images
│   │   ├── 021.png
│   │   ├── 055.png
│   │   └── ...               # More images
│   ├── berlin/               # Berlin-specific question images
│   │   ├── 321.png
│   │   ├── 328.png
│   └── ...                   # More state-specific image directories
├── js/
│   └── script.js             # JavaScript logic for the quiz
└── resources/
    ├── german_citizenship_test_questions.pdf  # Reference PDF
    ├── questions/
        ├── answers/          # JSON files containing answers
        │   ├── berlin.json
        │   ├── general.json
        │   ├── sachsen_anhalt.json
        │   └── ...           # More state-specific answer files
        └── translations/     # Multi-language translations for questions
            ├── general/      # General question translations
            │   ├── de.json
            │   ├── en.json
            │   └── ...       # More language files
            ├── berlin/       # Berlin-specific question translations
            │   ├── de.json
            │   ├── en.json
            │   └── ...       # More language files
            └── ...           # More state-specific translation directories
```

## Technology Stack

- **HTML**: Structure of the web application.
- **CSS**: Styling and design.
- **JavaScript**: Interactive functionality and quiz logic.

---

## License

This project is licensed under the **MIT License**. For more details, see the [LICENSE](LICENSE) file.

---

## Live Website

Access the live website here: [ishanrai05.github.io/einburgerungtest](https://ishanrai05.github.io/einburgerungtest/)

---

## Contributing

Contributions are welcome! If you'd like to improve this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description of your changes.
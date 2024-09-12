# AI Notes

AI Notes is an innovative voice notes application that leverages the power of AI to convert voice input into text-based notes. This project is built using a modern tech stack, featuring a Next.js frontend and a Python backend. The application aims to provide a seamless and efficient way to take notes using voice commands, making it ideal for users who prefer speaking over typing.

## Description

### Overview

AI Notes is designed to simplify the process of note-taking by allowing users to speak their notes instead of typing them. The application captures voice input through the microphone, processes the audio data, and converts it into text using advanced speech recognition algorithms. The resulting text is then displayed as notes in the application.

### Features

- **Voice Input**: Users can easily record their voice notes using the built-in microphone functionality.
- **Real-time Transcription**: The application provides real-time transcription of voice input, converting speech to text almost instantaneously.
- **User-friendly Interface**: The frontend, built with Next.js, offers a clean and intuitive user interface for a seamless user experience.
- **AI-powered Backend**: The backend, developed in Python, utilizes state-of-the-art AI models for accurate speech recognition and transcription.
- **Cross-platform Compatibility**: The application is designed to work across different devices and platforms, ensuring accessibility for all users.

### Technology Stack

- **Frontend**: Next.js, a popular React framework, is used for building the user interface. It provides server-side rendering, static site generation, and a robust development environment.
- **Backend**: Python is used for the backend, leveraging its powerful libraries and frameworks for AI and machine learning to handle speech recognition and transcription tasks.
- **WebSocket Communication**: The frontend and backend communicate in real-time using WebSockets, ensuring low-latency data transfer and real-time updates.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- Python 3.x
- pnpm (or npm/yarn)
- Virtualenv (optional but recommended)

### Frontend Setup

1. Navigate to the `ainotes_web` directory:

    ```bash
    cd ainotes_web
    ```

2. Install the dependencies:

    ```bash
    pnpm install
    # or
    npm install
    # or
    yarn install
    ```

3. Run the development server:

    ```bash
    pnpm dev
    # or
    npm run dev
    # or
    yarn dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Backend Setup

1. Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

2. Create a virtual environment (optional but recommended):

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the dependencies:

    ```bash
    pip install -r requirements.txt
    ```

4. Run the backend server:

    ```bash
    python main.py
    ```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

To learn more about Python, take a look at the following resources:

- [Python Documentation](https://docs.python.org/3/) - learn about Python features and API.
- [Real Python](https://realpython.com/) - tutorials and articles on Python.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Contact

For any inquiries, please contact [EffDuBois](https://github.com/EffDuBois).
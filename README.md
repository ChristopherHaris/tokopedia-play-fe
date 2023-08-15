# Tokopedia Play Clone

A clone of Tokopedia Play, a video streaming platform, built using React.js. This project aims to replicate the core features of Tokopedia Play, allowing users to watch videos, view product lists, submit comments, and more.

## Features

- User-friendly interface with a Home page and Video Detail page.
- Video list with thumbnails from YouTube on the Home page.
- Clicking on each video takes the user to the Video Detail page.
- Video Detail page displays video content, list of products, comments, and a comment submission form.
- Comment submission form requires only a name and comment.
- Submitted comments are displayed in the list of comments section after successful submission.
- Custom React hooks to manage state and logic.
- Utilizes React Router for seamless navigation between pages.

## Additional Features

- Dark mode for enhanced user experience.

## How to Install & Run

1. Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/ChristopherHaris/tokopedia-play-fe.git
```

2. Navigate to the project directory:

```bash
cd tokopedia-play-clone
```

3. Install the required dependencies using npm:

```shell
npm install
```

4. Create a `.env` file in the root directory and add the following environment variable:

REACT_APP_SERVER_URL=https://api.example.com

Replace `https://api.example.com` with the actual backend server URL.

5. Start the development server:

```shell
npm start
```

This will launch the application in your default web browser. You can access the app at `http://localhost:3000`.

## Acknowledgements

This project is developed as part of a coding challenge and is inspired by the Tokopedia Play platform.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

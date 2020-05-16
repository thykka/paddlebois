# PaddleBois

Epic multiplayer pong

## Usage

1. clone the repo
    ```sh
    git clone https://github.com/thykka/paddlebois.git
    cd paddlebois
    ```

1. use the right node version
    1. install [nvm](https://github.com/nvm-sh/nvm)
    1. install node
        ```sh
        nvm use .
        ```

1. install project deps
    ```sh
    npm i
    ```

1. start server & watch for changes
    ```sh
    npm run start
    ```

5. open the [client](https://127.0.0.1:8443/)

## Todo

- [ ] Implement basic game mechanics
    - [ ] Player state class
    - [ ] Game state class
    - [ ] client: Player setup (input for nickname, avatar?)
    - [ ] server: Global state (list of games & players, etc.)
    - [ ] Game setup on websocket connection
        - [ ] Player management
        - [ ] Games management (starting & joining games)
    - [ ] Input handling
    - [ ] Paddle class
    - [ ] Paddle movement
    - [ ] Ball class
    - [ ] Ball movement & collisions
    - [ ]
- [ ] Graphics & UI
    - [ ] Paddle
    - [ ] Ball
    - [ ]

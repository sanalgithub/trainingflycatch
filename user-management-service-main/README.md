# User Service Module

The nodejs APIs for user service module.

## Prerequisite

- [pre-commit](https://pre-commit.com/index.html): to install refer [this](https://github.com/flycatch/library-documentations/blob/main/standards/git/commits.md)
- nodejs >= 18.14.0
- npm >= 9.3.1
- mongodb

## Development

- make sure the [prerequesite](#prerequisite) has been met.
- clone the repository
- create a `.env` file with [this](./.env.example) as a template.
- execute the following
  ```bash
  $ npm ci
  ```

## Running the app

### Docker

```sh
git clone https://github.com/flycatch/user-management-service.git
cd user-service-api
docker compose up --build -d
```

### npm

```sh

# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod


```

## Guidelines

- read [here](https://github.com/flycatch/library-documentations/tree/main/standards) for pull requests, branch, and commit guidelines.
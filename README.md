# Dataverse Web Portal

> 🔭 Dataverse Portal for the [OKP4 network](https://okp4.network).

[![lint](https://img.shields.io/github/actions/workflow/status/okp4/dataverse-portal/lint.yml?label=lint&style=for-the-badge&logo=github)](https://github.com/okp4/dataverse-portal/actions/workflows/lint.yml)
[![build](https://img.shields.io/github/actions/workflow/status/okp4/dataverse-portal/build.yml?branch=main&label=build&style=for-the-badge&logo=github)](https://github.com/okp4/dataverse-portal/actions/workflows/build.yml)
[![test](https://img.shields.io/github/actions/workflow/status/okp4/dataverse-portal/test.yml?branch=main&label=test&style=for-the-badge&logo=github)](https://github.com/okp4/dataverse-portal/actions/workflows/test.yml)
[![conventional commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=for-the-badge&logo=conventionalcommits)](https://conventionalcommits.org)
[![contributor covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg?style=for-the-badge)](https://github.com/okp4/.github/blob/main/CODE_OF_CONDUCT.md)
[![typescript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://www.google.com/search?client=safari&rls=en&q=vitejs&ie=UTF-8&oe=UTF-8)
[![pnpm](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)](https://pnpm.io)
[![prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)](https://github.com/prettier/prettier)
[![license][bsd-3-clause-image]][bsd-3-clause]
[![cc-by-sa-4.0][cc-by-sa-image]][cc-by-sa]

## Purpose

🚀 Get ready to dive into the Dataverse! 💥 This portal is your gateway to an endless world of digital resources! 🪐 Explore the [Dataspaces](https://blog.okp4.network/what-is-a-data-space-b26ba51596b0), use, and contribute with datasets, algorithms, storage, and computational power!

[![portal screen](./etc/image/portal-screen.webp)](https://okp4.network)

## Install

These instructions will get you a project up and running on your local machine for development and testing purposes.

### Prerequisites

Be sure to have the following properly installed:

- [Node.js](https://nodejs.org/ru/) `v16.19` ([gallium](https://nodejs.org/en/blog/release/v16.19.0/))
- [pnpm](https://pnpm.io/) `v7.27`
- [Docker](https://www.docker.com/)

### Setup

Install the dependencies and build the project:

```sh
pnpm install
```

### Launch

Run the server with the following command line.

```sh
pnpm dev
```

The portal will be available at <http://127.0.0.1:5173>.

## Docker image

The Docker image can be used to run the application in a container. The Dockerfile is located in the root directory of the project.

### Building the Docker Image

To build the Docker image, use the following command:

```sh
docker build -t dataverse-portal .
```

### Running the Docker Container

To run the Docker container, use the following command (adapt the arguments as needed):

```sh
docker run --rm -ti -p 8080:80 dataverse-portal
```

The command will start the Docker container and bind it to port `8080` on your local machine. You can access the application by navigating to <http://localhost:8080> in your web browser.

## License

The code of this project is licensed under the [3-Clause BSD][bsd-3-clause].

All other resources, including documentation, graphical assets, etc., are licensed under the [Creative Commons Attribution-ShareAlike 4.0 International][cc-by-sa] license.

## You want to get involved? 😍

Please check out OKP4 health files:

- [Contributing](https://github.com/okp4/.github/blob/main/CONTRIBUTING.md)
- [Code of conduct](https://github.com/okp4/.github/blob/main/CODE_OF_CONDUCT.md)

[bsd-3-clause]: https://opensource.org/licenses/BSD-3-Clause
[bsd-3-clause-image]: https://img.shields.io/badge/License-BSD_3--Clause-blue.svg?style=for-the-badge
[cc-by-sa]: https://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-image]: https://i.creativecommons.org/l/by-sa/4.0/88x31.png

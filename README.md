# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## Protos

To generate TypeScript codes from the proto files, follow the instructions below.

### Set up the environment

1. Install Node.js and pnpm.

2. Install dependencies.

    ```sh
    pnpm install
    ```

3. Install protoc.

4. Download protoc-gen-grpc-web from [grpc-web releases](https://github.com/grpc/grpc-web/releases), and make it executable. For example:
    
    Download the protoc-gen-grpc-web file:

    ```sh
    wget https://github.com/grpc/grpc-web/releases/download/<version>/protoc-gen-grpc-web-<version>-<platform>
    ```

    Make it executable:

    ```sh
    chmod +x protoc-gen-grpc-web-<version>-<platform>
    ```

5. Open [scripts/generate.sh](scripts/generate.sh) in an editor, change the `PROTOC_GEN_GRPC_WEB_PATH` value to the path you save the downloaded file.
    
    For example:
    
    ```diff
    - PROTOC_GEN_GRPC_WEB_PATH=path/to/protoc-gen-grpc-web
    + PROTOC_GEN_GRPC_WEB_PATH=/home/user/Downloads/protoc-gen-grpc-web-<version>-<platform>
    ```

### Generate codes from proto files

Run this command:

```sh
scripts/generate.sh
```

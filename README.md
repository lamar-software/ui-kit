# UI Kit

`version 0.0.2`

### This project is in an early alpha and is prone to breaking changes.

A configurable UI kit built upon Angular v8's CDK.

This project was created by LaMar Software.

## Installing
- `npm install @lamar-software/ui-kit`

## Publishing

- Increment the version number in `package.json`.
- Increment the version number in `README.md`.
- Run `ng build ui-kit`.
- Run `cd dist/ui-kit`
- Run `npm publish`.

## Link this library to sync changes locally and avoid reinstalling the library on every build
- Run `ng build ui-kit`.
- Run `cd dist/ui-kit`.
- Run `npm link`.
- Run `cd path/to/your/project`.
- Run `npm link path/to/dist/ui-kit`

## To map to ui-kit library peer dependences
- Add the following in your project's `./tsconfig.json`
```
{
  "compilerOptions": {
    // ...
    // paths are relative to `baseUrl` path.
    "paths": {
      "@angular/*": [
        "./node_modules/@angular/*"
      ]
      // ...
      // other dependencies the ui-kit library peer depends on
    }
  }
}

# TS GREP

Today I was like why just react code or even c, this time I thought lets do something different, something I haven't tried yet. Try to build a cli based application, and see beyond just framework in javascript.

This app is just a basic app that iterates through your directory and list directory and also files.

## How to build and use it on you machine

### Prerequisites

- bun

or any program that can compile js/ts code to binary

#### run the following command (Using bun)

```bash
bun build main.ts --compile --outfile ./build/tsgrep
```

#### Now the binary is built for your specific platform

Either run using the following command

for Listing Directories:

```bash
 ./build/tsgrep search [directory] [searchstring]
```

for Listing Directories:

```bash
 ./build/tsgrep read [directory]
```

or copy this somewhere where your terminal is already looking for binaries and use it that way. For windows adding PATH.

Happy coding! 🚀

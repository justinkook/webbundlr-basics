# WebBundlr Basics

## About

Interactive code examples showing how to use Bundlr in the browser with React.
For information on creating a new React project to use with Bundlr, you can reference
https://staging.docs.bundlr.network/docs/sdk/Bundlr-React

These components contain minimal error checking as we wanted to highlight the aspects that are Bundlr-specific. When implementing in your own applications, feel free to add additional checks.

## Strucutre

-   `assets`: Images used by the UI.
-   `components`: Use specific React components for interacting with Bundlr.
-   `pages`: Pages which combine the components into grouped functions for a given use-case.
-   `lens`: Mutations and queries used in the Lens Protocol demo.

## Components

-   `FundNode`: Funds a Bundlr node using the amount specified by the user.
-   `NodeBalance`: Checks and displays the balance funded to a given node.
-   `NormalUploader`: A file uploader designed for smaller files, the code will block until the upload is complete.
-   `LargeFileUploader`: A file uploader designed for larger files. It uses our chunking uploader and event callbacks to update a progress bar as the upload progresses.
-   `LensUploader`: A component showing how upload post metadata to Bundlr and then post to Lens Protocol.

## Pages

-   `/normal-uploader`
    Components to fund a node, check node balance, and upload a file.
    Designed for smaller files that can be uploaded in less than 1 min.

-   `/large-file-uploader`
    Components to fund a node, check node balance, and upload a large file.
    This example includes code to create a progress bar showing upload
    progress that is updated using event callbacks.
    A tutorial breaking down this code is at
    https://staging.docs.bundlr.network/docs/tutorials/WebBundlr-ProgressBars

-   `Lens Poster`
    Components to fund a node, check node balance, upload a file, create
    metadata featuring that file, upload metadata to Bundlr, post metadata
    to Lens.

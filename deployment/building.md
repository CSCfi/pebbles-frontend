# Building container image

We have two options to build the container image, namely single stage and multi-stage ways. Both produce
a `nginxinc/nginx-unprivileged` -based runtime image as the end result. The image runs as the non-root
`nginx` user (UID 101) and listens on port 8080, so it works without privileged host configuration.

# Single stage build

In single stage build, we first build the application using command line tools on the host, and then copy the result to
a runtime image.

```shell script
# change to project root directory
cd ~/src/gitlab.ci.csc.fi/pebbles/pebbles-frontend/

# install dependencies
npm install

# build the application (production build here)
npm run-script build:prod

# create runtime image by copying the compiled application in it
podman build . -t pebbles-frontend:latest -f deployment/Dockerfile.runtime
```

# Multi-stage build

We can also use Docker multi-stage building to build the image and copy the application to the runtime image:

```shell script
# change to project root directory
cd ~/src/gitlab.ci.csc.fi/pebbles/pebbles-frontend/

# create runtime image with multi-stage
podman build . -t pebbles-frontend:latest -f deployment/Dockerfile.multi-stage
```

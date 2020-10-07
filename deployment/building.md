# Building container image

We have two options to build the container image, namely single stage and multi-stage ways. Both produce an 
bitnami/nginx -based runtime image as the end result. Bitnami NGINX image runs without root privileges and does not need
any additional configuration.

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
docker build . -t pebbles-frontend:latest -f deployment/Dockerfile.runtime
```

# Multi-stage build

We can also use Docker multi-stage building to build the image and copy the application to the runtime image:

```shell script
# change to project root directory
cd ~/src/gitlab.ci.csc.fi/pebbles/pebbles-frontend/

# create runtime image with multi-stage
docker build . -t pebbles-frontend:latest -f deployment/Dockerfile.multi-stage
```

# Build with old AngularJS code included

```shell script
# change to project root directory
cd ~/src/gitlab.ci.csc.fi/pebbles/pebbles-frontend/

# install dependencies
npm install

# build the application (production build here)
npm run-script build:prod

# copy AngularJS code from Pebbles-repo, assuming it is cloned as sibling directory
cp -r ../pebbles/pebbles/static/index.html dist/pebbles-frontend/admin.html
cp -r ../pebbles/pebbles/static/{img,js,css,fonts,partials} dist/pebbles-frontend/.

# create runtime image by copying the compiled application in it
docker build . -t pebbles-frontend:latest -f deployment/Dockerfile.runtime
```

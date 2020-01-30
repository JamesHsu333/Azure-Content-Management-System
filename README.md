# Azure Content Management System
---
## How to operate

* [Introduction](#introduction)

## How to develop

* [Preparation](#preparation)
* [Create new pages](#create-new-pages)
* [API Usage](#api-usage)

## How to deploy

* [Build and Deploy](#build-and-deploy)

# Introduction
---
[Azure Content Management System](https://azure-team.gitlab.io/azure-content-management-system/) is a CMS which focus on resolve complex and duplicate operation on Azure Portal.

You can easily use this CMS to create,assign and delete user,resource group and resource.

## Features
```
- User
    - Create User
    - Create User with Assigning Role
    - Create Multiple Users
    - Create Multiple Users with Assigning Role
    - Delete User
    - Search User
- Resource Group
    - List Resources in specific Resource
    - Delete Resource
    - Delete All Resource in specific Resource 
    Group
    - Delete Resource Group
    - Search Resource
    - Search Resource Group
```

## Prerequisite
* You need to have a **Azure User Account** with **Admin** Active Directory Role.
* User Account **without Admin** Active Directory Role is not able to access User Dashboard


# Preparation

---

## Prerequisite

You need to install [node](https://nodejs.org/en/) and [git](https://git-scm.com/) locally. Front end of this project is based on [ES6](https://es6.ruanyifeng.com/), [vue](https://vuejs.org/index.html), [vuex](https://vuex.vuejs.org/guide/), [vue-router](https://router.vuejs.org/), [vue-cli](https://cli.vuejs.org/), [axios](https://github.com/axios/axios) and [element-ui](https://element.eleme.io/#/zh-CN). Back end is structed by [Azure REST API](https://docs.microsoft.com/en-us/rest/api/azure/) and [Microsoft Graph REST API](https://docs.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0).
Besides, authentication feature is based on [Microsoft Authentication Library for JavaScript (MSAL.js)](https://www.npmjs.com/package/msal).
## Structure
    .
    ├── public                  # pure static assets (directly copied)
    │   ├── favicon.ico         # favicon
    │   └── index.html          # index.html template
    ├── src                     # main source code
    │   ├── api                 # api service
    │   │   ├──azure.js         # Azure REST API
    │   │   └──graph.js         # Microsoft Graph REST API
    │   ├── assets              # module assets like fonts,images (processed by webpack)
    │   ├── components          # global components
    │   ├── layout              # global layout
    │   ├── router              # router
    │   ├── store               # store
    │   ├── styles              # global css
    │   ├── utils               # global utils
    │   │   ├──auth.js          # Msal module (Handle Azure Login)
    │   │   ├──error-handling.js
    │   │   ├──generate.js      # Generate Random Password & GUID        
    │   │   ├──http-request.js  # axios interceptor config
    │   │   └──validate.js      # validate External Link
    │   ├── views               # views
    │   ├── App.vue             # main app component
    │   ├── main.js             # app entry file
    │   ├── permission.js       # permission authentication
    │   └── tenant.js           # Azure tenant account config
    ├── babel.config.js         # babel config
    ├── package.json            # package.json
    └── vue.config.js           # vue-cli config
## Getting Started
``` shell
# clone the project
git clone git@gitlab.com:azure-team/azure-content-management-system.git

# enter project directory
cd azure-content-management-system

# install dependencies
npm i

# develop
npm run serve

```
This will automatically open [http://localhost:8080](http://localhost:8080).

You will see following page if succeed.

![Azure CMS Login](https://i.imgur.com/6zl2zxA.png)

## Redirect URIs
1. Home -> Azure Active Directory -> App registration -> New registration
2. Your App registration -> Authentication -> Web -> Redirect URIs -> Add the URI `http://localhost:8080/`

![](https://i.imgur.com/EmvhHQ3.png)

# Create new pages
---
## Layout

The overall layout of the page is the outermost frame structure of a product and often includes navigation, sidebars, breadcrumbs, and content. To understand a admin project, first understand its basic layout.

![Azure CMS Layout](https://i.imgur.com/qkj3EPw.png)

Almost all pages are based on layout.

``` javascript
// No layout page 
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/login')
  }
  
 // With layout page
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard'),
      meta: {
        title: 'Dashboard',
        icon: 'orange'
      }
    }]
  }
```

This uses vue-router [routing nesting](https://router.vuejs.org/guide/essentials/nested-routes.html), so in general, adding or modifying a page will only affect the main body of app-main. Other content in the layout, such as: the sidebar or navigation bar will not change with your main page.

```
/foo                                  /bar
+------------------+                  +-----------------+
| layout           |                  | layout          |
| +--------------+ |                  | +-------------+ |
| | foo.vue      | |  +------------>  | | bar.vue     | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

## New Page

### Add Routes

First add the route to the `@/router/index.js`.

**For example: Add Test Page**
``` javascript
{
  path: '/test',
  component: Layout,
  children: [
    {
      path: '',
      component: ()=>import('@/views/Test'),
      name: 'Test',
      meta: { title: 'Test' }
    }
  ]
}
```
**This sidebar will appear the menu-item**

### Create View

After adding the route, create a view under the `@/views`. As usual, a router correspond a view.

Suggestion if a component or utils function only used in this view, just create a component folder under this view, lt is more convenient for each module to maintain its own utils or components.

![](https://i.imgur.com/lHibe5w.png)

### Create Api

Finally, under the `@/api` folder, create the corresponding api service for this module.

# API Usage
---
## Front-end request flow
In `Azure CMS` , a complete front-end UI interacts to the server-side processing flow as follows:

1. UI component interaction
2. Call unified management API service request function
3. Send requests using encapsulated https-request.js
4. Get server return
5. Update data

As you can see from the above flow, in order to facilitate management and maintenance, unified request processing is placed in the src/api folder and the files are generally split according to the model latitude,such as:
```
api/
    azure.js
    graph.js
    ...
```

## https-request.js
`@/src/utils/https-request` is based on [axios](https://github.com/axios/axios), to facilitate the uniform handling of POST, GET and other request parameters, request headers, and error messages.

It encapsulates the global `request interceptor`, `response interceptor`,`unified error handling`, `unified timeout`, `baseURL settings`, etc.

## An example of a request User list: 
``` javascript
//api/graph.js
import {GraphService} from '../utils/https-request.js'
import {domainName} from '../tenant.js'

/**
 * Retrieve a list of user objects
 * 
 * @function listUser
 * 
 * @return {Promise} GraphService
 */
export const listUser = () => {
    return GraphService({
        url: '/users/',
        method: 'get'
    })
}

//views/example/list
import {listUser} from '@/api/graph.js'
export default {
  data() {
    list: null,
    listLoading: true
  },
  methods: {
    async listUser() {
      this.listLoading = true
      let res = await listUser()
      this.list = res.data.value
      this.listLoading = false
    }
  }
}

```

## Azure REST API
### Register for authorization
In `Azure CMS`, server-side processing is rely on Azure REST API which provide create, retrieve, update, or delete access to the service's resources. More details and API reference: [Azure REST API Reference](https://docs.microsoft.com/en-us/rest/api/azure/).

### Get access token
In Azure REST API, user needs to acquire access token in order to use API. Following Link is how to quickly authenticate with the Azure REST APIs via the client id/secret method: [How to call Azure REST API](https://docs.microsoft.com/en-us/rest/api/azure/#how-to-call-azure-rest-apis-with-postman).

## Microsoft Graph API
### Register for authorization
In `Azure CMS`, server-side processing is rely on Azure REST API which provide a unified programmability model that you can use to access the tremendous amount of data in Azure or other Microsoft platform.

A simple registeration flow as follows:
1. Home -> Azure Active Directory -> App registration -> New registration
2. Your App registration -> API permissions -> Add a permission -> Choose which you will use
3. Your App registration -> Authentication -> Web -> Redirect URIs -> Add the URL you plan to develop or deploy

Here is a full walkthrough on how to Register for authorization: [Microsoft Graph Auth Overview](https://docs.microsoft.com/en-us/graph/auth/?view=graph-rest-1.0)

### Use `msal.js` to login and call Microsoft Graph API
The MSAL library for JavaScript enables client-side JavaScript web applications, running in a web browser, to authenticate users using Azure AD work and school accounts (AAD). It also enables your app to get tokens to access Microsoft Cloud services such as Microsoft Graph. More Details on [msal.js](https://www.npmjs.com/package/msal).

This project use `msal.js` in `@/src/utils/auth.js`. You can easily change tenant settings in `@/src/tenant.js`.

### Get access token
You can easily acquire token by `acquireTokenSilent()` from `msal.js`


# Build and Deploy

---
## Build
When projects are completed, you can build your application only run one command:
```shell
# build for production environment
npm run build

```

After the build package is successful, the dist folder will be generated in the root directory, which is to build a packaged file, usually static files such as ```***.js```, ```***.css```, ```index.html```, etc. .

## Publish
For publishing, you only have to publish the resulting static file after build, which is usually the static file in the dist folder, to your cdn or static server. Note that the index.html usually will be an entry page for your backend service. You may need to change the page's import path after determining static for JS and css.

### Router & Server
In `Azure CMS`, the front-end routing uses vue-router, so you have two options: `browserHistory` and `hashHistory`.

Simply speaking, the difference between them is the deal with routing. `hashHistory` is processed by the path following `#` , front-end routing management through HTML 5 History, and browserHistory is similar to our usual page access path, and with not `#` , but must through the server's configuration.

This project uses hashHistory by default, so if you have `#` in your url and you want to get rid of it, you need to switch to `browserHistory`.

Modify `src/router/index.js` mode。

```javascript
export default new Router({
      mode: 'history' // Need backend support
})
```

Detail see [vue-router document](https://router.vuejs.org/zh/guide/essentials/history-mode.html)


## Deploy (Platform Guides)
### GitHub Pages
#### Pushing updates manually
1. Set correct publicPath in `vue.config.js`<br>
If you are deploying to `https://<USERNAME>.github.io/`, you can omit `publicPath` as it defaults to `"/"`.<br>
If you are deploying to `https://<USERNAME>.github.io/<REPO>/`, set `publicPath` to ``"./"``

2. Inside your project, type following content (with highlighted lines uncommented appropriately) and run it to deploy:
``` shell
# build 
npm run build

# navigate into the build output directory
cd dist

git init
git add -A
git commit -m 'First Deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
```
### GitLab Pages
1. Inside your project, type following content (with highlighted lines uncommented appropriately) and run it to deploy:
``` shell
git add # files you modified

git commit -m # commit message

git push 
```

### Azure blob Static Website
1. Set correct publicPath in `vue.config.js` (Recommend setting `publicPath` to ``"./"``)
2. Inside your project, type following content (with highlighted lines uncommented appropriately):
``` shell
# build 
npm run build

# navigate into the build output directory
cd dist

```
3. Upload all files in `dist` to Azure blob `$web` container.

## Authentication redirect URI in Azure
### Redirect URIs
#### Introduction
The URIs we will accept as destinations when returning authentication responses (tokens) after successfully authenticating users. Also referred as reply URLs. [Learn more about redirect URIs](https://docs.microsoft.com/zh-tw/azure/active-directory/develop/quickstart-configure-app-access-web-apis#add-redirect-uris-to-your-application)

#### How to
1. Home -> Azure Active Directory -> App registration -> New registration
2. Your App registration -> Authentication -> Web -> Redirect URIs -> Add the URL you plan to deploy

![](https://i.imgur.com/EmvhHQ3.png)




# Blog
<div align="center">
    <img width="200" src="https://github.com/jimkk159/Blog/assets/105664533/0c5a7720-af4b-404f-9779-6be5c89f6d98">
</div>
📜This project is a blog website that allow you and your friends to edit blog post together

## Demo
🕹️ Demon Website URL: https://blogv2.jimkk159.com/  

👩‍💻 Test Account: test@test.com / Password: 123456

- Home Page
<div align="center">
    <img width="300" src="https://github.com/jimkk159/Blog/blob/main/readmeImg/demo_1.gif">
</div>

<br />
<br />

- Responsive Web Design(RWD)
    
| Sidedrawer on mobile | RWD  |
|---	|---    |
|<img width="200" height="250" src="https://github.com/jimkk159/Blog/blob/main/readmeImg/demo_2.gif">|<img width="300" height="250" src="https://github.com/jimkk159/Blog/blob/main/readmeImg/demo_3.gif"> |

- Editor
    
| Cover Upload Post Cover  | 
|---	|
| <div align="center"><img height="250" src="https://github.com/jimkk159/Blog/blob/main/readmeImg/demo_4.gif"></div>|  
    
| KaTeX Plugin | Mermaid Plugin |
|---	|---	|
| <div align="center"><img width="300" src="https://github.com/jimkk159/Blog/blob/main/readmeImg/demo_5.gif"></div>| <div align="center"><img width="300" src="https://github.com/jimkk159/Blog/blob/main/readmeImg/demo_6.gif"></div>   | 

| Upload image   | DnD image | Embed Yt   | 
|---	|---	|---	|
| <div align="center"><img width="300" src="https://github.com/jimkk159/Blog/blob/main/readmeImg/demo_7.gif"></div>| <div align="center"><img width="320" src="https://github.com/jimkk159/Blog/blob/main/readmeImg/demo_8.gif"></div>   | <div align="center"><img width="300" src="https://github.com/jimkk159/Blog/blob/main/readmeImg/demo_9.gif"></div>  |

## Table of Contents
- [Branch Rule](#branch-rule)
- [Commit](#commit)
- [Main Features](#main-features)
    - [Networking](#networking-protocol)
    - [Version Control](#version-control)
- [Database](#database)
    - [Schema](#schema)
- [Backend](#backend)
    - [Setup](#setup)
    - [Design Pattern](#design-pattern)
    - [Env](#env)
    - [Env Requirement](#env-requirement)
    - [Third Party Library](#third-party-library)
    - [Test](#test)
    - [Cloud Services](#cloud-services)
    - [Architecture](#architecture)
- [Frontend](#frontend)
    - [Setup](#setup)
    - [Sitemap](#sitemap)
    - [Third Party Library](#third-party-library)
    - [Cloud Services](#cloud-services)
    - [Architecture](#architecture)
- [API Doc](#api-doc)
- [Contact](#contact)

## Branch Rule
Main branch is **`master`**。
Backend branch is **`backend`**。
Frontend branch is **`frontendv2`**。

## Commit
1. Add feature：**`feat: xxx`**
2. Fix bug：**`fix: xxx`**
3. Refactor code：**`refactor: xxx`**
4. Documents：**`docs: xxx `**

## Main Features
- Users can sign in locally or use Google OAuth 2.0.
- User authentication with Json Web Token.
- Enable two-step email authentication for local email and password login.
- Supports mobile devices so you can update content anytime anywhere.
- Permission control/management. Only the host(root user) has the authority to revoke access to your posts and modify or update public topics.
- Hosting images on aws S3
- Unit test by vitest on backend
- Setup CI/CD pipeline with aws codebuild, codedeploy and codepipeline.

### Networking Protocol

- HTTP & HTTPS

### Version Control

- Git/GitHub

## Database

- MySQL on RDS

### Schema

<div align="center">
    <img width="600" src="https://github.com/jimkk159/Blog/blob/main/readmeImg/blog-database-schema.png">
</div>

## Backend

### Setup

```
git checkout backend
cd backend
npm i
```
- development mode
```
npm run start:dev
```
- production mode
```
npm start
```
### Design Pattern

- MVC Pattern
  
### Env

- Node.js
- Express.js

### Env Requirement

- Node version >= 18

### Third Party Library

- passport.js
- mysql2
- sequelize
- nodemailer

### Test

- Unit test: Vitest

### Cloud Services

- S3
- EC2
- RDS
- Route 53
- Codebuild
- Codedeploy
- Codepipline
- Load Balancer
- Certificate Manager

## Architecture

- Server Architecture (Support CI/CD)

  ![image](https://github.com/jimkk159/Blog/blob/main/readmeImg/backend-architecture.png)

## Frontend
Frontent is made from create-react-app

### Setup
```
npm start
```

### React (hooks) & Sitemap

- SPA with functional components

![image](https://github.com/jimkk159/Blog/blob/main/readmeImg/sitemap.png)

### Third Party Library

- Tailwind CSS
- React Router
- Redux (redux-toolkit)
- @uiw/react-md-editor

### Cloud Services

- S3
- Codebuild
  
## Architecture

- Frontend Architecture (Support CI/CD)
  
  ![image](https://github.com/jimkk159/Blog/blob/main/readmeImg/frontend-architecture.png)

## API Doc
[API doc]()

## Contact

✍️ Jim Chung
<br/>

📧Email: jimkk159@gmail.com

# Blog
<div align="center">
    <img width="200" src="https://github.com/jimkk159/Blog/assets/105664533/0c5a7720-af4b-404f-9779-6be5c89f6d98">
</div>
📜This project is a blog website that allow you and your friends to edit blog post together

## Demo
🕹️ Demon Website URL: https://blogv2.jimkk159.com/  

👩‍💻 Test Account: test@test.com / Password: 123456

<div align="center">
    <img width="480" src="https://github.com/jimkk159/Blog/blob/main/readmeImg/demo_1.gif">
</div>

## Table of Contents

- [Main Features](#main-features)
    - [Networking](#networking-protocol)
    - [Version Control](#version-control)
- [Database](#database)
    - [Database Schema](#database-schema)
- [Backend](#backend)
    - [Design Pattern](#design-pattern)
    - [Environment](#environment)
    - [Third Party Library](#third-party-library)
    - [Test](#test)
    - [Cloud Services](#cloud-services)
    - [Architecture](#architecture)

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

### Database Schema

<div align="center">
    <img width="600" src="https://github.com/jimkk159/Blog/blob/main/readmeImg/blog-database-schema.png">
</div>

## Backend

### Design Pattern

- MVC Pattern
- 
### Environment

- Node.js/Express.js

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

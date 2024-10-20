## Automated Deployment Pipeline for Natours Application

This project sets up a fully automated CI/CD pipeline for deploying the Natours (Node.js) application using Docker, Jenkins, and Ansible. The pipeline includes unit testing, building Docker images, pushing them to DockerHub, and deploying the application in a containerized environment.

### Project Structure

- Docker: Used to containerize the application.
- Docker-Compose: Manages multi-container deployments.
- Jenkins: Automates the CI/CD pipeline, running tests, building images, and deploying the app.
- Ansible: Automates container lifecycle management and image building.
- Unit Tests: Ensure that the application behaves as expected before deployment.

### Table of Contents

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
  - [Dockerfile](#dockerfile)
  - [Docker Compose](#docker-compose)
  - [Jenkins Pipeline](#jenkins-pipeline)
  - [Ansible Playbook](#ansible-playbook)
  - [Unit Tests](#unit-tests)
- [Running the Project](#running-the-project)
  - [Local Setup](#project-setup)
  - [Running CI/CD Pipeline](#running-cicd-pipeline)
- [License](#license)

### Prerequisites

Make sure you have the following installed:

- Docker (v20.10+)
- Docker Compose (v1.29+)
- Jenkins (v2.303+)
- Ansible (v2.10+)
- Node.js (v20.13+)
- npm (v8.0+)

You will also need valid credentials for DockerHub and an SSH key for Ansible.

### Project Setup

#### Dockerfile

The Dockerfile containerizes application:

```docker
    FROM node:20-alpine

    WORKDIR /app

    COPY ./DEPI-Project/package.json .

    RUN npm install --only=production && npm cache clean --force

    COPY ./DEPI-Project/ .

    EXPOSE 5000

    CMD [ "npm" ,"run" ,"start:prod" ]
```

#### Docker Compose

Docker Compose is used to define and manage the containerized environment. Here's the docker-compose.yml file:

```yaml
version: '3.4'

services:
node-app:
  container_name: depi-app
  image: nayra000/depi-image
  build:
  context: .
  dockerfile: ./Dockerfile
  environment:
  NODE_ENV: production
  ports:
    - 5000:5000
  env_file:
    - ./DEPI-Project/config.env
```

#### Jenkins Pipeline

This Jenkins pipeline automates unit testing, building the Docker image, and running the Ansible playbook:

```sh
pipeline {
    agent any
    environment {
		DOCKERHUB_CREDENTIALS=credentials('dockerhub')
	}
	tools {
        nodejs 'node-20.13.1'
    }

    stages {
        stage('run-unit-tests') {
            steps{
                dir('./DEPI-Project'){
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }
        stage('login-dockerhub') {
            steps {
              sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }
        stage('Run-ansible-playbook') {
            steps {
              sh 'ansible-playbook playbook.yml'
            }
        }
    }
    post {
        success {
            mail to: 'youssefnayra26@gmail.com',
                 subject: "SUCCESS: ${env.JOB_NAME} Build ${env.BUILD_NUMBER}",
                 body: "The build was successful.\nJob: ${env.JOB_NAME}\nBuild Number: ${env.BUILD_NUMBER}\nBuild URL: ${env.BUILD_URL}"
        }
        failure {
            mail to: 'youssefnayra26@gmail.com',
                 subject: "FAILURE: ${env.JOB_NAME} Build ${env.BUILD_NUMBER}",
                 body: "The build failed.\nJob: ${env.JOB_NAME}\nBuild Number: ${env.BUILD_NUMBER}\nBuild URL: ${env.BUILD_URL}"
        }
    }

}
```

#### Ansible Playbook

The Ansible playbook manages Docker container operations, image creation, and deployment:

```yaml
---
- name: 'Build a container with ansible'
  hosts: localhost
  connection: local
  tasks:
    - name: stop current running container
      command: docker stop depi-app
      ignore_errors: yes

    - name: remove stopped container
      command: docker rm depi-app
      ignore_errors: yes

    - name: remove depi-image
      command: docker rmi nayra000/depi-image
      ignore_errors: yes

    - name: copy config.env to build context
      copy:
        src: /home/nayra/Desktop/DEPI-final-project/DEPI-Project/config.env
        dest: /var/lib/jenkins/workspace/DEPI-pipeline/DEPI-Project/config.env

    - name: build docker image using the Dockerfile
      command: docker build -t nayra000/depi-image .

    - name: Push depi-image to dockerhub
      command: docker push nayra000/depi-image

    - name: run container
      command: docker-compose up -d
```

#### Unit Tests

Unit tests are written using Supertest and Chai for API testing:

```js
import request from 'supertest';
import index from '../index.js';
import { expect } from 'chai';

describe('Check Health API', () => {
  describe('GET /api/v1/test', () => {
    it('should return a success message', (done) => {
      request(index)
        .get('/api/v1/test')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).to.equal('success');
          done();
        });
    });
  });

  'POST /api/v1/users/singin',
    () => {
      it('should login to my account successfully', async () => {
        const res = await request('http://localhost:5000')
          .post('/api/v1/users/singin')
          .send({
            email: 'ma2001129@gmail.com',
            password: 'ma2001129@gmail.com',
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200);

        expect(res.body.status).to.equal('success');
        expect(res.body).to.have.property('token');
        expect(res.body.data).to.have.property('user');
        expect(res.body.data.user.name).to.equal('Mohamed Alaa');
      });
    };
});
```

### Running the Project

1. Clone the repository:

```bash
    git clone https://github.com/your-repo/natours-deployment-pipeline.git
    cd natours-deployment-pipeline
```

2. Run the Docker container:

```bash
    docker-compose up --build
```

3. The application should be running at `http://localhost:5000`.

### Running CI/CD Pipeline

To trigger the CI/CD pipeline, ensure Jenkins is set up with the provided Jenkinsfile, and the following actions will occur:

- Unit tests will run.
- A Docker image will be built and pushed to DockerHub.
- Ansible will deploy the application.

### License

This project is licensed under the MIT License.

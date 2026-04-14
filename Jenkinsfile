pipeline {
    agent any

    environment {
        IMAGE_NAME = "nikhilabba12/rowdy"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                    bat "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Push') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-creds') {
                        bat "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                        bat "docker push ${IMAGE_NAME}:latest"
                    }
                }
            }
        }
    }
}
stage('Build Docker Image') {
    steps {
        bat "docker build -t nikhilabba12/rowdy:%BUILD_NUMBER% ."
        bat "docker tag nikhilabba12/rowdy:%BUILD_NUMBER% nikhilabba12/rowdy:latest"
    }
}
pipeline {
    agent any

    environment {
        IMAGE_NAME = "nikhilabba12/rowdy"
        IMAGE_TAG  = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Set Commit Tag') {
            steps {
                script {
                    env.COMMIT_TAG = bat(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat """
                docker build -t %IMAGE_NAME%:%IMAGE_TAG% .
                docker tag %IMAGE_NAME%:%IMAGE_TAG% %IMAGE_NAME%:latest
                docker tag %IMAGE_NAME%:%IMAGE_TAG% %IMAGE_NAME%:%COMMIT_TAG%
                """
            }
        }

        stage('Test') {
            steps {
                bat "docker run --rm %IMAGE_NAME%:%IMAGE_TAG% npm test"
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat """
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    docker push %IMAGE_NAME%:%IMAGE_TAG%
                    docker push %IMAGE_NAME%:latest
                    docker push %IMAGE_NAME%:%COMMIT_TAG%
                    docker logout
                    """
                }
            }
        }
    }
}
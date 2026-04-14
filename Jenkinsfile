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

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %IMAGE_NAME%:%IMAGE_TAG% ."
                bat "docker tag %IMAGE_NAME%:%IMAGE_TAG% %IMAGE_NAME%:latest"
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
                    bat '''
                    echo ===== Docker Login =====
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin

                    echo ===== Push Build Tag =====
                    docker push %IMAGE_NAME%:%IMAGE_TAG%

                    echo ===== Push Latest Tag =====
                    docker push %IMAGE_NAME%:latest

                    echo ===== Logout =====
                    docker logout
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Rowdy pipeline completed successfully.'
        }
        failure {
            echo 'Rowdy pipeline failed.'
        }
        always {
            bat 'docker images'
        }
    }
}

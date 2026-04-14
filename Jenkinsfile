pipeline {
    agent any

    environment {
        IMAGE_NAME = "nikhilabba12/rowdy"
        IMAGE_TAG  = "2ef0d67288ea"
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
                    credentialsId: 'nikhilabba12',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat '''
                    echo %DOCKER_PASS% | docker login --username %nikhilabba12% --password-stdin dckr_pat_PUDz7mwrCIIl6rDWgTG59KIG3l0
                    docker push %IMAGE_NAME%:%IMAGE_TAG%sha256:7a4c8095bf17450933c36846fac0bf1d717b42dcf4c69dac33896fd6becec804
                    docker push %IMAGE_NAME%:latest
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

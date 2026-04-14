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
                bat "docker build -t %nikhilabba12/rowdy%:%IMAGE_TAG% ."
                bat "docker tag %nikhilabba12/rowdy%:%IMAGE_TAG% %nikhilabba12/rowdy%:latest"
            }
        }

        stage('Test') {
            steps {
                bat "docker run --rm %nikhilabba12/rowdy%:%IMAGE_TAG% npm test"
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
                    echo %DOCKER_PASS% | docker login --username %nikhilabba12% --password-stdin dckr_pat_PUDz7mwrCIIl6rDWgTG59KIG3l0
                    docker push %nikhilabba12/rowdy%:%IMAGE_TAG%sha256:7a4c8095bf17450933c36846fac0bf1d717b42dcf4c69dac33896fd6becec804
                    docker push %nikhilabba12/rowdy%:latest
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

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

        stage('Build Docker Image') {
            steps {
                bat """
                docker build -t %IMAGE_NAME%:%IMAGE_TAG% .
                docker tag %IMAGE_NAME%:%IMAGE_TAG% %IMAGE_NAME%:latest
                """
            }
        }

        // ✅ Get SHA256 Image ID
        stage('Get Image SHA') {
            steps {
                script {
                    env.IMAGE_ID = bat(
                        script: "docker images --no-trunc -q %IMAGE_NAME%:%IMAGE_TAG%",
                        returnStdout: true
                    ).trim()

                    // Remove sha256: and take short version
                    env.SHORT_SHA = env.IMAGE_ID.replace("sha256:", "").substring(0,12)

                    echo "Full SHA: ${env.IMAGE_ID}"
                    echo "Short SHA: ${env.SHORT_SHA}"
                }
            }
        }

        // ✅ Tag using SHA
        stage('Tag SHA Image') {
            steps {
                bat """
                docker tag %IMAGE_NAME%:%IMAGE_TAG% %IMAGE_NAME%:%SHORT_SHA%
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

                    echo === PUSH BUILD TAG ===
                    docker push %IMAGE_NAME%:%IMAGE_TAG%

                    echo === PUSH LATEST ===
                    docker push %IMAGE_NAME%:latest

                    echo === PUSH SHA TAG ===
                    docker push %IMAGE_NAME%:%SHORT_SHA%

                    docker logout
                    """
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
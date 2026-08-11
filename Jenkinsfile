pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
            }
        }
        
        stage('Environment Check') {
            steps {
                echo 'Checking Node.js environment...'
                bat 'node -v || node --version'
            }
        }

        stage('Run Automated Tests') {
            steps {
                echo 'Executing Automated Test Suite...'
                bat 'node test.js'
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: All unit tests passed! Jenkins build succeeded.'
        }
        failure {
            echo 'FAILURE: One or more unit tests failed! Jenkins build failed.'
        }
    }
}

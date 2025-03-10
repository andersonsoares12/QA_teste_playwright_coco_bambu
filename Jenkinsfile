pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.51.0-noble'
            args '--network qa_teste_playwright_coco_bambu_bambunet'  
        }
    }
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npx playwright test'
                allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            }
        }
}
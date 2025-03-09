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
                sh 'npx playwright test --reporter=line,allure-playwright'
            }
        }
        stage('Generate Allure Report') {
            steps {
                sh 'npx allure generate --clean && npx allure open'
            }
        }
    }
}